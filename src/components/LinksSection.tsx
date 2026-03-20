'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Github, ExternalLink, Newspaper, BookOpen, Link2 } from 'lucide-react'

interface ExternalLink {
  id: string
  title: string
  url: string
  description: string | null
  category: string
}

const categoryIcons: Record<string, React.ReactNode> = {
  github: <Github className="h-5 w-5" />,
  blog: <BookOpen className="h-5 w-5" />,
  news: <Newspaper className="h-5 w-5" />,
  other: <Link2 className="h-5 w-5" />,
}

const categoryColors: Record<string, string> = {
  github: 'bg-gray-900 text-white hover:bg-gray-800',
  blog: 'bg-purple-500 text-white hover:bg-purple-600',
  news: 'bg-orange-500 text-white hover:bg-orange-600',
  other: 'bg-gray-500 text-white hover:bg-gray-600',
}

const categoryBadgeColors: Record<string, string> = {
  github: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  blog: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  news: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  other: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
}

export default function LinksSection() {
  const [links, setLinks] = useState<ExternalLink[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/links')
      .then((res) => res.json())
      .then((data) => {
        setLinks(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg h-24" />
        ))}
      </div>
    )
  }

  if (links.length === 0) {
    return null
  }

  // Group links by category
  const groupedLinks = links.reduce(
    (acc, link) => {
      const category = link.category || 'other'
      if (!acc[category]) acc[category] = []
      acc[category].push(link)
      return acc
    },
    {} as Record<string, ExternalLink[]>
  )

  return (
    <div className="space-y-6">
      {Object.entries(groupedLinks).map(([category, categoryLinks]) => (
        <div key={category}>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2 capitalize">
            {categoryIcons[category]}
            {category === 'github' ? 'GitHub' : category === 'blog' ? 'My Blogs' : category === 'news' ? 'News Sites' : 'Other Links'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="h-full hover:shadow-md transition-all duration-200 hover:border-emerald-300 dark:hover:border-emerald-700">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                            {link.title}
                          </h4>
                          <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-emerald-500 transition-colors shrink-0" />
                        </div>
                        {link.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                            {link.description}
                          </p>
                        )}
                      </div>
                      <Badge className={`shrink-0 ${categoryBadgeColors[category]}`}>
                        {category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
