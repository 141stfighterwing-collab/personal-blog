'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { themeList } from '@/lib/themes/config'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Palette, Moon, Sun, Check } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import Image from 'next/image'
import { cn } from '@/lib/utils'

// Theme preview images
const themePreviews: Record<string, string> = {
  'twenty-ten': '/themes/twenty-ten-screenshot.png',
  'twenty-eleven': '/themes/twenty-eleven-screenshot.png',
  'twenty-twelve': '/themes/twenty-twelve-screenshot.png',
}

export function ThemeSwitcher() {
  const { themeId, setTheme, isDarkMode, toggleDarkMode } = useTheme()

  return (
    <div className="flex items-center gap-2">
      {/* Theme Selector Dropdown */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Theme</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Choose Your Theme</DialogTitle>
            <DialogDescription>
              Select from classic WordPress-inspired themes with distinct layouts and styles
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {themeList.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className={cn(
                  "relative rounded-lg border-2 text-left transition-all overflow-hidden group",
                  themeId === theme.id 
                    ? "border-primary ring-2 ring-primary/20" 
                    : "border-border hover:border-primary/50"
                )}
              >
                {/* Preview Image */}
                <div className="aspect-video relative overflow-hidden bg-muted">
                  <Image
                    src={themePreviews[theme.id]}
                    alt={`${theme.name} preview`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {themeId === theme.id && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
                
                {/* Info */}
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{theme.name}</span>
                    <span className="text-xs text-muted-foreground">{theme.year}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {theme.description}
                  </p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {theme.features.hasCalendar && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-muted">Calendar</span>
                    )}
                    {theme.features.hasFeaturedPosts && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-muted">Featured</span>
                    )}
                    {theme.features.hasTeamSection && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-muted">Team</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dark Mode Toggle */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleDarkMode}
        className="w-9 h-9"
        title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </Button>
    </div>
  )
}

export function ThemeSelectorPanel() {
  const { themeId, setTheme, isDarkMode, toggleDarkMode } = useTheme()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Theme Settings
        </CardTitle>
        <CardDescription>
          Choose from classic WordPress-inspired themes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Theme Grid with Previews */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {themeList.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setTheme(theme.id)}
              className={cn(
                "relative rounded-lg border-2 text-left transition-all overflow-hidden group",
                themeId === theme.id 
                  ? "border-primary ring-2 ring-primary/20" 
                  : "border-border hover:border-primary/50"
              )}
            >
              {/* Preview Image */}
              <div className="aspect-video relative overflow-hidden bg-muted">
                <Image
                  src={themePreviews[theme.id]}
                  alt={`${theme.name} preview`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {themeId === theme.id && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
              
              {/* Info */}
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{theme.name}</span>
                  <span className="text-xs text-muted-foreground">{theme.year}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {theme.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div>
            <div className="font-medium text-sm">Dark Mode</div>
            <div className="text-xs text-muted-foreground">Toggle dark/light appearance</div>
          </div>
          <Button
            variant={isDarkMode ? "default" : "outline"}
            size="sm"
            onClick={toggleDarkMode}
            className="gap-2"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {isDarkMode ? 'Light' : 'Dark'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
