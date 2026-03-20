'use client'

import { ReactNode } from 'react'
import { ThemeConfig } from '@/lib/themes/config'
import { Clock, User, Tag, Folder, Users, PenLine } from 'lucide-react'
import Link from 'next/link'

interface TwentyTwelveLayoutProps {
  theme: ThemeConfig
  children: ReactNode
  headerImage?: string
  siteTitle?: string
  siteTagline?: string
  recentPosts?: Array<{ title: string; date: string; slug: string }>
  teamMembers?: Array<{ name: string; role: string; image?: string; bio: string }>
  categories?: Array<{ name: string; count: number }>
}

export function TwentyTwelveLayout({
  theme,
  children,
  headerImage,
  siteTitle = 'Twenty Twelve',
  siteTagline = 'Your favorite theme, updated and published for 2012',
  recentPosts = [],
  teamMembers = [],
  categories = [],
}: TwentyTwelveLayoutProps) {
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
      {/* Header - Centered Style */}
      <header 
        className="border-b"
        style={{ 
          backgroundColor: 'var(--theme-surface)',
          borderColor: 'var(--theme-border)',
        }}
      >
        <div 
          className="mx-auto text-center py-8 px-4"
          style={{ maxWidth: theme.layout.contentWidth }}
        >
          {/* Site Title */}
          <h1 
            className="text-3xl font-normal mb-2"
            style={{ 
              fontFamily: 'var(--theme-heading-font)',
              color: 'var(--theme-primary)',
            }}
          >
            <Link href="/">{siteTitle}</Link>
          </h1>
          <p className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>
            {siteTagline}
          </p>

          {/* Navigation */}
          <nav className="mt-6">
            <ul className="flex items-center justify-center gap-8 text-sm font-medium">
              {['Home', 'About', 'Blog', 'Links', 'Admin'].map((item) => (
                <li key={item}>
                  <Link
                    href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="hover:underline uppercase tracking-wide"
                    style={{ color: 'var(--theme-link)' }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {/* Optional Header Image */}
      {headerImage && (
        <div className="border-b" style={{ borderColor: 'var(--theme-border)' }}>
          <img
            src={headerImage}
            alt={theme.headerImage.alt}
            className="w-full object-cover mx-auto"
            style={{ 
              maxWidth: theme.layout.contentWidth,
              height: theme.layout.headerImageHeight,
            }}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div 
        className="mx-auto px-4 py-8"
        style={{ maxWidth: theme.layout.contentWidth }}
      >
        <div className="flex gap-8">
          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}

            {/* Meet the Team Section */}
            {teamMembers.length > 0 && (
              <section className="mt-12 pt-8 border-t" style={{ borderColor: 'var(--theme-border)' }}>
                <h2 
                  className="text-xl font-normal mb-6"
                  style={{ 
                    fontFamily: 'var(--theme-heading-font)',
                    color: 'var(--theme-primary)',
                  }}
                >
                  <Users className="w-5 h-5 inline mr-2" />
                  Meet the Team
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teamMembers.map((member, i) => (
                    <div key={i} className="flex gap-4">
                      {/* Avatar */}
                      <div 
                        className="w-16 h-16 rounded-full flex-shrink-0 overflow-hidden bg-gray-200"
                        style={{ backgroundColor: 'var(--theme-surface)' }}
                      >
                        {member.image ? (
                          <img 
                            src={member.image} 
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div 
                            className="w-full h-full flex items-center justify-center text-2xl font-bold"
                            style={{ color: 'var(--theme-text-muted)' }}
                          >
                            {member.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      {/* Info */}
                      <div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm" style={{ color: 'var(--theme-accent)' }}>
                          {member.role}
                        </p>
                        <p className="text-sm mt-1" style={{ color: 'var(--theme-text-muted)' }}>
                          {member.bio}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>

          {/* Right Sidebar */}
          <aside className="w-64 flex-shrink-0 space-y-6">
            {/* Recent Posts */}
            {recentPosts.length > 0 && (
              <div>
                <h3 
                  className="text-sm font-normal mb-4 pb-2 border-b"
                  style={{ 
                    borderColor: 'var(--theme-border)',
                    fontFamily: 'var(--theme-heading-font)',
                  }}
                >
                  <PenLine className="w-4 h-4 inline mr-2" />
                  Recent Posts
                </h3>
                <ul className="space-y-3">
                  {recentPosts.map((post, i) => (
                    <li key={i}>
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="text-sm hover:underline"
                        style={{ color: 'var(--theme-link)' }}
                      >
                        {post.title}
                      </Link>
                      <div 
                        className="text-xs flex items-center gap-1 mt-1"
                        style={{ color: 'var(--theme-text-muted)' }}
                      >
                        <Clock className="w-3 h-3" />
                        {post.date}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Categories */}
            {categories.length > 0 && (
              <div>
                <h3 
                  className="text-sm font-normal mb-4 pb-2 border-b"
                  style={{ 
                    borderColor: 'var(--theme-border)',
                    fontFamily: 'var(--theme-heading-font)',
                  }}
                >
                  <Folder className="w-4 h-4 inline mr-2" />
                  Categories
                </h3>
                <ul className="space-y-1 text-sm">
                  {categories.map((cat, i) => (
                    <li key={i} className="flex justify-between">
                      <Link 
                        href={`/category/${cat.name.toLowerCase()}`}
                        className="hover:underline"
                        style={{ color: 'var(--theme-link)' }}
                      >
                        {cat.name}
                      </Link>
                      <span style={{ color: 'var(--theme-text-muted)' }}>{cat.count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* About Widget */}
            <div 
              className="p-4 rounded"
              style={{ backgroundColor: 'var(--theme-surface)' }}
            >
              <h3 
                className="text-sm font-semibold mb-2"
                style={{ fontFamily: 'var(--theme-heading-font)' }}
              >
                About This Site
              </h3>
              <p className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>
                This is a personal blog built with Next.js, featuring classic WordPress-inspired themes.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer 
        className="border-t mt-12 py-8"
        style={{ 
          backgroundColor: 'var(--theme-surface)',
          borderColor: 'var(--theme-border)',
        }}
      >
        <div 
          className="mx-auto px-4"
          style={{ maxWidth: theme.layout.contentWidth }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm" style={{ color: 'var(--theme-text-muted)' }}>
            <p>© {new Date().getFullYear()} {siteTitle}. All rights reserved.</p>
            <p>Theme: {theme.name} • Powered by Next.js</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
