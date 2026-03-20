import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getUserById } from '@/lib/auth'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userCookie = cookieStore.get('user')

    if (!userCookie) {
      return NextResponse.json({ user: null, authenticated: false })
    }

    const userData = JSON.parse(userCookie.value)
    
    // Verify user still exists and is active
    const user = getUserById(userData.id)
    
    if (!user) {
      // Clear invalid cookies
      cookieStore.delete('session_token')
      cookieStore.delete('user')
      return NextResponse.json({ user: null, authenticated: false })
    }

    return NextResponse.json({
      user,
      authenticated: true,
    })
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json({ user: null, authenticated: false })
  }
}
