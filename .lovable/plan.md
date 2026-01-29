
# Enhanced AI Website Generation with Images & Blog Support

## Overview
Upgrade the website builder to create higher quality, more visually appealing websites by adding AI-generated images, a blog system, and enhanced content generation. This will significantly improve the professional appearance and value of generated websites.

---

## Current State Analysis

The system currently generates:
- 4 pages: Home, About, Services, Contact
- Text-only content based on profession and preferences
- Basic layout with icon placeholders
- No images or visual media
- No blog functionality

---

## New Features to Add

### 1. AI-Generated Images

**Hero Images for Each Page:**
- Homepage: Professional hero banner related to the profession
- About: Team/clinic environment image
- Services: Medical/healthcare themed imagery
- Contact: Welcoming, professional atmosphere

**Service/Highlight Icons:**
- Replace text-based icon names with actual AI-generated icons or use high-quality stock imagery from Unsplash

**Implementation Approach:**
- Use Lovable AI's image generation model (`google/gemini-2.5-flash-image`)
- Generate profession-specific images during website creation
- Store image URLs in the `generated_content` JSON

### 2. Blog System

**New Blog Page:**
- Add a "Blog" page to the website structure
- AI generates 3-5 initial blog posts based on profession
- Posts include: title, excerpt, full content, featured image, category, publish date

**Blog Post Topics by Profession:**
- **Doctor**: Health tips, preventive care, medical news
- **Dentist**: Oral hygiene tips, dental procedures explained
- **Pharmacist**: Medication guides, health supplements, wellness advice

### 3. Enhanced Content Quality

**Richer Text Content:**
- Longer, more detailed descriptions
- FAQ sections
- Testimonial placeholders
- Call-to-action sections (informational, not sales)

**SEO-Ready Meta Content:**
- Meta descriptions for each page
- Open Graph data for social sharing

---

## Technical Implementation

### Database Changes

```sql
-- Extend generated_content structure to include:
-- - images: Object containing all generated image URLs
-- - blog: Object containing blog posts array
-- No schema change needed - uses existing JSONB column
```

### Updated Type Definitions

```typescript
// src/types/generated-website.ts - Extended structure
export interface GeneratedContent {
  pages: {
    home: { /* existing + heroImage */ };
    about: { /* existing + images */ };
    services: { /* existing + images */ };
    contact: { /* existing */ };
    blog: {
      hero: { title: string; subtitle: string; };
      posts: BlogPost[];
    };
  };
  images: {
    heroHome: string;
    heroAbout: string;
    heroServices: string;
    // Additional images...
  };
  metadata: { /* existing + seo fields */ };
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  featuredImage: string;
  publishedAt: string;
}
```

### New & Updated Files

| File | Action | Description |
|------|--------|-------------|
| `supabase/functions/generate-website/index.ts` | Update | Enhanced prompt + image generation calls |
| `supabase/functions/generate-images/index.ts` | Create | Separate edge function for image generation |
| `src/types/generated-website.ts` | Update | Add blog, images, and enhanced fields |
| `src/components/website-preview/pages/BlogPage.tsx` | Create | New blog page component |
| `src/components/website-preview/pages/BlogPostPage.tsx` | Create | Individual blog post view |
| `src/components/website-preview/WebsitePreview.tsx` | Update | Add blog page routing |
| `src/components/website-preview/WebsiteHeader.tsx` | Update | Add Blog nav link |
| `src/components/website-preview/pages/HomePage.tsx` | Update | Add hero image display |
| `src/components/website-preview/pages/AboutPage.tsx` | Update | Add team/clinic images |
| `src/components/website-preview/pages/ServicesPage.tsx` | Update | Add service images |

---

## Implementation Flow

```text
1. User completes wizard
        |
        v
2. generate-website Edge Function called
        |
        v
3. AI generates enhanced text content (including blog posts)
        |
        v
4. generate-images Edge Function called (parallel)
   - Hero images for each page
   - Blog post featured images
        |
        v
5. Images uploaded to Supabase Storage
        |
        v
6. Content + Image URLs saved to project
        |
        v
7. Enhanced website displayed with images & blog
```

---

## AI Prompts Enhancement

**Content Generation Prompt (Enhanced):**
- Request longer, more detailed content
- Include FAQ section for services
- Generate testimonial templates
- Create SEO metadata
- Generate 3 initial blog posts with full content

**Image Generation Prompts:**
- "Professional medical clinic reception area, modern, clean, warm lighting, healthcare"
- "Friendly doctor consulting with patient, professional, trustworthy"
- "Modern dental office interior, comfortable, bright, welcoming"
- "Pharmacy counter with pharmacist, organized, professional, healthcare"

---

## Storage Setup

**New Supabase Storage Bucket:**
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('website-images', 'website-images', true);
```

**RLS Policy:**
- Public read access for all images
- Insert only via service role (edge function)

---

## UI Enhancements

### Hero Sections with Images
- Full-width hero images with overlay text
- Gradient overlays for text readability
- Responsive image sizing

### Blog Page Layout
- Grid of blog post cards
- Featured image thumbnails
- Category badges
- Excerpt text
- Read more links

### Blog Post Page
- Full featured image banner
- Rich text content display
- Related posts section
- Back to blog navigation

---

## Technical Details

### Image Generation Approach
Since AI image generation can be slow, we'll use a two-phase approach:
1. **Quick generation**: Text content generated first, placeholder images shown
2. **Background processing**: Images generated asynchronously, updated when ready

### Image Sizing
- Hero images: 1920x600px (landscape)
- Blog thumbnails: 800x450px (16:9)
- Service images: 600x400px

### Fallback Images
- Use profession-specific Unsplash images as fallbacks
- Graceful degradation if AI image generation fails

---

## Summary of Changes

| Category | Changes |
|----------|---------|
| **Edge Functions** | 1 updated, 1 new (image generation) |
| **Types** | Extended `GeneratedContent` with blog + images |
| **Components** | 2 new (BlogPage, BlogPostPage), 5 updated |
| **Storage** | 1 new bucket (website-images) |
| **Database** | No schema changes (uses existing JSONB) |

This enhancement will transform basic text-only websites into visually rich, professional healthcare sites with engaging blog content.
