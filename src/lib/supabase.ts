// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('【Supabaseエラー】環境変数 PUBLIC_SUPABASE_URL または PUBLIC_SUPABASE_ANON_KEY が読み込めていません。');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);