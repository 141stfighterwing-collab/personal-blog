'use client'

import { useEffect, useState } from 'react'
import NewsMarquee from '@/components/NewsMarquee'
import BlogSection from '@/components/BlogSection'
import LinksSection from '@/components/LinksSection'
import { ThemeLayout, ThemeSwitcher } from '@/components/themes'
import { useTheme } from '@/contexts/ThemeContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, Link2, Sparkles } from 'lucide-react'
import Link from 'next/link'

// Sample data for theme components
const sampleRecentPosts = [
  { title: 'Science of a lonely night sky', date: 'March 15, 2024', slug: 'lonely-night-sky' },
  { title: 'Write a new joke', date: 'March 10, 2024', slug: 'new-joke' },
  { title: 'Don\'t stop questioning', date: 'March 5, 2024', slug: 'stop-questioning' },
]

const sampleArchives = [
  { month: 'March 2024', count: 5 },
  { month: 'February 2024', count: 8 },
  { month: 'January 2024', count: 12 },
  { month: 'December 2023', count: 6 },
]

const sampleCategories = [
  { name: 'Technology', count: 15 },
  { name: 'Life', count: 8 },
  { name: 'Travel', count: 5 },
  { name: 'Photography', count: 3 },
]

const sampleFeaturedPosts = [
  { title: 'Featured: Getting Started with AI', excerpt: 'An introduction to artificial intelligence and machine learning concepts for beginners.', slug: 'ai-intro' },
  { title: 'Featured: Web Development Trends 2024', excerpt: 'The latest trends and technologies shaping the future of web development.', slug: 'web-trends-2024' },
]

const sampleTeamMembers = [
  { name: 'John Doe', role: 'Editor', bio: 'Technology enthusiast and writer.' },
  { name: 'Jane Smith', role: 'Contributor', bio: 'Travel blogger and photographer.' },
  { name: 'Mike Johnson', role: 'Developer', bio: 'Full-stack developer and open source contributor.' },
]

export default function Home() {
  const [isSeeded, setIsSeeded] = useState(false)
  const { currentTheme } = useTheme()

  useEffect(() => {
    // Seed the database on first load
    fetch('/api/seed')
      .then((res) => res.json())
      .then(() => setIsSeeded(true))
      .catch(() => setIsSeeded(true))
  }, [])

  // Content that goes inside the theme layout
  const mainContent = (
    <>
      {/* News Ticker at top */}
      <div className="mb-6">
        <NewsMarquee />
      </div>

      {/* User Menu and Theme Switcher */}
      <div className="flex justify-end gap-2 mb-6">
        <ThemeSwitcher />
        <Link 
          href="/login" 
          className="px-4 py-2 text-sm rounded-md border hover:bg-accent transition-colors"
          style={{ 
            borderColor: 'var(--theme-border)',
            color: 'var(--theme-text)',
          }}
        >
          Login
        </Link>
      </div>

      {/* Blog and Links Tabs */}
      <Tabs defaultValue="blog" className="w-full">
        <TabsList 
          className="grid w-full grid-cols-2 mb-8"
          style={{ 
            backgroundColor: 'var(--theme-surface)',
            borderColor: 'var(--theme-border)',
          }}
        >
          <TabsTrigger
            value="blog"
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Blog Posts
          </TabsTrigger>
          <TabsTrigger
            value="links"
            className="flex items-center gap-2"
          >
            <Link2 className="w-4 h-4" />
            Links & Resources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="blog" className="mt-0">
          <Card 
            className="border-0 shadow-none bg-transparent"
            style={{ backgroundColor: 'transparent' }}
          >
            <CardHeader className="px-0 pt-0">
              <CardTitle 
                className="text-xl flex items-center gap-2"
                style={{ 
                  fontFamily: 'var(--theme-heading-font)',
                  color: 'var(--theme-text)',
                }}
              >
                <FileText className="w-5 h-5" style={{ color: 'var(--theme-accent)' }} />
                Latest Posts
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              {isSeeded ? (
                <BlogSection />
              ) : (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div 
                      key={i} 
                      className="animate-pulse rounded-lg h-48"
                      style={{ backgroundColor: 'var(--theme-surface)' }}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links" className="mt-0">
          <Card 
            className="border-0 shadow-none bg-transparent"
            style={{ backgroundColor: 'transparent' }}
          >
            <CardHeader className="px-0 pt-0">
              <CardTitle 
                className="text-xl flex items-center gap-2"
                style={{ 
                  fontFamily: 'var(--theme-heading-font)',
                  color: 'var(--theme-text)',
                }}
              >
                <Link2 className="w-5 h-5" style={{ color: 'var(--theme-accent)' }} />
                My Links
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              {isSeeded ? (
                <LinksSection />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className="animate-pulse rounded-lg h-24"
                      style={{ backgroundColor: 'var(--theme-surface)' }}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )

  return (
    <ThemeLayout
      siteTitle="My Personal Blog"
      siteTagline="Thoughts, projects, and discoveries"
      recentPosts={sampleRecentPosts}
      archives={sampleArchives}
      categories={sampleCategories}
      featuredPosts={sampleFeaturedPosts}
      teamMembers={sampleTeamMembers}
    >
      {mainContent}
    </ThemeLayout>
  )
}
