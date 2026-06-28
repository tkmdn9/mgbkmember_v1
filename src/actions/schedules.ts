'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

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

export async function createSchedule(formData: FormData) {
  const admin = await getAdminProfile()
  if (!admin) redirect('/schedules')

  const date      = formData.get('date') as string
  const startTime = formData.get('start_time') as string
  const endTime   = formData.get('end_time') as string
  const location  = formData.get('location') as string
  const note      = formData.get('note') as string

  if (!date || !startTime || !endTime || !location) return

  const supabase = await createClient()
  await supabase.from('schedules').insert({
    date,
    start_time: startTime,
    end_time:   endTime,
    location:   location.trim(),
    note:       note?.trim() || null,
    created_by: admin.id,
  })

  redirect('/schedules')
}

export async function deleteSchedule(id: string) {
  const admin = await getAdminProfile()
  if (!admin) return

  const supabase = await createClient()
  await supabase.from('schedules').delete().eq('id', id)
  redirect('/schedules')
}
