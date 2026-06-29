import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { Profile } from '@/types/database'
import Link from 'next/link'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'short',
  })
}
function formatTime(timeStr: string) {
  return timeStr.slice(0, 5)
}

const STATUS_CONFIG = {
  present: { label: '出席', bg: 'bg-green-100', text: 'text-green-700' },
  absent:  { label: '欠席', bg: 'bg-red-100',   text: 'text-red-700'   },
  pending: { label: '未回答', bg: 'bg-gray-100', text: 'text-gray-500' },
} as const

type Status = keyof typeof STATUS_CONFIG

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ filter?: string }>
}

export default async function ScheduleDetailPage({ params, searchParams }: Props) {
  const { id } = await params
  const { filter } = await searchParams

  const activeFilter = (filter === 'present' || filter === 'absent' || filter === 'pending')
    ? filter as Status
    : null

  const cookieStore = await cookies()
  const userName = cookieStore.get('proto_user_name')?.value ?? ''
  const supabase = await createClient()

  const { data: myProfile } = await supabase
    .from('profiles').select('role').eq('name', userName).single()
  if (myProfile?.role !== 'admin') redirect('/schedules')

  const { data: schedule, error } = await supabase
    .from('schedules').select('*').eq('id', id).single()
  if (error || !schedule) notFound()

  const { data: members } = await supabase
    .from('profiles').select('id, name, jersey_no, position, gym_fee_paid').order('name')

  const { data: attendances } = await supabase
    .from('attendances').select('user_id, status').eq('schedule_id', id)

  const statusMap: Record<string, Status> = Object.fromEntries(
    (attendances ?? []).map(a => [a.user_id, a.status as Status])
  )

  const memberList = members ?? []
  const presentCount = memberList.filter(m => statusMap[m.id] === 'present').length
  const absentCount  = memberList.filter(m => statusMap[m.id] === 'absent').length
  const pendingCount = memberList.length - presentCount - absentCount

  // フィルタ適用
  const displayedMembers = activeFilter
    ? memberList.filter(m => (statusMap[m.id] ?? 'pending') === activeFilter)
    : memberList

  // サマリーボタン: アクティブ時はトグル解除（全表示に戻る）、非アクティブ時はフィルタ適用
  const filterHref = (status: Status) =>
    activeFilter === status ? `/schedules/${id}` : `/schedules/${id}?filter=${status}`

  return (
    <div className="max-w-lg">
      <Link href="/schedules" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">
        ← スケジュール一覧に戻る
      </Link>

      {/* スケジュール情報 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
        <p className="font-bold text-gray-900 text-lg">{formatDate(schedule.date)}</p>
        <p className="text-sm text-gray-600 mt-1">
          🕐 {formatTime(schedule.start_time)} 〜 {formatTime(schedule.end_time)}
        </p>
        <p className="text-sm text-gray-600">📍 {schedule.location}</p>
        {schedule.note && (
          <p className="text-sm text-gray-500 mt-2 bg-gray-50 rounded px-3 py-2">{schedule.note}</p>
        )}

        {/* 集計サマリー（クリックでフィルタ） */}
        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
          <Link
            href={filterHref('present')}
            className={`flex-1 text-center py-2 rounded-lg transition-colors ${
              activeFilter === 'present'
                ? 'bg-green-500 text-white'
                : 'bg-green-50 hover:bg-green-100'
            }`}
          >
            <p className={`text-2xl font-bold ${activeFilter === 'present' ? 'text-white' : 'text-green-600'}`}>
              {presentCount}
            </p>
            <p className={`text-xs ${activeFilter === 'present' ? 'text-green-100' : 'text-gray-500'}`}>出席</p>
          </Link>
          <Link
            href={filterHref('absent')}
            className={`flex-1 text-center py-2 rounded-lg transition-colors ${
              activeFilter === 'absent'
                ? 'bg-red-500 text-white'
                : 'bg-red-50 hover:bg-red-100'
            }`}
          >
            <p className={`text-2xl font-bold ${activeFilter === 'absent' ? 'text-white' : 'text-red-500'}`}>
              {absentCount}
            </p>
            <p className={`text-xs ${activeFilter === 'absent' ? 'text-red-100' : 'text-gray-500'}`}>欠席</p>
          </Link>
          <Link
            href={filterHref('pending')}
            className={`flex-1 text-center py-2 rounded-lg transition-colors ${
              activeFilter === 'pending'
                ? 'bg-gray-500 text-white'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <p className={`text-2xl font-bold ${activeFilter === 'pending' ? 'text-white' : 'text-gray-400'}`}>
              {pendingCount}
            </p>
            <p className={`text-xs ${activeFilter === 'pending' ? 'text-gray-200' : 'text-gray-500'}`}>未回答</p>
          </Link>
        </div>
      </div>

      {/* メンバー出欠一覧 */}
      <h2 className="text-sm font-medium text-gray-500 mb-2">
        {activeFilter
          ? `${STATUS_CONFIG[activeFilter].label}のメンバー（${displayedMembers.length} 名）`
          : `メンバー出欠状況（全 ${memberList.length} 名）`}
      </h2>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {displayedMembers.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {displayedMembers.map((member: Pick<Profile, 'id' | 'name' | 'jersey_no' | 'position' | 'gym_fee_paid'>) => {
              const status = statusMap[member.id] ?? 'pending'
              const cfg = STATUS_CONFIG[status]
              return (
                <li key={member.id} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{member.name}</p>
                      {member.jersey_no !== null && (
                        <p className="text-xs text-gray-400">#{member.jersey_no}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      member.gym_fee_paid
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {member.gym_fee_paid ? '✅ 振込済' : '⬜ 未振込'}
                    </span>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
                      {cfg.label}
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="text-center text-gray-500 py-8 text-sm">
            {activeFilter ? `${STATUS_CONFIG[activeFilter].label}のメンバーはいません` : 'メンバーがいません'}
          </p>
        )}
      </div>
    </div>
  )
}
