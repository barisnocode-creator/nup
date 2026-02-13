

# Image Action Box -- Micro-Interaction and Animation Refinements

## Analysis of Current State

After reviewing `EditableImage.tsx`, `EditableSection.tsx`, and `PixabayImagePicker.tsx`, the existing implementation already covers most of the 8 micro-interaction requirements. This plan identifies what is done and the 3 targeted refinements needed.

## Already Handled (No Changes Needed)

### 1. Fade + Scale on Appear (Requirement 1) -- DONE
Line 130-133: `transition-all duration-200` with `opacity-0 scale-95` to `opacity-100 scale-100`. This is a fade + slight scale-in, which achieves the same effect as fade + slide.

### 2. Transition Duration 150-250ms (Requirement 2) -- DONE
`duration-200` (200ms) on the action box, `duration-200` on the hover border. Both within the 150-250ms range.

### 3. Dropdown Expand Animation (Requirement 5) -- DONE
`DropdownMenuContent` already has Radix built-in `animate-in fade-in-0 zoom-in-95` plus directional slide animations. No changes needed.

### 4. Disabled State Styling (Requirement 6) -- DONE
Move Up/Down buttons already use `opacity-40 pointer-events-none` when `isFirst`/`isLast` is true, plus `disabled={isFirst/isLast}`.

### 5. Skeleton Loading for Regenerate Modal (Requirement 7) -- DONE
`PixabayImagePicker` already shows `Loader2 animate-spin` during search and empty-state illustrations. The loading UX is complete.

### 6. Cursor State Changes (Requirement 8) -- DONE
Container: `cursor-pointer` (editable), `cursor-default` (locked). Buttons inside action box inherit pointer cursor from their `<button>` element. Disabled buttons get `pointer-events-none`.

## Refinements Needed

### Refinement 1: Click Feedback Animation (Requirement 4)

Currently, action buttons have no visual feedback on click -- only `hover:bg-gray-100`. Adding a brief `active:scale-95` transform gives immediate tactile feedback.

**Change in `EditableImage.tsx`**: Update every action button's className from:
```
"p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-700"
```
to:
```
"p-1.5 rounded-md hover:bg-gray-100 active:scale-95 transition-all text-gray-700"
```

This applies to all 5 buttons: Restyle (line 142), Regenerate (line 158), Move Up (line 174), Move Down (line 192), More Options (line 218).

Note: `transition-colors` changes to `transition-all` so the `scale` transform also animates.

### Refinement 2: Individual Button Hover Elevation (Requirement 3)

Add a subtle shadow on hover to give each button a slight "lift" effect, differentiating it from its neighbors.

**Change**: Add `hover:shadow-sm` to each action button's className. Combined with the existing `hover:bg-gray-100`, this creates a gentle glow/elevation.

Updated button class becomes:
```
"p-1.5 rounded-md hover:bg-gray-100 hover:shadow-sm active:scale-95 transition-all text-gray-700"
```

### Refinement 3: Dropdown Items Click Feedback

The dropdown menu items (`DropdownMenuItem`) currently have Radix's built-in `focus:bg-accent` but no click feedback. Add `active:scale-[0.98]` to the Delete item specifically (since it is the most destructive action) for emphasis.

**Change in `EditableImage.tsx`**: Update the Delete `DropdownMenuItem` className from:
```
"text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600"
```
to:
```
"text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600 active:scale-[0.98] transition-transform"
```

## Technical Details

### File: `src/components/website-preview/EditableImage.tsx`

All changes are className string updates on existing elements:

1. **Restyle button** (line 142): Add `hover:shadow-sm active:scale-95`, change `transition-colors` to `transition-all`
2. **Regenerate button** (line 158): Same change
3. **Move Up button** (line 174): Same change (disabled styling already handled separately)
4. **Move Down button** (line 192): Same change
5. **More Options button** (line 218): Same change
6. **Delete dropdown item** (line 244): Add `active:scale-[0.98] transition-transform`

### Motion Design System Summary

| Element | Enter | Hover | Active (Click) | Exit |
|---------|-------|-------|----------------|------|
| Action box container | `opacity-0 scale-95` to `opacity-100 scale-100` (200ms) | -- | -- | Reverse (200ms) |
| Hover border | `border-transparent` to `border-primary` (200ms) | -- | -- | Reverse (200ms) |
| Icon button | -- | `bg-gray-100 shadow-sm` | `scale-95` | -- |
| Dropdown menu | Radix `fade-in zoom-in-95 slide-in` | `bg-accent` per item | -- | Radix `fade-out zoom-out-95` |
| Delete item | -- | `bg-red-50` | `scale-[0.98]` | -- |
| Disabled button | `opacity-40 pointer-events-none` | -- | -- | -- |

### Interaction Timing Guidelines

| Transition | Duration | Easing |
|------------|----------|--------|
| Action box appear/disappear | 200ms | ease-out (Tailwind default) |
| Border color change | 200ms | ease-out |
| Button hover bg + shadow | ~150ms | ease (CSS default for transition-all) |
| Button active scale | Instant (CSS active pseudo) | -- |
| Tooltip appear | 300ms delay | Radix default |
| Dropdown open/close | ~150ms | Radix cubic-bezier |

### Accessibility Considerations

- All buttons retain `role="button"` semantics (native `<button>` elements)
- `disabled` attribute is set on Move Up/Down when at boundaries
- `tabIndex={0}` on the image container allows keyboard focus
- Tooltip `delayDuration={300}` prevents flashing on quick mouse movements
- `aria-labelledby` comes from Radix Tooltip and DropdownMenu automatically
- `active:scale-95` does not affect layout or accessibility tree -- purely visual
- Color contrast: `text-gray-700` on `bg-white/95` meets WCAG AA

### Files Changed

Only `src/components/website-preview/EditableImage.tsx` -- className string updates on 6 elements.

