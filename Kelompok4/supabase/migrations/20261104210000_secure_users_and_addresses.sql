-- Use Supabase Auth for credentials. The public.users.password_hash column
-- must never be readable by the mobile app.
alter table public.users
  alter column password_hash drop not null;

alter table public.users enable row level security;
alter table public.alamat enable row level security;

revoke all on table public.users from public, anon, authenticated;
revoke all on table public.alamat from public, anon, authenticated;

grant select (id, nama, email, no_hp, role, is_aktif, kurir_id, created_at)
  on table public.users to authenticated;
grant update (nama, no_hp) on table public.users to authenticated;
grant select, insert, update, delete on table public.alamat to authenticated;
grant all on table public.users, public.alamat to service_role;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname, tablename
    from pg_policies
    where schemaname = 'public'
      and tablename in ('users', 'alamat')
  loop
    execute format(
      'drop policy %I on public.%I',
      existing_policy.policyname,
      existing_policy.tablename
    );
  end loop;
end;
$$;

create or replace function public.is_current_user_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.users as account
    where lower(account.email) = lower((select auth.jwt() ->> 'email'))
      and account.role = 'admin'
      and account.is_aktif
  );
$$;

revoke all on function public.is_current_user_admin() from public, anon;
grant execute on function public.is_current_user_admin() to authenticated;

drop policy if exists "Users can read own account" on public.users;
create policy "Users can read own account"
  on public.users for select to authenticated
  using (
    lower(email) = lower((select auth.jwt() ->> 'email'))
    or (select public.is_current_user_admin())
  );

drop policy if exists "Customers can update own account" on public.users;
create policy "Customers can update own account"
  on public.users for update to authenticated
  using (
    lower(email) = lower((select auth.jwt() ->> 'email'))
    and role = 'pelanggan'
    and is_aktif
  )
  with check (
    lower(email) = lower((select auth.jwt() ->> 'email'))
    and role = 'pelanggan'
    and is_aktif
  );

drop policy if exists "Customers can read own addresses" on public.alamat;
create policy "Customers can read own addresses"
  on public.alamat for select to authenticated
  using (
    exists (
      select 1
      from public.users as account
      where account.id = alamat.user_id
        and lower(account.email) = lower((select auth.jwt() ->> 'email'))
        and account.role = 'pelanggan'
        and account.is_aktif
    )
  );

drop policy if exists "Customers can create own addresses" on public.alamat;
create policy "Customers can create own addresses"
  on public.alamat for insert to authenticated
  with check (
    exists (
      select 1
      from public.users as account
      where account.id = alamat.user_id
        and lower(account.email) = lower((select auth.jwt() ->> 'email'))
        and account.role = 'pelanggan'
        and account.is_aktif
    )
  );

drop policy if exists "Customers can update own addresses" on public.alamat;
create policy "Customers can update own addresses"
  on public.alamat for update to authenticated
  using (
    exists (
      select 1
      from public.users as account
      where account.id = alamat.user_id
        and lower(account.email) = lower((select auth.jwt() ->> 'email'))
        and account.role = 'pelanggan'
        and account.is_aktif
    )
  )
  with check (
    exists (
      select 1
      from public.users as account
      where account.id = alamat.user_id
        and lower(account.email) = lower((select auth.jwt() ->> 'email'))
        and account.role = 'pelanggan'
        and account.is_aktif
    )
  );

drop policy if exists "Customers can delete own addresses" on public.alamat;
create policy "Customers can delete own addresses"
  on public.alamat for delete to authenticated
  using (
    exists (
      select 1
      from public.users as account
      where account.id = alamat.user_id
        and lower(account.email) = lower((select auth.jwt() ->> 'email'))
        and account.role = 'pelanggan'
        and account.is_aktif
    )
  );

create or replace function public.sync_auth_user_to_users()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  existing_user_id text;
begin
  if new.email is null then
    return new;
  end if;

  select account.id::text
    into existing_user_id
    from public.users as account
    where lower(account.email) = lower(new.email)
    order by account.created_at
    limit 1;

  if existing_user_id is not null then
    update public.users
      set nama = coalesce(
            nullif(new.raw_user_meta_data ->> 'nama', ''),
            nama
          ),
          no_hp = coalesce(
            nullif(new.raw_user_meta_data ->> 'no_hp', ''),
            no_hp
          )
      where id::text = existing_user_id;
  else
    if nullif(new.raw_user_meta_data ->> 'nama', '') is null then
      return new;
    end if;

    insert into public.users (
      nama,
      email,
      no_hp,
      password_hash,
      role,
      is_aktif
    )
    values (
      coalesce(new.raw_user_meta_data ->> 'nama', ''),
      new.email,
      nullif(new.raw_user_meta_data ->> 'no_hp', ''),
      null,
      'pelanggan',
      true
    );
  end if;

  return new;
end;
$$;

drop trigger if exists create_customer_profile_after_auth_insert on auth.users;
drop trigger if exists create_customer_profile_after_auth_email_update on auth.users;
drop trigger if exists sync_auth_user_to_users_after_insert on auth.users;
create trigger sync_auth_user_to_users_after_insert
  after insert on auth.users
  for each row execute function public.sync_auth_user_to_users();

drop function if exists public.create_customer_profile();

create index if not exists alamat_user_created_idx
  on public.alamat (user_id, created_at desc);

create or replace function public.keep_one_primary_customer_address()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.is_utama then
    update public.alamat
      set is_utama = false
      where user_id = new.user_id
        and is_utama
        and id is distinct from new.id;
  end if;

  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists keep_one_primary_customer_address_before_write on public.alamat;
create trigger keep_one_primary_customer_address_before_write
  before insert or update of is_utama, user_id on public.alamat
  for each row execute function public.keep_one_primary_customer_address();
