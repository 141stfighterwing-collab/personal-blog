# 📡 API Reference

> Technical reference for Sentinel Nexus programmatic interfaces including content API endpoints, RSS feed format, search API, and webhook integrations.

---

## Table of Contents

- [Overview](#overview)
- [Content API Endpoints](#content-api-endpoints)
- [RSS Feed Format](#rss-feed-format)
- [Search API](#search-api)
- [Webhook Integrations](#webhook-integrations)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

---

## Overview

Sentinel Nexus exposes several API endpoints for programmatic access to content. These are built as Next.js API routes and are available in both development and production environments.

### Base URL

| Environment | Base URL |
|-------------|----------|
| Development | `http://localhost:3000` |
| Production (Vercel) | `https://yourdomain.com` |
| Production (Docker) | `https://yourdomain.com` |

### API Format

| Aspect | Specification |
|--------|---------------|
| Protocol | HTTPS (HTTP only in development) |
| Content Type | `application/json` (default), `application/xml` (RSS) |
| Character Encoding | UTF-8 |
| Date Format | ISO 8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`) |

---

## Content API Endpoints

### GET `/api/posts`

Retrieve a paginated list of published blog posts.

#### Request

```http
GET /api/posts?page=1&limit=10&tag=tutorial&sort=date&order=desc HTTP/1.1
Host: yourdomain.com
Accept: application/json
```

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | `1` | Page number (1-indexed) |
| `limit` | integer | `10` | Posts per page (max: 50) |
| `tag` | string | — | Filter posts by tag |
| `sort` | string | `date` | Sort field (`date`, `title`, `readingTime`) |
| `order` | string | `desc` | Sort order (`asc`, `desc`) |
| `search` | string | — | Full-text search query |
| `fields` | string | — | Comma-separated list of fields to include |

#### Response

```json
{
  "posts": [
    {
      "slug": "building-static-blog",
      "title": "How to Build a Static Blog",
      "date": "2025-01-15T00:00:00.000Z",
      "excerpt": "A comprehensive guide to building a static blog with Next.js...",
      "tags": ["tutorial", "nextjs", "web-development"],
      "coverImage": "/images/blog-cover.jpg",
      "readingTime": 5,
      "author": "Sentinel"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "totalPosts": 42,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### Status Codes

| Code | Description |
|------|-------------|
| `200` | Success — returns paginated posts |
| `400` | Bad Request — invalid query parameters |
| `404` | Not Found — no posts match the criteria |
| `500` | Internal Server Error |

---

### GET `/api/posts/[slug]`

Retrieve a single blog post by its URL slug.

#### Request

```http
GET /api/posts/building-static-blog HTTP/1.1
Host: yourdomain.com
Accept: application/json
```

#### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `slug` | string | URL slug of the post (e.g., `building-static-blog`) |

#### Response

```json
{
  "slug": "building-static-blog",
  "title": "How to Build a Static Blog",
  "date": "2025-01-15T00:00:00.000Z",
  "excerpt": "A comprehensive guide to building a static blog with Next.js...",
  "content": "<h1>How to Build a Static Blog</h1><p>Introduction...</p>",
  "tags": ["tutorial", "nextjs", "web-development"],
  "coverImage": "/images/blog-cover.jpg",
  "readingTime": 5,
  "author": "Sentinel",
  "tableOfContents": [
    { "id": "prerequisites", "text": "Prerequisites", "level": 2 },
    { "id": "step-1", "text": "Step 1: Setup", "level": 2 }
  ],
  "seo": {
    "title": "How to Build a Static Blog | Sentinel Nexus",
    "description": "A comprehensive guide to building a static blog...",
    "canonicalUrl": "https://yourdomain.com/posts/building-static-blog"
  }
}
```

#### Status Codes

| Code | Description |
|------|-------------|
| `200` | Success — returns the post |
| `404` | Not Found — no post with the given slug |

---

### GET `/api/tags`

Retrieve all tags with associated post counts.

#### Request

```http
GET /api/tags HTTP/1.1
Host: yourdomain.com
Accept: application/json
```

#### Response

```json
{
  "tags": [
    { "name": "tutorial", "count": 12 },
    { "name": "nextjs", "count": 8 },
    { "name": "typescript", "count": 6 },
    { "name": "web-development", "count": 15 },
    { "name": "docker", "count": 3 }
  ]
}
```

---

## RSS Feed Format

### GET `/api/rss.xml`

The RSS feed is a standard RSS 2.0 XML document containing all published posts.

#### Request

```http
GET /api/rss.xml HTTP/1.1
Host: yourdomain.com
Accept: application/rss+xml
```

#### Response Format

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Sentinel Nexus</title>
    <description>A modern personal blog platform</description>
    <link>https://yourdomain.com</link>
    <language>en-us</language>
    <lastBuildDate>Wed, 15 Jan 2025 12:00:00 +0000</lastBuildDate>
    <atom:link href="https://yourdomain.com/api/rss.xml"
               rel="self" type="application/rss+xml"/>
    <managingEditor>sentinel@example.com (Sentinel)</managingEditor>
    <webMaster>sentinel@example.com (Sentinel)</webMaster>
    <ttl>60</ttl>

    <item>
      <title>How to Build a Static Blog</title>
      <link>https://yourdomain.com/posts/building-static-blog</link>
      <guid isPermaLink="true">https://yourdomain.com/posts/building-static-blog</guid>
      <pubDate>Wed, 15 Jan 2025 00:00:00 +0000</pubDate>
      <dc:creator>Sentinel</dc:creator>
      <description>A comprehensive guide to building a static blog...</description>
      <content:encoded><![CDATA[
        <h1>How to Build a Static Blog</h1>
        <p>Introduction paragraph...</p>
        <p>More content...</p>
      ]]></content:encoded>
      <category>tutorial</category>
      <category>nextjs</category>
    </item>

    <!-- More items... -->
  </channel>
</rss>
```

#### RSS Feed Fields

| Field | Description |
|-------|-------------|
| `title` | Post title |
| `link` | Absolute URL to the post |
| `guid` | Unique identifier (same as link, `isPermaLink="true"`) |
| `pubDate` | Publication date in RFC 822 format |
| `dc:creator` | Author name |
| `description` | Plain text excerpt (first 160 characters) |
| `content:encoded` | Full HTML content of the post (CDATA wrapped) |
| `category` | Post tags (one element per tag) |

#### Feed Configuration

The RSS feed can be configured via environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_SITE_TITLE` | `Sentinel Nexus` | Channel title |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Base URL for all links |
| `NEXT_PUBLIC_AUTHOR_NAME` | `Sentinel` | Default author name |
| `NEXT_PUBLIC_AUTHOR_EMAIL` | — | Managing editor email |
| `NEXT_PUBLIC_RSS_DESCRIPTION` | — | Channel description |
| `NEXT_PUBLIC_RSS_TTL` | `60` | Cache time-to-live in minutes |

---

## Search API

### GET `/api/search`

Full-text search across all published blog posts. The search is powered by a pre-built FlexSearch index at build time.

#### Request

```http
GET /api/search?q=static+blog&limit=10&tag=tutorial HTTP/1.1
Host: yourdomain.com
Accept: application/json
```

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `q` | string | **Required** | Search query (URL-encoded) |
| `limit` | integer | `10` | Maximum results to return (max: 50) |
| `tag` | string | — | Restrict search to specific tag |
| `fields` | string | `title,content,excerpt` | Fields to search in |

#### Response

```json
{
  "query": "static blog",
  "results": [
    {
      "slug": "building-static-blog",
      "title": "How to Build a <mark>Static</mark> <mark>Blog</mark>",
      "excerpt": "A comprehensive guide to building a <mark>static</mark> <mark>blog</mark> with Next.js...",
      "tags": ["tutorial", "nextjs"],
      "date": "2025-01-15T00:00:00.000Z",
      "readingTime": 5,
      "relevanceScore": 0.95
    }
  ],
  "totalResults": 3,
  "queryTime": 12
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `query` | string | The original search query |
| `results` | array | Array of matching posts |
| `results[].relevanceScore` | float | Relevance score (0.0–1.0) |
| `results[].title` | string | Title with `<mark>` tags around matches |
| `results[].excerpt` | string | Excerpt with `<mark>` tags around matches |
| `totalResults` | integer | Total number of matching posts |
| `queryTime` | integer | Search execution time in milliseconds |

#### Status Codes

| Code | Description |
|------|-------------|
| `200` | Success — returns search results (may be empty array) |
| `400` | Bad Request — missing or empty `q` parameter |

---

## Webhook Integrations

Sentinel Nexus supports webhook notifications for external services to react to content changes.

### Webhook Configuration

Webhooks are configured via environment variables:

```bash
# Enable webhook support
NEXT_PUBLIC_WEBHOOK_ENABLED=true

# Webhook endpoints (comma-separated)
WEBHOOK_URLS=https://hooks.slack.com/services/XXX,https://discord.com/api/webhooks/XXX

# Webhook secret for HMAC signature verification
WEBHOOK_SECRET=your-webhook-secret-here

# Events to trigger webhooks
WEBHOOK_EVENTS=post_created,post_updated
```

### Webhook Payload

When a new post is created or updated, the following payload is sent to each configured webhook URL:

```json
{
  "event": "post_created",
  "timestamp": "2025-01-15T12:00:00.000Z",
  "payload": {
    "slug": "building-static-blog",
    "title": "How to Build a Static Blog",
    "url": "https://yourdomain.com/posts/building-static-blog",
    "date": "2025-01-15T00:00:00.000Z",
    "tags": ["tutorial", "nextjs"],
    "excerpt": "A comprehensive guide to building a static blog..."
  },
  "signature": "sha256=a1b2c3d4e5f6..."
}
```

### HMAC Signature Verification

Each webhook request includes a `X-Sentinel-Signature` header containing an HMAC-SHA256 signature of the payload. Verify it using your `WEBHOOK_SECRET`:

```javascript
import crypto from 'crypto';

function verifyWebhookSignature(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}
```

### Supported Webhook Events

| Event | Trigger | Description |
|-------|---------|-------------|
| `post_created` | New post file added to `src/content/posts/` | New blog post published |
| `post_updated` | Existing post file modified | Blog post content changed |
| `post_deleted` | Post file removed | Blog post unpublished |
| `build_complete` | Successful `npm run build` | New static build generated |
| `deploy_complete` | Successful deployment | Site deployed to production |

### Example: Slack Integration

```json
// Slack webhook payload (transformed)
{
  "text": "📰 *New post published on Sentinel Nexus*",
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "📰 *New Post: How to Build a Static Blog*\n*Author:* Sentinel\n*Tags:* tutorial, nextjs\n<https://yourdomain.com/posts/building-static-blog|Read Post>"
      }
    }
  ]
}
```

### Example: Discord Integration

```json
// Discord webhook payload (transformed)
{
  "embeds": [
    {
      "title": "📰 New Post: How to Build a Static Blog",
      "url": "https://yourdomain.com/posts/building-static-blog",
      "color": 5814783,
      "description": "A comprehensive guide to building a static blog...",
      "fields": [
        { "name": "Author", "value": "Sentinel", "inline": true },
        { "name": "Tags", "value": "tutorial, nextjs", "inline": true },
        { "name": "Reading Time", "value": "5 min", "inline": true }
      ],
      "timestamp": "2025-01-15T12:00:00.000Z"
    }
  ]
}
```

---

## Data Models

### Post (Complete)

```typescript
interface Post {
  // Required fields
  slug: string;
  title: string;
  date: string;           // ISO 8601 date string
  content: string;        // Raw Markdown content
  contentHtml: string;    // Rendered HTML content

  // Optional fields
  excerpt?: string;       // Plain text excerpt (auto-generated if not provided)
  coverImage?: string;    // Path to cover image
  tags?: string[];        // Array of tag strings
  author?: string;        // Author name (default from config)
  draft?: boolean;        // If true, excluded from build
  readingTime?: number;   // Estimated reading time in minutes

  // SEO fields
  seoTitle?: string;      // Custom page title
  seoDescription?: string;// Meta description
  canonicalUrl?: string;  // Canonical URL override

  // Computed fields
  tableOfContents?: TocEntry[];
}

interface TocEntry {
  id: string;             // HTML element ID
  text: string;           // Heading text
  level: number;          // Heading level (1-6)
  children?: TocEntry[];  // Nested headings
}
```

### Tag

```typescript
interface Tag {
  name: string;
  count: number;
  slug: string;           // URL-safe version of the tag
}
```

### Pagination

```typescript
interface Pagination {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextPage?: number;
  prevPage?: number;
}
```

### SearchResult

```typescript
interface SearchResult {
  slug: string;
  title: string;          // Title with <mark> highlights
  excerpt: string;        // Excerpt with <mark> highlights
  tags: string[];
  date: string;
  readingTime: number;
  relevanceScore: number; // 0.0 to 1.0
}
```

---

## Error Handling

All API errors follow a consistent JSON format:

```json
{
  "error": {
    "code": "POST_NOT_FOUND",
    "message": "No post found with slug 'nonexistent-post'",
    "details": {},
    "status": 404,
    "timestamp": "2025-01-15T12:00:00.000Z",
    "path": "/api/posts/nonexistent-post"
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `POST_NOT_FOUND` | 404 | Requested post slug does not exist |
| `INVALID_PARAMETERS` | 400 | Query parameters are invalid |
| `MISSING_QUERY` | 400 | Required query parameter is missing |
| `INTERNAL_ERROR` | 500 | Unexpected server error |
| `RATE_LIMITED` | 429 | Too many requests |
| `FEED_DISABLED` | 404 | RSS feed is disabled in configuration |
| `SEARCH_DISABLED` | 404 | Search API is disabled in configuration |

---

## Rate Limiting

| Endpoint | Rate Limit | Window |
|----------|-----------|--------|
| `GET /api/posts` | 100 requests | Per minute |
| `GET /api/posts/[slug]` | 200 requests | Per minute |
| `GET /api/tags` | 200 requests | Per minute |
| `GET /api/search` | 30 requests | Per minute |
| `GET /api/rss.xml` | 60 requests | Per minute |

Rate limit headers are included in every response:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705320000
```

When rate limited, the API returns:

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests. Please retry after 45 seconds.",
    "status": 429,
    "retryAfter": 45
  }
}
```

---

*For deployment details, see [[Deployment]]. For architecture, see [[Architecture]]. For testing, see [[Testing]].*
