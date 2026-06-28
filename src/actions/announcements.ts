'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// adminかどうかをDB上のroleで判定する
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

export async function createAnnouncement(formData: FormData) {
  const admin = await getAdminProfile()
  if (!admin) redirect('/announcements') // admin以外は弾く

  const title = formData.get('title') as string
  const body = formData.get('body') as string
  if (!title?.trim() || !body?.trim()) return

  const supabase = await createClient()
  await supabase.from('announcements').insert({
    title: title.trim(),
    body: body.trim(),
    author_id: admin.id,
  })

  redirect('/announcements')
}

export async function deleteAnnouncement(id: string) {
  const admin = await getAdminProfile()
  if (!admin) return

  const supabase = await createClient()
  await supabase.from('announcements').delete().eq('id', id)
  redirect('/announcements')
}
