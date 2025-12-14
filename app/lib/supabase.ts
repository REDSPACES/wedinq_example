import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

// Supabaseクライアント（Auth/Realtime用）
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
