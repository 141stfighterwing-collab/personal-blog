import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashIP, generateVisitorId, getClientIP, getCurrentDateString } from '@/lib/analytics/utils'

const HASH_SECRET = process.env.ANALYTICS_SECRET || 'analytics-secret-key'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      elementType,
      elementId,
      elementClass,
      elementText,
      href,
      pageUrl,
      pagePath,
      x,
      y,
    } = body

    // Get client info
    const ip = getClientIP(request)
    const userAgent = request.headers.get('user-agent') || ''
    const sessionId = request.headers.get('x-session-id') || ''

    // Generate visitor ID
    const visitorId = generateVisitorId(hashIP(ip, HASH_SECRET), userAgent)

    // Get date
    const date = getCurrentDateString()

    // Truncate element text to prevent huge data
    const truncatedText = elementText ? elementText.substring(0, 100) : null

    // Create click event
    const clickEvent = await db.clickEvent.create({
      data: {
        sessionId,
        visitorId,
        elementType,
        elementId,
        elementClass,
        elementText: truncatedText,
        href,
        pageUrl,
        pagePath,
        x,
        y,
        date,
      },
    })

    return NextResponse.json({ success: true, clickEventId: clickEvent.id })
  } catch (error) {
    console.error('Analytics click track error:', error)
    return NextResponse.json(
      { error: 'Failed to track click' },
      { status: 500 }
    )
  }
}
