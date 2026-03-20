import { NextResponse } from 'next/server'
import { fetchAllFeeds, getEnabledFeedSources, clearFeedCache } from '@/lib/rss/parser'

export async function GET() {
  try {
    const items = await fetchAllFeeds()
    const sources = getEnabledFeedSources()
    
    return NextResponse.json({
      success: true,
      count: items.length,
      sources: sources.map(s => ({ id: s.id, name: s.name, category: s.category })),
      items,
    })
  } catch (error) {
    console.error('RSS fetch error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch RSS feeds',
        items: [],
      },
      { status: 500 }
    )
  }
}

// Clear cache endpoint (for manual refresh)
export async function DELETE() {
  try {
    clearFeedCache()
    return NextResponse.json({
      success: true,
      message: 'RSS cache cleared',
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to clear cache' },
      { status: 500 }
    )
  }
}
