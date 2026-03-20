'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ThemeId, ThemeConfig, getTheme, themes } from '@/lib/themes/config'

interface ThemeContextType {
  currentTheme: ThemeConfig
  themeId: ThemeId
  setTheme: (themeId: ThemeId) => void
  isDarkMode: boolean
  toggleDarkMode: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const THEME_STORAGE_KEY = 'blog-theme-id'
const DARK_MODE_KEY = 'blog-dark-mode'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>('twenty-ten')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Load theme from localStorage
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId | null
    if (savedTheme && themes[savedTheme]) {
      setThemeId(savedTheme)
    }

    // Load dark mode preference
    const savedDarkMode = localStorage.getItem(DARK_MODE_KEY)
    if (savedDarkMode !== null) {
      setIsDarkMode(savedDarkMode === 'true')
    } else {
      // Check system preference
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
  }, [])

  const setTheme = (newThemeId: ThemeId) => {
    setThemeId(newThemeId)
    localStorage.setItem(THEME_STORAGE_KEY, newThemeId)
  }

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newValue = !prev
      localStorage.setItem(DARK_MODE_KEY, String(newValue))
      return newValue
    })
  }

  const currentTheme = getTheme(themeId)

  // Apply CSS variables for theme
  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    const theme = currentTheme

    root.style.setProperty('--theme-primary', theme.colors.primary)
    root.style.setProperty('--theme-secondary', theme.colors.secondary)
    root.style.setProperty('--theme-accent', theme.colors.accent)
    root.style.setProperty('--theme-background', theme.colors.background)
    root.style.setProperty('--theme-surface', theme.colors.surface)
    root.style.setProperty('--theme-text', theme.colors.text)
    root.style.setProperty('--theme-text-muted', theme.colors.textMuted)
    root.style.setProperty('--theme-border', theme.colors.border)
    root.style.setProperty('--theme-link', theme.colors.link)
    root.style.setProperty('--theme-link-hover', theme.colors.linkHover)

    // Typography
    root.style.setProperty('--theme-heading-font', theme.typography.headingFont)
    root.style.setProperty('--theme-body-font', theme.typography.bodyFont)
    root.style.setProperty('--theme-body-size', theme.typography.bodySize)
    root.style.setProperty('--theme-line-height', theme.typography.lineHeight)

    // Layout
    root.style.setProperty('--theme-content-width', theme.layout.contentWidth)
    root.style.setProperty('--theme-header-image-height', theme.layout.headerImageHeight)

    // Dark mode adjustments
    if (isDarkMode) {
      root.style.setProperty('--theme-background', '#1a1a1a')
      root.style.setProperty('--theme-surface', '#2a2a2a')
      root.style.setProperty('--theme-text', '#e5e5e5')
      root.style.setProperty('--theme-text-muted', '#a0a0a0')
      root.style.setProperty('--theme-border', '#404040')
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [currentTheme, isDarkMode, mounted])

  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ currentTheme, themeId, setTheme, isDarkMode, toggleDarkMode }}>
        {children}
      </ThemeContext.Provider>
    )
  }

  return (
    <ThemeContext.Provider value={{ currentTheme, themeId, setTheme, isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
