'use client'

import Link from 'next/link'

type Props = {
  userName: string
  profileId: string | null
}

export function MobileHeader({ userName, profileId }: Props) {
  return (
    <header className="flex lg:hidden items-center justify-between px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-40">
      <span className="text-base font-bold">🏀 MUITバスケ同好会</span>
      <div className="flex items-center gap-2">
        <Link
          href="/guide"
          className="text-xs text-gray-400 hover:text-orange-500 transition-colors px-2 py-1"
        >
          📖 ガイド
        </Link>
        <Link
          href={profileId ? `/members/${profileId}` : '#'}
          className="w-9 h-9 rounded-full bg-orange-500 text-white font-bold text-sm flex items-center justify-center shrink-0 hover:bg-orange-600 transition-colors"
        >
          {userName.charAt(0)}
        </Link>
      </div>
    </header>
  )
}
