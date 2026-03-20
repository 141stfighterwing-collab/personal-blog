'use client'

import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Video } from 'lucide-react'
import VideoEmbed, { isVideoUrl } from '@/components/VideoEmbed'

interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string | null
  slug: string
  videoUrl?: string | null
  createdAt: string
}

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedPost, setExpandedPost] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then((data) => {
        setPosts(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg h-48" />
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-gray-500">
          <p>No blog posts yet. Check back soon!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => {
        const isExpanded = expandedPost === post.id
        const date = new Date(post.createdAt)

        return (
          <Card
            key={post.id}
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-emerald-500"
            onClick={() => setExpandedPost(isExpanded ? null : post.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-4">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-2">
                  {post.title}
                  {post.videoUrl && isVideoUrl(post.videoUrl) && (
                    <Video className="w-5 h-5 text-red-500" />
                  )}
                </CardTitle>
                <Badge variant="secondary" className="shrink-0 bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                  {post.videoUrl && isVideoUrl(post.videoUrl) ? 'Video Post' : 'Blog'}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {date.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {isExpanded ? (
                <div className="space-y-4">
                  {/* Video Embed - shows at top if post has video */}
                  {post.videoUrl && isVideoUrl(post.videoUrl) && (
                    <div className="mb-4">
                      <VideoEmbed url={post.videoUrl} title={post.title} />
                    </div>
                  )}
                  <div className="prose prose-emerald dark:prose-invert max-w-none">
                    <ReactMarkdown
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3">{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mt-4 mb-2">{children}</h3>
                      ),
                      p: ({ children }) => <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1 mb-3">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside text-gray-600 dark:text-gray-400 space-y-1 mb-3">{children}</ol>,
                      code: ({ children, className }) => {
                        const isBlock = className?.includes('language-')
                        return isBlock ? (
                          <code className="block bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-sm overflow-x-auto mb-3">{children}</code>
                        ) : (
                          <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm">{children}</code>
                        )
                      },
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-emerald-500 pl-4 italic text-gray-500 dark:text-gray-400 my-4">{children}</blockquote>
                      ),
                      hr: () => <hr className="my-6 border-gray-200 dark:border-gray-700" />,
                    }}
                  >
                    {post.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  {post.excerpt || post.content.substring(0, 150).replace(/[#*`]/g, '') + '...'}
                </p>
              )}
              <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-3 font-medium">
                {isExpanded ? '← Click to collapse' : 'Click to read more →'}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
