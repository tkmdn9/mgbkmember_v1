import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { MemberListWithSearch } from '@/components/members/MemberListWithSearch'
import Link from 'next/link'

export default async function MembersPage() {
  const supabase = await createClient()

  const { data: members, error } = await supabase
    .from('profiles')
    .select('*')
    .order('name')

  if (error) {
    return <p className="text-red-500">データの取得に失敗しました: {error.message}</p>
  }

  const cookieStore = await cookies()
  const userName = cookieStore.get('proto_user_name')?.value ?? ''
  const { data: myProfile } = await supabase
    .from('profiles').select('role').eq('name', userName).single()
  const isAdmin = myProfile?.role === 'admin'

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-6 flex-wrap">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">👥 メンバー一覧</h1>
          <p className="text-gray-500 mt-1">全 {members?.length ?? 0} 名</p>
        </div>
        {isAdmin && (
          <Link
            href="/members/new"
            className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            + メンバー追加
          </Link>
        )}
      </div>

      <MemberListWithSearch members={members ?? []} isAdmin={isAdmin} />
    </div>
  )
}
