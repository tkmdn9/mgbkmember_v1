import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

type Props = { params: Promise<{ id: string }> }

export default async function AnnouncementDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: item, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !item) notFound()

  return (
    <div className="max-w-2xl">
      <Link href="/announcements" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">
        ← お知らせ一覧に戻る
      </Link>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-xs text-gray-400 mb-2">
          {new Date(item.created_at).toLocaleDateString('ja-JP')}
        </p>
        <h1 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h1>
        {/* whitespace-pre-wrap で改行をそのまま表示 */}
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{item.body}</p>
      </div>
    </div>
  )
}
