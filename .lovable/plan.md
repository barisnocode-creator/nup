
# Contextual Floating Edit Card

## Current State
The `DesktopEditorLayout` already uses `ChaiBlockPropsEditor` and `ChaiBlockStyleEditor` from the SDK, which are inherently context-aware -- they automatically show the correct fields based on the selected block type (text fields for text, image fields for images, section spacing for sections). The problem is: the card is always visible and doesn't respond to selection events.

## Approach
Since the SDK doesn't expose a `useSelectedBlock` hook, we'll use a MutationObserver on the props editor container to detect when the SDK populates it with content (block selected) vs when it's empty (no selection). This gives us reliable selection awareness without hacking the SDK internals.

## Changes

### 1. `src/components/chai-builder/DesktopEditorLayout.tsx`

**Selection-aware visibility:**
- Start with `showRight: false`
- Use a `ref` on the props/styles container and a `MutationObserver` to detect when `ChaiBlockPropsEditor` renders content (meaning a block is selected)
- When content appears, slide the card in; when it empties, slide it out
- This replaces the manual toggle approach that didn't work with iframe clicks

**Improved animation:**
- Slide-in from right: `initial={{ x: 30, opacity: 0, scale: 0.95 }}` with spring physics
- Smooth exit with matching reverse animation
- Card remains compact: `w-[280px]`, `max-h-[420px]`

**Manual toggle preserved:**
- The Settings2 button in the toolbar acts as a force show/hide override
- Closing the card via X button hides it until next block selection

### 2. `src/styles/chaibuilder.tailwind.css`

**Floating card refinements:**
- Tighten the gradient border width from 3px to 2px for a sleeker look
- Add subtle box-shadow for depth
- Ensure the card doesn't overlap the screen-size toolbar buttons

**SDK sidebar suppression:**
- Strengthen the CSS rule that hides SDK's internal right sidebar so it never appears alongside the floating card

## Technical Details

The MutationObserver approach:
```text
propsContainerRef --> MutationObserver(childList, subtree)
  |
  +-- Has child nodes? --> setShowRight(true)
  +-- Empty?          --> setShowRight(false)
```

This is reliable because `ChaiBlockPropsEditor` renders form fields only when a block is selected and clears them when deselected. The observer fires on DOM mutations inside the container.

### Files to modify:
1. `src/components/chai-builder/DesktopEditorLayout.tsx` - MutationObserver logic, refined animation, compact layout
2. `src/styles/chaibuilder.tailwind.css` - Tighter gradient border, stronger SDK sidebar suppression
