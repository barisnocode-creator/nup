

# Fix: Image Action Box Crashing in Chai Builder Editor

## Problem

When hovering over images in the Chai Builder editor, the app crashes with:
```
Error: `Tooltip` must be used within `TooltipProvider`
```

The Chai Builder SDK renders blocks inside its own React tree/iframe where Radix UI portals (Tooltip, DropdownMenu) don't connect properly to the provider context. Even though `ImageActionBox` has its own `TooltipProvider`, the Chai Builder's rendering pipeline breaks the React context chain.

## Solution

Create a simplified version of the action box specifically for Chai Builder blocks that avoids Radix UI portals entirely. The Chai Builder blocks only need a single "Gorsel Degistir" button -- no tooltips, dropdowns, or secondary actions are needed.

## File Changes

### 1. MODIFY: `src/components/chai-builder/blocks/shared/EditableChaiImage.tsx`

Replace the imported `ImageActionBox` with a simple inline button overlay that doesn't use any Radix UI components:

- Remove import of `ImageActionBox` from `@/components/website-preview/ImageActionBox`
- Add a lightweight `ChaiImageOverlay` inline component that renders a plain styled button (no Tooltip, no DropdownMenu)
- The button shows "Gorsel Degistir" text on hover, matching the Durable-style design
- Keep the same positioning (`absolute top-3 right-3`) and animations (`opacity`, `translate-y`)
- Apply to both `EditableChaiImage` and `EditableChaiBackground`

### Technical Details

The simplified overlay will be:
```text
<div> (absolute positioned, fade in/out)
  <div> (white/95 backdrop-blur container)
    <button> "Gorsel Degistir" </button>
  </div>
</div>
```

No Radix Tooltip, no DropdownMenu, no portals -- just a plain HTML button with Tailwind classes. This completely eliminates the context chain issue while maintaining the same visual appearance for the single action that Chai Builder blocks need.

The `ImageActionBox` component in `website-preview/` remains unchanged for use by the template system.

| File | Change |
|------|--------|
| `EditableChaiImage.tsx` | Replace `ImageActionBox` import with inline portal-free overlay |

