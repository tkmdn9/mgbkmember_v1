'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export type RegisterState = { error: string | null }

export async function registerAction(prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  const name = (formData.get('name') as string)?.trim()
  if (!name) return { error: null }

  const supabase = await createClient()

  const { data: existing } = await supabase
    .from('profiles').select('id').eq('name', name).single()
  if (existing) return { error: 'duplicate' }

  const jerseyNo   = formData.get('jersey_no') as string
  const position   = (formData.get('position') as string) || null
  const bio        = (formData.get('bio') as string)?.trim() || null
  const department = (formData.get('department') as string)?.trim() || null

  await supabase.from('profiles').insert({
    name,
    jersey_no: jerseyNo ? parseInt(jerseyNo) : null,
    position: position || null,
    bio,
    department,
    role: 'member',
  })

  redirect('/login?success=registered')
}
