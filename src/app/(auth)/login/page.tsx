import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

async function loginAction(formData: FormData) {
  'use server'
  const name = formData.get('name') as string
  if (!name?.trim()) return

  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('name', name.trim())
    .single()

  if (!data) {
    redirect('/login?error=not_found')
  }

  const cookieStore = await cookies()
  cookieStore.set('proto_user_name', name.trim(), {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  redirect('/dashboard')
}

type Props = {
  searchParams: Promise<{ error?: string; success?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const { error, success } = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {/* 右上リンク */}
      <div className="absolute top-4 right-4 flex gap-3 text-sm">
        <Link href="/public-members" className="text-gray-500 hover:text-orange-500 transition-colors">
          メンバー確認
        </Link>
        <Link href="/register" className="text-orange-500 font-medium hover:text-orange-600 transition-colors">
          新規登録
        </Link>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">🏀 MUITバスケ同好会</h1>
          <p className="text-gray-500 text-sm mt-1">メンバー管理システム</p>
        </div>

        {success === 'registered' && (
          <div className="mb-4 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
            メンバー登録が完了しました。登録した名前でログインしてください。
          </div>
        )}

        <form action={loginAction} className="flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              あなたの名前
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="例: 山田太郎"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {error === 'not_found' && (
              <p className="mt-1 text-xs text-red-500">
                名簿に登録されていない名前です。まず右上の<Link href="/public-members" className="underline">メンバー確認</Link>で自分の名前を探してログインに利用してください。一覧になければ<Link href="/register" className="underline">新規登録</Link>してください。スペースなしで登録してください。
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white rounded-lg px-4 py-2 font-medium hover:bg-orange-600 transition-colors"
          >
            ログイン
          </button>
        </form>

      </div>
    </div>
  )
}
