"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../utils/supabase"

interface ProfileFormProps {
    initialName?: string | null
    userEmail?: string | null
}

export default function ProfileForm({ initialName, userEmail }: ProfileFormProps) {
    const router = useRouter()
    const [name, setName] = useState(initialName || "")
    const [username, setUsername] = useState("")
    const [age, setAge] = useState("")
    const [location, setLocation] = useState("")
    const [childAge, setChildAge] = useState("")
    const [childAgeUnit, setChildAgeUnit] = useState("years") // デフォルトを years にしておくと親切！
    const [role, setRole] = useState("requester")
    const [loading, setLoading] = useState(false)

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const fullChildAge = childAge && childAgeUnit ? `${childAge} ${childAgeUnit}` : ''

        try {
            const { error } = await supabase
                .from('users')
                .upsert([
                    {
                        username: username,
                        name: name,
                        email: userEmail,
                        age: age ? parseInt(age) : null,
                        location: location,
                        child_age: fullChildAge,
                        role: role,
                        is_completed: true
                    }
                ], { onConflict: 'username' })

            if (error) {
                console.error('Error saving profile (Full details):', error) // 👈 error オブジェクトを丸ごと出力！
                alert(`Failed to save: ${error.message}`) // 👈 画面にも具体的なメッセージを出す
            }
            else {
                router.push('/board')
                router.refresh()
            }
        } catch (err) {
            console.error('Unexpected error:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800">Your Profile</h2>

            <form onSubmit={handleSave} className="flex flex-col gap-4 mt-4">
                {/* Name */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Name:</label>
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                </div>
                {/* Username の入力欄 */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Username (e.g. @saku_mama):</label>
                    <input
                        type="text"
                        placeholder="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                </div>

                {/* Age */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Age:</label>
                    <input
                        type="number"
                        placeholder="Age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                </div>

                {/* Location */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Location:</label>
                    <input
                        type="text"
                        placeholder="e.g. Rexburg, ID"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                </div>

                {/* Child Age */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Child Age:</label>
                    <div className="flex gap-3">
                        <select
                            value={childAge}
                            onChange={(e) => setChildAge(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="">Age...</option>
                            {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                                <option key={num} value={num}>
                                    {num}
                                </option>
                            ))}
                        </select>
                        <select
                            value={childAgeUnit}
                            onChange={(e) => setChildAgeUnit(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="years">Years old</option>
                            <option value="months">Months old</option>
                        </select>
                    </div>
                </div>

                {/* Role */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Role:</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        <option value="">Select your role...</option>
                        <option value="requester">Requester Mother (Seeking Support)</option>
                        <option value="senior">Senior Mother (Offering Support)</option>
                    </select>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-md cursor-pointer transition shadow-sm"
                >
                    {loading ? "Saving..." : "Save Profile"}
                </button>
            </form>
        </section>
    )
}