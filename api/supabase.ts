import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient }  from '@supabase/supabase-js';
import config from '../config';

const { supabase_url, supabase_key } = config;

export const supabase = createClient(supabase_url, supabase_key, 
  {
    localStorage: AsyncStorage,
    detectSessionInUrl: true,
  });

export const userId = () => {
  const user = supabase.auth.user();
  return user ? user.id : null;
}