import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client-side instance (limited permissions via anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side instance (full permissions via service role key — never expose to client)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
