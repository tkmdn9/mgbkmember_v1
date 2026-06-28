import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// サーバー (Server Component / Server Actions / middleware) から使うクライアント
// Cookieを通じてセッションを読み書きする
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component から呼ばれた場合はCookie書き込み不可 (読み取りのみ)
          }
        },
      },
    }
  )
}
