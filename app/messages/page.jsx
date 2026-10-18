'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function MessagesInboxPage() {
    const { data: session, status } = useSession()
    const [conversations, setConversations] = useState([])
    const [loading, setLoading] = useState(true)

    // 会話ルーム一覧と相手の名前を読み込む関数
    const fetchConversations = async () => {
        try {
            const userEmail = session?.user?.email

            if (!userEmail) {
                setLoading(false)
                return
            }

            // 1. 自分のユーザーIDを取得
            const { data: profile, error: profileError } = await supabase
                .from('users')
                .select('id')
                .eq('email', userEmail)
                .single()

            if (profileError || !profile) {
                console.error('Profile not found:', profileError?.message)
                setLoading(false)
                return
            }

            const currentUserId = profile.id

            // 2. 自分が参加している会話を取得
            const { data: convsData, error: convsError } = await supabase
                .from('conversations')
                .select('*')
                .or(`user1_id.eq.${currentUserId},user2_id.eq.${currentUserId}`)
                .order('created_at', { ascending: false })

            if (convsError) {
                console.error('Error fetching conversations:', convsError.message)
                return
            }

            if (!convsData || convsData.length === 0) {
                setConversations([])
                setLoading(false)
                return
            }

            // 3. 各会話について「相手のID」を特定し、相手の名前情報をまとめて取得する
            // ※ users テーブルのカラム名が 'name' の場合。もし 'full_name' の場合は適宜書き換えてください
            const otherUserIds = convsData.map(conv =>
                conv.user1_id === currentUserId ? conv.user2_id : conv.user1_id
            )

            const { data: usersData, error: usersError } = await supabase
                .from('users')
                .select('id, name, username') // name（または full_name）を取得する
                .in('id', otherUserIds)

            if (usersError) {
                console.error('Error fetching other users:', usersError.message)
            }

            // IDをキーにした名前のマップを作る (名前がなければ fallback として username を使う)
            const userMap = {}
            usersData?.forEach(u => {
                userMap[u.id] = u.name || u.username // name があれば名前、なければ username
            })

            // 4. 会話データに相手の名前を付与する
            const conversationsWithPartner = convsData.map(conv => {
                const partnerId = conv.user1_id === currentUserId ? conv.user2_id : conv.user1_id
                return {
                    ...conv,
                    partnerName: userMap[partnerId] || 'Unknown User'
                }
            })

            setConversations(conversationsWithPartner)
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (status === 'authenticated') {
            fetchConversations()
        } else if (status === 'unauthenticated') {
            setLoading(false)
        }
    }, [status, session])

    return (
        <main className="max-w-2xl mx-auto p-6 font-sans my-8">
            {/* ボードに戻るリンク */}
            <div className="mb-4">
                <Link
                    href="/board"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition no-underline inline-block"
                >
                    &larr; Back to Board
                </Link>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-1">INBOX</h2>
            <p className="text-gray-600 text-sm mb-6">
                Your private conversations with other moms.
            </p>

            {loading ? (
                <p className="text-center text-gray-500 py-8">Loading conversations...</p>
            ) : conversations.length === 0 ? (
                <div className="bg-gray-50 p-8 rounded-xl text-center border border-gray-200 shadow-sm">
                    <p className="text-gray-500 m-0">No messages yet.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {conversations.map((conv) => (
                        <Link
                            key={conv.id}
                            href={`/messages/${conv.id}`}
                            className="no-underline text-inherit group"
                        >
                            <div className="border border-gray-200 p-4 rounded-xl bg-white shadow-sm hover:shadow-md hover:border-blue-300 transition flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    {/* 相手のイニシャルアイコン */}
                                    <span className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
                                        {conv.partnerName.charAt(0).toUpperCase()}
                                    </span>
                                    <div>
                                        {/* 👇 相手の名前を表示 */}
                                        <h4 className="text-base font-bold text-gray-800 mb-0.5 group-hover:text-blue-600 transition">
                                            {conv.partnerName}
                                        </h4>
                                        <p className="text-xs text-gray-500 m-0">
                                            Click to open conversation
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                                    Open Chat &rarr;
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    )
}