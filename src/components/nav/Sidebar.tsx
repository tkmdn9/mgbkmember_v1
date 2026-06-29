'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut } from 'lucide-react'
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
        <span className="text-lg font-bold">🏀 MUITバスケ同好会</span>
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
      <div className="px-3 py-3 border-t border-gray-100">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-gray-50 mb-2">
          {/* アバター */}
          <div className="w-9 h-9 rounded-full bg-orange-500 text-white font-bold text-sm flex items-center justify-center shrink-0">
            {userName.charAt(0)}
          </div>
          {/* 名前 */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 leading-none mb-0.5">ログイン中</p>
            <p className="text-sm font-semibold text-gray-800 truncate">{userName}</p>
          </div>
        </div>
        {/* ログアウトボタン */}
        <form action={logout}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <LogOut size={15} />
            ログアウト
          </button>
        </form>
      </div>
    </aside>
  )
}
