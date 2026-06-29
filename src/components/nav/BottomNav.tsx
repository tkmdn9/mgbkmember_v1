'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/dashboard',     label: 'ホーム',     icon: '🏠' },
  { href: '/members',       label: 'メンバー',   icon: '👥' },
  { href: '/announcements', label: 'お知らせ',   icon: '📢' },
  { href: '/schedules',     label: 'スケジュール', icon: '📅' },
  { href: '/attendance',    label: '出席管理',   icon: '✅' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex lg:hidden z-50">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs transition-colors ${
              isActive ? 'text-orange-500' : 'text-gray-400'
            }`}
          >
            <span className="text-xl leading-none">{item.icon}</span>
            <span className="leading-none">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
