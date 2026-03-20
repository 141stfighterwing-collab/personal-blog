import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import {
  parseUserAgent,
  generateVisitorId,
  getClientIP,
  getCurrentDateString,
  getPageType,
} from '@/lib/analytics/utils'
import crypto from 'crypto'

// Simple hash function
function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex').substring(0, 32)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      path,
      url,
      query,
      pageTitle,
      referrer,
      loadTime,
      theme,
    } = body

    // Get client info
    const ip = getClientIP(request)
    const userAgent = request.headers.get('user-agent') || ''
    const forwardedFor = request.headers.get('x-forwarded-for')
    const sessionId = forwardedFor?.split(',')[0]?.trim() || crypto.randomUUID()
    const visitorId = generateVisitorId(hashIP(ip), userAgent)

    // Parse user agent
    const uaParsed = parseUserAgent(userAgent)

    // Parse referrer
    let referrerHost = null
    if (referrer) {
      try {
        referrerHost = new URL(referrer).hostname
      } catch {}
    }

    // Get date
    const date = getCurrentDateString()

    // Get page type
    const pageType = getPageType(path)

    // Determine device
    const device = uaParsed.device

    // Create page view record
    try {
      await db.pageView.create({
        data: {
          sessionId: sessionId.substring(0, 100),
          visitorId: visitorId.substring(0, 100),
          url: (url || path).substring(0, 500),
          path: path.substring(0, 255),
          query: query?.substring(0, 500) || null,
          referrer: referrer?.substring(0, 500) || null,
          referrerHost: referrerHost?.substring(0, 255) || null,
          userAgent: userAgent.substring(0, 500),
          browser: uaParsed.browser,
          browserVersion: uaParsed.browserVersion,
          os: uaParsed.os,
          osVersion: uaParsed.osVersion,
          device: device,
          deviceBrand: uaParsed.deviceBrand || null,
          deviceModel: uaParsed.deviceModel || null,
          ip: hashIP(ip),
          pageTitle: pageTitle?.substring(0, 255) || null,
          pageType: pageType,
          articleId: null,
          theme: theme || null,
          loadTime: loadTime || null,
          date: date,
        },
      })
    } catch (dbError) {
      console.error('Failed to create page view:', dbError)
    }

    // Update or create session
    try {
      const existingSession = await db.analyticsSession.findUnique({
        where: { sessionId: sessionId.substring(0, 100) },
      })

      if (existingSession) {
        await db.analyticsSession.update({
          where: { sessionId: sessionId.substring(0, 100) },
          data: {
            pageViews: { increment: 1 },
            exitUrl: (url || path).substring(0, 500),
            exitPath: path.substring(0, 255),
            lastActivity: new Date(),
          },
        })
      } else {
        await db.analyticsSession.create({
          data: {
            sessionId: sessionId.substring(0, 100),
            visitorId: visitorId.substring(0, 100),
            entryUrl: (url || path).substring(0, 500),
            entryPath: path.substring(0, 255),
            referrer: referrer?.substring(0, 500) || null,
            referrerHost: referrerHost?.substring(0, 255) || null,
            device: device,
            browser: uaParsed.browser,
            os: uaParsed.os,
            date: date,
          },
        })
      }
    } catch (sessionError) {
      console.error('Failed to update session:', sessionError)
    }

    // Update daily analytics
    await updateDailyAnalytics(date, device, uaParsed.browser, uaParsed.os, loadTime)

    return NextResponse.json({ 
      success: true,
      sessionId,
    })
  } catch (error) {
    console.error('Analytics track error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

async function updateDailyAnalytics(
  date: string,
  device: string,
  browser: string,
  os: string,
  loadTime?: number
) {
  try {
    const existing = await db.dailyAnalytics.findUnique({
      where: { date },
    })

    if (existing) {
      // Update existing
      const updates: any = {
        pageViews: { increment: 1 },
        uniqueVisitors: { increment: 1 },
        sessions: { increment: 1 },
      }

      // Update device breakdown
      let deviceBreakdown = JSON.parse(existing.deviceBreakdown || '{}')
      deviceBreakdown[device] = (deviceBreakdown[device] || 0) + 1
      updates.deviceBreakdown = JSON.stringify(deviceBreakdown)

      // Update browser breakdown
      let browserBreakdown = JSON.parse(existing.browserBreakdown || '{}')
      browserBreakdown[browser] = (browserBreakdown[browser] || 0) + 1
      updates.browserBreakdown = JSON.stringify(browserBreakdown)

      // Update OS breakdown
      let osBreakdown = JSON.parse(existing.osBreakdown || '{}')
      osBreakdown[os] = (osBreakdown[os] || 0) + 1
      updates.osBreakdown = JSON.stringify(osBreakdown)

      // Update average load time
      if (loadTime) {
        updates.avgLoadTime = existing.avgLoadTime 
          ? (existing.avgLoadTime * 0.9 + loadTime * 0.1)
          : loadTime
      }

      await db.dailyAnalytics.update({
        where: { date },
        data: updates,
      })
    } else {
      // Create new
      await db.dailyAnalytics.create({
        data: {
          date,
          sessions: 1,
          uniqueVisitors: 1,
          newVisitors: 1,
          returningVisitors: 0,
          pageViews: 1,
          uniquePageViews: 1,
          deviceBreakdown: JSON.stringify({ [device]: 1 }),
          browserBreakdown: JSON.stringify({ [browser]: 1 }),
          osBreakdown: JSON.stringify({ [os]: 1 }),
          avgLoadTime: loadTime || null,
        },
      })
    }
  } catch (error) {
    console.error('Failed to update daily analytics:', error)
  }
}
