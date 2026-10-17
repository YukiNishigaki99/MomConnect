'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../utils/supabase' // 👈 パスはファイルの階層に合わせて調整してね！
import Link from 'next/link'

export default function UserProfilePage() {
    const params = useParams()
    // URLから username を取得する（例: /profile/saku_mama なら "saku_mama" が入るよ）
    const username = params.username ? decodeURIComponent(params.username) : ''

    const [profile, setProfile] = useState(null)
    const [userPosts, setUserPosts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchUserData() {
            if (!username) return

            try {
                // 1. その人のプロフィール情報を取得する
                const { data: profileData, error: profileError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('username', username)
                    .single()

                if (profileError) {
                    console.error('Error fetching profile:', profileError.message)
                } else {
                    setProfile(profileData)
                }

                // 2. その人が投稿したスレッド（ポスト）一覧を取得する
                // ※ posts テーブル側に username カラムがある想定だよ！
                const { data: postsData, error: postsError } = await supabase
                    .from('posts')
                    .select('*')
                    .eq('username', username)
                    .order('created_at', { ascending: false })

                if (postsError) {
                    console.error('Error fetching user posts:', postsError.message)
                } else {
                    setUserPosts(postsData || [])
                }

            } catch (err) {
                console.error('Unexpected error:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchUserData()
    }, [username])

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh] text-gray-500 font-sans">
                Loading profile...
            </div>
        )
    }

    return (
        <main className="max-w-xl mx-auto p-6 font-sans my-8">
            {/* 戻るリンク */}
            <div className="mb-6">
                <Link
                    href="/board"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition no-underline inline-block"
                >
                    &larr; Back to Board
                </Link>
            </div>

            {/* --- 上部：Threads風のプロフィールヘッダー --- */}
            <section className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm mb-8 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    {/* アイコン（名前の頭文字を大きく表示） */}
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold shadow-inner">
                        {profile?.name ? profile.name.charAt(0).toUpperCase() : username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 m-0">
                            {profile?.name || username}
                        </h1>
                        <p className="text-sm text-gray-500 m-0">@{username}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-1.5 text-sm text-gray-600 pt-2 border-t border-gray-100">
                    <p className="m-0">📍 {profile?.location || "Location not specified"}</p>
                    {profile?.child_age && (
                        <p className="m-0">👶 Child Age: {profile.child_age}</p>
                    )}
                    <div>
                        <span className={`inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full border ${profile?.role === 'senior'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}>
                            {profile?.role === 'senior' ? 'Senior Mother (Offering Support)' : 'Requester Mother (Seeking Support)'}
                        </span>
                    </div>
                </div>
            </section>

            {/* --- 下部：その人が投稿したスレッド一覧 --- */}
            <section>
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                    Threads by {profile?.name || `@${username}`}
                </h2>

                {userPosts.length === 0 ? (
                    <p className="text-center text-gray-500 bg-gray-50 p-8 rounded-xl border border-gray-100">
                        No threads posted yet.
                    </p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {userPosts.map((post) => (
                            <div
                                key={post.id}
                                className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md transition flex flex-col gap-2"
                            >
                                <div className="flex justify-between items-center">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${post.category === 'request'
                                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        }`}>
                                        {post.category === 'request' ? 'Seeking Support' : 'Offering Support'}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </span>
                                </div>

                                <h3 className="text-base font-bold text-gray-800 m-0">{post.title}</h3>
                                <p className="text-sm text-gray-600 m-0 leading-relaxed">{post.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    )
}