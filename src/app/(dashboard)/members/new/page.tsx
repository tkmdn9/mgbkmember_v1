import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { createMember } from '@/actions/members'
import Link from 'next/link'

const POSITIONS = [
  { value: 'PG', label: 'PG（ポイントガード）' },
  { value: 'SG', label: 'SG（シューティングガード）' },
  { value: 'SF', label: 'SF（スモールフォワード）' },
  { value: 'PF', label: 'PF（パワーフォワード）' },
  { value: 'C',  label: 'C（センター）' },
]

export default async function NewMemberPage() {
  // admin以外はリダイレクト
  const cookieStore = await cookies()
  const userName = cookieStore.get('proto_user_name')?.value ?? ''
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('name', userName).single()
  if (profile?.role !== 'admin') redirect('/members')

  return (
    <div className="max-w-lg">
      <Link href="/members" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">
        ← メンバー一覧に戻る
      </Link>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">👤 メンバーを追加</h1>

        <form action={createMember} className="flex flex-col gap-4">
          {/* 名前 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              名前 <span className="text-red-500">*</span>
            </label>
            <input
              name="name" type="text" required
              placeholder="例: 山田 太郎"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* 背番号 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">背番号（任意）</label>
            <input
              name="jersey_no" type="number" min="0" max="99"
              placeholder="例: 23"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* ポジション */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ポジション（任意）</label>
            <select
              name="position"
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
              placeholder="例: バスケ歴3年、3ポイントが得意です！"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            />
          </div>

          {/* 権限 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">権限</label>
            <select
              name="role"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
            >
              <option value="member">メンバー</option>
              <option value="admin">管理者</option>
            </select>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Link
              href="/members"
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              キャンセル
            </Link>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
            >
              追加する
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
