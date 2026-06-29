'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { DeleteMemberButton } from '@/components/members/DeleteMemberButton'
import { toggleGymFeePaid } from '@/actions/members'
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
  const [paidMap, setPaidMap] = useState<Record<string, boolean>>(
    () => Object.fromEntries(members.map((m) => [m.id, m.gym_fee_paid]))
  )
  const [, startTransition] = useTransition()

  function handleToggle(memberId: string) {
    const next = !paidMap[memberId]
    setPaidMap((prev) => ({ ...prev, [memberId]: next }))
    startTransition(() => {
      toggleGymFeePaid(memberId, next)
    })
  }

  const filtered = query.trim()
    ? members.filter((m) =>
        m.name.toLowerCase().includes(query.trim().toLowerCase())
      )
    : members

  return (
    <>
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
            {filtered.map((member) => {
              const paid = paidMap[member.id] ?? member.gym_fee_paid
              return (
                <li key={member.id} className="flex items-center gap-3 px-4 lg:px-6 py-4 hover:bg-gray-50 transition-colors">
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

                  {/* 振込状況 */}
                  {isAdmin ? (
                    // 管理者: 振込済は緑バッジ、未振込は小さなグレーボタン（テキストなし）
                    <button
                      onClick={() => handleToggle(member.id)}
                      title={paid ? '振込済（クリックで取消）' : 'クリックで振込済にする'}
                      className={`shrink-0 transition-colors ${
                        paid
                          ? 'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200'
                          : 'w-6 h-6 rounded-full border-2 border-gray-200 hover:border-green-300 hover:bg-green-50'
                      }`}
                    >
                      {paid ? '✅ 振込済' : ''}
                    </button>
                  ) : (
                    // 一般: 振込済のみ表示、未振込は非表示
                    paid ? (
                      <span className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        ✅ 振込済
                      </span>
                    ) : null
                  )}

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
              )
            })}
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
