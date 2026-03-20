'use client'

import { useState } from 'react'
import { Play, ExternalLink, Youtube } from 'lucide-react'

interface VideoEmbedProps {
  url: string
  title?: string
}

/**
 * Extract video ID and platform from URL
 */
function parseVideoUrl(url: string): { platform: string; id: string } | null {
  // YouTube patterns
  const youtubePatterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/,
  ]
  
  for (const pattern of youtubePatterns) {
    const match = url.match(pattern)
    if (match) {
      return { platform: 'youtube', id: match[1] }
    }
  }
  
  // Vimeo pattern
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) {
    return { platform: 'vimeo', id: vimeoMatch[1] }
  }
  
  // TikTok pattern
  const tiktokMatch = url.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/)
  if (tiktokMatch) {
    return { platform: 'tiktok', id: tiktokMatch[1] }
  }
  
  return null
}

/**
 * Get embed URL from video info
 */
function getEmbedUrl(videoInfo: { platform: string; id: string }): string {
  switch (videoInfo.platform) {
    case 'youtube':
      return `https://www.youtube.com/embed/${videoInfo.id}`
    case 'vimeo':
      return `https://player.vimeo.com/video/${videoInfo.id}`
    case 'tiktok':
      return `https://www.tiktok.com/embed/v2/${videoInfo.id}`
    default:
      return ''
  }
}

/**
 * Get thumbnail URL for video
 */
function getThumbnailUrl(videoInfo: { platform: string; id: string }): string {
  switch (videoInfo.platform) {
    case 'youtube':
      return `https://img.youtube.com/vi/${videoInfo.id}/maxresdefault.jpg`
    case 'vimeo':
      // Vimeo requires API call for thumbnail, use placeholder
      return '/logo.svg'
    default:
      return '/logo.svg'
  }
}

export default function VideoEmbed({ url, title }: VideoEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  
  const videoInfo = parseVideoUrl(url)
  
  if (!videoInfo) {
    // Not a recognized video URL, show as link
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
      >
        <ExternalLink className="w-4 h-4" />
        {title || url}
      </a>
    )
  }
  
  const thumbnailUrl = getThumbnailUrl(videoInfo)
  const embedUrl = getEmbedUrl(videoInfo)
  
  // Show thumbnail with play button
  if (!isPlaying) {
    return (
      <div 
        className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-900 cursor-pointer group"
        onClick={() => setIsPlaying(true)}
      >
        {/* Thumbnail */}
        <img
          src={thumbnailUrl}
          alt={title || 'Video thumbnail'}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback if thumbnail fails to load
            e.currentTarget.src = `https://img.youtube.com/vi/${videoInfo.id}/hqdefault.jpg`
          }}
        />
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
          <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
            <Play className="w-8 h-8 text-white ml-1" fill="white" />
          </div>
        </div>
        
        {/* Platform badge */}
        <div className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
          <Youtube className="w-3 h-3" />
          YouTube
        </div>
        
        {/* Title */}
        {title && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <p className="text-white text-sm font-medium truncate">{title}</p>
          </div>
        )}
      </div>
    )
  }
  
  // Show embedded player
  return (
    <div className="relative w-full rounded-lg overflow-hidden bg-black">
      <div className="aspect-video">
        <iframe
          src={embedUrl}
          title={title || 'Embedded video'}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setIsLoaded(true)}
        />
      </div>
      
      {/* External link */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1 transition-colors"
      >
        <ExternalLink className="w-3 h-3" />
        Open
      </a>
    </div>
  )
}

/**
 * Helper function to check if a URL is a video
 */
export function isVideoUrl(url: string): boolean {
  const videoPatterns = [
    /youtube\.com|youtu\.be/,
    /vimeo\.com/,
    /tiktok\.com/,
  ]
  
  return videoPatterns.some(pattern => pattern.test(url))
}

/**
 * Helper to extract YouTube video ID
 */
export function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/,
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }
  
  return null
}
