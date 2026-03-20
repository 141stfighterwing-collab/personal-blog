'use client'

import { useEffect, useState } from 'react'
import { Brain, Globe, Shield, Sparkles, Play, Pause, FastForward, RefreshCw, ExternalLink } from 'lucide-react'

interface RSSNewsItem {
  id: string
  title: string
  link: string | null
  category: string
  source: string
  pubDate: string | null
}

// Category configuration with colors and icons
const categoryConfig: Record<string, {
  icon: React.ReactNode
  bgColor: string
  textColor: string
  borderColor: string
  badgeColor: string
  gradient: string
}> = {
  ai: {
    icon: <Brain className="w-4 h-4" />,
    bgColor: 'bg-purple-500',
    textColor: 'text-purple-100',
    borderColor: 'border-purple-400',
    badgeColor: 'bg-purple-600/30 text-purple-200 border-purple-400/50',
    gradient: 'from-purple-600 via-violet-600 to-purple-700',
  },
  geopolitics: {
    icon: <Globe className="w-4 h-4" />,
    bgColor: 'bg-orange-500',
    textColor: 'text-orange-100',
    borderColor: 'border-orange-400',
    badgeColor: 'bg-orange-600/30 text-orange-200 border-orange-400/50',
    gradient: 'from-orange-600 via-red-600 to-orange-700',
  },
  cybersecurity: {
    icon: <Shield className="w-4 h-4" />,
    bgColor: 'bg-emerald-500',
    textColor: 'text-emerald-100',
    borderColor: 'border-emerald-400',
    badgeColor: 'bg-emerald-600/30 text-emerald-200 border-emerald-400/50',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
  },
  general: {
    icon: <Sparkles className="w-4 h-4" />,
    bgColor: 'bg-blue-500',
    textColor: 'text-blue-100',
    borderColor: 'border-blue-400',
    badgeColor: 'bg-blue-600/30 text-blue-200 border-blue-400/50',
    gradient: 'from-blue-600 via-indigo-600 to-blue-700',
  },
}

const speedOptions = [
  { label: 'Slow', value: 60, icon: <Play className="w-3 h-3" /> },
  { label: 'Normal', value: 35, icon: <FastForward className="w-3 h-3" /> },
  { label: 'Fast', value: 20, icon: <FastForward className="w-3 h-3 rotate-90" /> },
]

export default function NewsMarquee() {
  const [news, setNews] = useState<RSSNewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [speed, setSpeed] = useState(35)
  const [currentSpeedIndex, setCurrentSpeedIndex] = useState(1)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchNews = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch('/api/rss')
      const data = await res.json()
      
      if (data.items && data.items.length > 0) {
        setNews(data.items)
        setLastUpdated(new Date())
      } else if (data.error) {
        setError(data.error)
      }
    } catch (err) {
      setError('Failed to fetch news')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
    
    // Refresh news every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const toggleSpeed = () => {
    const newIndex = (currentSpeedIndex + 1) % speedOptions.length
    setCurrentSpeedIndex(newIndex)
    setSpeed(speedOptions[newIndex].value)
  }

  // Group news by category for display
  const hasAI = news.some(n => n.category === 'ai')
  const hasGeo = news.some(n => n.category === 'geopolitics')
  const hasCyber = news.some(n => n.category === 'cybersecurity')

  if (loading && news.length === 0) {
    return (
      <div className="w-full bg-gray-900 border-b border-gray-700 py-2 text-center text-gray-400">
        <RefreshCw className="w-4 h-4 inline animate-spin mr-2" />
        Loading news feeds...
      </div>
    )
  }

  if (error && news.length === 0) {
    return (
      <div className="w-full bg-red-900/50 border-b border-red-700 py-2 text-center text-red-200">
        <p>⚠️ {error} - Using fallback content</p>
      </div>
    )
  }

  if (news.length === 0) {
    return null
  }

  // Triple the news items for seamless infinite loop
  const extendedNews = [...news, ...news, ...news]

  return (
    <div className="w-full relative">
      {/* Category indicators bar */}
      <div className="bg-gray-900/95 border-b border-gray-700 px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {hasAI && (
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${categoryConfig.ai.badgeColor}`}>
              <Brain className="w-3 h-3" />
              <span className="text-xs font-medium">AI</span>
            </div>
          )}
          {hasGeo && (
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${categoryConfig.geopolitics.badgeColor}`}>
              <Globe className="w-3 h-3" />
              <span className="text-xs font-medium">Geopolitics</span>
            </div>
          )}
          {hasCyber && (
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${categoryConfig.cybersecurity.badgeColor}`}>
              <Shield className="w-3 h-3" />
              <span className="text-xs font-medium">Cybersecurity</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-xs text-gray-500 hidden md:inline">
              Updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={fetchNews}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
            disabled={loading}
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
          >
            {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            {isPaused ? 'Play' : 'Pause'}
          </button>
          <button
            onClick={toggleSpeed}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
          >
            {speedOptions[currentSpeedIndex].icon}
            {speedOptions[currentSpeedIndex].label}
          </button>
        </div>
      </div>

      {/* Main ticker bar */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 py-2.5 overflow-hidden relative">
        {/* Gradient overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-900 via-gray-900/80 to-transparent z-10 pointer-events-none" />

        {/* Scrolling content */}
        <div
          className="flex whitespace-nowrap"
          style={{
            animation: `${isPaused ? 'none' : `marquee ${speed}s linear infinite`}`,
          }}
        >
          {extendedNews.map((item, index) => {
            const config = categoryConfig[item.category] || categoryConfig.general
            return (
              <span
                key={`${item.id}-${index}`}
                className="inline-flex items-center group"
              >
                <span className={`flex items-center gap-2 px-5 ${config.textColor} transition-colors group-hover:text-white`}>
                  <span className={`${config.bgColor} p-1 rounded-md shrink-0`}>
                    {config.icon}
                  </span>
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:text-white transition-colors flex items-center gap-1"
                    >
                      <span className="max-w-xs truncate">{item.title}</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </a>
                  ) : (
                    <span className="font-medium max-w-xs truncate">{item.title}</span>
                  )}
                </span>
                <span className="text-gray-600 text-lg">│</span>
              </span>
            )
          })}
        </div>
      </div>

      {/* Animated glow effect */}
      <div className="h-0.5 bg-gradient-to-r from-purple-500 via-cyan-500 to-orange-500 animate-pulse opacity-50" />

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
      `}</style>
    </div>
  )
}
