'use client'

import { ReactNode } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { TwentyTenLayout } from './TwentyTenLayout'
import { TwentyElevenLayout } from './TwentyElevenLayout'
import { TwentyTwelveLayout } from './TwentyTwelveLayout'

interface ThemeLayoutProps {
  children: ReactNode
  headerImage?: string
  siteTitle?: string
  siteTagline?: string
  recentPosts?: Array<{ title: string; date: string; slug: string }>
  archives?: Array<{ month: string; count: number }>
  categories?: Array<{ name: string; count: number }>
  featuredPosts?: Array<{ title: string; excerpt: string; slug: string }>
  teamMembers?: Array<{ name: string; role: string; image?: string; bio: string }>
}

export function ThemeLayout({
  children,
  headerImage,
  siteTitle,
  siteTagline,
  recentPosts = [],
  archives = [],
  categories = [],
  featuredPosts = [],
  teamMembers = [],
}: ThemeLayoutProps) {
  const { currentTheme } = useTheme()

  const commonProps = {
    theme: currentTheme,
    headerImage,
    siteTitle,
    siteTagline,
  }

  switch (currentTheme.id) {
    case 'twenty-ten':
      return (
        <TwentyTenLayout
          {...commonProps}
          recentPosts={recentPosts}
          archives={archives}
          categories={categories}
        >
          {children}
        </TwentyTenLayout>
      )

    case 'twenty-eleven':
      return (
        <TwentyElevenLayout
          {...commonProps}
          featuredPosts={featuredPosts}
          archives={archives}
        >
          {children}
        </TwentyElevenLayout>
      )

    case 'twenty-twelve':
      return (
        <TwentyTwelveLayout
          {...commonProps}
          recentPosts={recentPosts}
          categories={categories}
          teamMembers={teamMembers}
        >
          {children}
        </TwentyTwelveLayout>
      )

    default:
      return (
        <TwentyTenLayout
          {...commonProps}
          recentPosts={recentPosts}
          archives={archives}
          categories={categories}
        >
          {children}
        </TwentyTenLayout>
      )
  }
}
