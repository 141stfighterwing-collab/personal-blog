/**
 * Open Source Image Sources for Banner Images
 * 
 * All sources provide free, high-quality images for use in blogs and websites
 */

export interface ImageSource {
  id: string
  name: string
  url: string
  searchUrl: string
  description: string
  license: string
  icon: string
}

export const OPEN_SOURCE_IMAGE_SOURCES: ImageSource[] = [
  {
    id: 'unsplash',
    name: 'Unsplash',
    url: 'https://unsplash.com',
    searchUrl: 'https://unsplash.com/s/photos/',
    description: 'Beautiful, free images and photos that you can download and use for any project.',
    license: 'Unsplash License (Free to use)',
    icon: '🖼️',
  },
  {
    id: 'pexels',
    name: 'Pexels',
    url: 'https://pexels.com',
    searchUrl: 'https://pexels.com/search/',
    description: 'Free stock photos shared by talented creators. High quality and free for commercial use.',
    license: 'Pexels License (Free to use)',
    icon: '📷',
  },
  {
    id: 'pixabay',
    name: 'Pixabay',
    url: 'https://pixabay.com',
    searchUrl: 'https://pixabay.com/images/search/',
    description: 'Stunning royalty-free images, stock photos, and videos. Over 2.7 million+ free images.',
    license: 'Pixabay License (Free for commercial use)',
    icon: '🎨',
  },
  {
    id: 'burst',
    name: 'Burst (Shopify)',
    url: 'https://burst.shopify.com',
    searchUrl: 'https://burst.shopify.com/search?q=',
    description: 'Free stock photos by Shopify. Great for entrepreneurs and small businesses.',
    license: 'Shopify License (Free to use)',
    icon: '🛍️',
  },
  {
    id: 'stocksnap',
    name: 'StockSnap',
    url: 'https://stocksnap.io',
    searchUrl: 'https://stocksnap.io/search?q=',
    description: 'Hundreds of high-resolution images added weekly. No attribution required.',
    license: 'CC0 (Public Domain)',
    icon: '📸',
  },
  {
    id: 'kaboompics',
    name: 'Kaboompics',
    url: 'https://kaboompics.com',
    searchUrl: 'https://kaboompics.com/gallery?search=',
    description: 'Beautiful lifestyle photos with complementary color palettes included.',
    license: 'Free for personal and commercial use',
    icon: '🌈',
  },
  {
    id: 'flickr-cc',
    name: 'Flickr (CC)',
    url: 'https://flickr.com/creativecommons',
    searchUrl: 'https://flickr.com/search/?license=2%2C3%2C4%2C5%2C6%2C9&text=',
    description: 'Creative Commons licensed photos from millions of photographers.',
    license: 'Various CC licenses (check individual)',
    icon: '📷',
  },
  {
    id: 'wikimedia',
    name: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org',
    searchUrl: 'https://commons.wikimedia.org/wiki/Special:Search?search=',
    description: 'Free media files from the Wikimedia community. Great for historical and educational images.',
    license: 'Various (check individual)',
    icon: '📚',
  },
]

export const FEATURED_BANNER_CATEGORIES = [
  {
    name: 'Nature & Landscapes',
    keywords: ['sunset', 'mountains', 'ocean', 'forest', 'landscape'],
    source: 'unsplash',
  },
  {
    name: 'Technology',
    keywords: ['technology', 'computer', 'coding', 'office', 'workspace'],
    source: 'unsplash',
  },
  {
    name: 'Business',
    keywords: ['business', 'meeting', 'team', 'office', 'startup'],
    source: 'pexels',
  },
  {
    name: 'Abstract & Minimal',
    keywords: ['abstract', 'minimal', 'pattern', 'texture', 'geometric'],
    source: 'unsplash',
  },
  {
    name: 'Food & Lifestyle',
    keywords: ['food', 'coffee', 'lifestyle', 'home', 'cooking'],
    source: 'unsplash',
  },
  {
    name: 'Travel & Adventure',
    keywords: ['travel', 'adventure', 'city', 'destination', 'explore'],
    source: 'pexels',
  },
]

/**
 * Generate search URL for a given source and query
 */
export function getImageSearchUrl(sourceId: string, query: string): string {
  const source = OPEN_SOURCE_IMAGE_SOURCES.find(s => s.id === sourceId)
  if (!source) return ''
  return `${source.searchUrl}${encodeURIComponent(query)}`
}
