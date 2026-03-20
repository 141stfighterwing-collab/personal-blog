'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, Loader2, Eye } from 'lucide-react'
import PageBuilder from '@/components/page-builder/PageBuilder'
import { useToast } from '@/hooks/use-toast'

export default function CreatePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (data: any) => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        const page = await response.json()
        toast({
          title: 'Page Created',
          description: `Page "${page.title}" has been created successfully.`
        })
        router.push('/admin')
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create page')
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create page',
        variant: 'destructive'
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => router.push('/admin')}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Admin
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Create New Page
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Build a custom page with layered content blocks
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <PageBuilder onSave={handleSave} isSaving={isSaving} />
      </main>
    </div>
  )
}
