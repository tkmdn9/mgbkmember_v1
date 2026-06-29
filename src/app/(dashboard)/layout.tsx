import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/nav/Sidebar'
import { BottomNav } from '@/components/nav/BottomNav'
import { MobileHeader } from '@/components/nav/MobileHeader'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const userName = cookieStore.get('proto_user_name')?.value

  if (!userName) redirect('/login')

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles').select('id').eq('name', userName).single()

  const profileId = profile?.id ?? null

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userName={userName} profileId={profileId} />

      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader userName={userName} profileId={profileId} />
        <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8 overflow-auto">
          {children}
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
