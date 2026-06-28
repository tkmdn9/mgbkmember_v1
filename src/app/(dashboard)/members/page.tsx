import { createClient } from '@/lib/supabase/server'
import { Profile } from '@/types/database'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'

// ポジションの日本語ラベル
const POSITION_LABEL: Record<string, string> = {
  PG: 'ポイントガード',
  SG: 'シューティングガード',
  SF: 'スモールフォワード',
  PF: 'パワーフォワード',
  C: 'センター',
}

// Server Component: サーバーでSupabaseからデータ取得
export default async function MembersPage() {
  const supabase = await createClient()

  // profilesテーブルから全メンバーを名前順で取得
  const { data: members, error } = await supabase
    .from('profiles')
    .select('*')
    .order('name')

  if (error) {
    return <p className="text-red-500">データの取得に失敗しました: {error.message}</p>
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">👥 メンバー一覧</h1>
        <p className="text-gray-500 mt-1">全 {members?.length ?? 0} 名</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {members && members.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {members.map((member: Profile) => (
              // 各メンバーをクリックすると詳細ページへ遷移 (動的ルート [id])
              <li key={member.id}>
                <Link
                  href={`/members/${member.id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  {/* アバター: 画像がなければ名前の頭文字を表示 */}
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

                  {/* 背番号 */}
                  {member.jersey_no !== null && (
                    <span className="text-2xl font-bold text-gray-300">
                      #{member.jersey_no}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 py-12">
            メンバーがいません。Supabaseにテストデータを追加してください。
          </p>
        )}
      </div>
    </div>
  )
}
