import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { Schedule } from '@/types/database'
import Link from 'next/link'
import { deleteSchedule, toggleScheduleVisibility } from '@/actions/schedules'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'short',
  })
}
function formatTime(timeStr: string) {
  return timeStr.slice(0, 5)
}

type Props = {
  searchParams: Promise<{ from?: string; to?: string; visibility?: string }>
}

export default async function SchedulesPage({ searchParams }: Props) {
  const { from, to, visibility } = await searchParams
  const supabase = await createClient()

  const cookieStore = await cookies()
  const userName = cookieStore.get('proto_user_name')?.value ?? ''
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('name', userName).single()
  const isAdmin = profile?.role === 'admin'

  let q = supabase.from('schedules').select('*').order('date', { ascending: true })
  if (!isAdmin) {
    q = q.eq('is_hidden', false)
  } else {
    if (from) q = q.gte('date', from)
    if (to)   q = q.lte('date', to)
    if (visibility === 'visible') q = q.eq('is_hidden', false)
    if (visibility === 'hidden')  q = q.eq('is_hidden', true)
  }
  const { data: schedules } = await q

  const visibleCount = schedules?.filter(s => !s.is_hidden).length ?? 0
  const hasFilter = from || to || (visibility && visibility !== 'all')

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">📅 練習スケジュール</h1>
          <p className="text-gray-500 mt-1">
            {isAdmin
              ? `全 ${schedules?.length ?? 0} 件（うち公開 ${visibleCount} 件）`
              : `${visibleCount} 件`}
          </p>
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

      {/* 管理者フィルター */}
      {isAdmin && (
        <form method="GET" className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">開始日</label>
            <input
              type="date" name="from" defaultValue={from ?? ''}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">終了日</label>
            <input
              type="date" name="to" defaultValue={to ?? ''}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">公開状態</label>
            <select
              name="visibility" defaultValue={visibility ?? 'all'}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="all">すべて</option>
              <option value="visible">公開のみ</option>
              <option value="hidden">非公開のみ</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-gray-800 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              絞り込む
            </button>
            {hasFilter && (
              <Link
                href="/schedules"
                className="px-4 py-1.5 text-sm text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                リセット
              </Link>
            )}
          </div>
        </form>
      )}

      <div className="flex flex-col gap-3">
        {schedules && schedules.length > 0 ? (
          schedules.map((s: Schedule) => (
            <div
              key={s.id}
              className={`bg-white rounded-xl border p-5 transition-opacity ${
                s.is_hidden ? 'border-gray-200 opacity-60' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900">{formatDate(s.date)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      s.is_hidden
                        ? 'bg-gray-100 text-gray-400'
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {s.is_hidden ? '非公開' : '公開'}
                    </span>
                  </div>
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
                    <form action={toggleScheduleVisibility.bind(null, s.id, s.is_hidden)}>
                      <button
                        type="submit"
                        className={`text-xs font-medium transition-colors ${
                          s.is_hidden
                            ? 'text-blue-500 hover:text-blue-700'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        {s.is_hidden ? '公開に戻す' : '非公開にする'}
                      </button>
                    </form>
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
          <p className="text-center text-gray-500 py-12">
            {hasFilter ? '条件に一致するスケジュールがありません' : '予定はありません'}
          </p>
        )}
      </div>
    </div>
  )
}
