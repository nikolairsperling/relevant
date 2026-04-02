import { createBrowserClient } from '@supabase/ssr'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://folqmqmaszlzpwxqmzdy.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvbHFtcW1hc3psenB3eHFtemR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyMjEwNDMsImV4cCI6MjA4Mzc5NzA0M30.0EAGa2R78Q8IbBZbMObVoym2nbl9VLwGX8BkGJeYMv4'

export function createClient() {
    return createBrowserClient(
          SUPABASE_URL,
          SUPABASE_ANON_KEY
        )
}
