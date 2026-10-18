// app/board/actions.js
'use server'

import { auth, signOut } from '../../auth'
import { redirect } from 'next/navigation'

export async function handleLogout() {
    // ログアウト処理（NextAuth等の場合）
    await signOut({ redirectTo: '/' })
}