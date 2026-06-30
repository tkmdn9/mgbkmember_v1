import Link from 'next/link'

const FEATURES = [
  {
    icon: '🏠',
    title: 'ホーム',
    description: 'メンバー数・お知らせ件数・スケジュールなどをまとめて確認できるダッシュボードです。',
  },
  {
    icon: '👥',
    title: 'メンバー',
    description: '全メンバーの一覧を見られます。自分のプロフィール（背番号・ポジション・部署・一言）を編集できます。',
  },
  {
    icon: '📢',
    title: 'お知らせ',
    description: '管理者からの連絡事項を確認できます。重要なアナウンスはここをチェックしてください。',
  },
  {
    icon: '📅',
    title: 'スケジュール',
    description: '練習・イベントの日程を確認できます。管理者が公開設定したスケジュールのみ表示されます。',
  },
  {
    icon: '✅',
    title: '出席管理',
    description: '練習ごとの出欠（出席・欠席・未回答）を登録・変更できます。早めの回答にご協力ください。',
  },
]

const FAQS = [
  {
    q: 'ログインできません',
    a: '名前の入力はスペースなしで登録された名前と完全一致する必要があります。まず「メンバー確認」で自分の名前を確認してください。',
  },
  {
    q: '名前が一覧にありません',
    a: '「新規登録」から自分の名前を登録してください。登録後すぐにログインできます。',
  },
  {
    q: 'プロフィールを変更したい',
    a: 'ログイン後、メンバー一覧から自分の名前をタップして「プロフィールを編集」ボタンから変更できます。',
  },
  {
    q: '出欠はいつまでに登録すればいいですか？',
    a: '練習前日までを目安に登録をお願いします。管理者が参加人数を確認するために使用します。',
  },
  {
    q: 'スケジュールが表示されません',
    a: '管理者がスケジュールを「非公開」に設定している場合は表示されません。管理者に連絡してください。',
  },
]

const ADMIN_FEATURES = [
  {
    icon: '👥',
    title: 'メンバー管理',
    description: 'メンバーの追加・編集・削除ができます。背番号・ポジション・部署・体育館代金の振込状況も管理できます。',
  },
  {
    icon: '📢',
    title: 'お知らせ管理',
    description: 'お知らせの作成・削除ができます。全メンバーに周知したい情報を投稿してください。',
  },
  {
    icon: '📅',
    title: 'スケジュール管理',
    description: '練習日程の追加・削除・公開/非公開の切り替えができます。非公開にしたスケジュールはメンバーには表示されません。期間や公開状態で絞り込みフィルターも使えます。',
  },
  {
    icon: '✅',
    title: '出欠確認',
    description: '各スケジュールの出欠状況（出席・欠席・未回答）を一覧で確認できます。体育館代金の振込状況もここで管理できます。',
  },
]

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ヒーロー */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <p className="text-4xl mb-4">🏀</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MUITバスケ同好会</h1>
          <p className="text-lg text-gray-500 mb-8">メンバー管理システム 利用ガイド</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login"
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              ログインする
            </Link>
            <Link
              href="/public-members"
              className="bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              メンバー一覧を確認する
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-12">

        {/* はじめての方へ */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6">はじめての方へ</h2>
          <div className="flex flex-col gap-4">
            {[
              {
                step: '1',
                title: '自分の名前を確認する',
                body: '「メンバー一覧を確認する」から自分の名前が登録されているか確認してください。',
                sub: '名前がない場合は「新規登録」へ進んでください。',
                link: { href: '/public-members', label: 'メンバー一覧を確認する →' },
              },
              {
                step: '2',
                title: '新規登録する（未登録の場合）',
                body: '名前・背番号・ポジション・部署などを入力して登録します。',
                sub: '名前はスペースなしで入力してください（例: 山田太郎）。',
                link: { href: '/register', label: '新規登録はこちら →' },
              },
              {
                step: '3',
                title: 'ログインして使い始める',
                body: '登録した名前を入力してログインします。以降は各機能をご利用ください。',
                sub: null,
                link: { href: '/login', label: 'ログインはこちら →' },
              },
            ].map(({ step, title, body, sub, link }) => (
              <div key={step} className="bg-white rounded-xl border border-gray-200 p-5 flex gap-4">
                <div className="w-9 h-9 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center shrink-0 text-sm">
                  {step}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 mb-1">{title}</p>
                  <p className="text-sm text-gray-600">{body}</p>
                  {sub && <p className="text-xs text-orange-600 mt-1">{sub}</p>}
                  <Link href={link.href} className="text-xs text-orange-500 hover:text-orange-600 font-medium mt-2 inline-block">
                    {link.label}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 機能一覧 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6">機能一覧</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-2xl mb-2">{f.icon}</p>
                <p className="font-semibold text-gray-900 mb-1">{f.title}</p>
                <p className="text-sm text-gray-500">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 管理者向け機能 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">管理者向け機能</h2>
          <p className="text-sm text-gray-500 mb-6">role が admin のメンバーのみ利用できます。</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ADMIN_FEATURES.map((f) => (
              <div key={f.title} className="bg-orange-50 rounded-xl border border-orange-100 p-5">
                <p className="text-2xl mb-2">{f.icon}</p>
                <p className="font-semibold text-gray-900 mb-1">{f.title}</p>
                <p className="text-sm text-gray-500">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6">よくある質問</h2>
          <div className="flex flex-col gap-3">
            {FAQS.map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="font-semibold text-gray-900 mb-1">Q. {faq.q}</p>
                <p className="text-sm text-gray-600">A. {faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* フッター */}
        <div className="text-center pb-4">
          <Link
            href="/login"
            className="bg-orange-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors inline-block"
          >
            ログインする
          </Link>
          <p className="text-xs text-gray-400 mt-4">MUITバスケ同好会 メンバー管理システム</p>
        </div>

      </div>
    </div>
  )
}
