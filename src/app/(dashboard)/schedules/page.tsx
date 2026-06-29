import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { Schedule } from '@/types/database'
import Link from 'next/link'
import { deleteSchedule } from '@/actions/schedules'

// 日付と時刻を日本語形式に整形するヘルパー
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'short',
  })
}
function formatTime(timeStr: string) {
  // "18:00:00" → "18:00" に変換
  return timeStr.slice(0, 5)
}

export default async function SchedulesPage() {
  const supabase = await createClient()

  // 今日以降のスケジュールを日付順で取得
  const today = new Date().toISOString().split('T')[0]  // "2026-06-28"
  const { data: schedules } = await supabase
    .from('schedules')
    .select('*')
    .gte('date', today)   // gte = greater than or equal (今日以降)
    .order('date', { ascending: true })

  // admin判定
  const cookieStore = await cookies()
  const userName = cookieStore.get('proto_user_name')?.value ?? ''
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('name', userName).single()
  const isAdmin = profile?.role === 'admin'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📅 練習スケジュール</h1>
          <p className="text-gray-500 mt-1">直近 {schedules?.length ?? 0} 件</p>
        </div>
        {isAdmin && (
          <Link
            href="/schedules/new"
            className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            + 追加する
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {schedules && schedules.length > 0 ? (
          schedules.map((s: Schedule) => (
            <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900">{formatDate(s.date)}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    🕐 {formatTime(s.start_time)} 〜 {formatTime(s.end_time)}
                  </p>
                  <p className="text-sm text-gray-600">📍 {s.location}</p>
                  {s.note && (
                    <p className="text-sm text-gray-500 mt-2 bg-gray-50 rounded px-3 py-2">
                      {s.note}
                    </p>
                  )}
                </div>
                {isAdmin && (
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <Link
                      href={`/schedules/${s.id}`}
                      className="text-xs text-orange-500 hover:text-orange-600 font-medium transition-colors"
                    >
                      出欠を確認 →
                    </Link>
                    <form action={deleteSchedule.bind(null, s.id)}>
                      <button type="submit" className="text-xs text-gray-400 hover:text-red-500 transition-colors">
                        削除
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-12">予定はありません</p>
        )}
      </div>
    </div>
  )
}
