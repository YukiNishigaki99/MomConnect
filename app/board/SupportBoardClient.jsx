'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../utils/supabase'
import { signOut } from 'next-auth/react'

export default function SupportBoardPage({ username, email }) {
    const router = useRouter()
    const [posts, setPosts] = useState([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('request')
    const [loading, setLoading] = useState(true)

    // 👇 1. 自分のusersテーブルのidを保持するステートを追加
    const [currentUserId, setCurrentUserId] = useState(null)

    const [commentTexts, setCommentTexts] = useState({})
    const [commentsMap, setCommentsMap] = useState({})

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const menuRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // データの取得と同時に、自分のユーザーID（id）も取得する
    const fetchInitialData = async () => {
        try {
            // 自分のemailを使ってusersテーブルからidを取得
            const { data: userProfile, error: profileError } = await supabase
                .from('users')
                .select('id')
                .eq('email', email)
                .single()

            if (profileError) {
                console.error('Error fetching user profile ID:', profileError.message)
            } else if (userProfile) {
                setCurrentUserId(userProfile.id)
            }

            // 投稿一覧の取得
            const { data: postsData, error: postsError } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false })

            if (postsError) {
                console.error('Error fetching posts:', postsError.message)
                return
            }
            setPosts(postsData || [])

            // コメント一覧の取得
            const { data: commentsData, error: commentsError } = await supabase
                .from('comments')
                .select('*')
                .order('created_at', { ascending: true })

            if (commentsError) {
                console.error('Error fetching comments:', commentsError.message)
                return
            }

            const map = {}
            commentsData?.forEach((comment) => {
                if (!map[comment.post_id]) {
                    map[comment.post_id] = []
                }
                map[comment.post_id].push(comment)
            })
            setCommentsMap(map)
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchInitialData()
    }, [])

    const handleCreatePost = async (e) => {
        e.preventDefault()
        if (!title || !description) {
            alert('Please fill in both title and description.')
            return
        }

        const { error } = await supabase
            .from('posts')
            .insert([{ username, title, description, category }])

        if (error) {
            console.error('Error creating post:', error)
            alert('Failed to create post.')
        } else {
            setTitle('')
            setDescription('')
            fetchInitialData()
        }
    }

    const handleAddComment = async (postId, e) => {
        e.preventDefault()
        const text = commentTexts[postId]
        if (!text || text.trim() === '') return

        const { error } = await supabase
            .from('comments')
            .insert([{ post_id: postId, content: text, username }])

        if (error) {
            console.error('Error adding comment:', error)
            alert('Failed to add comment.')
        } else {
            setCommentTexts({ ...commentTexts, [postId]: '' })
            fetchInitialData()
        }
    }

    // 👇 2. 相手のusernameからidを特定して会話を作成・取得する関数
    const handleStartChat = async (targetUsername) => {
        try {
            if (username === targetUsername) {
                alert("You cannot start a chat with yourself.");
                return;
            }

            if (!currentUserId) {
                alert("User session not loaded yet. Please try again.");
                return;
            }

            // 相手の username から usersテーブルの id を取得する
            const { data: targetProfile, error: targetError } = await supabase
                .from('users')
                .select('id')
                .eq('username', targetUsername)
                .single()

            if (targetError || !targetProfile) {
                console.error('Error finding target user:', targetError?.message)
                alert('Could not find user to chat with.')
                return
            }

            const targetUserId = targetProfile.id

            // データベースの id（数値やUUID）同士で既存の会話ルームを検索
            const { data: existingConvs, error: fetchError } = await supabase
                .from('conversations')
                .select('*')
                .or(`and(user1_id.eq.${currentUserId},user2_id.eq.${targetUserId}),and(user1_id.eq.${targetUserId},user2_id.eq.${currentUserId})`)

            if (fetchError) {
                console.error('Error fetching conversation:', fetchError.message)
                return
            }

            let conversationId

            if (existingConvs && existingConvs.length > 0) {
                conversationId = existingConvs[0].id
            } else {
                // 新規作成時はお互いの users.id を保存する
                const { data: newConv, error: insertError } = await supabase
                    .from('conversations')
                    .insert([{ user1_id: currentUserId, user2_id: targetUserId }])
                    .select()

                if (insertError) {
                    console.error('Error creating conversation:', insertError.message)
                    alert('Failed to start chat.')
                    return
                }
                conversationId = newConv[0].id
            }

            router.push(`/messages/${conversationId}`)
        } catch (error) {
            console.error('Error starting chat:', error)
        }
    }

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/' })
    }

    return (
        <main className="max-w-2xl mx-auto p-6 font-sans my-8 relative">
            {/* 右上のメニュー */}
            <div className="absolute top-6 right-6" ref={menuRef}>
                <div className="flex items-center gap-3">
                    <Link
                        href="/messages"
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 transition no-underline"
                    >
                        Inbox
                    </Link>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex items-center gap-2 bg-white border border-gray-200 py-1.5 px-3 rounded-full shadow-sm hover:bg-gray-50 transition cursor-pointer"
                    >
                        <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {username.charAt(0).toUpperCase()}
                        </span>
                        <span className="text-xs font-semibold text-gray-700">@{username}</span>
                    </button>
                </div>

                {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50 flex flex-col">
                        <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-xs text-gray-500 m-0">Signed in as</p>
                            <p className="text-xs font-bold text-gray-800 truncate m-0">@{username}</p>
                        </div>
                        <Link
                            href={`/profile/${username}`}
                            className="px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 no-underline text-left transition"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            👤 My Profile
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left transition font-medium cursor-pointer border-none bg-transparent"
                        >
                            🚪 Log out
                        </button>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 pr-36">
                <h2 className="text-2xl font-bold text-gray-800 m-0">MotherConnect Support Board</h2>
            </div>

            {/* 投稿フォーム */}
            <form
                onSubmit={handleCreatePost}
                className="flex flex-col gap-4 bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm mb-8"
            >
                <h3 className="text-lg font-bold text-gray-800 m-0">Create New Post</h3>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Category:</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        <option value="request">Seeking Support (Request)</option>
                        <option value="offer">Offering Support (Offer)</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Title:</label>
                    <input
                        type="text"
                        placeholder="e.g. Need someone to watch my toddler"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Details:</label>
                    <textarea
                        placeholder="Describe support..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="p-2 h-24 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-y"
                    />
                </div>

                <button
                    type="submit"
                    className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md cursor-pointer transition shadow-sm mt-1"
                >
                    Post to Board
                </button>
            </form>

            <h3 className="text-xl font-bold text-gray-800 mb-4">Support Board Posts</h3>

            {loading ? (
                <p className="text-center text-gray-500 py-8">Loading posts...</p>
            ) : posts.length === 0 ? (
                <p className="text-center text-gray-500 bg-gray-50 p-6 rounded-lg border border-gray-100">
                    No posts yet. Be the first to post!
                </p>
            ) : (
                <div className="flex flex-col gap-5">
                    {posts.map((post) => {
                        const postComments = commentsMap[post.id] || []
                        const postUsername = post.username || 'mother'

                        return (
                            <div
                                key={post.id}
                                className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md transition flex flex-col gap-3"
                            >
                                <div className="flex justify-between items-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${post.category === 'request'
                                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        }`}>
                                        {post.category === 'request' ? 'Seeking Support' : 'Offering Support'}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className='flex items-center gap-2 mb-2'>
                                    <Link
                                        href={`/profile/${postUsername}`}
                                        className='font-bold text-gray-800 hover:text-blue-600 transition no-underline flex items-center gap-2'>
                                        <span className='w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-600'>
                                            {postUsername.charAt(0).toUpperCase()}
                                        </span>
                                        <span>@{postUsername}</span>
                                    </Link>
                                </div>

                                <div>
                                    <h4 className="text-lg font-bold text-gray-800 mb-1">{post.title}</h4>
                                    <p className="text-gray-600 text-sm leading-relaxed">{post.description}</p>
                                </div>

                                <div>
                                    {/* 👇 3. ボタンに post.username を渡してチャット開始関数を呼ぶ */}
                                    <button
                                        onClick={() => handleStartChat(postUsername)}
                                        className="py-1.5 px-3 text-xs bg-sky-50 hover:bg-sky-100 text-sky-700 font-medium rounded-md cursor-pointer transition border border-sky-200"
                                    >
                                        💬 Message Author
                                    </button>
                                </div>

                                <div className="border-t border-gray-100 pt-3 mt-1">
                                    <h5 className="text-xs font-semibold text-gray-500 mb-2">
                                        Comments ({postComments.length})
                                    </h5>

                                    <div className="flex flex-col gap-2 mb-3">
                                        {postComments.map((comment) => {
                                            const commentUsername = comment.username || 'mother'
                                            return (
                                                <div
                                                    key={comment.id}
                                                    className="bg-gray-50 p-3 rounded-md text-xs text-gray-700 border border-gray-100 flex flex-col gap-1.5"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <Link
                                                            href={`/profile/${commentUsername}`}
                                                            className="font-bold text-gray-800 hover:text-blue-600 transition no-underline flex items-center gap-1.5"
                                                        >
                                                            <span className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-[10px] text-gray-600">
                                                                {commentUsername.charAt(0).toUpperCase()}
                                                            </span>
                                                            <span>@{commentUsername}</span>
                                                        </Link>
                                                    </div>

                                                    <p className="text-gray-600 m-0 leading-relaxed pl-6">
                                                        {comment.content}
                                                    </p>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    <form onSubmit={(e) => handleAddComment(post.id, e)} className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Write a reply..."
                                            value={commentTexts[post.id] || ''}
                                            onChange={(e) => setCommentTexts({ ...commentTexts, [post.id]: e.target.value })}
                                            className="flex-1 py-1.5 px-3 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                        />
                                        <button
                                            type="submit"
                                            className="py-1.5 px-3 text-xs bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-md cursor-pointer transition"
                                        >
                                            Reply
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </main>
    )
}