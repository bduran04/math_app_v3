import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../utils/supabase/server'
import { deleteCookie } from '../../utils/supabase/cookies'


export async function POST(req: NextRequest) {
    const supabase = createClient();

    const { error } = await supabase.auth.signOut()

    if (error) {
        return NextResponse.redirect(new URL('/error', req.url))
    }

    const response = NextResponse.redirect(new URL('/login', req.url))
    // Delete cookies if needed
    deleteCookie(response, 'user-data')

    return response
}