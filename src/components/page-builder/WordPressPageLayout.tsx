'use client'

import ReactMarkdown from 'react-markdown'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  Clock, 
  ArrowLeft,
  Home,
  ChevronRight,
  ExternalLink,
  Quote,
  MousePointerClick,
  Image as ImageIcon
} from 'lucide-react'
import Link from 'next/link'
import VideoEmbed from '@/components/VideoEmbed'

interface PageBlock {
  id: string
  blockType: string
  content: string
  sortOrder: number
}

interface PageData {
  id: string
  title: string
  slug: string
  description?: string | null
  bannerUrl?: string | null
  bannerAlt?: string | null
  showSidebar: boolean
  sidebarMenu?: string | null
  blocks: PageBlock[]
  createdAt: string
  updatedAt: string
}

interface WordPressPageLayoutProps {
  page: PageData
}

export default function WordPressPageLayout({ page }: WordPressPageLayoutProps) {
  const sidebarMenu = page.sidebarMenu ? JSON.parse(page.sidebarMenu) : []
  const sortedBlocks = [...page.blocks].sort((a, b) => a.sortOrder - b.sortOrder)

  const renderBlock = (block: PageBlock) => {
    const content = JSON.parse(block.content || '{}')

    switch (block.blockType) {
      case 'HERO':
        return (
          <div 
            key={block.id}
            className="relative w-full h-[400px] bg-cover bg-center rounded-xl overflow-hidden mb-8"
            style={{ 
              backgroundImage: content.backgroundImage ? `url(${content.backgroundImage})` : undefined,
              backgroundColor: !content.backgroundImage ? '#1e3a5f' : undefined
            }}
          >
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center text-white max-w-3xl px-6">
                <h2 className="text-4xl font-bold mb-4">{content.title || page.title}</h2>
                {content.subtitle && (
                  <p className="text-xl text-gray-200">{content.subtitle}</p>
                )}
              </div>
            </div>
          </div>
        )

      case 'TEXT':
        return (
          <div 
            key={block.id} 
            className={`mb-6 prose prose-lg dark:prose-invert max-w-none ${
              content.align === 'center' ? 'text-center' : 
              content.align === 'right' ? 'text-right' : 'text-left'
            }`}
          >
            <ReactMarkdown>{content.text || ''}</ReactMarkdown>
          </div>
        )

      case 'IMAGE':
        return (
          <div key={block.id} className="mb-8">
            <figure className="my-0">
              {content.url && (
                <img 
                  src={content.url} 
                  alt={content.alt || ''} 
                  className="w-full rounded-xl shadow-lg"
                />
              )}
              {content.caption && (
                <figcaption className="text-center text-sm text-gray-500 mt-2 italic">
                  {content.caption}
                </figcaption>
              )}
            </figure>
          </div>
        )

      case 'GALLERY':
        const images = content.images || []
        const columns = content.columns || 3
        return (
          <div key={block.id} className="mb-8">
            <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-4`}>
              {images.map((img: { url: string; alt: string }, idx: number) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={img.alt || ''}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )

      case 'VIDEO':
        return (
          <div key={block.id} className="mb-8">
            {content.url && <VideoEmbed url={content.url} title={content.caption} />}
            {content.caption && (
              <p className="text-center text-sm text-gray-500 mt-2">{content.caption}</p>
            )}
          </div>
        )

      case 'QUOTE':
        return (
          <div key={block.id} className="mb-8">
            <blockquote className="border-l-4 border-emerald-500 pl-6 py-2 bg-gray-50 dark:bg-gray-800 rounded-r-lg">
              <Quote className="w-8 h-8 text-emerald-500 mb-2" />
              <p className="text-xl italic text-gray-700 dark:text-gray-300">{content.text || ''}</p>
              {content.author && (
                <footer className="mt-2 text-sm text-gray-500">— {content.author}</footer>
              )}
            </blockquote>
          </div>
        )

      case 'DIVIDER':
        return (
          <hr key={block.id} className="my-8 border-gray-200 dark:border-gray-700" />
        )

      case 'COLUMNS':
        const cols = content.columns || []
        return (
          <div key={block.id} className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {cols.map((col: { content: string }, idx: number) => (
              <div key={idx} className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{col.content || ''}</ReactMarkdown>
              </div>
            ))}
          </div>
        )

      case 'SIDEBAR':
        return (
          <div key={block.id} className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            {content.title && <h4 className="font-semibold mb-2">{content.title}</h4>}
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{content.content || ''}</ReactMarkdown>
            </div>
          </div>
        )

      case 'CTA':
        return (
          <div key={block.id} className="mb-8 text-center">
            <Button 
              asChild
              size="lg"
              variant={content.style === 'secondary' ? 'secondary' : content.style === 'outline' ? 'outline' : 'default'}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <a href={content.href || '#'} target="_blank" rel="noopener noreferrer">
                <MousePointerClick className="w-4 h-4 mr-2" />
                {content.text || 'Click Here'}
              </a>
            </Button>
          </div>
        )

      case 'CODE':
        return (
          <div key={block.id} className="mb-8">
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              {content.language && (
                <div className="text-xs text-gray-400 mb-2 uppercase">{content.language}</div>
              )}
              <pre className="text-sm">
                <code>{content.code || ''}</code>
              </pre>
            </div>
          </div>
        )

      case 'EMBED':
        return (
          <div key={block.id} className="mb-8">
            <iframe
              src={content.url}
              width={content.width || '100%'}
              height={content.height || '400px'}
              className="rounded-lg border-0"
              allowFullScreen
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Banner Image */}
      {page.bannerUrl && (
        <div className="relative w-full h-[400px] bg-cover bg-center">
          <img
            src={page.bannerUrl}
            alt={page.bannerAlt || page.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{page.title}</h1>
              {page.description && (
                <p className="text-lg text-gray-200">{page.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar (WordPress Twenty Fifteen Style) */}
          {page.showSidebar && (
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-8 space-y-6">
                {/* Site Info */}
                <Card className="bg-white dark:bg-gray-800">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-2">Personal Blog</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      A modern blog built with Next.js
                    </p>
                  </CardContent>
                </Card>

                {/* Navigation */}
                <Card className="bg-white dark:bg-gray-800">
                  <CardContent className="p-4">
                    <nav className="space-y-1">
                      <Link 
                        href="/"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                      >
                        <Home className="w-4 h-4" />
                        Home
                      </Link>
                      {sidebarMenu.map((item: { label: string; href: string }, idx: number) => (
                        <Link
                          key={idx}
                          href={item.href}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                        >
                          <ChevronRight className="w-4 h-4" />
                          {item.label}
                        </Link>
                      ))}
                    </nav>
                  </CardContent>
                </Card>

                {/* About Section */}
                <Card className="bg-white dark:bg-gray-800">
                  <CardContent className="p-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-gray-500">
                      About
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      This is a personal blog featuring news updates, articles, and resources. 
                      Built with Next.js, TypeScript, and Tailwind CSS.
                    </p>
                  </CardContent>
                </Card>

                {/* Page Date */}
                <div className="text-xs text-gray-400 space-y-1">
                  <p>Created: {new Date(page.createdAt).toLocaleDateString()}</p>
                  <p>Updated: {new Date(page.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </aside>
          )}

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            {/* Title (if no banner) */}
            {!page.bannerUrl && (
              <div className="mb-8">
                <Button variant="ghost" size="sm" asChild className="mb-4">
                  <Link href="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Link>
                </Button>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {page.title}
                </h1>
                {page.description && (
                  <p className="text-lg text-gray-600 dark:text-gray-400">{page.description}</p>
                )}
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(page.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(page.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            )}

            {/* Content Blocks */}
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="p-8">
                {sortedBlocks.map(renderBlock)}

                {sortedBlocks.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No content blocks yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Back Link */}
            <div className="mt-8">
              <Button variant="outline" asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
