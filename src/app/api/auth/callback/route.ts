import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Googleログイン後、Supabaseがここにリダイレクトしてくる
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // 初回ログイン時: profilesテーブルにユーザー情報を登録
      await supabase.from('profiles').upsert({
        id: data.user.id,
        name: data.user.user_metadata?.full_name ?? data.user.email ?? '',
        avatar_url: data.user.user_metadata?.avatar_url ?? null,
      }, {
        onConflict: 'id',
        ignoreDuplicates: true, // 2回目以降のログインは上書きしない
      })

      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  // エラー時はログインページへ
  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
