import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// client for browser (respects RLS)
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

// client for server-side API routes (bypasses RLS)
// falls back to anon key if service role key is not set
const supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey)

export default supabase