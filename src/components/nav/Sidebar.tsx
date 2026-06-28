'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/actions/auth'

const NAV_ITEMS = [
  { href: '/dashboard',      label: 'ホーム',         icon: '🏠' },
  { href: '/members',        label: 'メンバー',       icon: '👥' },
  { href: '/announcements',  label: 'お知らせ',       icon: '📢' },
  { href: '/schedules',      label: 'スケジュール',   icon: '📅' },
  { href: '/attendance',     label: '出席管理',       icon: '✅' },
]

type Props = {
  userName: string
}

export function Sidebar({ userName }: Props) {
  // usePathname() は現在のURLパスを返すフック (Client Componentでのみ使える)
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* ロゴ */}
      <div className="px-4 py-5 border-b border-gray-100">
        <span className="text-lg font-bold">🏀 バスケ同好会</span>
      </div>

      {/* ナビリンク */}
      <nav className="flex-1 px-2 py-4 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          // 現在のページかどうかでスタイルを切り替える
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-orange-50 text-orange-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* ユーザー情報 & ログアウト */}
      <div className="px-4 py-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 mb-2">ログイン中</p>
        <p className="text-sm font-medium text-gray-800 truncate mb-3">{userName}</p>
        {/* form + Server Action でログアウト */}
        <form action={logout}>
          <button
            type="submit"
            className="w-full text-xs text-gray-500 hover:text-red-500 transition-colors text-left"
          >
            ログアウト
          </button>
        </form>
      </div>
    </aside>
  )
}
