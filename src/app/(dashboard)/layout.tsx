import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/nav/Sidebar'

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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userName={userName} profileId={profile?.id ?? null} />

      {/* メインコンテンツ: {children} に各ページの page.tsx が入る */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
