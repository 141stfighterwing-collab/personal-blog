import RSSParser from 'rss-parser'
import { RSSFeedSource, RSS_FEED_SOURCES, RSS_CACHE_TTL } from './config'

export interface RSSItem {
  id: string
  title: string
  link: string | null
  category: string
  source: string
  pubDate: string | null
}

interface CacheEntry {
  items: RSSItem[]
  timestamp: number
  source: RSSFeedSource
}

// Simple in-memory cache
const feedCache = new Map<string, CacheEntry>()

/**
 * Create RSS parser instance
 */
const parser = new RSSParser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Personal-Blog-RSS-Reader/1.0',
    'Accept': 'application/rss+xml, application/xml, text/xml',
  },
  customFields: {
    item: ['media:content', 'media:thumbnail', 'enclosure'],
  },
})

/**
 * Fetch and parse a single RSS feed
 */
export async function fetchFeed(source: RSSFeedSource): Promise<RSSItem[]> {
  const cached = feedCache.get(source.id)
  
  // Return cached items if still valid
  if (cached && Date.now() - cached.timestamp < RSS_CACHE_TTL) {
    return cached.items
  }
  
  try {
    console.log(`Fetching RSS feed: ${source.name}`)
    const feed = await parser.parseURL(source.url)
    
    const items: RSSItem[] = feed.items.slice(0, source.maxItems || 10).map((item, index) => ({
      id: `${source.id}-${index}-${Date.now()}`,
      title: cleanTitle(item.title || 'Untitled'),
      link: item.link || null,
      category: source.category,
      source: source.name,
      pubDate: item.pubDate || item.isoDate || null,
    }))
    
    // Update cache
    feedCache.set(source.id, {
      items,
      timestamp: Date.now(),
      source,
    })
    
    return items
  } catch (error) {
    console.error(`Failed to fetch RSS feed ${source.name}:`, error)
    
    // Return cached items if available (even if expired)
    if (cached) {
      return cached.items
    }
    
    return []
  }
}

/**
 * Clean title by removing HTML entities and extra whitespace
 */
function cleanTitle(title: string): string {
  return title
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Fetch all enabled RSS feeds
 */
export async function fetchAllFeeds(): Promise<RSSItem[]> {
  const enabledSources = RSS_FEED_SOURCES.filter(s => s.enabled)
  
  // Fetch all feeds in parallel
  const results = await Promise.allSettled(
    enabledSources.map(source => fetchFeed(source))
  )
  
  // Collect all items
  const allItems: RSSItem[] = []
  
  for (const result of results) {
    if (result.status === 'fulfilled') {
      allItems.push(...result.value)
    }
  }
  
  // Sort by date (newest first) if available
  allItems.sort((a, b) => {
    if (!a.pubDate || !b.pubDate) return 0
    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  })
  
  return allItems
}

/**
 * Get all available feed sources
 */
export function getFeedSources(): RSSFeedSource[] {
  return RSS_FEED_SOURCES
}

/**
 * Get only enabled feed sources
 */
export function getEnabledFeedSources(): RSSFeedSource[] {
  return RSS_FEED_SOURCES.filter(s => s.enabled)
}

/**
 * Clear the feed cache
 */
export function clearFeedCache(): void {
  feedCache.clear()
}

/**
 * Clear expired cache entries
 */
export function clearExpiredCache(): void {
  const now = Date.now()
  for (const [key, entry] of feedCache.entries()) {
    if (now - entry.timestamp > RSS_CACHE_TTL) {
      feedCache.delete(key)
    }
  }
}

/**
 * Get cache stats
 */
export function getCacheStats(): { size: number; sources: string[] } {
  return {
    size: feedCache.size,
    sources: Array.from(feedCache.keys()),
  }
}
