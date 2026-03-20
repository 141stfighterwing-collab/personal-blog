'use client'

import { useEffect, useState } from 'react'
import NewsMarquee from '@/components/NewsMarquee'
import BlogSection from '@/components/BlogSection'
import LinksSection from '@/components/LinksSection'
import { UserMenu } from '@/components/auth/UserMenu'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, Link2, Sparkles } from 'lucide-react'

export default function Home() {
  const [isSeeded, setIsSeeded] = useState(false)

  useEffect(() => {
    // Seed the database on first load
    fetch('/api/seed')
      .then((res) => res.json())
      .then(() => setIsSeeded(true))
      .catch(() => setIsSeeded(true))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* News Ticker Marquee */}
      <NewsMarquee />

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  My Personal Blog
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Thoughts, projects, and discoveries
                </p>
              </div>
            </div>
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        <Tabs defaultValue="blog" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <TabsTrigger
              value="blog"
              className="flex items-center gap-2 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-emerald-900/30 dark:data-[state=active]:text-emerald-400"
            >
              <FileText className="w-4 h-4" />
              Blog Posts
            </TabsTrigger>
            <TabsTrigger
              value="links"
              className="flex items-center gap-2 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-emerald-900/30 dark:data-[state=active]:text-emerald-400"
            >
              <Link2 className="w-4 h-4" />
              Links & Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="blog" className="mt-0">
            <Card className="border-0 shadow-none bg-transparent">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-500" />
                  Latest Posts
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                {isSeeded ? (
                  <BlogSection />
                ) : (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg h-48" />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="links" className="mt-0">
            <Card className="border-0 shadow-none bg-transparent">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-emerald-500" />
                  My Links
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                {isSeeded ? (
                  <LinksSection />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg h-24" />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Built with Next.js & Markdown •{' '}
            <a
              href="https://github.com/Shootre21"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              View on GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
