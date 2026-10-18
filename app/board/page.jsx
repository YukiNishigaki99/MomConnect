import { auth } from '../../auth'
import { supabase } from '../../utils/supabase'
import SupportBoardClient from './SupportBoardClient'

export default async function BoardPage() {
    const session = await auth()
    const email = session?.user?.email

    if (!email) {
        return <p>Please Log in.</p>
    }

    const { data: profile, error } = await supabase
        .from('users')
        .select('username, email')
        .eq('email', email)
        .single()

    if (error) {
        console.error('Failed to load profile ', error.message)
        return <p>Failed to load profile.</p>
    }

    if (!profile?.username) {
        return <p>Please add a username to your profile.</p>
    }

    // username と email をクライアントに渡す
    return <SupportBoardClient username={profile.username} email={email} />
}