import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// Server Action: フォームの送信を受け取り、Cookieに名前を保存する
async function loginAction(formData: FormData) {
  'use server'
  const name = formData.get('name') as string
  if (!name?.trim()) return

  const cookieStore = await cookies()
  cookieStore.set('proto_user_name', name.trim(), {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7日間
  })

  redirect('/dashboard')
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">🏀 バスケ同好会</h1>
          <p className="text-gray-500 text-sm mt-1">メンバー管理システム</p>
        </div>

        {/* action に Server Action を渡す。送信するとサーバーで loginAction が実行される */}
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
              placeholder="例: 山田 太郎"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white rounded-lg px-4 py-2 font-medium hover:bg-orange-600 transition-colors"
          >
            ログイン
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-4">
          ※ プロトタイプ版: 名前入力のみでログインできます
        </p>
      </div>
    </div>
  )
}
