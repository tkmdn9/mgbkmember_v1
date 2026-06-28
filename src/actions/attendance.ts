'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getCurrentProfile() {
  const cookieStore = await cookies()
  const userName = cookieStore.get('proto_user_name')?.value
  if (!userName) return null
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('name', userName)
    .single()
  return data
}

export async function registerAttendance(scheduleId: string, status: 'present' | 'absent') {
  const profile = await getCurrentProfile()
  if (!profile) return

  const supabase = await createClient()

  // upsert: schedule_id + user_id の組み合わせが同じなら UPDATE、なければ INSERT
  await supabase.from('attendances').upsert(
    { schedule_id: scheduleId, user_id: profile.id, status },
    { onConflict: 'schedule_id,user_id' }
  )

  // redirect ではなく revalidatePath: ページを再読み込みせず、サーバーデータだけ更新する
  revalidatePath('/attendance')
}
