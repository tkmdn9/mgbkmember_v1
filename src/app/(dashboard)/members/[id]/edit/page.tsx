import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { updateMember, updateSelfProfile } from '@/actions/members'
import { EditMemberForm } from '@/components/forms/EditMemberForm'
import Link from 'next/link'

type Props = { params: Promise<{ id: string }> }

export default async function EditMemberPage({ params }: Props) {
  const { id } = await params

  const cookieStore = await cookies()
  const userName = cookieStore.get('proto_user_name')?.value ?? ''
  const supabase = await createClient()
  const { data: myProfile } = await supabase
    .from('profiles').select('id, role').eq('name', userName).single()

  const isAdmin = myProfile?.role === 'admin'
  const isSelf  = myProfile?.id === id

  if (!isAdmin && !isSelf) redirect('/members')

  const { data: member, error } = await supabase
    .from('profiles').select('*').eq('id', id).single()
  if (error || !member) notFound()

  const action = isAdmin
    ? updateMember.bind(null, id)
    : updateSelfProfile.bind(null, id)

  return (
    <div className="max-w-lg">
      <Link href={`/members/${id}`} className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">
        ← メンバー詳細に戻る
      </Link>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">✏️ メンバーを編集</h1>
        <EditMemberForm action={action} member={member} isAdmin={isAdmin} memberId={id} />
      </div>
    </div>
  )
}
