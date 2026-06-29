import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { NewMemberForm } from '@/components/forms/NewMemberForm'
import Link from 'next/link'

export default async function NewMemberPage() {
  const cookieStore = await cookies()
  const userName = cookieStore.get('proto_user_name')?.value ?? ''
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('name', userName).single()
  if (profile?.role !== 'admin') redirect('/members')

  return (
    <div className="max-w-lg">
      <Link href="/members" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">
        ← メンバー一覧に戻る
      </Link>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">👤 メンバーを追加</h1>
        <NewMemberForm />
      </div>
    </div>
  )
}
