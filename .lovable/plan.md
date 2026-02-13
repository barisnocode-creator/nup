

# Regenerate Images -- Pixabay Picker Integration

## Overview

Wire the "Regenerate" (Wand2) button on the image action box to open the existing `PixabayImagePicker` modal with an auto-generated search query based on the image's context. Selecting an image replaces the original instantly with undo support via a toast action.

## Current State

- `PixabayImagePicker` exists at `src/components/chai-builder/PixabayImagePicker.tsx` -- a fully built modal with search, grid results, Pixabay attribution, and suggestion tags
- `search-pixabay` edge function exists and works with the `PIXABAY_API_KEY` secret
- `EditableImage` has an `onRegenerate` callback prop already wired to the action box
- `Project.tsx` currently handles regeneration via `fetch-image-options` edge function (fetches 3 alternatives into the sidebar) -- this is the sidebar flow, separate from the action box

## Architecture

### 1. Auto-Query Generation

Build the `defaultQuery` for `PixabayImagePicker` from available context, prioritized:

```text
Priority 1: imageData.altText (e.g., "Modern dental clinic interior")
Priority 2: Section type mapping (hero -> "professional business", about -> "team office", etc.)
Priority 3: Project profession from generated_content (e.g., "dental clinic")
Fallback: "professional business"
```

Logic lives in a small helper function inside `Project.tsx`:

```text
function buildImageSearchQuery(imageData, content):
  if imageData.altText and altText is not generic ("Hero", "About Us"):
    return altText
  
  sectionKeywords = {
    hero: content.businessName + " " + content.profession,
    about: "team office " + content.profession,
    gallery: content.profession + " workspace",
    cta: content.profession + " professional",
    service: imageData.altText or content.profession + " service"
  }
  return sectionKeywords[imageData.type] or "professional business"
```

### 2. Trigger Flow

```text
User hovers image
  -> Action box appears
    -> User clicks Wand2 (Regenerate)
      -> onRegenerate callback fires
        -> Sets pixabayPickerOpen = true
        -> Sets pixabayDefaultQuery from buildImageSearchQuery()
        -> PixabayImagePicker auto-searches on open
      -> User selects image from grid
        -> onSelect returns largeImageURL
        -> Image is replaced in generated_content
        -> Previous URL stored for undo
        -> Toast shows "Gorsel degistirildi" with "Geri Al" action
```

### 3. File Changes

#### A. `src/components/chai-builder/PixabayImagePicker.tsx`

- Add `autoSearch` prop (boolean, default false)
- When `open` becomes true and `autoSearch` is true and `defaultQuery` is non-empty, trigger `searchImages(defaultQuery)` automatically via a `useEffect`
- Reset state (images, searched, query) when dialog closes so it's fresh on next open

#### B. `src/pages/Project.tsx`

- Add state: `pixabayForRegenerate` (`{ open: boolean; defaultQuery: string; targetImagePath: string; previousUrl: string }`)
- Update the `onRegenerate` handler passed through templates to open PixabayImagePicker instead of calling `fetch-image-options`
- Add `handlePixabaySelect` callback that:
  1. Saves current image URL as `previousUrl`
  2. Updates `generated_content` with new URL at the correct image path
  3. Saves to database
  4. Shows toast with "Geri Al" (Undo) button that restores `previousUrl`
- Render `PixabayImagePicker` component in Project.tsx JSX

#### C. Template files (no changes needed)

The `onRegenerate` callback is already plumbed from `EditableImage` through templates. The only gap is that templates currently don't pass `onRegenerate` to `EditableImage` -- this needs to be connected in each template's hero/about/gallery sections by passing a callback that calls up to `Project.tsx`.

However, since the regeneration is image-specific and `EditableImage` already receives `onRegenerate` as an optional prop, the wiring happens at the template level. We need to:

- Pass an `onImageRegenerate` callback from `Project.tsx` through `WebsitePreview` to templates
- Templates pass it as `onRegenerate` to each `EditableImage`, including the `imagePath` so Project.tsx knows which image to replace

This is the same pattern used for `onImageSelect` -- add a parallel `onImageRegenerate?: (imageData: ImageData) => void` prop that flows through `WebsitePreview` -> Template -> Section -> `EditableImage`.

### 4. Undo / Revert Handling

- Before replacing, store `{ imagePath, previousUrl }` in a ref or state
- Toast with "Geri Al" action button calls a restore function that writes `previousUrl` back to `generated_content` at the same path
- Toast auto-dismisses after 8 seconds (standard sonner duration)
- No persistent undo history needed -- single-level undo via toast is sufficient

### 5. Loading States

- `PixabayImagePicker` already has a `Loader2` spinner during search
- The image grid shows a skeleton/loading state while fetching
- After selection, the image in the canvas updates instantly (URL swap) -- no additional loading needed since Pixabay URLs are direct CDN links

### 6. Licensing Attribution

- `PixabayImagePicker` already includes Pixabay attribution footer: "Gorseller Pixabay tarafindan saglanmaktadir"
- Pixabay images are free for commercial use (Pixabay License) -- no per-image attribution required
- The attribution in the picker modal satisfies Pixabay's API terms of service

## Summary of Changes

| File | Change |
|------|--------|
| `PixabayImagePicker.tsx` | Add `autoSearch` prop + useEffect for auto-search on open + reset on close |
| `Project.tsx` | Add pixabay state, `buildImageSearchQuery` helper, `handlePixabaySelect` with undo toast, render PixabayImagePicker |
| `WebsitePreview.tsx` | Add `onImageRegenerate` prop passthrough |
| Template files (temp1 hero, about, gallery, CTA; temp2 hero) | Pass `onRegenerate` to `EditableImage` instances using the new callback |

