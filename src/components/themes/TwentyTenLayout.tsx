'use client'

import { ReactNode } from 'react'
import { ThemeConfig } from '@/lib/themes/config'
import NewsMarquee from '@/components/NewsMarquee'
import { Calendar, Search, Archive, Clock, User, Tag, Folder } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

interface TwentyTenLayoutProps {
  theme: ThemeConfig
  children: ReactNode
  headerImage?: string
  siteTitle?: string
  siteTagline?: string
  recentPosts?: Array<{ title: string; date: string; slug: string }>
  archives?: Array<{ month: string; count: number }>
  categories?: Array<{ name: string; count: number }>
}

export function TwentyTenLayout({
  theme,
  children,
  headerImage,
  siteTitle = 'Twenty Ten',
  siteTagline = 'The default WordPress theme for 2010',
  recentPosts = [],
  archives = [],
  categories = [],
}: TwentyTenLayoutProps) {
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
  const today = new Date().getDate()

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
      {/* Header Image */}
      <div 
        className="relative mx-auto"
        style={{ maxWidth: theme.layout.contentWidth }}
      >
        <img
          src={headerImage || theme.headerImage.default}
          alt={theme.headerImage.alt}
          className="w-full object-cover"
          style={{ height: theme.layout.headerImageHeight }}
        />
        
        {/* Site Title Overlay */}
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/30">
          <h1 
            className="text-4xl font-bold text-white mb-2"
            style={{ fontFamily: 'var(--theme-heading-font)' }}
          >
            {siteTitle}
          </h1>
          <p className="text-white/90 text-lg">{siteTagline}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav 
        className="border-b"
        style={{ 
          backgroundColor: 'var(--theme-surface)',
          borderColor: 'var(--theme-border)',
        }}
      >
        <div 
          className="mx-auto px-4"
          style={{ maxWidth: theme.layout.contentWidth }}
        >
          <ul className="flex items-center gap-6 py-3 text-sm font-medium">
            <li><Link href="/" className="hover:underline" style={{ color: 'var(--theme-link)' }}>Home</Link></li>
            <li><Link href="/about" className="hover:underline" style={{ color: 'var(--theme-link)' }}>About</Link></li>
            <li><Link href="/blog" className="hover:underline" style={{ color: 'var(--theme-link)' }}>Blog</Link></li>
            <li><Link href="/links" className="hover:underline" style={{ color: 'var(--theme-link)' }}>Links</Link></li>
            <li><Link href="/admin" className="hover:underline" style={{ color: 'var(--theme-link)' }}>Admin</Link></li>
          </ul>
        </div>
      </nav>

      {/* Main Content Area */}
      <div 
        className="mx-auto px-4 py-8"
        style={{ maxWidth: theme.layout.contentWidth }}
      >
        <div className="flex gap-8">
          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>

          {/* Right Sidebar */}
          <aside className="w-64 flex-shrink-0 space-y-6">
            {/* Search */}
            <div 
              className="p-4 border rounded"
              style={{ borderColor: 'var(--theme-border)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Search className="w-4 h-4" style={{ color: 'var(--theme-text-muted)' }} />
                <span className="font-semibold text-sm">Search</span>
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-3 py-2 border rounded text-sm"
                style={{ 
                  backgroundColor: 'var(--theme-background)',
                  borderColor: 'var(--theme-border)',
                  color: 'var(--theme-text)',
                }}
              />
            </div>

            {/* Calendar */}
            <div 
              className="p-4 border rounded"
              style={{ borderColor: 'var(--theme-border)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4" style={{ color: 'var(--theme-text-muted)' }} />
                <span className="font-semibold text-sm">{currentMonth}</span>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <div key={i} className="font-medium py-1" style={{ color: 'var(--theme-text-muted)' }}>{d}</div>
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => (
                  <div
                    key={i}
                    className={`py-1 rounded ${i + 1 === today ? 'font-bold' : ''}`}
                    style={{ 
                      backgroundColor: i + 1 === today ? 'var(--theme-accent)' : 'transparent',
                      color: i + 1 === today ? 'white' : 'var(--theme-text)',
                    }}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Posts */}
            {recentPosts.length > 0 && (
              <div 
                className="p-4 border rounded"
                style={{ borderColor: 'var(--theme-border)' }}
              >
                <h3 className="font-semibold text-sm mb-3">Recent Posts</h3>
                <ul className="space-y-2">
                  {recentPosts.map((post, i) => (
                    <li key={i}>
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="text-sm hover:underline"
                        style={{ color: 'var(--theme-link)' }}
                      >
                        {post.title}
                      </Link>
                      <div className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>{post.date}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Archives */}
            <div 
              className="p-4 border rounded"
              style={{ borderColor: 'var(--theme-border)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Archive className="w-4 h-4" style={{ color: 'var(--theme-text-muted)' }} />
                <span className="font-semibold text-sm">Archives</span>
              </div>
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

            {/* Categories */}
            {categories.length > 0 && (
              <div 
                className="p-4 border rounded"
                style={{ borderColor: 'var(--theme-border)' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Folder className="w-4 h-4" style={{ color: 'var(--theme-text-muted)' }} />
                  <span className="font-semibold text-sm">Categories</span>
                </div>
                <ul className="space-y-1 text-sm">
                  {categories.map((cat, i) => (
                    <li key={i}>
                      <Link 
                        href={`/category/${cat.name.toLowerCase()}`}
                        className="hover:underline"
                        style={{ color: 'var(--theme-link)' }}
                      >
                        {cat.name}
                      </Link>
                      <span style={{ color: 'var(--theme-text-muted)' }}> ({cat.count})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
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
          <p>Powered by Next.js • Theme: {theme.name}</p>
        </div>
      </footer>
    </div>
  )
}
