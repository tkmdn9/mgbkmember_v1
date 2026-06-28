import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { createSchedule } from '@/actions/schedules'
import Link from 'next/link'

export default async function NewSchedulePage() {
  const cookieStore = await cookies()
  const userName = cookieStore.get('proto_user_name')?.value ?? ''
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('name', userName).single()
  if (profile?.role !== 'admin') redirect('/schedules')

  // デフォルト日付を今日に設定
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="max-w-lg">
      <Link href="/schedules" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">
        ← スケジュール一覧に戻る
      </Link>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">📅 練習を追加</h1>

        <form action={createSchedule} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">日付</label>
            <input
              name="date" type="date" required defaultValue={today}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">開始時刻</label>
              <input
                name="start_time" type="time" required defaultValue="18:00"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">終了時刻</label>
              <input
                name="end_time" type="time" required defaultValue="20:00"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">場所</label>
            <input
              name="location" type="text" required placeholder="例: 〇〇体育館 第2コート"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">メモ（任意）</label>
            <textarea
              name="note" rows={3} placeholder="例: 体育館シューズ必須"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Link href="/schedules" className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
              キャンセル
            </Link>
            <button type="submit" className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium">
              追加する
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
