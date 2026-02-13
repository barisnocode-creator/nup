
# Image Action Box - Expanded Controls

## Overview

Expand the current single-button action box in `EditableImage.tsx` to include 5 controls matching the section action box pattern already used in `EditableSection.tsx`. Add a "More Options" dropdown using Radix DropdownMenu.

## Control Layout (left to right)

```text
+-------------------------------------------------------+
| [Restyle] [Regenerate] [Move Up] [Move Down] [More ⋯] |
+-------------------------------------------------------+
```

1. **Restyle** (Paintbrush icon) -- opens image editor sidebar (existing `onSelect` callback)
2. **Regenerate** (Wand2 icon) -- triggers image regeneration
3. **Move Up** (ChevronUp icon) -- moves parent section up
4. **Move Down** (ChevronDown icon) -- moves parent section down
5. **More Options** (MoreHorizontal icon) -- opens dropdown menu

### More Options Dropdown

- **Edit Section** (Edit3 icon) -- opens section editor
- **Duplicate** (Copy icon) -- duplicates section
- **Delete** (Trash2 icon, red text) -- deletes section

## Technical Details

### 1. Props Extension (`EditableImage.tsx`)

Add new optional callback props to support the expanded actions:

```text
New props:
  onRegenerate?: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  onEdit?: () => void
  onDuplicate?: () => void
  onDelete?: () => void
  isFirst?: boolean
  isLast?: boolean
```

These are optional so existing usages without the new props continue to work (only the edit/restyle button shows if callbacks aren't provided).

### 2. Action Box Structure

Replace the current single-button box with:

```text
<div class="absolute top-2 right-2 z-20 ...">
  <div class="flex items-center gap-0.5 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-1 border">
    <!-- Tooltip-wrapped icon buttons -->
    <TooltipProvider>
      <Tooltip><TooltipTrigger><button>Paintbrush</button></TooltipTrigger>
        <TooltipContent>Restyle</TooltipContent></Tooltip>
      <Tooltip><TooltipTrigger><button>Wand2</button></TooltipTrigger>
        <TooltipContent>Regenerate</TooltipContent></Tooltip>
      <Tooltip><TooltipTrigger><button>ChevronUp</button></TooltipTrigger>
        <TooltipContent>Move Up</TooltipContent></Tooltip>
      <Tooltip><TooltipTrigger><button>ChevronDown</button></TooltipTrigger>
        <TooltipContent>Move Down</TooltipContent></Tooltip>

      <!-- Separator -->
      <div class="w-px h-4 bg-gray-300 mx-0.5" />

      <!-- Dropdown -->
      <DropdownMenu>
        <DropdownMenuTrigger>
          <button>MoreHorizontal</button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit Section</DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="text-red-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  </div>
</div>
```

### 3. Individual Button Styling

Each icon button:
- Size: `p-1.5` (28px touch target)
- Icon size: `w-3.5 h-3.5` (14px)
- Hover: `hover:bg-gray-100` (light), transitions via `transition-colors`
- Disabled: `opacity-40 pointer-events-none` (for first/last move buttons)
- Border radius: `rounded-md`
- Color: `text-gray-700`

### 4. Dropdown Behavior

- Uses existing `DropdownMenu` from `@radix-ui/react-dropdown-menu` (already in project)
- Opens on click, closes on outside click or item selection
- `align="end"` to anchor to the right edge
- Each item has an icon (16px) + label
- Delete item styled with `text-red-600` for destructive emphasis
- `onClick` on items calls `e.stopPropagation()` to prevent image click handler

### 5. Tooltip Labels

- Uses existing `Tooltip` from `@radix-ui/react-tooltip` (already in project)
- `delayDuration={300}` for a quick but non-intrusive reveal
- Side: `bottom` to avoid clipping at top edge
- Labels in Turkish: "Stili Degistir", "Yeniden Olustur", "Yukari Tasi", "Asagi Tasi", "Diger"

### 6. Micro-Interaction Feedback

- Action box entrance: `opacity-0 scale-95` to `opacity-100 scale-100` (200ms) -- already exists
- Button hover: `bg-gray-100` with `transition-colors` (150ms)
- Dropdown open: Radix built-in `animate-in fade-in-0 zoom-in-95` -- already configured in project's DropdownMenuContent
- Disabled buttons: reduced opacity, no pointer events
- Delete hover: `hover:bg-red-50` for destructive emphasis

### 7. Conditional Rendering

Controls only render if their callback is provided:
- Restyle always shows (uses existing `onSelect`)
- Regenerate only if `onRegenerate` is provided
- Move Up/Down only if `onMoveUp`/`onMoveDown` are provided
- More Options only if any of `onEdit`/`onDuplicate`/`onDelete` are provided
- Separator only renders if both primary actions and dropdown exist

### 8. Imports to Add

```text
From lucide-react: Paintbrush, Wand2, ChevronUp, ChevronDown, MoreHorizontal, Edit3, Copy, Trash2
From @/components/ui/tooltip: Tooltip, TooltipTrigger, TooltipContent, TooltipProvider
From @/components/ui/dropdown-menu: DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator
```

### 9. Files Changed

Only **one file**: `src/components/website-preview/EditableImage.tsx`

No template files need updating -- the new props are all optional, so existing usages continue working with just the restyle button visible. Templates can opt in to the expanded toolbar by passing the new callbacks.
