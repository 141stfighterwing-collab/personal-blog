import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/analytics/stats - Get analytics stats (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '7d' // 1d, 7d, 30d, 90d

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    
    switch (range) {
      case '1d':
        startDate.setDate(startDate.getDate() - 1)
        break
      case '7d':
        startDate.setDate(startDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(startDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(startDate.getDate() - 90)
        break
      default:
        startDate.setDate(startDate.getDate() - 7)
    }

    const dateFrom = startDate.toISOString().split('T')[0]
    const dateTo = endDate.toISOString().split('T')[0]

    // Get daily analytics
    const dailyStats = await db.dailyAnalytics.findMany({
      where: {
        date: {
          gte: dateFrom,
          lte: dateTo,
        },
      },
      orderBy: { date: 'asc' },
    })

    // Get total stats from page views
    const [totalPageViews, uniqueVisitors, totalSessions] = await Promise.all([
      db.pageView.count({
        where: {
          date: {
            gte: dateFrom,
            lte: dateTo,
          },
        },
      }),
      db.pageView.groupBy({
        by: ['visitorId'],
        where: {
          date: {
            gte: dateFrom,
            lte: dateTo,
          },
        },
      }),
      db.analyticsSession.count({
        where: {
          date: {
            gte: dateFrom,
            lte: dateTo,
          },
        },
      }),
    ])

    // Get top pages
    const topPages = await db.pageView.groupBy({
      by: ['path'],
      where: {
        date: {
          gte: dateFrom,
          lte: dateTo,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    })

    // Get top referrers
    const topReferrers = await db.pageView.groupBy({
      by: ['referrerHost'],
      where: {
        date: {
          gte: dateFrom,
          lte: dateTo,
        },
        referrerHost: { not: null },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    })

    // Get device breakdown
    const deviceStats = await db.pageView.groupBy({
      by: ['device'],
      where: {
        date: {
          gte: dateFrom,
          lte: dateTo,
        },
      },
      _count: {
        id: true,
      },
    })

    // Get browser breakdown
    const browserStats = await db.pageView.groupBy({
      by: ['browser'],
      where: {
        date: {
          gte: dateFrom,
          lte: dateTo,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    })

    // Get OS breakdown
    const osStats = await db.pageView.groupBy({
      by: ['os'],
      where: {
        date: {
          gte: dateFrom,
          lte: dateTo,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    })

    // Get country breakdown
    const countryStats = await db.pageView.groupBy({
      by: ['country'],
      where: {
        date: {
          gte: dateFrom,
          lte: dateTo,
        },
        country: { not: null },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    })

    // Get page type breakdown
    const pageTypeStats = await db.pageView.groupBy({
      by: ['pageType'],
      where: {
        date: {
          gte: dateFrom,
          lte: dateTo,
        },
      },
      _count: {
        id: true,
      },
    })

    // Get click events stats
    const clickStats = await db.clickEvent.groupBy({
      by: ['elementType'],
      where: {
        date: {
          gte: dateFrom,
          lte: dateTo,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    })

    // Get top clicked elements
    const topClicks = await db.clickEvent.groupBy({
      by: ['elementType', 'elementText', 'href'],
      where: {
        date: {
          gte: dateFrom,
          lte: dateTo,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    })

    // Real-time stats (last hour)
    const oneHourAgo = new Date()
    oneHourAgo.setHours(oneHourAgo.getHours() - 1)

    const realtimeStats = {
      activeNow: await db.pageView.count({
        where: {
          timestamp: {
            gte: oneHourAgo,
          },
        },
      }),
      pageViewsLastHour: await db.pageView.count({
        where: {
          timestamp: {
            gte: oneHourAgo,
          },
        },
      }),
      clicksLastHour: await db.clickEvent.count({
        where: {
          timestamp: {
            gte: oneHourAgo,
          },
        },
      }),
    }

    // Calculate averages from daily stats
    const avgSessionDuration = dailyStats.length > 0 
      ? dailyStats.reduce((sum, d) => sum + (d.avgSessionDuration || 0), 0) / dailyStats.length 
      : 0
    const bounceRate = dailyStats.length > 0 
      ? dailyStats.reduce((sum, d) => sum + (d.bounceRate || 0), 0) / dailyStats.length 
      : 0

    return NextResponse.json({
      range,
      startDate: dateFrom,
      endDate: dateTo,
      totals: {
        totalPageViews,
        totalUniqueVisitors: uniqueVisitors.length,
        totalSessions,
        avgSessionDuration,
        bounceRate,
        totalOrganicTraffic: dailyStats.reduce((sum, d) => sum + d.organicTraffic, 0),
        totalDirectTraffic: dailyStats.reduce((sum, d) => sum + d.directTraffic, 0),
        totalReferralTraffic: dailyStats.reduce((sum, d) => sum + d.referralTraffic, 0),
        totalSocialTraffic: dailyStats.reduce((sum, d) => sum + d.socialTraffic, 0),
        totalEmailTraffic: dailyStats.reduce((sum, d) => sum + d.emailTraffic, 0),
      },
      daily: dailyStats,
      topPages: topPages.map(p => ({ path: p.path, views: p._count.id })),
      topReferrers: topReferrers
        .filter(r => r.referrerHost)
        .map(r => ({ host: r.referrerHost, count: r._count.id })),
      devices: deviceStats.map(d => ({ device: d.device || 'unknown', count: d._count.id })),
      browsers: browserStats.map(b => ({ browser: b.browser || 'unknown', count: b._count.id })),
      os: osStats.map(o => ({ os: o.os || 'unknown', count: o._count.id })),
      countries: countryStats
        .filter(c => c.country)
        .map(c => ({ country: c.country, count: c._count.id })),
      pageTypes: pageTypeStats.map(p => ({ type: p.pageType || 'unknown', count: p._count.id })),
      clicks: {
        byType: clickStats.map(c => ({ type: c.elementType || 'unknown', count: c._count.id })),
        top: topClicks.map(c => ({
          type: c.elementType,
          text: c.elementText,
          href: c.href,
          count: c._count.id,
        })),
      },
      realtime: realtimeStats,
    })
  } catch (error) {
    console.error('Analytics stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics stats' },
      { status: 500 }
    )
  }
}
