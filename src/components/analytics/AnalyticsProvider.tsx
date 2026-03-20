'use client'

import { useEffect, useCallback, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

// Session ID management
function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  
  let sessionId = sessionStorage.getItem('analytics_session_id')
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    sessionStorage.setItem('analytics_session_id', sessionId)
  }
  return sessionId
}

// Track page view
async function trackPageView(event: {
  path: string
  url: string
  query?: string
  pageTitle?: string
  referrer?: string
  loadTime?: number
  theme?: string
}) {
  const sessionId = getSessionId()
  
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': sessionId,
      },
      body: JSON.stringify(event),
    })
  } catch (error) {
    console.error('Failed to track page view:', error)
  }
}

// Track click event
async function trackClickEvent(event: {
  elementType?: string
  elementId?: string
  elementClass?: string
  elementText?: string
  href?: string
  pageUrl: string
  pagePath: string
  x?: number
  y?: number
}) {
  const sessionId = getSessionId()
  
  try {
    await fetch('/api/analytics/click', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': sessionId,
      },
      body: JSON.stringify(event),
    })
  } catch (error) {
    console.error('Failed to track click:', error)
  }
}

// Analytics Provider Component
export function AnalyticsProvider({ 
  children,
  enabled = true,
  trackClicks = true,
  trackPageViews = true,
}: {
  children: React.ReactNode
  enabled?: boolean
  trackClicks?: boolean
  trackPageViews?: boolean
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const lastPathRef = useRef<string>('')
  const pageLoadStartRef = useRef<number>(0)

  // Track page views
  useEffect(() => {
    if (!enabled || !trackPageViews) return
    
    const currentPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    
    // Avoid duplicate tracking
    if (currentPath === lastPathRef.current) return
    lastPathRef.current = currentPath
    
    // Calculate load time
    const loadTime = pageLoadStartRef.current 
      ? Date.now() - pageLoadStartRef.current 
      : undefined
    
    // Track page view
    trackPageView({
      path: pathname,
      url: window.location.href,
      query: searchParams?.toString() || undefined,
      pageTitle: document.title,
      referrer: document.referrer || undefined,
      loadTime,
      theme: typeof window !== 'undefined' ? localStorage.getItem('blog-theme') || undefined : undefined,
    })
    
    // Reset for next page
    pageLoadStartRef.current = Date.now()
  }, [pathname, searchParams, enabled, trackPageViews])

  // Track clicks
  useEffect(() => {
    if (!enabled || !trackClicks) return

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      // Find the closest clickable element
      const clickable = target.closest('a, button, [role="button"], input[type="submit"], input[type="button"]')
      
      if (!clickable) return
      
      const element = clickable as HTMLElement
      
      // Get element info
      const elementType = element.tagName.toLowerCase()
      const elementId = element.id || undefined
      const elementClass = element.className || undefined
      const elementText = element.textContent?.trim().substring(0, 100) || undefined
      const href = (element as HTMLAnchorElement).href || undefined
      
      // Track click
      trackClickEvent({
        elementType,
        elementId,
        elementClass: typeof elementClass === 'string' ? elementClass.split(' ').slice(0, 5).join(' ') : undefined,
        elementText,
        href,
        pageUrl: window.location.href,
        pagePath: pathname,
        x: e.clientX,
        y: e.clientY,
      })
    }

    document.addEventListener('click', handleClick, { passive: true })
    
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [pathname, enabled, trackClicks])

  // Initialize page load time
  useEffect(() => {
    pageLoadStartRef.current = Date.now()
  }, [])

  return <>{children}</>
}

// Hook to manually track events
export function useAnalytics() {
  const pathname = usePathname()
  
  const trackEvent = useCallback(async (eventName: string, data?: Record<string, any>) => {
    const sessionId = getSessionId()
    
    try {
      await fetch('/api/analytics/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId,
        },
        body: JSON.stringify({
          event: eventName,
          pagePath: pathname,
          ...data,
        }),
      })
    } catch (error) {
      console.error('Failed to track event:', error)
    }
  }, [pathname])
  
  const trackClick = useCallback((element: string, data?: Record<string, any>) => {
    trackClickEvent({
      elementType: element,
      pageUrl: window.location.href,
      pagePath: pathname,
      ...data,
    })
  }, [pathname])
  
  const trackPageViewManual = useCallback((data?: Partial<Parameters<typeof trackPageView>[0]>) => {
    trackPageView({
      path: pathname,
      url: window.location.href,
      ...data,
    })
  }, [pathname])

  return {
    trackEvent,
    trackClick,
    trackPageView: trackPageViewManual,
    sessionId: typeof window !== 'undefined' ? getSessionId() : null,
  }
}

export default AnalyticsProvider
