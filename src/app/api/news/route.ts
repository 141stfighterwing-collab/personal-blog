import { db } from '@/lib/db'
import { NextResponse, NextRequest } from 'next/server'

export async function GET() {
  try {
    const news = await db.newsItem.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    })
    return NextResponse.json(news)
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { headline, url, isActive } = body

    const newsItem = await db.newsItem.create({
      data: {
        headline,
        url: url || null,
        isActive: isActive ?? true,
      },
    })
    return NextResponse.json(newsItem)
  } catch (error) {
    console.error('Error creating news item:', error)
    return NextResponse.json({ error: 'Failed to create news item' }, { status: 500 })
  }
}
