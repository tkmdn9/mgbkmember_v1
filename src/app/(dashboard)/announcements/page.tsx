import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { Announcement } from '@/types/database'
import Link from 'next/link'
import { deleteAnnouncement } from '@/actions/announcements'

export default async function AnnouncementsPage() {
  const supabase = await createClient()

  // お知らせを新しい順で取得
  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })

  // adminかどうか判定 (プロトタイプ: DB上のroleで確認)
  const cookieStore = await cookies()
  const userName = cookieStore.get('proto_user_name')?.value ?? ''
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('name', userName)
    .single()
  const isAdmin = profile?.role === 'admin'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📢 お知らせ</h1>
          <p className="text-gray-500 mt-1">{announcements?.length ?? 0} 件</p>
        </div>
        {/* adminだけ「投稿する」ボタンを表示 */}
        {isAdmin && (
          <Link
            href="/announcements/new"
            className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            + 投稿する
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {announcements && announcements.length > 0 ? (
          announcements.map((item: Announcement) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <Link href={`/announcements/${item.id}`}>
                    <h2 className="font-semibold text-gray-900 hover:text-orange-600 transition-colors">
                      {item.title}
                    </h2>
                  </Link>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{item.body}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(item.created_at).toLocaleDateString('ja-JP')}
                  </p>
                </div>
                {/* adminだけ削除ボタンを表示 */}
                {isAdmin && (
                  <form action={deleteAnnouncement.bind(null, item.id)}>
                    <button
                      type="submit"
                      className="text-xs text-gray-400 hover:text-red-500 transition-colors shrink-0"
                    >
                      削除
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-12">お知らせはありません</p>
        )}
      </div>
    </div>
  )
}
