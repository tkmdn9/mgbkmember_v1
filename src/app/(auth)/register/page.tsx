import Link from 'next/link'
import { RegisterForm } from '@/components/forms/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">🏀 MUITバスケ同好会</h1>
          <p className="text-gray-500 text-sm mt-1">新規メンバー登録</p>
        </div>

        <RegisterForm />

        <p className="text-center mt-4">
          <Link href="/login" className="text-sm text-gray-500 hover:text-gray-700">
            ← ログインへ戻る
          </Link>
        </p>
      </div>
    </div>
  )
}
