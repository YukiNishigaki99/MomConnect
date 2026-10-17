import { auth, signIn, signOut } from "../auth"
import { redirect } from "next/navigation"
import { supabase } from "../utils/supabase"
import ProfileForm from "./ProfileForm"

export default async function Home() {
    const session = await auth()

    // 1. ログインしていない場合は、ログイン画面（サインインボタン）を表示して即リターン！
    if (!session || !session.user) {
        return (
            <main className="max-w-[600px] mx-auto p-10 font-sans text-center">
                <h1 className="text-3xl font-bold mb-4">MotherConnect</h1>
                <p className="text-gray-600 mb-8 text-lg">Sign in to connect with other mothers!</p>
                <form action={async () => {
                    "use server"
                    await signIn("google")
                }}>
                    <button
                        type="submit"
                        className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md cursor-pointer transition"
                    >
                        Sign in with Google
                    </button>
                </form>
            </main>
        )
    }

    // 2. ここから先は、ログインしているユーザーがいる安全な状態！
    const userEmail = session.user.email
    const userName = session.user.name || ""

    if (userEmail) {
        // users テーブルにこのユーザーのデータがあるか確認
        const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('email', userEmail)
            .maybeSingle()

        if (!profile) {
            await supabase
                .from('users')
                .insert([
                    {
                        email: userEmail,
                        name: userName,
                        is_completed: false
                    }
                ])
        } else if (profile.is_completed === true) {
            redirect('/board')
        }
    }

    // 3. 初回ログイン（まだ登録データがない、または is_completed が false）の場合
    return (
        <main className="max-w-[600px] mx-auto p-10 font-sans">
            <h1 className="text-3xl font-bold mb-2">Welcome to MotherConnect!</h1>
            <p className="text-gray-600 mb-5">
                Please set up your profile to get started.
            </p>

            <hr className="my-5 border-gray-200" />

            <ProfileForm initialName={userName} userEmail={userEmail ?? ""} />

            <div className="mt-8">
                <form action={async () => {
                    "use server"
                    await signOut()
                }}>
                    <button
                        type="submit"
                        className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md cursor-pointer transition"
                    >
                        Sign out
                    </button>
                </form>
            </div>
        </main>
    )
}