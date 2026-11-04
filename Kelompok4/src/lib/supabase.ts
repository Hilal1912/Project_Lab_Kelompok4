import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://ujfaudhwqgwzpwxifopd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqZmF1ZGh3cWd3enB3eGlmb3BkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM1OTA4OTYsImV4cCI6MjEwOTE2Njg5Nn0.SZNZIuFLuIyg7_o2HuNumT2FF4WB0HHYAY13_UzupQc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
