import { NextResponse, type NextRequest } from 'next/server'

// プロトタイプ用: 名前Cookieの有無でログイン状態を判定
// Step 9でGoogle認証に置き換える
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const userName = request.cookies.get('proto_user_name')?.value

  // 未ログインでダッシュボード系のページにアクセスしたらログインへ
  // /public-members と /register は認証不要の公開ページ
  if (
    !userName &&
    !pathname.startsWith('/login') &&
    !pathname.startsWith('/register') &&
    !pathname.startsWith('/public-members') &&
    !pathname.startsWith('/guide') &&
    !pathname.startsWith('/api')
  ) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // ログイン済みでログインページにアクセスしたらダッシュボードへ
  if (userName && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
