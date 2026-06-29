import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'
import { updateMember, updateSelfProfile } from '@/actions/members'
import Link from 'next/link'

const POSITIONS = [
  { value: 'PG', label: 'PG（ポイントガード）' },
  { value: 'SG', label: 'SG（シューティングガード）' },
  { value: 'SF', label: 'SF（スモールフォワード）' },
  { value: 'PF', label: 'PF（パワーフォワード）' },
  { value: 'C',  label: 'C（センター）' },
]

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }

export default async function EditMemberPage({ params, searchParams }: Props) {
  const { id } = await params
  const { error: formError } = await searchParams

  const cookieStore = await cookies()
  const userName = cookieStore.get('proto_user_name')?.value ?? ''
  const supabase = await createClient()
  const { data: myProfile } = await supabase
    .from('profiles').select('id, role').eq('name', userName).single()

  const isAdmin = myProfile?.role === 'admin'
  const isSelf  = myProfile?.id === id

  // admin でも自分でもない場合はリダイレクト
  if (!isAdmin && !isSelf) redirect('/members')

  const { data: member, error } = await supabase
    .from('profiles').select('*').eq('id', id).single()
  if (error || !member) notFound()

  const action = isAdmin
    ? updateMember.bind(null, id)
    : updateSelfProfile.bind(null, id)

  return (
    <div className="max-w-lg">
      <Link href={`/members/${id}`} className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">
        ← メンバー詳細に戻る
      </Link>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">✏️ メンバーを編集</h1>

        <form action={action} className="flex flex-col gap-4">
          {/* 名前: admin のみ編集可 */}
          {isAdmin && (
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
          )}

          {/* 背番号 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">背番号（任意）</label>
            <input
              name="jersey_no" type="number" min="0" max="99"
              defaultValue={member.jersey_no ?? ''}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {formError === 'jersey_taken' && (
              <p className="mt-1 text-xs text-red-500">
                この背番号はすでに他のメンバーが使用しています。
              </p>
            )}
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

          {/* 部署 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">部署（任意）</label>
            <input
              name="department" type="text"
              defaultValue={member.department ?? ''}
              placeholder="例: DX推進部"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* 趣味・一言 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">趣味・一言（任意）</label>
            <textarea
              name="bio"
              rows={2}
              defaultValue={member.bio ?? ''}
              placeholder="例: バスケ歴3年、3ポイントが得意です！"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            />
          </div>

          {/* 権限: admin のみ編集可 */}
          {isAdmin && (
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
          )}

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
