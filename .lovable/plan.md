
# Image Hover Action Box System

## Overview

Replace the current full-overlay pencil icon on image hover with a compact contextual action box positioned in the top-right corner. This action box appears only in editor mode and provides quick access to image editing actions.

## Current Behavior

- Hovering an image shows a dark overlay (`bg-black/40`) covering the entire image
- A centered pencil icon appears inside a white circle
- Clicking opens the image editor sidebar

## New Behavior

- Hovering an image shows a subtle border highlight (no dark overlay blocking the image)
- A compact action box fades in at the top-right corner with 8px padding from edges
- The action box contains: **Edit** (pencil icon) button that opens the image editor sidebar
- The box disappears when the cursor leaves the image container
- Not visible in preview or published mode (controlled by existing `isEditable` prop)

## Technical Details

### File: `src/components/website-preview/EditableImage.tsx`

This is the single global image component used by all templates (temp1 hero, about, gallery, CTA, temp2 hero, etc. -- 7+ template files). Modifying this one file applies the change everywhere.

**Changes:**

1. Remove the full-screen dark overlay (`bg-black/40`) on hover
2. Remove the centered pencil icon layout
3. Add a top-right positioned action box:

```text
Structure:
<div class="absolute top-2 right-2 z-20">  -- action box container
  <div class="flex gap-1 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-1 border">
    <button title="Edit Image">
      <Pencil icon 14px />
    </button>
  </div>
</div>
```

4. Keep the subtle border highlight on hover (`border-2 border-primary`) -- already exists
5. Animation: `opacity-0 scale-95` to `opacity-100 scale-100` with `transition-all duration-200`
6. The action box uses `pointer-events-auto` while the overlay border uses `pointer-events-none`

### Hover Detection Model

- Uses the existing `onMouseEnter` / `onMouseLeave` on the container `div` -- no change needed
- The `isHovered` state already tracks hover correctly
- Detection area matches the container boundaries which wrap the image exactly

### Editor-Only Visibility

- The entire overlay system is already gated behind `{isEditable && (...)}` -- no change needed
- When `isEditable` is false (preview/published mode), no hover effects render
- The `cursor-pointer` class is also already conditional on `isEditable`

### Responsive Editor Scaling

- Using `top-2 right-2` (8px) Tailwind spacing ensures consistent padding at any scale
- The action box uses small, fixed-size icons (14px) that remain legible at all viewport widths
- No absolute pixel values that would break with CSS transforms

### Selected State

- When an image is selected (`isSelected`), the action box remains visible (same as current behavior where overlay stays visible)
- The primary-color border ring on selection is preserved

## Impact

- All image blocks across all templates get the new interaction automatically (EditableImage is used in 7+ template files)
- No changes needed in any template file
- ImageEditorSidebar continues to open via the existing `onSelect` callback
- No changes to the hover detection model or editor-only gating logic
