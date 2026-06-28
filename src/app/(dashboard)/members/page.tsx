import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { Profile } from '@/types/database'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DeleteMemberButton } from '@/components/members/DeleteMemberButton'
import Link from 'next/link'

const POSITION_LABEL: Record<string, string> = {
  PG: 'ポイントガード',
  SG: 'シューティングガード',
  SF: 'スモールフォワード',
  PF: 'パワーフォワード',
  C: 'センター',
}

export default async function MembersPage() {
  const supabase = await createClient()

  const { data: members, error } = await supabase
    .from('profiles')
    .select('*')
    .order('name')

  if (error) {
    return <p className="text-red-500">データの取得に失敗しました: {error.message}</p>
  }

  // admin判定
  const cookieStore = await cookies()
  const userName = cookieStore.get('proto_user_name')?.value ?? ''
  const { data: myProfile } = await supabase
    .from('profiles').select('role').eq('name', userName).single()
  const isAdmin = myProfile?.role === 'admin'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">👥 メンバー一覧</h1>
          <p className="text-gray-500 mt-1">全 {members?.length ?? 0} 名</p>
        </div>
        {isAdmin && (
          <Link
            href="/members/new"
            className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            + メンバー追加
          </Link>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {members && members.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {members.map((member: Profile) => (
              <li key={member.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                {/* メンバー情報（クリックで詳細へ） */}
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
                    <span className="text-2xl font-bold text-gray-300">
                      #{member.jersey_no}
                    </span>
                  )}
                </Link>

                {/* admin用: 編集・削除ボタン */}
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
          <p className="text-center text-gray-500 py-12">メンバーがいません。</p>
        )}
      </div>
    </div>
  )
}
