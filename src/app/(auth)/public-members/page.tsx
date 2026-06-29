import { createClient } from '@/lib/supabase/server'
import { Profile } from '@/types/database'
import Link from 'next/link'

const POSITION_LABEL: Record<string, string> = {
  PG: 'PG',
  SG: 'SG',
  SF: 'SF',
  PF: 'PF',
  C: 'C',
}

export default async function PublicMembersPage() {
  const supabase = await createClient()

  const { data: members, error } = await supabase
    .from('profiles')
    .select('id, name, jersey_no, position, bio, department')
    .order('name')

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🏀 メンバー一覧</h1>
            <p className="text-gray-500 text-sm mt-1">全 {members?.length ?? 0} 名</p>
          </div>
          <Link href="/login" className="text-sm text-gray-500 hover:text-orange-500 transition-colors">
            ← ログインへ戻る
          </Link>
        </div>

        <p className="text-sm text-gray-500 mb-4 bg-orange-50 border border-orange-100 rounded-lg px-4 py-3">
          ログイン時はこちらのリストに表示されている名前（完全一致）を入力してください。
        </p>

        {error && (
          <p className="text-red-500 text-sm">データの取得に失敗しました。</p>
        )}

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {members && members.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {members.map((member: Pick<Profile, 'id' | 'name' | 'jersey_no' | 'position' | 'bio' | 'department'>) => (
                <li key={member.id} className="px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-700 font-bold text-sm flex items-center justify-center shrink-0">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        {member.department && (
                          <p className="text-xs text-gray-400 mt-0.5">{member.department}</p>
                        )}
                        {member.bio && (
                          <p className="text-xs text-gray-500 mt-0.5">{member.bio}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-right shrink-0">
                      {member.position && (
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                          {POSITION_LABEL[member.position] ?? member.position}
                        </span>
                      )}
                      {member.jersey_no !== null && (
                        <span className="text-lg font-bold text-gray-300">
                          #{member.jersey_no}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 py-12">メンバーがいません。</p>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link href="/register" className="text-sm text-orange-500 hover:text-orange-600 font-medium">
            新規メンバー登録はこちら →
          </Link>
        </div>
      </div>
    </div>
  )
}
