'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../utils/supabase'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function ChatRoomPage() {
    const params = useParams()
    const conversationId = params.id

    const { data: session, status } = useSession()

    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)

    // 自分の情報と相手の名前を保持するステート
    const [currentUser, setCurrentUser] = useState({ id: null, username: '' })
    const [partnerName, setPartnerName] = useState('')

    // ユーザー情報、相手の情報、メッセージ一覧を取得する関数
    const fetchUserDataAndMessages = async () => {
        try {
            const userEmail = session?.user?.email

            if (!userEmail) {
                setLoading(false)
                return
            }

            // 1. 自分の情報を取得
            const { data: profile, error: profileError } = await supabase
                .from('users')
                .select('id, username')
                .eq('email', userEmail)
                .single()

            if (profileError || !profile) {
                console.error('Error fetching user profile:', profileError?.message)
                setLoading(false)
                return
            }

            setCurrentUser({
                id: profile.id,
                username: profile.username
            })

            const currentUserId = profile.id

            // 2. この会話の情報（参加者）を取得
            const { data: convData, error: convError } = await supabase
                .from('conversations')
                .select('*')
                .eq('id', conversationId)
                .single()

            if (convError) {
                console.error('Error fetching conversation details:', convError.message)
            } else if (convData) {
                // 自分以外の相手のIDを特定
                const partnerId = convData.user1_id === currentUserId ? convData.user2_id : convData.user1_id

                // 相手のユーザー情報を取得
                const { data: partnerProfile } = await supabase
                    .from('users')
                    .select('name, username')
                    .eq('id', partnerId)
                    .single()

                if (partnerProfile) {
                    setPartnerName(partnerProfile.name || partnerProfile.username || 'Member')
                }
            }

            // 3. メッセージ一覧を取得
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', conversationId)
                .order('created_at', { ascending: true })

            if (error) {
                console.error('Error fetching messages:', error.message)
                return
            }

            setMessages(data || [])
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (conversationId && status === 'authenticated') {
            fetchUserDataAndMessages()
        } else if (status === 'unauthenticated') {
            setLoading(false)
        }
    }, [conversationId, session, status])

    // メッセージ送信処理
    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        if (!currentUser.id) {
            alert('User profile not loaded yet. Please wait...')
            return
        }

        try {
            const { error } = await supabase
                .from('messages')
                .insert([
                    {
                        conversation_id: conversationId,
                        sender_id: currentUser.id,
                        content: newMessage.trim()
                    }
                ])

            if (error) {
                console.error('Error sending message:', error.message)
                alert(`Failed to send message: ${error.message}`)
                return
            }

            setNewMessage('')
            fetchUserDataAndMessages()
        } catch (error) {
            console.error('Error:', error)
        }
    }

    return (
        <main className="max-w-2xl mx-auto p-6 font-sans flex flex-col h-[85vh] my-4">
            {/* ヘッダー部分 */}
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <Link
                        href="/messages"
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 transition no-underline inline-block"
                    >
                        &larr; Back to Inbox
                    </Link>

                    <Link
                        href="/board"
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 transition no-underline inline-block"
                    >
                        Go to Board &rarr;
                    </Link>
                </div>

                {/* 👇 タイトル部分に相手の名前を表示（読み込み中はChat Room、相手が判明したら名前を表示） */}
                <h2 className="text-2xl font-bold text-gray-800 m-0 flex items-center gap-2">
                    {partnerName ? partnerName : 'Chat Room'}
                </h2>
            </div>

            {/* メッセージ表示エリア */}
            <div className="flex-1 border border-gray-200 rounded-xl p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3 mb-4 shadow-inner">
                {loading ? (
                    <p className="text-center text-gray-500 my-auto">Loading messages...</p>
                ) : messages.length === 0 ? (
                    <p className="text-center text-gray-500 my-auto">No messages in this room yet. Say hello! 👋</p>
                ) : (
                    messages.map((msg) => {
                        const isMe =
                            (currentUser.id && String(msg.sender_id) === String(currentUser.id)) ||
                            (currentUser.username && String(msg.sender_id) === String(currentUser.username))

                        return (
                            <div
                                key={msg.id}
                                className={`max-w-[75%] p-3 rounded-xl shadow-sm border ${isMe
                                    ? 'bg-blue-600 text-white self-end border-blue-600 rounded-br-none'
                                    : 'bg-white text-gray-800 self-start border-gray-200 rounded-bl-none'
                                    }`}
                            >
                                <span className={`text-[10px] block mb-1 font-medium ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                                    {isMe ? 'You' : partnerName || 'Member'} • {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <p className="m-0 text-sm leading-relaxed break-words">{msg.content}</p>
                            </div>
                        )
                    })
                )}
            </div>

            {/* メッセージ入力フォーム */}
            <form onSubmit={handleSendMessage} className="flex gap-2 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={currentUser.id ? "Type a message..." : "Loading profile..."}
                    className="flex-1 p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
                <button
                    type="submit"
                    disabled={!currentUser.id}
                    className={`py-2.5 px-5 font-semibold rounded-lg text-sm transition shadow-sm ${currentUser.id
                        ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    Send
                </button>
            </form>
        </main>
    )
}