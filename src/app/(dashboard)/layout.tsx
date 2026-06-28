import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/nav/Sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // サーバー側でCookieからユーザー名を取得
  const cookieStore = await cookies()
  const userName = cookieStore.get('proto_user_name')?.value

  // 万が一Cookieが無ければログインへ (middlewareのバックアップ)
  if (!userName) redirect('/login')

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar は Client Component だが、userName はサーバーから渡す */}
      <Sidebar userName={userName} />

      {/* メインコンテンツ: {children} に各ページの page.tsx が入る */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
