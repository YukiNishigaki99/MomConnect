'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../utils/supabase'
import Link from 'next/link'

export default function ChatRoomPage() {
    const params = useParams()
    const conversationId = params.id

    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)

    // メッセージ一覧を取得する関数
    const fetchMessages = async () => {
        try {
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
        if (conversationId) {
            fetchMessages()
        }
    }, [conversationId])

    // メッセージを送信する関数
    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        try {
            const { error } = await supabase
                .from('messages')
                .insert([
                    {
                        conversation_id: conversationId,
                        sender_id: 'User',
                        content: newMessage
                    }
                ])

            if (error) {
                console.error('Error sending message:', error.message)
                alert('Failed to send message.')
                return
            }

            setNewMessage('')
            fetchMessages()
        } catch (error) {
            console.error('Error:', error)
        }
    }

    return (
        <main className="max-w-2xl mx-auto p-6 font-sans flex flex-col h-[85vh] my-4">
            {/* ヘッダー部分 */}
            <div className="mb-4">
                <Link
                    href="/messages"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition no-underline inline-block mb-2"
                >
                    &larr; Back to Inbox
                </Link>
                <h2 className="text-2xl font-bold text-gray-800 m-0">Chat Room #{conversationId}</h2>
            </div>

            {/* メッセージ表示エリア */}
            <div className="flex-1 border border-gray-200 rounded-xl p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3 mb-4 shadow-inner">
                {loading ? (
                    <p className="text-center text-gray-500 my-auto">Loading messages...</p>
                ) : messages.length === 0 ? (
                    <p className="text-center text-gray-500 my-auto">No messages in this room yet. Say hello! 👋</p>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender_id === 'User'
                        return (
                            <div
                                key={msg.id}
                                className={`max-w-[75%] p-3 rounded-xl shadow-sm border ${isMe
                                        ? 'bg-blue-600 text-white self-end border-blue-600 rounded-br-none'
                                        : 'bg-white text-gray-800 self-start border-gray-200 rounded-bl-none'
                                    }`}
                            >
                                <span className={`text-[10px] block mb-1 font-medium ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                                    {msg.sender_id} • {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                    placeholder="Type a message..."
                    className="flex-1 p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
                <button
                    type="submit"
                    className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg cursor-pointer transition shadow-sm text-sm"
                >
                    Send
                </button>
            </form>
        </main>
    )
}