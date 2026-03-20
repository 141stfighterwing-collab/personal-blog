'use client'

import { ReactNode } from 'react'
import { ThemeConfig } from '@/lib/themes/config'
import { Search, Archive, Star, ChevronRight, Clock } from 'lucide-react'
import Link from 'next/link'

interface TwentyElevenLayoutProps {
  theme: ThemeConfig
  children: ReactNode
  headerImage?: string
  siteTitle?: string
  siteTagline?: string
  featuredPosts?: Array<{ title: string; excerpt: string; slug: string }>
  archives?: Array<{ month: string; count: number }>
}

export function TwentyElevenLayout({
  theme,
  children,
  headerImage,
  siteTitle = 'Twenty Eleven',
  siteTagline = 'A sophisticated theme for WordPress',
  featuredPosts = [],
  archives = [],
}: TwentyElevenLayoutProps) {
  return (
    <div 
      className="min-h-screen transition-colors duration-300"
      style={{ 
        backgroundColor: 'var(--theme-background)',
        color: 'var(--theme-text)',
        fontFamily: 'var(--theme-body-font)',
        fontSize: 'var(--theme-body-size)',
        lineHeight: 'var(--theme-line-height)',
      }}
    >
      {/* Header */}
      <header 
        className="relative"
        style={{ backgroundColor: 'var(--theme-surface)' }}
      >
        <div 
          className="mx-auto"
          style={{ maxWidth: theme.layout.contentWidth }}
        >
          {/* Top Bar with Search */}
          <div className="flex justify-end py-2 px-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search..."
                className="px-3 py-1 border rounded text-sm w-48"
                style={{ 
                  backgroundColor: 'var(--theme-background)',
                  borderColor: 'var(--theme-border)',
                  color: 'var(--theme-text)',
                }}
              />
              <button
                className="p-1.5 rounded"
                style={{ color: 'var(--theme-text-muted)' }}
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Header Image */}
          <div className="relative">
            <img
              src={headerImage || theme.headerImage.default}
              alt={theme.headerImage.alt}
              className="w-full object-cover"
              style={{ height: theme.layout.headerImageHeight }}
            />
            
            {/* Site Title Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/50 to-transparent">
              <h1 
                className="text-3xl font-bold text-white"
                style={{ fontFamily: 'var(--theme-heading-font)' }}
              >
                {siteTitle}
              </h1>
              <p className="text-white/80 text-lg">{siteTagline}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="border-t border-b px-4" style={{ borderColor: 'var(--theme-border)' }}>
            <ul className="flex items-center gap-1 py-0">
              {['Showcase', 'Home', 'About', 'Blog', 'Links', 'Admin'].map((item) => (
                <li key={item}>
                  <Link
                    href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="block px-4 py-3 text-sm font-medium transition-colors hover:bg-accent/10"
                    style={{ color: 'var(--theme-text)' }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <div 
        className="mx-auto px-4 py-8"
        style={{ maxWidth: theme.layout.contentWidth }}
      >
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <aside className="w-48 flex-shrink-0 space-y-6">
            {/* Archives */}
            <div>
              <h3 
                className="text-xs font-bold uppercase tracking-wider mb-3 pb-2 border-b"
                style={{ 
                  borderColor: 'var(--theme-border)',
                  color: 'var(--theme-text-muted)',
                }}
              >
                ARCHIVES
              </h3>
              <ul className="space-y-1 text-sm">
                {archives.map((archive, i) => (
                  <li key={i}>
                    <Link 
                      href={`/archive/${archive.month.toLowerCase().replace(' ', '-')}`}
                      className="hover:underline"
                      style={{ color: 'var(--theme-link)' }}
                    >
                      {archive.month}
                    </Link>
                    <span style={{ color: 'var(--theme-text-muted)' }}> ({archive.count})</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Meta */}
            <div>
              <h3 
                className="text-xs font-bold uppercase tracking-wider mb-3 pb-2 border-b"
                style={{ 
                  borderColor: 'var(--theme-border)',
                  color: 'var(--theme-text-muted)',
                }}
              >
                META
              </h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link 
                    href="/admin"
                    className="hover:underline"
                    style={{ color: 'var(--theme-link)' }}
                  >
                    Site Admin
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/login"
                    className="hover:underline"
                    style={{ color: 'var(--theme-link)' }}
                  >
                    Log in
                  </Link>
                </li>
              </ul>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Featured Posts Section */}
            {featuredPosts.length > 0 && (
              <section className="mb-8">
                <h2 
                  className="text-xl font-semibold mb-4 pb-2 border-b"
                  style={{ 
                    fontFamily: 'var(--theme-heading-font)',
                    borderColor: 'var(--theme-border)',
                  }}
                >
                  <Star className="w-5 h-5 inline mr-2" style={{ color: 'var(--theme-accent)' }} />
                  Featured Posts
                </h2>
                <div className="grid gap-4">
                  {featuredPosts.map((post, i) => (
                    <article
                      key={i}
                      className="p-4 rounded shadow-sm"
                      style={{ 
                        backgroundColor: 'var(--theme-surface)',
                        boxShadow: theme.layout.cardStyle === 'shadow' ? '0 1px 3px rgba(0,0,0,0.1)' : undefined,
                      }}
                    >
                      <h3 className="font-semibold mb-2">
                        <Link 
                          href={`/blog/${post.slug}`}
                          className="hover:underline"
                          style={{ color: 'var(--theme-link)' }}
                        >
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>
                        {post.excerpt}
                      </p>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1 text-sm mt-2 hover:underline"
                        style={{ color: 'var(--theme-link)' }}
                      >
                        Read more <ChevronRight className="w-3 h-3" />
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Main Content */}
            {children}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer 
        className="border-t mt-12 py-6"
        style={{ 
          backgroundColor: 'var(--theme-surface)',
          borderColor: 'var(--theme-border)',
        }}
      >
        <div 
          className="mx-auto px-4 text-center text-sm"
          style={{ 
            maxWidth: theme.layout.contentWidth,
            color: 'var(--theme-text-muted)',
          }}
        >
          <p>Proudly powered by Next.js • Theme: {theme.name}</p>
        </div>
      </footer>
    </div>
  )
}
