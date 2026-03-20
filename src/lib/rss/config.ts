// RSS Feed Configuration
// Add your RSS feed sources here

export interface RSSFeedSource {
  id: string
  name: string
  url: string
  category: 'ai' | 'geopolitics' | 'cybersecurity' | 'general'
  enabled: boolean
  maxItems?: number // Max items to fetch from this feed
}

// Cache time-to-live in milliseconds (5 minutes)
export const RSS_CACHE_TTL = 5 * 60 * 1000

export const RSS_FEED_SOURCES: RSSFeedSource[] = [
  // AI News Sources
  {
    id: 'ai-techcrunch',
    name: 'TechCrunch AI',
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    category: 'ai',
    enabled: true,
    maxItems: 5,
  },
  {
    id: 'ai-venturebeat',
    name: 'VentureBeat AI',
    url: 'https://venturebeat.com/category/ai/feed/',
    category: 'ai',
    enabled: true,
    maxItems: 5,
  },
  {
    id: 'ai-openai',
    name: 'OpenAI Blog',
    url: 'https://openai.com/blog/rss.xml',
    category: 'ai',
    enabled: true,
    maxItems: 3,
  },
  {
    id: 'ai-google',
    name: 'Google AI Blog',
    url: 'https://blog.google/technology/ai/rss/',
    category: 'ai',
    enabled: true,
    maxItems: 3,
  },

  // Geopolitics News Sources
  {
    id: 'geo-bbc',
    name: 'BBC World News',
    url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    category: 'geopolitics',
    enabled: true,
    maxItems: 5,
  },
  {
    id: 'geo-reuters',
    name: 'Reuters World',
    url: 'https://www.reutersagency.com/feed/?taxonomy=best-topics&post_type=best',
    category: 'geopolitics',
    enabled: false, // May require authentication
    maxItems: 5,
  },
  {
    id: 'geo-aljazeera',
    name: 'Al Jazeera',
    url: 'https://www.aljazeera.com/xml/rss/all.xml',
    category: 'geopolitics',
    enabled: false, // Enable if needed
    maxItems: 3,
  },

  // Cybersecurity News Sources
  {
    id: 'cyber-bleeping',
    name: 'BleepingComputer',
    url: 'https://www.bleepingcomputer.com/feed/',
    category: 'cybersecurity',
    enabled: true,
    maxItems: 5,
  },
  {
    id: 'cyber-therecord',
    name: 'The Record',
    url: 'https://therecord.media/feed/',
    category: 'cybersecurity',
    enabled: true,
    maxItems: 5,
  },
  {
    id: 'cyber-darkreading',
    name: 'Dark Reading',
    url: 'https://www.darkreading.com/rss.xml',
    category: 'cybersecurity',
    enabled: true,
    maxItems: 3,
  },
  {
    id: 'cyber-krebs',
    name: 'Krebs on Security',
    url: 'https://krebsonsecurity.com/feed/',
    category: 'cybersecurity',
    enabled: true,
    maxItems: 3,
  },

  // General Tech News (fallback)
  {
    id: 'general-hackernews',
    name: 'Hacker News',
    url: 'https://hnrss.org/frontpage',
    category: 'general',
    enabled: true,
    maxItems: 5,
  },
  {
    id: 'general-devto',
    name: 'Dev.to',
    url: 'https://dev.to/feed',
    category: 'general',
    enabled: true,
    maxItems: 3,
  },
]

// Default fallback feeds if external feeds fail
export const DEFAULT_NEWS_ITEMS = [
  { title: '🚀 Welcome to my personal blog!', category: 'general' },
  { title: '⭐ Check out my GitHub: github.com/Shootre21', category: 'general' },
  { title: '☕ Powered by coffee and curiosity', category: 'general' },
]

/**
 * Get feed sources by category
 */
export function getFeedsByCategory(category: RSSFeedSource['category']): RSSFeedSource[] {
  return RSS_FEED_SOURCES.filter(s => s.category === category && s.enabled)
}

/**
 * Get all enabled feed sources
 */
export function getEnabledFeeds(): RSSFeedSource[] {
  return RSS_FEED_SOURCES.filter(s => s.enabled)
}
