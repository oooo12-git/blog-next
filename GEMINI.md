# GEMINI.md

This file provides guidance to Gemini when working with code in this repository.

!IMPORTANT : Always responds in Korean

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

### MDX Content Rules & Automation

These rules apply when creating or editing MDX content in the `/contents` directory.

#### Image Size Automation

When requested to "fill in image sizes" for an `.mdx` file, automatically perform the following:
1. Find all `ImageWithCaption` components in the file.
2. For each component, get the `src` path.
3. Use the `sips -g pixelWidth -g pixelHeight` command on the image file (located in the `public` directory) to get its dimensions.
4. Add the `width` and `height` attributes to the `ImageWithCaption` component.

#### Writing Style

- **Headings**: **NEVER use h1 headings (`#`)**. It causes SEO issues with duplicate h1 tags. Use h2 (`##`) or lower for all headings.
- **Tone**: Use an informal tone (평어체), not formal Korean (존댓말).
- **Line Breaks**: To create a line break, add two spaces (`  `) at the end of a line. To start a new paragraph, use an empty line.

#### Metadata Automation (`ko.mdx`)

When a `ko.mdx` file is modified, its metadata should be automatically updated based on the content.

- **`description`**: Automatically generate a concise 2-3 sentence summary of the article.
- **`tags`**:
  - Automatically generate 3-7 relevant tags based on the main topics, technologies, and concepts in the article.
  - **For restaurant/food reviews, the tag '맛집' is mandatory.**
- **`heroImage`**:
  - Automatically set the `heroImage` path from the `src` of the most representative `ImageWithCaption` component in the article (usually the first one).
  - If no `ImageWithCaption` component is present, use the default image: `/contents/default.jpg`.

#### Multilingual Synchronization (`ko.mdx` -> `en.mdx`)

When a `ko.mdx` file is updated, the corresponding `en.mdx` file in the same directory must be automatically synchronized.

- **Translate Content**: The `title`, `description`, and `tags` from the `ko.mdx` metadata should be translated into English for the `en.mdx` file.
- **Sync `heroImage`**: The `heroImage` path should be identical in both files.
- **Preserve Code/Math**: During translation of the body, ensure that code blocks (`...`), math formulas (`$...# GEMINI.md

This file provides guidance to Gemini when working with code in this repository.

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

or `$...$`), and links are preserved without modification.

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
