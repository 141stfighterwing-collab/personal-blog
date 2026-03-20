import { db } from '@/lib/db'
import { NextResponse, NextRequest } from 'next/server'

export async function GET() {
  try {
    const links = await db.externalLink.findMany({
      orderBy: { sortOrder: 'asc' },
    })
    return NextResponse.json(links)
  } catch (error) {
    console.error('Error fetching links:', error)
    return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, url, description, category } = body

    const link = await db.externalLink.create({
      data: {
        title,
        url,
        description: description || '',
        category: category || 'other',
      },
    })
    return NextResponse.json(link)
  } catch (error) {
    console.error('Error creating link:', error)
    return NextResponse.json({ error: 'Failed to create link' }, { status: 500 })
  }
}
