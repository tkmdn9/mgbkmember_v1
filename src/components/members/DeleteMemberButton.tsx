'use client'

import { deleteMember } from '@/actions/members'

type Props = {
  memberId: string
  memberName: string
}

// 削除確認ダイアログが必要なため Client Component として分離
// Server Component 内では onClick などのイベントハンドラが使えない
export function DeleteMemberButton({ memberId, memberName }: Props) {
  async function handleDelete() {
    if (!confirm(`「${memberName}」を削除してもよいですか？\n関連する出席記録も削除されます。`)) return
    await deleteMember(memberId)
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-gray-400 hover:text-red-500 transition-colors px-2 py-1"
    >
      削除
    </button>
  )
}
