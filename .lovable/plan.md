

# Image Action Box -- Visibility and Behavior Rules

## Analysis of Current State

After reviewing the codebase, the existing `EditableImage` implementation already satisfies **most** of the 8 requirements. This plan documents what's already handled and identifies 3 small refinements needed.

## Already Handled (No Changes Needed)

### 1. Edit Mode Only (Requirement 1 and 2) -- DONE
The action box is gated by `{isEditable && (...)}` at line 122. The `isEditable` prop is set to `false` in:
- **Published site** (`PublicWebsite.tsx` line 156): `isEditable={false}`
- **Preview mode** (`Project.tsx` line 1396): `isEditable={isAuthenticated && !isPreviewMode}`
- **Unauthenticated visitors** (`Project.tsx`): `isAuthenticated` is false

No action box, hover border, or cursor change renders outside the editor canvas.

### 2. Smooth Fade In/Out (Requirement 4) -- DONE
Already uses `transition-all duration-200` with `opacity-0 scale-95` / `opacity-100 scale-100` toggled by `isHovered || isSelected`.

### 3. No Trigger on Non-Editable Images (Requirement 8) -- DONE
Background images in CSS (`background-image`) are not `EditableImage` instances and therefore never get hover interactions. Only `<EditableImage>` components with `isEditable={true}` produce hover effects.

### 4. Hover Detection Matches Image Boundaries (Requirement 7 of previous plan) -- DONE
`onMouseEnter` / `onMouseLeave` on the container div which wraps the image exactly.

## Refinements Needed

### Refinement 1: Z-Index Layer Hierarchy (Requirement 5)

Current z-index stack:
- `z-10` -- EditableImage container (when editable)
- `z-20` -- Image action box
- `z-30` -- EditableSection action box and label badge
- `z-40` -- Editor sidebar backdrop
- `z-50` -- Editor sidebar panel, DropdownMenuContent, modals, template preview banner

**Problem**: The DropdownMenuContent inside the image action box uses `z-50`, which is correct for it to appear above the sidebar backdrop (`z-40`). However, the action box container itself at `z-20` may clip behind a sibling section's `z-30` action box if two sections overlap.

**Fix**: Keep current values but ensure the action box parent gets `z-30` (matching section-level actions) so it doesn't get clipped. The dropdown already at `z-50` stays above modals' backdrops.

**Change in `EditableImage.tsx`**: Line 125, change `z-20` to `z-30`.

### Refinement 2: Locked Section Support (Requirement 6)

Currently, `EditableImage` has no concept of a "locked" or "view-only" section. Hero sections are protected from deletion in `EditableSection`, but the image inside can still be interacted with.

**Fix**: Add an optional `isLocked` prop. When `true`:
- The hover border still shows (so the user knows the element exists)
- The action box renders with all buttons disabled and a lock icon badge
- OR simpler: the action box does not render at all, and the hover border uses a muted color (`border-muted-foreground/30` instead of `border-primary`)

The simpler approach is better -- locked sections should feel non-interactive. A subtle gray border on hover communicates "this exists but you can't edit it."

**Changes in `EditableImage.tsx`**:
- Add `isLocked?: boolean` prop (default `false`)
- When `isLocked` is true: show muted hover border, hide action box entirely
- When `isLocked` is false: current behavior

### Refinement 3: Zoomed Editor Scale (Requirement 7)

The editor canvas does not currently use CSS `transform: scale()` for zoom -- it relies on viewport width changes (device switcher changes iframe/container width). Since `top-2 right-2` uses relative spacing and icons are fixed at 14px, the action box already scales correctly with container width changes.

**No change needed** -- the current approach with Tailwind spacing and small fixed icons is inherently scale-safe. If CSS zoom is added in the future, the action box will need `transform-origin: top right` to anchor correctly, but that's not required now.

## Technical Details

### File: `src/components/website-preview/EditableImage.tsx`

**Changes summary:**

1. Add `isLocked?: boolean` prop to interface (line 17 area)
2. Update hover border: when `isLocked`, use `border-muted-foreground/30` instead of `border-primary`
3. Gate action box rendering: `{isEditable && !isLocked && (...)}` instead of `{isEditable && (...)}`
4. Update action box z-index from `z-20` to `z-30`
5. When `isLocked`, change cursor from `cursor-pointer` to `cursor-default`

### Layer Hierarchy (Final)

```text
z-10  -- EditableImage container (editable)
z-30  -- Image action box + EditableSection action box (same level, never overlap)
z-40  -- Sidebar backdrop overlay
z-50  -- Sidebar panel, DropdownMenuContent, modals, banners
```

This ensures image actions float above the image but below all global UI (sidebars, modals, pickers).

### Mode Detection Summary

| Context | isEditable | isLocked | Action Box | Hover Border |
|---------|-----------|----------|------------|--------------|
| Editor (edit mode) | true | false | Visible on hover | Primary color |
| Editor (locked section) | true | true | Hidden | Muted gray |
| Template preview mode | false | -- | Hidden | None |
| Published site | false | -- | Hidden | None |
| Unauthenticated view | false | -- | Hidden | None |

### Transition Animation Behavior (Unchanged)

- **Hover enter**: `opacity-0 scale-95` to `opacity-100 scale-100` over 200ms ease-out
- **Hover leave**: Reverse transition, same duration
- **Selected state**: Action box stays visible (no transition needed, already at full opacity)
- **Border highlight**: `transition-colors duration-200` for smooth color change

### Files Changed

Only `src/components/website-preview/EditableImage.tsx` -- 5 small modifications within the existing component.
