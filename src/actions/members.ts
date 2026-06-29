'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// announcements.ts / schedules.ts と同じパターン
async function getAdminProfile() {
  const cookieStore = await cookies()
  const userName = cookieStore.get('proto_user_name')?.value
  if (!userName) return null

  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('name', userName)
    .single()

  return data?.role === 'admin' ? data : null
}

export async function createMember(formData: FormData) {
  const admin = await getAdminProfile()
  if (!admin) redirect('/members')

  const name      = (formData.get('name') as string)?.trim()
  const jerseyNo  = formData.get('jersey_no') as string
  const position  = (formData.get('position') as string) || null
  const role       = (formData.get('role') as string) || 'member'
  const bio        = (formData.get('bio') as string)?.trim() || null
  const department = (formData.get('department') as string)?.trim() || null

  if (!name) return

  const supabase = await createClient()

  if (jerseyNo) {
    const { data: taken } = await supabase
      .from('profiles').select('id').eq('jersey_no', parseInt(jerseyNo)).single()
    if (taken) redirect('/members/new?error=jersey_taken')
  }

  await supabase.from('profiles').insert({
    name,
    jersey_no: jerseyNo ? parseInt(jerseyNo) : null,
    position:  position || null,
    bio,
    department,
    role,
  })

  redirect('/members')
}

export async function updateMember(id: string, formData: FormData) {
  const admin = await getAdminProfile()
  if (!admin) redirect('/members')

  const name     = (formData.get('name') as string)?.trim()
  const jerseyNo = formData.get('jersey_no') as string
  const position = (formData.get('position') as string) || null
  const role       = (formData.get('role') as string) || 'member'
  const bio        = (formData.get('bio') as string)?.trim() || null
  const department = (formData.get('department') as string)?.trim() || null

  if (!name) return

  const supabase = await createClient()

  if (jerseyNo) {
    const { data: taken } = await supabase
      .from('profiles').select('id').eq('jersey_no', parseInt(jerseyNo)).neq('id', id).single()
    if (taken) redirect(`/members/${id}/edit?error=jersey_taken`)
  }

  await supabase
    .from('profiles')
    .update({
      name,
      jersey_no: jerseyNo ? parseInt(jerseyNo) : null,
      position:  position || null,
      bio,
      department,
      role,
    })
    .eq('id', id)

  redirect(`/members/${id}`)
}

export async function updateSelfProfile(id: string, formData: FormData) {
  const cookieStore = await cookies()
  const userName = cookieStore.get('proto_user_name')?.value
  if (!userName) redirect('/login')

  const supabase = await createClient()
  const { data: myProfile } = await supabase
    .from('profiles').select('id').eq('name', userName).single()

  if (!myProfile || myProfile.id !== id) redirect('/members')

  const jerseyNo   = formData.get('jersey_no') as string
  const position   = (formData.get('position') as string) || null
  const bio        = (formData.get('bio') as string)?.trim() || null
  const department = (formData.get('department') as string)?.trim() || null

  if (jerseyNo) {
    const { data: taken } = await supabase
      .from('profiles').select('id').eq('jersey_no', parseInt(jerseyNo)).neq('id', id).single()
    if (taken) redirect(`/members/${id}/edit?error=jersey_taken`)
  }

  await supabase
    .from('profiles')
    .update({
      jersey_no: jerseyNo ? parseInt(jerseyNo) : null,
      position:  position || null,
      bio,
      department,
    })
    .eq('id', id)

  redirect(`/members/${id}`)
}

export async function deleteMember(id: string) {
  const admin = await getAdminProfile()
  if (!admin) return

  const supabase = await createClient()

  // attendances に user_id の外部キー制約があるため、先に削除する
  // (CASCADEが設定されていないため、順番を守らないとエラーになる)
  await supabase.from('attendances').delete().eq('user_id', id)
  await supabase.from('profiles').delete().eq('id', id)

  redirect('/members')
}
