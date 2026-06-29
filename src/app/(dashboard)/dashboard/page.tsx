import { cookies } from 'next/headers'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Link from 'next/link'

// ダッシュボードの各セクションへのリンクカード
const SECTIONS = [
  {
    href: '/members',
    title: '👥 メンバー管理',
    description: 'メンバーの一覧・プロフィールを確認',
  },
  {
    href: '/announcements',
    title: '📢 お知らせ',
    description: '同好会からのお知らせを確認',
  },
  {
    href: '/schedules',
    title: '📅 練習スケジュール',
    description: '練習日程の確認・登録',
  },
  {
    href: '/attendance',
    title: '✅ 出席管理',
    description: '練習への出席・欠席を登録',
  },
]

// Server Component: async にして Cookie をサーバー側で読む
export default async function DashboardPage() {
  const cookieStore = await cookies()
  const userName = cookieStore.get('proto_user_name')?.value ?? 'メンバー'

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          ようこそ、{userName}さん 👋
        </h1>
        <p className="text-gray-500 mt-1">MUITバスケ同好会メンバー管理システム</p>
      </div>

      {/* セクションカード一覧 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SECTIONS.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-base">{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
