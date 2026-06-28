import { createClient } from '@/lib/supabase/server'
import { Profile } from '@/types/database'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  // Next.js が URL の [id] 部分を params として渡してくれる
  params: Promise<{ id: string }>
}

export default async function MemberDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  // idに一致するメンバーを1件取得
  const { data: member, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)   // eq = equal (WHERE id = ?)
    .single()       // 1件だけ取得 (0件 or 複数件はエラーになる)

  // 存在しないIDにアクセスしたら404ページを表示
  if (error || !member) notFound()

  const profile = member as Profile

  return (
    <div className="max-w-lg">
      {/* 戻るリンク */}
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
            <div className="flex justify-between py-3">
              <dt className="text-sm text-gray-500">登録日</dt>
              <dd className="text-sm font-medium">
                {new Date(profile.created_at).toLocaleDateString('ja-JP')}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
