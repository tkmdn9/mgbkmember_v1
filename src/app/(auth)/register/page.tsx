import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const POSITIONS = [
  { value: 'PG', label: 'PG（ポイントガード）' },
  { value: 'SG', label: 'SG（シューティングガード）' },
  { value: 'SF', label: 'SF（スモールフォワード）' },
  { value: 'PF', label: 'PF（パワーフォワード）' },
  { value: 'C',  label: 'C（センター）' },
]

async function registerAction(formData: FormData) {
  'use server'
  const name = (formData.get('name') as string)?.trim()
  if (!name) return

  const supabase = await createClient()

  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('name', name)
    .single()

  if (existing) {
    redirect('/register?error=duplicate')
  }

  const jerseyNo   = formData.get('jersey_no') as string
  const position   = (formData.get('position') as string) || null
  const bio        = (formData.get('bio') as string)?.trim() || null
  const department = (formData.get('department') as string)?.trim() || null

  if (jerseyNo) {
    const { data: takenJersey } = await supabase
      .from('profiles').select('id').eq('jersey_no', parseInt(jerseyNo)).single()
    if (takenJersey) redirect('/register?error=jersey_taken')
  }

  await supabase.from('profiles').insert({
    name,
    jersey_no: jerseyNo ? parseInt(jerseyNo) : null,
    position: position || null,
    bio,
    department,
    role: 'member',
  })

  redirect('/login?success=registered')
}

type Props = {
  searchParams: Promise<{ error?: string }>
}

export default async function RegisterPage({ searchParams }: Props) {
  const { error } = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">🏀 MUITバスケ同好会</h1>
          <p className="text-gray-500 text-sm mt-1">新規メンバー登録</p>
        </div>

        <form action={registerAction} className="flex flex-col gap-4">
          {/* 名前 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              名前 <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              type="text"
              required
              placeholder="例: 山田 太郎"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {error === 'duplicate' && (
              <p className="mt-1 text-xs text-red-500">
                この名前はすでに登録されています。
              </p>
            )}
          </div>

          {/* 背番号 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">背番号（任意）</label>
            <input
              name="jersey_no"
              type="number"
              min="0"
              max="99"
              placeholder="例: 23"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {error === 'jersey_taken' && (
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
              name="department"
              type="text"
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

          <button
            type="submit"
            className="w-full bg-orange-500 text-white rounded-lg px-4 py-2 font-medium hover:bg-orange-600 transition-colors"
          >
            登録する
          </button>
        </form>

        <p className="text-center mt-4">
          <Link href="/login" className="text-sm text-gray-500 hover:text-gray-700">
            ← ログインへ戻る
          </Link>
        </p>
      </div>
    </div>
  )
}
