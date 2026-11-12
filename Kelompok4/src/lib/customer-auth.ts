import { supabase } from './supabase';

export function getEmailRateLimitMessage(error: unknown): string | null {
  const message = error instanceof Error ? error.message.toLowerCase() : '';
  if (!message.includes('rate limit') && !message.includes('too many requests')) return null;

  return 'Supabase sedang membatasi pengiriman email karena terlalu banyak percobaan. Jangan daftar atau meminta email ulang berulang kali; tunggu sampai batasnya pulih. Dengan penyedia email bawaan Supabase, batas umumnya 2 email per jam. Jika email konfirmasi tetap tidak masuk, minta backend mengatur SMTP khusus di Supabase.';
}

export async function resendSignupConfirmation(email: string): Promise<void> {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email.trim().toLowerCase(),
  });

  if (error) throw error;
}
