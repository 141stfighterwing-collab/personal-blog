import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const page = await db.page.findUnique({
      where: { id },
      include: {
        blocks: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    })
    
    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }
    
    return NextResponse.json(page)
  } catch (error) {
    console.error('Error fetching page:', error)
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    // Update page
    const page = await db.page.update({
      where: { id },
      data: {
        title,
        slug,
        description: description || null,
        bannerUrl: bannerUrl || null,
        bannerAlt: bannerAlt || null,
        showSidebar: showSidebar ?? true,
        sidebarMenu: sidebarMenu ? JSON.stringify(sidebarMenu) : null,
        published: published ?? false,
      }
    })

    // Update blocks - delete existing and create new
    if (blocks) {
      await db.pageBlock.deleteMany({
        where: { pageId: id }
      })

      await db.pageBlock.createMany({
        data: blocks.map((block: { blockType: string; content: string; sortOrder: number }) => ({
          pageId: id,
          blockType: block.blockType,
          content: block.content,
          sortOrder: block.sortOrder
        }))
      })
    }

    // Fetch updated page with blocks
    const updatedPage = await db.page.findUnique({
      where: { id },
      include: {
        blocks: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    })
    
    return NextResponse.json(updatedPage)
  } catch (error) {
    console.error('Error updating page:', error)
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Delete blocks first (cascade should handle this, but explicit is safer)
    await db.pageBlock.deleteMany({
      where: { pageId: id }
    })
    
    // Delete page
    await db.page.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting page:', error)
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 })
  }
}
