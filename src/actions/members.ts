'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export type ActionState = { error: string | null }

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

export async function createMember(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await getAdminProfile()
  if (!admin) redirect('/members')

  const name       = (formData.get('name') as string)?.trim()
  const jerseyNo   = formData.get('jersey_no') as string
  const position   = (formData.get('position') as string) || null
  const role       = (formData.get('role') as string) || 'member'
  const bio        = (formData.get('bio') as string)?.trim() || null
  const department = (formData.get('department') as string)?.trim() || null

  if (!name) return { error: null }

  const supabase = await createClient()

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

export async function updateMember(id: string, prevState: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await getAdminProfile()
  if (!admin) redirect('/members')

  const name       = (formData.get('name') as string)?.trim()
  const jerseyNo   = formData.get('jersey_no') as string
  const position   = (formData.get('position') as string) || null
  const role       = (formData.get('role') as string) || 'member'
  const bio        = (formData.get('bio') as string)?.trim() || null
  const department = (formData.get('department') as string)?.trim() || null

  if (!name) return { error: null }

  const supabase = await createClient()

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

export async function updateSelfProfile(id: string, prevState: ActionState, formData: FormData): Promise<ActionState> {
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

  await supabase.from('attendances').delete().eq('user_id', id)
  await supabase.from('profiles').delete().eq('id', id)

  redirect('/members')
}

export async function toggleGymFeePaid(memberId: string, paid: boolean) {
  const admin = await getAdminProfile()
  if (!admin) return

  const supabase = await createClient()
  await supabase
    .from('profiles')
    .update({ gym_fee_paid: paid })
    .eq('id', memberId)

  revalidatePath('/members')
}
