'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  GripVertical, 
  Plus, 
  Trash2, 
  Type, 
  Image as ImageIcon, 
  Video, 
  Quote, 
  Minus,
  Columns,
  SidebarOpen,
  MousePointerClick,
  Code,
  Layout,
  ExternalLink,
  ChevronUp,
  ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type BlockType = 
  | 'HERO' 
  | 'TEXT' 
  | 'IMAGE' 
  | 'GALLERY' 
  | 'VIDEO' 
  | 'QUOTE' 
  | 'DIVIDER' 
  | 'COLUMNS' 
  | 'SIDEBAR' 
  | 'CTA' 
  | 'CODE' 
  | 'EMBED'

export interface PageBlock {
  id: string
  blockType: BlockType
  content: string // JSON string
  sortOrder: number
}

export interface PageData {
  title: string
  slug: string
  description: string
  bannerUrl: string
  bannerAlt: string
  showSidebar: boolean
  sidebarMenu: { label: string; href: string }[]
  blocks: PageBlock[]
}

interface BlockConfig {
  type: BlockType
  name: string
  icon: React.ReactNode
  description: string
}

const BLOCK_CONFIGS: BlockConfig[] = [
  { type: 'HERO', name: 'Hero Banner', icon: <Layout className="w-4 h-4" />, description: 'Full-width banner with title' },
  { type: 'TEXT', name: 'Text Block', icon: <Type className="w-4 h-4" />, description: 'Rich text paragraph' },
  { type: 'IMAGE', name: 'Image', icon: <ImageIcon className="w-4 h-4" />, description: 'Single image with caption' },
  { type: 'GALLERY', name: 'Gallery', icon: <Columns className="w-4 h-4" />, description: 'Multiple images grid' },
  { type: 'VIDEO', name: 'Video', icon: <Video className="w-4 h-4" />, description: 'Video embed' },
  { type: 'QUOTE', name: 'Quote', icon: <Quote className="w-4 h-4" />, description: 'Blockquote' },
  { type: 'DIVIDER', name: 'Divider', icon: <Minus className="w-4 h-4" />, description: 'Horizontal rule' },
  { type: 'COLUMNS', name: 'Columns', icon: <Columns className="w-4 h-4" />, description: 'Multi-column layout' },
  { type: 'SIDEBAR', name: 'Sidebar Content', icon: <SidebarOpen className="w-4 h-4" />, description: 'Sidebar widget' },
  { type: 'CTA', name: 'Call to Action', icon: <MousePointerClick className="w-4 h-4" />, description: 'CTA button' },
  { type: 'CODE', name: 'Code Block', icon: <Code className="w-4 h-4" />, description: 'Code snippet' },
  { type: 'EMBED', name: 'Embed', icon: <ExternalLink className="w-4 h-4" />, description: 'Custom embed (iframe)' },
]

interface PageBuilderProps {
  initialData?: Partial<PageData>
  onSave: (data: PageData) => Promise<void>
  isSaving?: boolean
}

export default function PageBuilder({ initialData, onSave, isSaving }: PageBuilderProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [bannerUrl, setBannerUrl] = useState(initialData?.bannerUrl || '')
  const [bannerAlt, setBannerAlt] = useState(initialData?.bannerAlt || '')
  const [showSidebar, setShowSidebar] = useState(initialData?.showSidebar ?? true)
  const [sidebarMenu, setSidebarMenu] = useState<{ label: string; href: string }[]>(initialData?.sidebarMenu || [])
  const [blocks, setBlocks] = useState<PageBlock[]>(initialData?.blocks || [])
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null)
  const [showBlockPicker, setShowBlockPicker] = useState(false)

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(value))
    }
  }

  const addBlock = (type: BlockType) => {
    const newBlock: PageBlock = {
      id: `block-${Date.now()}`,
      blockType: type,
      content: getDefaultContent(type),
      sortOrder: blocks.length,
    }
    setBlocks([...blocks, newBlock])
    setShowBlockPicker(false)
    setSelectedBlock(newBlock.id)
  }

  const getDefaultContent = (type: BlockType): string => {
    switch (type) {
      case 'HERO':
        return JSON.stringify({ title: '', subtitle: '', backgroundImage: '' })
      case 'TEXT':
        return JSON.stringify({ text: '', align: 'left' })
      case 'IMAGE':
        return JSON.stringify({ url: '', alt: '', caption: '' })
      case 'GALLERY':
        return JSON.stringify({ images: [], columns: 3 })
      case 'VIDEO':
        return JSON.stringify({ url: '', caption: '' })
      case 'QUOTE':
        return JSON.stringify({ text: '', author: '' })
      case 'DIVIDER':
        return JSON.stringify({ style: 'solid' })
      case 'COLUMNS':
        return JSON.stringify({ columns: [{ content: '' }, { content: '' }], layout: '50-50' })
      case 'SIDEBAR':
        return JSON.stringify({ title: '', content: '' })
      case 'CTA':
        return JSON.stringify({ text: '', href: '', style: 'primary' })
      case 'CODE':
        return JSON.stringify({ code: '', language: 'javascript', showLineNumbers: true })
      case 'EMBED':
        return JSON.stringify({ url: '', width: '100%', height: '400px' })
      default:
        return '{}'
    }
  }

  const updateBlock = (blockId: string, content: string) => {
    setBlocks(blocks.map(b => 
      b.id === blockId ? { ...b, content } : b
    ))
  }

  const deleteBlock = (blockId: string) => {
    setBlocks(blocks.filter(b => b.id !== blockId).map((b, i) => ({ ...b, sortOrder: i })))
    if (selectedBlock === blockId) setSelectedBlock(null)
  }

  const moveBlock = (blockId: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(b => b.id === blockId)
    if (index === -1) return
    
    const newBlocks = [...blocks]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex < 0 || targetIndex >= blocks.length) return
    
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]]
    setBlocks(newBlocks.map((b, i) => ({ ...b, sortOrder: i })))
  }

  const handleSave = async () => {
    await onSave({
      title,
      slug,
      description,
      bannerUrl,
      bannerAlt,
      showSidebar,
      sidebarMenu,
      blocks: blocks.map((b, i) => ({ ...b, sortOrder: i })),
    })
  }

  const renderBlockEditor = (block: PageBlock) => {
    const content = JSON.parse(block.content || '{}')

    switch (block.blockType) {
      case 'TEXT':
        return (
          <div className="space-y-3">
            <Textarea
              placeholder="Enter your text content..."
              value={content.text || ''}
              onChange={(e) => updateBlock(block.id, JSON.stringify({ ...content, text: e.target.value }))}
              className="min-h-[150px]"
            />
            <div className="flex gap-2">
              <Label className="text-xs">Alignment:</Label>
              {['left', 'center', 'right'].map(align => (
                <Button
                  key={align}
                  variant={content.align === align ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateBlock(block.id, JSON.stringify({ ...content, align }))}
                  className="text-xs capitalize"
                >
                  {align}
                </Button>
              ))}
            </div>
          </div>
        )

      case 'IMAGE':
        return (
          <div className="space-y-3">
            <Input
              placeholder="Image URL..."
              value={content.url || ''}
              onChange={(e) => updateBlock(block.id, JSON.stringify({ ...content, url: e.target.value }))}
            />
            <Input
              placeholder="Alt text..."
              value={content.alt || ''}
              onChange={(e) => updateBlock(block.id, JSON.stringify({ ...content, alt: e.target.value }))}
            />
            <Input
              placeholder="Caption (optional)..."
              value={content.caption || ''}
              onChange={(e) => updateBlock(block.id, JSON.stringify({ ...content, caption: e.target.value }))}
            />
            {content.url && (
              <img src={content.url} alt={content.alt} className="w-full rounded-lg max-h-48 object-cover" />
            )}
          </div>
        )

      case 'VIDEO':
        return (
          <div className="space-y-3">
            <Input
              placeholder="Video URL (YouTube, Vimeo, etc.)..."
              value={content.url || ''}
              onChange={(e) => updateBlock(block.id, JSON.stringify({ ...content, url: e.target.value }))}
            />
            <Input
              placeholder="Caption (optional)..."
              value={content.caption || ''}
              onChange={(e) => updateBlock(block.id, JSON.stringify({ ...content, caption: e.target.value }))}
            />
          </div>
        )

      case 'QUOTE':
        return (
          <div className="space-y-3">
            <Textarea
              placeholder="Quote text..."
              value={content.text || ''}
              onChange={(e) => updateBlock(block.id, JSON.stringify({ ...content, text: e.target.value }))}
              className="min-h-[80px]"
            />
            <Input
              placeholder="Author (optional)..."
              value={content.author || ''}
              onChange={(e) => updateBlock(block.id, JSON.stringify({ ...content, author: e.target.value }))}
            />
          </div>
        )

      case 'CTA':
        return (
          <div className="space-y-3">
            <Input
              placeholder="Button text..."
              value={content.text || ''}
              onChange={(e) => updateBlock(block.id, JSON.stringify({ ...content, text: e.target.value }))}
            />
            <Input
              placeholder="Link URL..."
              value={content.href || ''}
              onChange={(e) => updateBlock(block.id, JSON.stringify({ ...content, href: e.target.value }))}
            />
            <div className="flex gap-2">
              <Label className="text-xs">Style:</Label>
              {['primary', 'secondary', 'outline'].map(style => (
                <Button
                  key={style}
                  variant={content.style === style ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateBlock(block.id, JSON.stringify({ ...content, style }))}
                  className="text-xs capitalize"
                >
                  {style}
                </Button>
              ))}
            </div>
          </div>
        )

      case 'HERO':
        return (
          <div className="space-y-3">
            <Input
              placeholder="Hero title..."
              value={content.title || ''}
              onChange={(e) => updateBlock(block.id, JSON.stringify({ ...content, title: e.target.value }))}
            />
            <Input
              placeholder="Subtitle..."
              value={content.subtitle || ''}
              onChange={(e) => updateBlock(block.id, JSON.stringify({ ...content, subtitle: e.target.value }))}
            />
            <Input
              placeholder="Background image URL..."
              value={content.backgroundImage || ''}
              onChange={(e) => updateBlock(block.id, JSON.stringify({ ...content, backgroundImage: e.target.value }))}
            />
          </div>
        )

      case 'CODE':
        return (
          <div className="space-y-3">
            <Input
              placeholder="Language (e.g., javascript, python)..."
              value={content.language || 'javascript'}
              onChange={(e) => updateBlock(block.id, JSON.stringify({ ...content, language: e.target.value }))}
            />
            <Textarea
              placeholder="Code..."
              value={content.code || ''}
              onChange={(e) => updateBlock(block.id, JSON.stringify({ ...content, code: e.target.value }))}
              className="min-h-[150px] font-mono text-sm"
            />
          </div>
        )

      case 'EMBED':
        return (
          <div className="space-y-3">
            <Input
              placeholder="Embed URL..."
              value={content.url || ''}
              onChange={(e) => updateBlock(block.id, JSON.stringify({ ...content, url: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Width..."
                value={content.width || '100%'}
                onChange={(e) => updateBlock(block.id, JSON.stringify({ ...content, width: e.target.value }))}
              />
              <Input
                placeholder="Height..."
                value={content.height || '400px'}
                onChange={(e) => updateBlock(block.id, JSON.stringify({ ...content, height: e.target.value }))}
              />
            </div>
          </div>
        )

      default:
        return (
          <p className="text-sm text-gray-500">
            Editor for {block.blockType} blocks coming soon...
          </p>
        )
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Editor */}
      <div className="lg:col-span-2 space-y-4">
        {/* Page Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Page Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Page Title</Label>
              <Input
                placeholder="Enter page title..."
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Slug (URL)</Label>
              <Input
                placeholder="page-url-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Meta Description</Label>
              <Textarea
                placeholder="Brief description for SEO..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Banner Image */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Banner Image
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Banner Image URL</Label>
              <Input
                placeholder="https://images.unsplash.com/..."
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Use free images from Unsplash, Pexels, or Pixabay
              </p>
            </div>
            <div className="space-y-2">
              <Label>Alt Text</Label>
              <Input
                placeholder="Describe the image..."
                value={bannerAlt}
                onChange={(e) => setBannerAlt(e.target.value)}
              />
            </div>
            {bannerUrl && (
              <img 
                src={bannerUrl} 
                alt={bannerAlt} 
                className="w-full h-48 object-cover rounded-lg" 
              />
            )}
          </CardContent>
        </Card>

        {/* Content Blocks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Content Blocks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {blocks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No content blocks yet. Click "Add Block" to start building your page.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {blocks.map((block, index) => {
                  const config = BLOCK_CONFIGS.find(c => c.type === block.blockType)
                  const isSelected = selectedBlock === block.id

                  return (
                    <div
                      key={block.id}
                      className={cn(
                        "border rounded-lg transition-all",
                        isSelected ? "border-emerald-500 ring-2 ring-emerald-500/20" : "border-gray-200 dark:border-gray-700"
                      )}
                    >
                      {/* Block Header */}
                      <div 
                        className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 cursor-pointer rounded-t-lg"
                        onClick={() => setSelectedBlock(isSelected ? null : block.id)}
                      >
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        <Badge variant="outline" className="gap-1">
                          {config?.icon}
                          {config?.name}
                        </Badge>
                        <span className="text-xs text-gray-500 ml-auto">Block {index + 1}</span>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'up'); }}
                            disabled={index === 0}
                          >
                            <ChevronUp className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'down'); }}
                            disabled={index === blocks.length - 1}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500 hover:text-red-600"
                            onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Block Editor */}
                      {isSelected && (
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                          {renderBlockEditor(block)}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Add Block Button */}
            {showBlockPicker ? (
              <div className="grid grid-cols-3 gap-2 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                {BLOCK_CONFIGS.map(config => (
                  <Button
                    key={config.type}
                    variant="outline"
                    className="h-auto py-3 flex flex-col items-center gap-1"
                    onClick={() => addBlock(config.type)}
                  >
                    {config.icon}
                    <span className="text-xs">{config.name}</span>
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  className="col-span-3 mt-2"
                  onClick={() => setShowBlockPicker(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowBlockPicker(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Block
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex gap-3">
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 flex-1"
            onClick={handleSave}
            disabled={isSaving || !title || !slug}
          >
            {isSaving ? 'Saving...' : 'Save Page'}
          </Button>
        </div>
      </div>

      {/* Sidebar Settings */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <SidebarOpen className="w-5 h-5" />
              Sidebar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Show Sidebar</Label>
              <Switch
                checked={showSidebar}
                onCheckedChange={setShowSidebar}
              />
            </div>

            {showSidebar && (
              <div className="space-y-3">
                <Label>Sidebar Menu</Label>
                {sidebarMenu.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Label"
                      value={item.label}
                      onChange={(e) => {
                        const newMenu = [...sidebarMenu]
                        newMenu[index] = { ...item, label: e.target.value }
                        setSidebarMenu(newMenu)
                      }}
                      className="flex-1"
                    />
                    <Input
                      placeholder="URL"
                      value={item.href}
                      onChange={(e) => {
                        const newMenu = [...sidebarMenu]
                        newMenu[index] = { ...item, href: e.target.value }
                        setSidebarMenu(newMenu)
                      }}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSidebarMenu(sidebarMenu.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSidebarMenu([...sidebarMenu, { label: '', href: '' }])}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Menu Item
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Free Image Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Free Image Sources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="block">
              <Button variant="outline" className="w-full justify-start">
                🖼️ Unsplash - Free high-quality photos
              </Button>
            </a>
            <a href="https://pexels.com" target="_blank" rel="noopener noreferrer" className="block">
              <Button variant="outline" className="w-full justify-start">
                📷 Pexels - Free stock photos
              </Button>
            </a>
            <a href="https://pixabay.com" target="_blank" rel="noopener noreferrer" className="block">
              <Button variant="outline" className="w-full justify-start">
                🎨 Pixabay - Free images & videos
              </Button>
            </a>
            <a href="https://burst.shopify.com" target="_blank" rel="noopener noreferrer" className="block">
              <Button variant="outline" className="w-full justify-start">
                🛍️ Burst - Shopify free photos
              </Button>
            </a>
            <a href="https://stocksnap.io" target="_blank" rel="noopener noreferrer" className="block">
              <Button variant="outline" className="w-full justify-start">
                📸 StockSnap - CC0 photos
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
