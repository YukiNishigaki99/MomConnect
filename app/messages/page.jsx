'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'
import Link from 'next/link'

export default function MessagesInboxPage() {
    const [conversations, setConversations] = useState([])
    const [loading, setLoading] = useState(true)

    // 会話ルーム一覧を読み込む関数
    const fetchConversations = async () => {
        try {
            const { data, error } = await supabase
                .from('conversations')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching conversations:', error.message)
                return
            }

            setConversations(data || [])
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchConversations()
    }, [])

    return (
        <main className="max-w-2xl mx-auto p-6 font-sans my-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Messages Inbox</h2>
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
                                <div>
                                    <h4 className="text-base font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition">
                                        Chat Room #{conv.id}
                                    </h4>
                                    <p className="text-xs text-gray-500 m-0">
                                        Between: {conv.user1_id || 'User 1'} & {conv.user2_id || 'User 2'}
                                    </p>
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