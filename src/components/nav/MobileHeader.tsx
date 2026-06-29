'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { LogOut } from 'lucide-react'
import { logout } from '@/actions/auth'

type Props = {
  userName: string
  profileId: string | null
}

export function MobileHeader({ userName, profileId }: Props) {
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
    <header className="flex lg:hidden items-center justify-between px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-40">
      <span className="text-base font-bold">🏀 MUITバスケ同好会</span>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-9 h-9 rounded-full bg-orange-500 text-white font-bold text-sm flex items-center justify-center shrink-0 hover:bg-orange-600 transition-colors"
        >
          {userName.charAt(0)}
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden z-50">
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
    </header>
  )
}
