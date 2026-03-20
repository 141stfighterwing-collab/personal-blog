import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check if data already exists
    const existingPosts = await db.blogPost.count()
    const existingLinks = await db.externalLink.count()
    const existingNews = await db.newsItem.count()

    if (existingPosts > 0 || existingLinks > 0 || existingNews > 0) {
      return NextResponse.json({ message: 'Database already seeded' })
    }

    // Seed blog posts
    await db.blogPost.createMany({
      data: [
        {
          title: 'Welcome to My Blog',
          slug: 'welcome-to-my-blog',
          excerpt: 'A warm welcome to my personal corner of the internet.',
          content: `# Welcome to My Blog!\n\nThis is my personal blog where I share my thoughts, projects, and discoveries.\n\n## What to Expect\n\n- **Tech tutorials** - Step-by-step guides on various technologies\n- **Project showcases** - Details about my latest coding adventures\n- **Learning notes** - Things I learn along the way\n\nStay tuned for more content!\n\n---\n\n*Thanks for visiting!*`,
          published: true,
        },
        {
          title: 'Getting Started with Markdown',
          slug: 'getting-started-with-markdown',
          excerpt: 'A quick guide to writing content in Markdown.',
          content: `# Getting Started with Markdown\n\nMarkdown is a lightweight markup language that makes writing for the web easy and enjoyable.\n\n## Basic Syntax\n\n### Headers\n\nUse \`#\` for headers:\n\n\`\`\`markdown\n# H1 Header\n## H2 Header\n### H3 Header\n\`\`\`\n\n### Emphasis\n\n- **Bold**: \`**text**\`\n- *Italic*: \`*text*\`\n- ~~Strikethrough~~: \`~~text~~\`\n\n### Lists\n\n1. Ordered lists use numbers\n2. Second item\n3. Third item\n\n- Unordered lists use dashes\n- Or asterisks\n- Simple and clean!\n\n### Code\n\nInline \`code\` uses backticks.\n\nCode blocks use triple backticks:\n\n\`\`\`javascript\nconst greeting = "Hello, World!"\nconsole.log(greeting)\n\`\`\`\n\nHappy writing!`,
          published: true,
        },
      ],
    })

    // Seed external links
    await db.externalLink.createMany({
      data: [
        {
          title: 'My GitHub',
          url: 'https://github.com/Shootre21',
          description: 'Check out my open source projects',
          category: 'github',
          sortOrder: 0,
        },
        {
          title: 'Tech Blog',
          url: 'https://example-tech-blog.com',
          description: 'Another blog I write for',
          category: 'blog',
          sortOrder: 1,
        },
        {
          title: 'Dev.to',
          url: 'https://dev.to',
          description: 'Community of developers sharing ideas',
          category: 'news',
          sortOrder: 2,
        },
        {
          title: 'Hacker News',
          url: 'https://news.ycombinator.com',
          description: 'Tech news and discussions',
          category: 'news',
          sortOrder: 3,
        },
      ],
    })

    // Seed news items for marquee
    await db.newsItem.createMany({
      data: [
        { headline: '🚀 New blog post: Getting Started with Markdown is now live!', sortOrder: 0 },
        { headline: '💻 Currently working on an exciting new open source project', sortOrder: 1 },
        { headline: '📚 Reading: Clean Code by Robert C. Martin', sortOrder: 2 },
        { headline: '🌟 Check out my GitHub for latest projects and contributions', sortOrder: 3 },
        { headline: '☕ Powered by coffee and curiosity', sortOrder: 4 },
      ],
    })

    return NextResponse.json({ message: 'Database seeded successfully!' })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 })
  }
}
