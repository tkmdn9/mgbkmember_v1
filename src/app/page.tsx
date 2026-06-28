import { redirect } from 'next/navigation'

// ルート (/) はダッシュボードへリダイレクト
// middleware.ts が未ログインならログインページへ飛ばしてくれる
export default function RootPage() {
  redirect('/dashboard')
}
