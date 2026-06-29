import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { Profile } from '@/types/database'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DeleteMemberButton } from '@/components/members/DeleteMemberButton'
import { notFound } from 'next/navigation'
import Link from 'next/link'

const POSITION_LABEL: Record<string, string> = {
  PG: 'ポイントガード',
  SG: 'シューティングガード',
  SF: 'スモールフォワード',
  PF: 'パワーフォワード',
  C: 'センター',
}

type Props = {
  params: Promise<{ id: string }>
}

export default async function MemberDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: member, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !member) notFound()

  // admin判定
  const cookieStore = await cookies()
  const userName = cookieStore.get('proto_user_name')?.value ?? ''
  const { data: myProfile } = await supabase
    .from('profiles').select('id, role').eq('name', userName).single()
  const isAdmin = myProfile?.role === 'admin'
  const isSelf  = myProfile?.id === id

  const profile = member as Profile

  return (
    <div className="max-w-lg">
      <Link href="/members" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">
        ← メンバー一覧に戻る
      </Link>

      <Card>
        <CardHeader className="text-center pb-4">
          <Avatar className="w-20 h-20 mx-auto mb-3">
            <AvatarImage src={profile.avatar_url ?? undefined} />
            <AvatarFallback className="text-2xl bg-orange-100 text-orange-700">
              {profile.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-xl">{profile.name}</CardTitle>
          {profile.role === 'admin' && (
            <Badge variant="secondary" className="mx-auto">管理者</Badge>
          )}
        </CardHeader>

        <CardContent>
          <dl className="divide-y divide-gray-100">
            <div className="flex justify-between py-3">
              <dt className="text-sm text-gray-500">背番号</dt>
              <dd className="text-sm font-medium">
                {profile.jersey_no !== null ? `#${profile.jersey_no}` : '未設定'}
              </dd>
            </div>
            <div className="flex justify-between py-3">
              <dt className="text-sm text-gray-500">ポジション</dt>
              <dd className="text-sm font-medium">
                {profile.position
                  ? `${profile.position}（${POSITION_LABEL[profile.position] ?? ''}）`
                  : '未設定'}
              </dd>
            </div>
            {profile.department && (
              <div className="flex justify-between py-3">
                <dt className="text-sm text-gray-500">部署</dt>
                <dd className="text-sm font-medium">{profile.department}</dd>
              </div>
            )}
            {profile.bio && (
              <div className="py-3">
                <dt className="text-sm text-gray-500 mb-1">趣味・一言</dt>
                <dd className="text-sm font-medium">{profile.bio}</dd>
              </div>
            )}
            <div className="flex justify-between py-3">
              <dt className="text-sm text-gray-500">登録日</dt>
              <dd className="text-sm font-medium">
                {new Date(profile.created_at).toLocaleDateString('ja-JP')}
              </dd>
            </div>
          </dl>

          {/* admin または自分: 編集ボタン */}
          {(isAdmin || isSelf) && (
            <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-100">
              {isAdmin && (
                <DeleteMemberButton memberId={profile.id} memberName={profile.name} />
              )}
              <Link
                href={`/members/${profile.id}/edit`}
                className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
              >
                {isSelf && !isAdmin ? 'プロフィールを編集' : '編集する'}
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
