'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Shield, 
  FileText, 
  Newspaper, 
  Link2, 
  Users, 
  Plus, 
  Edit, 
  Trash2,
  ArrowLeft,
  Loader2,
  Video,
  X,
  Youtube
} from 'lucide-react'
import { getRoleDisplayName, getRoleBadgeColor, canCreate, canDelete } from '@/lib/permissions'
import { useToast } from '@/hooks/use-toast'

interface Stats {
  posts: number
  news: number
  links: number
}

interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string | null
  slug: string
  videoUrl: string | null
  published: boolean
  createdAt: string
}

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [stats, setStats] = useState<Stats>({ posts: 0, news: 0, links: 0 })
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    videoUrl: '',
    published: true,
  })

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'ADMIN')) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, user, router])

  useEffect(() => {
    // Fetch stats and posts
    Promise.all([
      fetch('/api/posts').then(r => r.json()),
      fetch('/api/news').then(r => r.json()),
      fetch('/api/links').then(r => r.json()),
    ]).then(([postsData, news, links]) => {
      setPosts(postsData || [])
      setStats({
        posts: postsData?.length || 0,
        news: news?.length || 0,
        links: links?.length || 0,
      })
    })
  }, [])

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      videoUrl: '',
      published: true,
    })
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const slug = generateSlug(formData.title)
      
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt || formData.content.substring(0, 150),
          slug,
          videoUrl: formData.videoUrl || null,
          published: formData.published,
        }),
      })

      if (response.ok) {
        const newPost = await response.json()
        setPosts([newPost, ...posts])
        setStats(prev => ({ ...prev, posts: prev.posts + 1 }))
        setIsCreateDialogOpen(false)
        resetForm()
        toast({
          title: 'Post Created',
          description: 'Your blog post has been created successfully.',
        })
      } else {
        throw new Error('Failed to create post')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create post. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return
    
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setPosts(posts.filter(p => p.id !== postId))
        setStats(prev => ({ ...prev, posts: prev.posts - 1 }))
        toast({
          title: 'Post Deleted',
          description: 'The post has been removed.',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete post.',
        variant: 'destructive',
      })
    }
  }

  if (isLoading || !isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => router.push('/')}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Site
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Admin Dashboard
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Manage your blog content
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`${getRoleBadgeColor(user.role)} border`}>
                <Shield className="w-3 h-3 mr-1" />
                {getRoleDisplayName(user.role)}
              </Badge>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {user.name || user.username}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Blog Posts
              </CardTitle>
              <FileText className="w-5 h-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {stats.posts}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Published articles
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                News Items
              </CardTitle>
              <Newspaper className="w-5 h-5 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {stats.news}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Active headlines
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                External Links
              </CardTitle>
              <Link2 className="w-5 h-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {stats.links}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Resource links
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Manage your blog content and settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Card className="border-dashed hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors cursor-pointer">
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Plus className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">New Post</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Create a blog post</p>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-purple-500" />
                      Create New Blog Post
                    </DialogTitle>
                    <DialogDescription>
                      Fill in the details below to create a new blog post. Supports markdown formatting.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        placeholder="Enter post title..."
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="content">Content (Markdown) *</Label>
                      <Textarea
                        id="content"
                        placeholder="Write your post content in markdown..."
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        className="min-h-[200px] font-mono"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="excerpt">Excerpt (optional)</Label>
                      <Textarea
                        id="excerpt"
                        placeholder="Short description for preview..."
                        value={formData.excerpt}
                        onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                        className="min-h-[80px]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="videoUrl" className="flex items-center gap-2">
                        <Youtube className="w-4 h-4 text-red-500" />
                        Video URL (optional)
                      </Label>
                      <Input
                        id="videoUrl"
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={formData.videoUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                      />
                      <p className="text-xs text-gray-500">
                        Supports YouTube, Vimeo, and TikTok URLs
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="published" className="flex items-center gap-2">
                        Publish immediately
                      </Label>
                      <Switch
                        id="published"
                        checked={formData.published}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsCreateDialogOpen(false)
                          resetForm()
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting || !formData.title || !formData.content}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Post
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              <Card className="border-dashed hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors cursor-pointer">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <Newspaper className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Add News</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Add ticker item</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dashed hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors cursor-pointer">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <Link2 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Add Link</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">External resource</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dashed hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors cursor-pointer">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Manage Users</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">User accounts</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Posts List */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
            <CardDescription>
              Manage your existing blog posts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {posts.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No posts yet. Create your first post above!
              </p>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {post.videoUrl ? (
                        <div className="w-10 h-10 rounded bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <Video className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{post.title}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Badge 
                            variant="outline" 
                            className={post.published 
                              ? "border-green-500 text-green-600" 
                              : "border-yellow-500 text-yellow-600"
                            }
                          >
                            {post.published ? 'Published' : 'Draft'}
                          </Badge>
                          {post.videoUrl && (
                            <Badge variant="outline" className="border-red-500 text-red-600">
                              <Youtube className="w-3 h-3 mr-1" />
                              Video
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Permissions Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-500" />
              Your Permissions
            </CardTitle>
            <CardDescription>
              What you can do as {getRoleDisplayName(user.role)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                {canCreate(user.role as any, 'blog') ? (
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <Plus className="w-3 h-3 mr-1" /> Create
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="opacity-50">No Create</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {<Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  <Edit className="w-3 h-3 mr-1" /> Edit
                </Badge>}
              </div>
              <div className="flex items-center gap-2">
                {canDelete(user.role as any, 'blog') ? (
                  <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    <Trash2 className="w-3 h-3 mr-1" /> Delete
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="opacity-50">No Delete</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                  <Users className="w-3 h-3 mr-1" /> Manage Users
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
