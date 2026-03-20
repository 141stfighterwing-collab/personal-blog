import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import WordPressPageLayout from '@/components/page-builder/WordPressPageLayout'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const pages = await db.page.findMany({
    where: { published: true },
    select: { slug: true }
  })
  
  return pages.map((page) => ({
    slug: page.slug
  }))
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params
  
  const page = await db.page.findUnique({
    where: { 
      slug,
      published: true 
    },
    include: {
      blocks: {
        orderBy: { sortOrder: 'asc' }
      }
    }
  })

  if (!page) {
    notFound()
  }

  // Serialize dates for client component
  const serializedPage = {
    ...page,
    createdAt: page.createdAt.toISOString(),
    updatedAt: page.updatedAt.toISOString(),
    blocks: page.blocks.map(block => ({
      ...block,
      createdAt: block.createdAt.toISOString(),
      updatedAt: block.updatedAt.toISOString()
    }))
  }

  return <WordPressPageLayout page={serializedPage} />
}
