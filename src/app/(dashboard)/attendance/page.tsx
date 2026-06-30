import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { registerAttendance } from '@/actions/attendance'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'short',
  })
}
function formatTime(timeStr: string) {
  return timeStr.slice(0, 5)
}

// 出欠ステータスの日本語ラベルとスタイル
const statusConfig = {
  present: { label: '出席', bg: 'bg-green-100', text: 'text-green-700' },
  absent:  { label: '欠席', bg: 'bg-red-100',   text: 'text-red-700'   },
  pending: { label: '未回答', bg: 'bg-gray-100', text: 'text-gray-500' },
} as const

export default async function AttendancePage() {
  const supabase = await createClient()
  const cookieStore = await cookies()
  const userName = cookieStore.get('proto_user_name')?.value ?? ''

  // 自分のプロフィールを取得
  const { data: myProfile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('name', userName)
    .single()

  // 公開中かつ今日以降のスケジュールを取得 (JST基準)
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo' }).format(new Date())
  const { data: schedules } = await supabase
    .from('schedules')
    .select('*')
    .eq('is_hidden', false)
    .gte('date', today)
    .order('date', { ascending: true })

  if (!myProfile) {
    return <p className="text-gray-500">プロフィールが見つかりません。ログインし直してください。</p>
  }

  // 自分の出欠記録を取得 → { schedule_id: status } のマップに変換
  const { data: myAttendances } = await supabase
    .from('attendances')
    .select('schedule_id, status')
    .eq('user_id', myProfile.id)

  const myStatusMap: Record<string, 'present' | 'absent' | 'pending'> = Object.fromEntries(
    (myAttendances ?? []).map(a => [a.schedule_id, a.status as 'present' | 'absent' | 'pending'])
  )

  // adminの場合: 全メンバーの出欠集計を取得
  const isAdmin = myProfile.role === 'admin'
  const { data: allAttendances } = isAdmin
    ? await supabase.from('attendances').select('schedule_id, status')
    : { data: [] }

  // 全メンバー数（未回答人数の計算用）
  const { count: totalMembers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">✅ 出席管理</h1>
      <p className="text-gray-500 mb-6">直近 {schedules?.length ?? 0} 件の練習</p>

      {!schedules || schedules.length === 0 ? (
        <p className="text-center text-gray-500 py-12">
          予定はありません。先にスケジュールを追加してください。
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {schedules.map(schedule => {
            const myStatus = myStatusMap[schedule.id] ?? 'pending'
            const cfg = statusConfig[myStatus]

            // adminの場合: スケジュールごとの集計
            const entries = (allAttendances ?? []).filter(a => a.schedule_id === schedule.id)
            const presentCount = entries.filter(a => a.status === 'present').length
            const absentCount  = entries.filter(a => a.status === 'absent').length
            const pendingCount = (totalMembers ?? 0) - presentCount - absentCount

            return (
              <div key={schedule.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{formatDate(schedule.date)}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      🕐 {formatTime(schedule.start_time)} 〜 {formatTime(schedule.end_time)}
                    </p>
                    <p className="text-sm text-gray-600">📍 {schedule.location}</p>

                    {/* 現在の自分のステータス表示 */}
                    <span className={`inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                      {cfg.label}
                    </span>

                    {/* adminの場合: 全体の集計 */}
                    {isAdmin && (
                      <p className="text-xs text-gray-400 mt-1">
                        出席 {presentCount}名 ／ 欠席 {absentCount}名 ／ 未回答 {pendingCount}名
                      </p>
                    )}
                  </div>

                  {/* 出欠登録ボタン */}
                  <div className="flex flex-col gap-2 shrink-0">
                    {/* .bind(null, schedule.id, 'present') で引数を事前に渡す */}
                    <form action={registerAttendance.bind(null, schedule.id, 'present')}>
                      <button
                        type="submit"
                        className={`w-20 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                          myStatus === 'present'
                            ? 'bg-green-500 text-white'
                            : 'border border-gray-200 text-gray-600 hover:bg-green-50 hover:border-green-300'
                        }`}
                      >
                        出席
                      </button>
                    </form>
                    <form action={registerAttendance.bind(null, schedule.id, 'absent')}>
                      <button
                        type="submit"
                        className={`w-20 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                          myStatus === 'absent'
                            ? 'bg-red-500 text-white'
                            : 'border border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-300'
                        }`}
                      >
                        欠席
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
