# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `yarn dev` (uses Next.js with Turbopack)
- **Build**: `yarn build` (includes automatic SEO indexing via Google API and IndexNow)
- **Linting**: `yarn lint` (Next.js ESLint configuration)
- **Production server**: `yarn start`
- **SEO indexing**: `yarn indexing:all` (runs both Google Indexing API and IndexNow)

## Architecture Overview

This is a multilingual Next.js 15 blog built with the App Router and Server Components. The site deploys to kimjaahyun.com on Vercel.

### Core Technologies
- **Next.js 15** with App Router and React 19
- **TypeScript** for type safety
- **TailwindCSS 4** for styling with dark mode support
- **MDX** for blog content with React component embedding
- **Supabase** for comments, likes, views, and user data
- **next-intl** for internationalization (Korean/English)

### Content System
- Blog posts are stored as MDX files in `/contents/[post-name]/[locale].mdx`
- Supports LaTeX math (`remark-math` + `rehype-katex`)
- Supports Mermaid diagrams
- GitHub Flavored Markdown tables (`remark-gfm`)
- Custom React components can be embedded in MDX

### Key Features
- **Multilingual**: Automatic locale routing with Korean/English support
- **Interactive**: Comment system with email notifications for new comments/replies
- **SEO Optimized**: Automatic indexing via Google Indexing API and IndexNow API
- **Real-time Analytics**: Post views, likes via Supabase
- **Search**: Full-text search across all blog posts

## Important Development Rules

### MDX Content Rules (from Cursor rules)
- **NEVER use h1 headings (`#`) in MDX files** - causes SEO issues with duplicate h1 tags
- Use h2 (`##`) or lower for all headings in blog content
- Use informal tone (평어체) rather than formal Korean

### File Structure
```
app/
├── [locale]/           # Internationalized routes (ko/en)
├── components/         # React components
├── api/               # API routes (email, search, visitors)
contents/              # MDX blog posts organized by slug
lib/                   # Utilities (Supabase client, email service)
messages/              # Internationalization messages
scripts/               # SEO indexing scripts
sql/                   # Database schema files
```

### Key Configuration
- **MDX Config**: Uses `remark-math`, `remark-gfm`, `rehype-katex` plugins
- **Internationalization**: Handled by `next-intl` with locale-based routing
- **Database**: Supabase PostgreSQL with tables for comments, post_likes, post_views
- **Email**: Automated notifications for comments/replies

### Testing & Quality
- Use `yarn lint` to check ESLint compliance
- No specific test framework is configured - check with maintainer before adding tests
- Build process includes automatic SEO indexing post-deployment

### Environment Setup
Requires `.env.local` with:
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Optional: email API keys and SEO API keys for full functionality