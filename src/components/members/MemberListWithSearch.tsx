'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { DeleteMemberButton } from '@/components/members/DeleteMemberButton'
import { Profile } from '@/types/database'

const POSITION_LABEL: Record<string, string> = {
  PG: 'ポイントガード',
  SG: 'シューティングガード',
  SF: 'スモールフォワード',
  PF: 'パワーフォワード',
  C: 'センター',
}

type Props = {
  members: Profile[]
  isAdmin: boolean
}

export function MemberListWithSearch({ members, isAdmin }: Props) {
  const [query, setQuery] = useState('')

  const filtered = query.trim()
    ? members.filter((m) =>
        m.name.toLowerCase().includes(query.trim().toLowerCase())
      )
    : members

  return (
    <>
      {/* 検索ボックス */}
      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="名前で検索..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filtered.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {filtered.map((member) => (
              <li key={member.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                <Link href={`/members/${member.id}`} className="flex items-center gap-4 flex-1 min-w-0">
                  <Avatar>
                    <AvatarImage src={member.avatar_url ?? undefined} />
                    <AvatarFallback className="bg-orange-100 text-orange-700">
                      {member.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{member.name}</span>
                      {member.role === 'admin' && (
                        <Badge variant="secondary" className="text-xs">管理者</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {member.position ? POSITION_LABEL[member.position] ?? member.position : '未設定'}
                    </p>
                  </div>
                  {member.jersey_no !== null && (
                    <span className="text-lg font-bold text-gray-300 shrink-0">
                      #{member.jersey_no}
                    </span>
                  )}
                </Link>

                {isAdmin && (
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/members/${member.id}/edit`}
                      className="text-xs text-gray-400 hover:text-orange-500 transition-colors px-2 py-1"
                    >
                      編集
                    </Link>
                    <DeleteMemberButton memberId={member.id} memberName={member.name} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 py-12">
            {query ? `「${query}」に一致するメンバーはいません` : 'メンバーがいません。'}
          </p>
        )}
      </div>
    </>
  )
}
