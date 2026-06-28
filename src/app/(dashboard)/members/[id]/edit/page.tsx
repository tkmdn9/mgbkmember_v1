import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'
import { updateMember } from '@/actions/members'
import Link from 'next/link'

const POSITIONS = [
  { value: 'PG', label: 'PG（ポイントガード）' },
  { value: 'SG', label: 'SG（シューティングガード）' },
  { value: 'SF', label: 'SF（スモールフォワード）' },
  { value: 'PF', label: 'PF（パワーフォワード）' },
  { value: 'C',  label: 'C（センター）' },
]

type Props = { params: Promise<{ id: string }> }

export default async function EditMemberPage({ params }: Props) {
  const { id } = await params

  // admin以外はリダイレクト
  const cookieStore = await cookies()
  const userName = cookieStore.get('proto_user_name')?.value ?? ''
  const supabase = await createClient()
  const { data: myProfile } = await supabase
    .from('profiles').select('role').eq('name', userName).single()
  if (myProfile?.role !== 'admin') redirect('/members')

  // 編集対象メンバーの現在の値を取得
  const { data: member, error } = await supabase
    .from('profiles').select('*').eq('id', id).single()
  if (error || !member) notFound()

  return (
    <div className="max-w-lg">
      <Link href={`/members/${id}`} className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">
        ← メンバー詳細に戻る
      </Link>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">✏️ メンバーを編集</h1>

        {/* updateMember.bind(null, id) で id を事前に渡す */}
        <form action={updateMember.bind(null, id)} className="flex flex-col gap-4">
          {/* 名前: defaultValue で現在の値をセット */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              名前 <span className="text-red-500">*</span>
            </label>
            <input
              name="name" type="text" required
              defaultValue={member.name}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* 背番号 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">背番号（任意）</label>
            <input
              name="jersey_no" type="number" min="0" max="99"
              defaultValue={member.jersey_no ?? ''}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* ポジション */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ポジション（任意）</label>
            <select
              name="position"
              defaultValue={member.position ?? ''}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
            >
              <option value="">未設定</option>
              {POSITIONS.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          {/* 権限 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">権限</label>
            <select
              name="role"
              defaultValue={member.role}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
            >
              <option value="member">メンバー</option>
              <option value="admin">管理者</option>
            </select>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Link
              href={`/members/${id}`}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              キャンセル
            </Link>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
            >
              保存する
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
