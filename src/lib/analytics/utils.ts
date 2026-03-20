import crypto from 'crypto'
import { NextRequest } from 'next/server'

// User Agent parsing utilities
interface ParsedUserAgent {
  browser: string
  browserVersion: string
  os: string
  osVersion: string
  device: 'desktop' | 'mobile' | 'tablet'
  deviceBrand: string
  deviceModel: string
}

export function parseUserAgent(userAgent: string): ParsedUserAgent {
  const ua = userAgent.toLowerCase()
  
  // Browser detection
  let browser = 'Unknown'
  let browserVersion = ''
  
  if (ua.includes('edg/')) {
    browser = 'Edge'
    browserVersion = ua.match(/edg\/([\d.]+)/)?.[1] || ''
  } else if (ua.includes('opr/') || ua.includes('opera')) {
    browser = 'Opera'
    browserVersion = ua.match(/opr\/([\d.]+)/)?.[1] || ua.match(/opera\/([\d.]+)/)?.[1] || ''
  } else if (ua.includes('chrome/')) {
    browser = 'Chrome'
    browserVersion = ua.match(/chrome\/([\d.]+)/)?.[1] || ''
  } else if (ua.includes('firefox/')) {
    browser = 'Firefox'
    browserVersion = ua.match(/firefox\/([\d.]+)/)?.[1] || ''
  } else if (ua.includes('safari/') && !ua.includes('chrome')) {
    browser = 'Safari'
    browserVersion = ua.match(/version\/([\d.]+)/)?.[1] || ''
  } else if (ua.includes('msie') || ua.includes('trident/')) {
    browser = 'IE'
    browserVersion = ua.match(/(?:msie |rv:)([\d.]+)/)?.[1] || ''
  }

  // OS detection
  let os = 'Unknown'
  let osVersion = ''
  
  if (ua.includes('windows nt 10')) {
    os = 'Windows'
    osVersion = '10'
  } else if (ua.includes('windows nt 6.3')) {
    os = 'Windows'
    osVersion = '8.1'
  } else if (ua.includes('windows nt 6.2')) {
    os = 'Windows'
    osVersion = '8'
  } else if (ua.includes('windows nt 6.1')) {
    os = 'Windows'
    osVersion = '7'
  } else if (ua.includes('mac os x')) {
    os = 'macOS'
    osVersion = ua.match(/mac os x (\d+[._]\d+)/)?.[1]?.replace('_', '.') || ''
  } else if (ua.includes('android')) {
    os = 'Android'
    osVersion = ua.match(/android ([\d.]+)/)?.[1] || ''
  } else if (ua.includes('iphone') || ua.includes('ipad')) {
    os = 'iOS'
    osVersion = ua.match(/os (\d+[._]\d+)/)?.[1]?.replace('_', '.') || ''
  } else if (ua.includes('linux')) {
    os = 'Linux'
    osVersion = ''
  } else if (ua.includes('ubuntu')) {
    os = 'Ubuntu'
    osVersion = ''
  }

  // Device type detection
  let device: 'desktop' | 'mobile' | 'tablet' = 'desktop'
  let deviceBrand = ''
  let deviceModel = ''

  if (ua.includes('mobile') && !ua.includes('tablet')) {
    device = 'mobile'
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    device = 'tablet'
  }

  // Device brand/model
  if (ua.includes('iphone')) {
    deviceBrand = 'Apple'
    deviceModel = 'iPhone'
  } else if (ua.includes('ipad')) {
    deviceBrand = 'Apple'
    deviceModel = 'iPad'
  } else if (ua.includes('samsung')) {
    deviceBrand = 'Samsung'
    deviceModel = ua.match(/samsung[- ]([\w-]+)/)?.[1] || ''
  } else if (ua.includes('pixel')) {
    deviceBrand = 'Google'
    deviceModel = ua.match(/pixel ([\w-]+)/)?.[1] || ''
  } else if (ua.includes('huawei')) {
    deviceBrand = 'Huawei'
    deviceModel = ua.match(/huawei[- ]([\w-]+)/)?.[1] || ''
  } else if (ua.includes('xiaomi') || ua.includes('redmi')) {
    deviceBrand = 'Xiaomi'
    deviceModel = ua.match(/(?:xiaomi|redmi)[- ]([\w-]+)/)?.[1] || ''
  } else if (ua.includes('macintosh') || ua.includes('macbook')) {
    deviceBrand = 'Apple'
    deviceModel = 'Mac'
  }

  return {
    browser,
    browserVersion,
    os,
    osVersion,
    device,
    deviceBrand,
    deviceModel,
  }
}

// Hash IP for privacy
export function hashIP(ip: string, secret: string): string {
  return crypto.createHash('sha256').update(ip + secret).digest('hex').substring(0, 32)
}

// Generate visitor ID from IP and User Agent
export function generateVisitorId(ip: string, userAgent: string): string {
  return crypto.createHash('sha256').update(ip + userAgent).digest('hex').substring(0, 32)
}

// Generate session ID
export function generateSessionId(): string {
  return crypto.randomBytes(16).toString('hex')
}

// Parse referrer URL
export function parseReferrer(referrer: string | null): {
  referrer: string | null
  referrerHost: string | null
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
  utmTerm: string | null
  utmContent: string | null
} {
  if (!referrer) {
    return {
      referrer: null,
      referrerHost: null,
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      utmTerm: null,
      utmContent: null,
    }
  }

  try {
    const url = new URL(referrer)
    const searchParams = url.searchParams

    return {
      referrer,
      referrerHost: url.hostname,
      utmSource: searchParams.get('utm_source'),
      utmMedium: searchParams.get('utm_medium'),
      utmCampaign: searchParams.get('utm_campaign'),
      utmTerm: searchParams.get('utm_term'),
      utmContent: searchParams.get('utm_content'),
    }
  } catch {
    return {
      referrer,
      referrerHost: null,
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      utmTerm: null,
      utmContent: null,
    }
  }
}

// Determine traffic source
export function getTrafficSource(referrer: string | null, utmSource: string | null): {
  source: 'organic' | 'direct' | 'referral' | 'social' | 'email'
  type: string
} {
  if (utmSource) {
    if (['email', 'newsletter', 'mail'].includes(utmSource.toLowerCase())) {
      return { source: 'email', type: 'email' }
    }
    if (['facebook', 'twitter', 'linkedin', 'instagram', 'tiktok', 'youtube', 'reddit', 'pinterest'].includes(utmSource.toLowerCase())) {
      return { source: 'social', type: utmSource.toLowerCase() }
    }
  }

  if (!referrer) {
    return { source: 'direct', type: 'direct' }
  }

  const referrerLower = referrer.toLowerCase()
  
  // Search engines
  const searchEngines = ['google', 'bing', 'yahoo', 'duckduckgo', 'baidu', 'yandex']
  for (const engine of searchEngines) {
    if (referrerLower.includes(engine)) {
      return { source: 'organic', type: engine }
    }
  }

  // Social media
  const socialMedia = ['facebook', 'twitter', 'linkedin', 'instagram', 'tiktok', 'youtube', 'reddit', 'pinterest', 'twitch', 'discord']
  for (const social of socialMedia) {
    if (referrerLower.includes(social)) {
      return { source: 'social', type: social }
    }
  }

  // Email
  const emailProviders = ['mail', 'email', 'gmail', 'outlook', 'yahoo']
  for (const email of emailProviders) {
    if (referrerLower.includes(email)) {
      return { source: 'email', type: 'email' }
    }
  }

  return { source: 'referral', type: 'referral' }
}

// Get client IP
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }
  
  return '127.0.0.1' // Fallback
}

// Get current date string
export function getCurrentDateString(): string {
  return new Date().toISOString().split('T')[0]
}

// Determine page type from path
export function getPageType(path: string): string {
  if (path === '/' || path === '') return 'home'
  if (path.startsWith('/blog/') || path.startsWith('/posts/')) return 'article'
  if (path === '/blog') return 'blog-list'
  if (path.startsWith('/admin')) return 'admin'
  if (path === '/login') return 'login'
  if (path === '/links') return 'links'
  if (path.startsWith('/page/')) return 'custom-page'
  return 'page'
}

// Extract article ID from path if viewing an article
export function extractArticleId(path: string): string | null {
  const match = path.match(/\/blog\/([^/]+)/) || path.match(/\/posts\/([^/]+)/)
  return match ? match[1] : null
}
