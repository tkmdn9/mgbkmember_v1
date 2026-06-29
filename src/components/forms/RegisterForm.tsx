'use client'

import { useActionState } from 'react'
import { registerAction } from '@/actions/register'
import type { RegisterState } from '@/actions/register'

const POSITIONS = [
  { value: 'PG', label: 'PG（ポイントガード）' },
  { value: 'SG', label: 'SG（シューティングガード）' },
  { value: 'SF', label: 'SF（スモールフォワード）' },
  { value: 'PF', label: 'PF（パワーフォワード）' },
  { value: 'C',  label: 'C（センター）' },
]

export function RegisterForm() {
  const [state, formAction] = useActionState<RegisterState, FormData>(registerAction, { error: null })

  return (
    <form action={formAction} className="flex flex-col gap-4">
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
        {state.error === 'duplicate' && (
          <p className="mt-1 text-xs text-red-500">
            この名前はすでに登録されています。
          </p>
        )}
      </div>

      {/* 背番号 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">背番号（任意）</label>
        <input
          name="jersey_no" type="number" min="0" max="99"
          placeholder="例: 23"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        {state.error === 'jersey_taken' && (
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
          name="department" type="text"
          placeholder="例: DX推進部"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* 趣味・一言 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">趣味・一言（任意）</label>
        <textarea
          name="bio" rows={2}
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
  )
}
