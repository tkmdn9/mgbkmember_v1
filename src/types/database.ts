// Supabaseのテーブル構造をTypeScriptの型として定義
// コード補完・型チェックに使う

export type Profile = {
  id: string
  name: string
  jersey_no: number | null
  position: string | null  // PG / SG / SF / PF / C
  role: 'admin' | 'member'
  bio: string | null
  department: string | null
  avatar_url: string | null
  gym_fee_paid: boolean
  created_at: string
}

export type Announcement = {
  id: string
  title: string
  body: string
  author_id: string | null
  created_at: string
}

export type Schedule = {
  id: string
  date: string
  start_time: string
  end_time: string
  location: string
  note: string | null
  is_hidden: boolean
  created_by: string | null
  created_at: string
}

export type Attendance = {
  id: string
  schedule_id: string
  user_id: string
  status: 'present' | 'absent' | 'pending'
}
