insert into public.users (
  nama,
  email,
  no_hp,
  password_hash,
  role,
  is_aktif
)
select
  nullif(auth_user.raw_user_meta_data ->> 'nama', ''),
  auth_user.email,
  nullif(auth_user.raw_user_meta_data ->> 'no_hp', ''),
  null,
  'pelanggan',
  true
from auth.users as auth_user
where auth_user.email is not null
  and nullif(auth_user.raw_user_meta_data ->> 'nama', '') is not null
  and not exists (
    select 1
    from public.users as account
    where lower(account.email) = lower(auth_user.email)
  );
