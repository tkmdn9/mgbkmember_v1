import { createBrowserClient } from '@supabase/ssr'

// ブラウザ (Client Component) から使うクライアント
// 'use client' のコンポーネント内で呼び出す
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
