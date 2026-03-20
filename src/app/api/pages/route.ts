import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const pages = await db.page.findMany({
      where: { published: true },
      include: {
        blocks: {
          orderBy: { sortOrder: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(pages)
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      title, 
      slug, 
      description, 
      bannerUrl, 
      bannerAlt, 
      showSidebar, 
      sidebarMenu, 
      published,
      blocks 
    } = body

    // Create page with blocks in a transaction
    const page = await db.page.create({
      data: {
        title,
        slug,
        description: description || null,
        bannerUrl: bannerUrl || null,
        bannerAlt: bannerAlt || null,
        showSidebar: showSidebar ?? true,
        sidebarMenu: sidebarMenu ? JSON.stringify(sidebarMenu) : null,
        published: published ?? false,
        blocks: {
          create: (blocks || []).map((block: { blockType: string; content: string; sortOrder: number }) => ({
            blockType: block.blockType,
            content: block.content,
            sortOrder: block.sortOrder
          }))
        }
      },
      include: {
        blocks: true
      }
    })

    return NextResponse.json(page)
  } catch (error) {
    console.error('Error creating page:', error)
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 })
  }
}
