'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'

export default function ProfileEditPage() {
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [age, setAge] = useState('')
    const [location, setLocation] = useState('')
    const [childAge, setChildAge] = useState('')
    const [childAgeUnit, setChildAgeUnit] = useState('years')
    const [role, setRole] = useState('')
    const [loading, setLoading] = useState(true)

    // Load data from Supabase when the page loads
    useEffect(() => {
        async function fetchProfile() {
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .limit(1)
                    .single()

                if (error) {
                    console.log('No profile found yet, or error:', error.message)
                } else if (data) {
                    setName(data.name || '')
                    setAge(data.age || '')
                    setLocation(data.location || '')

                    // separate numbers and units of child's age
                    if (data.child_age) {
                        const parts = data.child_age.split(' ')
                        if (parts.length >= 2) {
                            setChildAge(parts[0])
                            setChildAgeUnit(parts[1])
                        }
                    }

                    setRole(data.role || '')
                }
            } catch (error) {
                console.error('Error loading profile:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [])

    // process of updating (saving) data
    const handleUpdate = async (e) => {
        e.preventDefault()

        const fullChildAge = childAge && childAgeUnit ? `${childAge} ${childAgeUnit}` : ''

        const { error } = await supabase
            .from('users')
            .upsert([
                {
                    name: name,
                    username: username,
                    age: age ? parseInt(age) : null,
                    location: location,
                    child_age: fullChildAge,
                    role: role,
                    updated_at: new Date()
                }
            ])

        if (error) {
            console.error('Something went wrong.', error)
            alert('Failed to update profile.')
        } else {
            alert('Profile updated successfully!')
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh] text-gray-600 font-sans">
                Loading profile...
            </div>
        )
    }

    return (
        <main className="max-w-md mx-auto p-6 font-sans my-8 bg-white rounded-xl shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit Profile</h2>

            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
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
                {/* User Name */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">User Name:</label>
                    <input
                        type="text"
                        placeholder="Your Name"
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
                        placeholder="Location"
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
                    className="mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md cursor-pointer transition shadow-sm"
                >
                    Update Profile
                </button>
            </form>
        </main>
    )
}