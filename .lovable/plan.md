

# Reusable Image Action Box -- Component Modularization

## Overview

Extract the action box toolbar from `EditableImage` into a standalone `ImageActionBox` component, and introduce an action configuration model that makes the toolbar injectable into any image context (hero, gallery, background, cards) with per-type action sets. This also lays the groundwork for future AI tools (Remove Background, Generate Variations) without touching the core component.

## Current Problem

The action toolbar (lines 127-257 in `EditableImage.tsx`) is hardcoded inside `EditableImage`. This means:
- Background images rendered via CSS cannot use the toolbar
- Card images in different templates must duplicate the full `EditableImage` wrapper
- Adding a new action (e.g., "AI Edit") requires modifying `EditableImage` internals
- The 13 callback props on `EditableImage` create a wide, hard-to-maintain interface

## Architecture

### New Component: `ImageActionBox`

A standalone floating toolbar component that can be placed inside any `relative` container. It receives a typed array of action descriptors instead of individual callback props.

```text
src/components/website-preview/
  ImageActionBox.tsx        <-- NEW: extracted toolbar
  EditableImage.tsx         <-- simplified, uses ImageActionBox internally
  EditableSection.tsx       <-- unchanged
```

### Action Descriptor Model

```text
interface ImageAction {
  id: string                          // unique key: 'restyle', 'regenerate', 'ai-edit', etc.
  icon: LucideIcon                    // Paintbrush, Wand2, Eraser, etc.
  label: string                       // Turkish tooltip text
  onClick: () => void                 // action handler
  disabled?: boolean                  // grays out with opacity-40
  hidden?: boolean                    // removes from toolbar entirely
  variant?: 'default' | 'danger'      // danger = red styling (for delete)
  group?: 'primary' | 'secondary' | 'overflow'  // primary = always visible, overflow = in dropdown
}
```

Actions are grouped:
- **primary**: Always visible as icon buttons (Restyle, Regenerate)
- **secondary**: Visible as icon buttons when provided (Move Up/Down)
- **overflow**: Inside the "More" dropdown (Edit Section, Duplicate, Delete)

A visual separator renders between groups automatically.

### Per-Image-Type Action Presets

A helper function returns the appropriate action set for each image type:

```text
function getImageActions(type, callbacks): ImageAction[]

  hero:     [restyle, regenerate]
  gallery:  [restyle, regenerate, moveUp, moveDown] + overflow[delete]
  about:    [restyle, regenerate]
  cta:      [restyle, regenerate]
  service:  [restyle, regenerate]
  card:     [restyle, regenerate] + overflow[edit, duplicate, delete]

  future:   [aiEdit, removeBg, generateVariations] -- added to presets later
```

This keeps action configuration centralized and type-safe. Templates call `getImageActions('hero', { onSelect, onRegenerate })` instead of passing 10 individual props.

### Injection Into Any Block

Since `ImageActionBox` is a standalone positioned component, it can be injected into any `relative` container -- not just `EditableImage`:

```text
<!-- Background image div -->
<div className="relative" style={{ backgroundImage: `url(${bg})` }}>
  {isEditable && (
    <ImageActionBox
      actions={getImageActions('hero', handlers)}
      isVisible={isHovered}
      isSelected={isSelected}
    />
  )}
</div>

<!-- Card component -->
<div className="relative">
  <img src={cardImage} />
  {isEditable && (
    <ImageActionBox
      actions={getImageActions('card', handlers)}
      isVisible={isHovered}
      isSelected={isSelected}
    />
  )}
</div>
```

## File Changes

### 1. NEW: `src/components/website-preview/ImageActionBox.tsx`

Extracted toolbar component containing:
- `ImageAction` interface and `ImageActionGroup` type exports
- `ImageActionBox` component with props: `actions`, `isVisible`, `isSelected`, `position?` (default `'top-right'`)
- All the existing toolbar JSX (TooltipProvider, icon buttons, dropdown)
- The `getImageActions()` preset factory function
- Shared button class constant: `"p-1.5 rounded-md hover:bg-gray-100 hover:shadow-sm active:scale-95 transition-all text-gray-700"`

### 2. MODIFY: `src/components/website-preview/EditableImage.tsx`

- Remove all toolbar JSX (lines 127-257) and replace with `<ImageActionBox>`
- Remove individual callback props (`onRegenerate`, `onMoveUp`, `onMoveDown`, `onEdit`, `onDuplicate`, `onDelete`, `isFirst`, `isLast`)
- Add a single `actions?: ImageAction[]` prop as the new interface
- Keep backward compatibility: if individual callbacks are still passed (during migration), internally convert them to `ImageAction[]` via `getImageActions()`
- The image rendering, hover state, border, and locked logic remain unchanged

### 3. NO CHANGES to template files initially

`EditableImage` maintains backward compatibility by accepting both the old individual callback props and the new `actions` array. Templates continue working without modification. Future template updates can migrate to the cleaner `actions` pattern at their own pace.

## Extensibility for Future AI Tools

Adding a new action (e.g., "Remove Background") requires only:

1. Add the action ID to `getImageActions()` for relevant image types
2. Pass the callback from `Project.tsx` through the existing plumbing
3. No changes to `ImageActionBox` or `EditableImage` internals

```text
// Future addition example
{ id: 'remove-bg', icon: Eraser, label: 'Arkaplanı Kaldır', onClick: onRemoveBg, group: 'primary' }
{ id: 'ai-edit', icon: Sparkles, label: 'AI Düzenleme', onClick: onAiEdit, group: 'primary' }
{ id: 'variations', icon: Grid3x3, label: 'Varyasyonlar', onClick: onVariations, group: 'overflow' }
```

## Performance Considerations

- **No new state**: `ImageActionBox` is stateless -- it receives `isVisible` from the parent's existing hover state
- **No re-renders on siblings**: Each `EditableImage` manages its own `isHovered` state independently via `useState`, so hovering one image does not re-render others
- **Callback stability**: Action handlers should be wrapped in `useCallback` at the `Project.tsx` level (they already are for most handlers). The `getImageActions()` call can be memoized with `useMemo` if profiling shows unnecessary re-renders
- **Bundle size**: `ImageActionBox` adds no new dependencies -- it uses the same Radix Tooltip/DropdownMenu already imported
- **Future multi-select**: The `isSelected` prop on `ImageActionBox` already supports visual selection state. Multi-select would add a selection context at the `Project.tsx` level that tracks selected image paths, but `ImageActionBox` itself needs no changes

## Multi-Select Preparation

The current architecture supports future multi-select with minimal changes:
- `ImageActionBox` already accepts `isSelected` for visual highlighting
- A future `useImageSelection` hook at the editor level would manage a `Set<string>` of selected `imagePath` values
- Bulk actions (e.g., "Regenerate All Selected") would be handled at the `Project.tsx` level, not in `ImageActionBox`
- No changes to `ImageActionBox` are needed for multi-select -- it remains a single-image toolbar

## Summary

| File | Change | Lines |
|------|--------|-------|
| `ImageActionBox.tsx` | NEW: Extracted toolbar + action model + presets | ~120 lines |
| `EditableImage.tsx` | Simplified: uses ImageActionBox, backward-compatible | net -80 lines |
| Template files | None (backward compatible) | 0 |

