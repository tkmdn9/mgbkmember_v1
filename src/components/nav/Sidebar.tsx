'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
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
  profileId: string | null
}

export function Sidebar({ userName, profileId }: Props) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isOpen])

  return (
    <aside className="hidden lg:flex w-56 shrink-0 bg-white border-r border-gray-200 flex-col h-screen sticky top-0">
      {/* ロゴ */}
      <div className="px-4 py-5 border-b border-gray-100">
        <span className="text-lg font-bold">🏀 MUITバスケ同好会</span>
      </div>

      {/* ナビリンク */}
      <nav className="flex-1 px-2 py-4 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
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

      {/* ユーザーカード（クリックでドロップダウン） */}
      <div className="px-3 py-3 border-t border-gray-100 relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full flex items-center gap-3 px-2 py-2 rounded-lg bg-gray-50 hover:bg-orange-50 transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-orange-500 text-white font-bold text-sm flex items-center justify-center shrink-0">
            {userName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-xs text-gray-400 leading-none mb-0.5">ログイン中</p>
            <p className="text-sm font-semibold text-gray-800 truncate">{userName}</p>
          </div>
        </button>

        {isOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-1 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden z-50">
            <Link
              href={profileId ? `/members/${profileId}` : '#'}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 transition-colors"
            >
              <span>👤</span>
              マイプロフィール
            </Link>
            <Link
              href="/guide"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 transition-colors border-t border-gray-100"
            >
              <span>📖</span>
              利用ガイド
            </Link>
            <form action={logout} className="border-t border-gray-100">
              <button
                type="submit"
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={15} />
                ログアウト
              </button>
            </form>
          </div>
        )}
      </div>
    </aside>
  )
}
