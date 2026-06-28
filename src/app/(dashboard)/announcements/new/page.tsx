import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { createAnnouncement } from '@/actions/announcements'
import Link from 'next/link'

export default async function NewAnnouncementPage() {
  // adminでなければ一覧ページへリダイレクト
  const cookieStore = await cookies()
  const userName = cookieStore.get('proto_user_name')?.value ?? ''
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('name', userName).single()

  if (profile?.role !== 'admin') redirect('/announcements')

  return (
    <div className="max-w-2xl">
      <Link href="/announcements" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">
        ← お知らせ一覧に戻る
      </Link>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">📢 お知らせを投稿</h1>

        {/* Server Action を form の action に直接渡す */}
        <form action={createAnnouncement} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
            <input
              name="title"
              type="text"
              required
              placeholder="例: 7月の練習日程について"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">本文</label>
            <textarea
              name="body"
              required
              rows={6}
              placeholder="お知らせの内容を入力してください"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Link
              href="/announcements"
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              キャンセル
            </Link>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              投稿する
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
