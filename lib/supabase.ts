import { createClient, SupabaseClient } from "@supabase/supabase-js"

// Lazy initialization so importing this module never crashes a build or a
// route when env vars are missing (local dev without Supabase configured).
// The client is only created the first time it is actually used.

let _admin: SupabaseClient | null = null

// Server-side instance (full permissions via service role key — never expose to client)
export function getSupabaseAdmin(): SupabaseClient {
  if (_admin) return _admin

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.")
  }

  _admin = createClient(url, serviceKey)
  return _admin
}
