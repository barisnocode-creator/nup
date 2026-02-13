
# UX and Engineering Rules -- Contextual Panel and Regeneration Workflow

This document provides the comprehensive rules, pseudo-APIs, data shapes, and QA plan so that the contextual editing panel and regeneration workflows can be implemented without breaking the existing Customize panel or editor behavior.

---

## 1. Architectural Invariants (Do NOT Break)

### Existing systems that must remain untouched:
- **Customize Panel** (`CustomizePanel.tsx`): Floating popover from toolbar, 280px, with drill-down sub-menus (Colors, Fonts, Corners, etc.). No code removal or behavioral change.
- **Editor Context** (`EditorContext.tsx`): Shared context with `projectId`, `projectName`, callbacks. New fields may be added but existing ones must not change signature.
- **Save Hook** (`useChaiBuilder.ts` > `useChaiBuilderSave`): Single save path via `supabase.from('projects').update({ chai_blocks, chai_theme })`. All save operations must flow through this hook.
- **SDK Components**: `ChaiBlockPropsEditor`, `ChaiBlockStyleEditor`, `ChaiBuilderCanvas` are black boxes. Cannot modify their internals.
- **Image Overlay System**: `EditableChaiImage`, `ChaiImageActionOverlay`, `InlineImageSwitcher` remain the primary image editing flow on canvas.

### Stacking order (z-index):
```text
z-30  Left panel (Outline / Add)
z-40  Right floating edit panel
z-50  Top toolbar
z-60  Customize popover
z-70  RegeneratePopover
z-80+ Global modals (Publish, Auth, etc.)
```

The contextual panel sits at z-40. Image hover overlays on canvas must remain visible when they do not overlap the panel. No z-index changes to existing layers.

---

## 2. Save / Staging / Undo Rules

### Current behavior (keep as-is):
The SDK's `onSave` callback fires on explicit save and auto-save (every 5 actions). The `handleSave` in `ChaiBuilderWrapper` calls `saveToSupabase`. This is the **only** persistence path.

### Contextual panel behavior:
- Edits made through SDK editors (`ChaiBlockPropsEditor`, `ChaiBlockStyleEditor`) inside the contextual panel are **immediately staged in the SDK's internal state** and shown on canvas. This is existing SDK behavior and cannot be intercepted.
- The SDK's built-in auto-save (`autoSave: true, autoSaveActionsCount: 5`) handles persistence automatically.
- The "Tamam" (Done) button simply **closes the panel**. It does not trigger an extra save -- the SDK's auto-save handles this.
- No separate "Save" / "Discard" buttons are needed in this phase because the SDK manages its own changeset internally. Adding a staging layer on top would require intercepting SDK internals, which is not feasible.

### Undo:
- The SDK provides `ChaiUndoRedo` (already imported but currently hidden). The SDK maintains its own undo stack for block/style changes.
- For regeneration actions specifically, the `RegeneratePopover` provides a single-level undo via toast notification (already implemented).
- Keyboard shortcuts (Ctrl/Cmd+Z) are handled by the SDK natively within the canvas.

### Conflict handling:
- Not applicable in current phase. The app is single-user per project (enforced by RLS `user_id` check). Multi-user concurrent editing is out of scope.

---

## 3. Contextual Panel UX Rules

### Opening:
- Panel opens when `showRight` is true (toggled by `PanelRightClose` button in toolbar).
- Panel shows SDK editors for whatever block is selected on canvas.
- If no block is selected, panel shows empty state message.

### Closing:
- "Tamam" button closes the panel.
- Escape key closes the panel (already implemented).
- Clicking outside does NOT close the panel (intentional -- prevents accidental closure during editing).

### Position and size:
- `absolute right-3 top-3 bottom-3` within the canvas area.
- Width: 360px fixed.
- `bg-white rounded-xl shadow-2xl border border-border/40`.
- Does not push or resize the canvas.

### Animation:
- Open: `x: 20 -> 0, opacity: 0 -> 1, duration: 180ms, ease: easeOut`
- Close: `x: 0 -> 20, opacity: 1 -> 0` (handled by AnimatePresence exit)

### Tabs:
- "Icerik" (Content) tab renders `ChaiBlockPropsEditor`
- "Stil" (Style) tab renders `ChaiBlockStyleEditor`
- Default tab on open: "Icerik"

---

## 4. Regeneration Workflow Rules

### Text Regeneration (`RegeneratePopover`):

**Trigger:** Sparkles button in the contextual panel header.

**Pseudo-API -- regenerate-content:**
```text
INPUT:
  POST /functions/v1/regenerate-content
  Authorization: Bearer <user-token>
  Body: {
    projectId: string,        // UUID
    fieldPath: string,         // e.g. "pages.home.hero.title"
    currentValue?: string,     // existing text to replace
    variants: 3                // number of alternatives
  }

OUTPUT (success):
  {
    success: true,
    fieldPath: string,
    variants: [
      { text: "Short version", length: "short" },
      { text: "Medium length version", length: "medium" },
      { text: "Longer more descriptive version", length: "long" }
    ]
  }

OUTPUT (error):
  { success: false, error: "Error message" }

LATENCY: 800-2000ms typical (Gemini 2.5 Flash)
```

**UX flow:**
1. User clicks Sparkles button
2. Popover opens with 3 skeleton cards (loading state)
3. API returns -> skeletons replaced with variant cards
4. User clicks a variant -> popover closes, toast shows "Icerik guncellendi" with "Geri Al" action
5. "Tekrar Olustur" button at bottom fetches new set
6. Error state: toast with destructive variant, popover stays open

**Popover specs:**
- Width: 300px
- Position: absolute, right-aligned, below trigger button
- z-index: 70 (above contextual panel)
- Close: outside click, Escape key, or variant selection
- Max height: 320px with overflow scroll

### Image Regeneration:

Image replacement continues through the existing canvas-level system:
1. Hover over image on canvas -> `ChaiImageActionOverlay` appears
2. "Degistir" opens `InlineImageSwitcher` (Pixabay search)
3. "Yenile" fetches a random new image from Pixabay

**Pseudo-API -- search-pixabay:**
```text
INPUT:
  POST /functions/v1/search-pixabay
  Body: {
    query: string,          // auto-generated from alt text + profession
    page: number,           // pagination (default 1)
    perPage: number,        // results per page (default 20)
    orientation?: string,   // "horizontal" | "vertical" | "all"
    imageType?: string      // "photo" | "illustration" | "vector"
  }

OUTPUT:
  {
    hits: [
      {
        id: number,
        webformatURL: string,    // 640px preview
        largeImageURL: string,   // full resolution
        tags: string,
        user: string,            // photographer name
        imageWidth: number,
        imageHeight: number
      }
    ],
    totalHits: number
  }
```

No changes needed to image workflow in this phase.

---

## 5. Feature Flag

Wrap the contextual panel behind a simple boolean flag:

```typescript
// In EditorContext or a separate config
const FEATURE_FLAGS = {
  contextualPanel: true,  // toggle to false to revert to no right panel
};
```

When `contextualPanel` is `false`:
- `PanelRightClose` button hidden from toolbar
- Right panel never renders
- All other editor functionality unchanged

Implementation: Add `featureFlags` to `EditorContext` interface. Check `featureFlags.contextualPanel` before rendering the panel in `DesktopEditorLayout`.

---

## 6. Accessibility Rules

### Keyboard:
- Tab order within panel: Header (Done, Regenerate) -> Tab buttons -> SDK editor fields
- Escape closes panel (already implemented)
- Enter on regenerate variant applies it (add `onKeyDown` handler to variant buttons)

### ARIA:
- Panel container: `role="region" aria-label="Bolum duzenleme paneli"`
- NOT `aria-modal="true"` (panel is non-modal, canvas remains interactive)
- Regenerate popover: `role="dialog" aria-label="Alternatif icerikler"`
- Variant buttons: `aria-label="Kisa varyant: [text preview]"`

### Focus:
- When panel opens, do NOT auto-focus (would steal focus from canvas selection)
- When regenerate popover opens, focus first variant or close button
- Visible focus ring: `focus-visible:ring-2 focus-visible:ring-primary/50` on all interactive elements

---

## 7. Performance Rules

- `RegeneratePopover` is already lazily rendered (only mounts when open state is true via AnimatePresence)
- `PixabayImagePicker` and `InlineImageSwitcher` are already conditionally rendered in `ChaiBuilderWrapper`
- The SDK editors (`ChaiBlockPropsEditor`, `ChaiBlockStyleEditor`) re-render only when the selected block changes (SDK-managed)
- The contextual panel uses `AnimatePresence` with `exit` props, ensuring unmount on close

No additional lazy-loading changes needed for current scope.

---

## 8. Analytics Events

Add these event emissions at the specified code locations:

| Event | Trigger Location | Data |
|-------|-----------------|------|
| `contextual.open` | `showRight` set to `true` in DesktopEditorLayout | `{ timestamp }` |
| `contextual.close` | `showRight` set to `false` | `{ timestamp, duration_ms }` |
| `field.regenerate.requested` | `fetchVariants()` in RegeneratePopover | `{ projectId, fieldPath }` |
| `field.regenerate.applied` | `handleApply()` in RegeneratePopover | `{ projectId, fieldPath, variantLength }` |
| `field.regenerate.undo` | Undo button click in toast | `{ projectId, fieldPath }` |
| `image.replace` | Image selected in InlineImageSwitcher | `{ projectId, blockType }` |
| `image.replace.undo` | Undo in image toast | `{ projectId }` |

Implementation: Use the existing `useAnalytics` hook or `supabase.functions.invoke('track-analytics', ...)`.

---

## 9. QA Test Plan

### Test 1: Panel open/close
- Click PanelRightClose button -> panel slides in from right (180ms)
- Click "Tamam" -> panel slides out
- Press Escape -> panel closes
- Click on canvas (outside panel) -> panel stays open (intentional)

### Test 2: Tab switching
- Default tab is "Icerik" (Content)
- Click "Stil" -> shows ChaiBlockStyleEditor
- Click "Icerik" -> shows ChaiBlockPropsEditor
- Tab state persists while panel is open

### Test 3: Block selection binding
- Select Hero block on canvas -> panel shows Hero properties
- Select Services block -> panel updates to Services properties
- Deselect all -> panel shows empty/default state

### Test 4: Regenerate text
- Click Sparkles -> popover opens with 3 skeletons
- Wait for API -> 3 variant cards appear
- Click variant -> popover closes, toast appears, text updates
- Click "Geri Al" in toast -> original text restored
- Click "Tekrar Olustur" -> new skeletons, new variants
- Network error -> destructive toast, popover stays open

### Test 5: Coexistence with Customize
- Open Customize panel (toolbar) -> works normally
- Open contextual panel (PanelRightClose) -> both visible simultaneously
- Customize does NOT interfere with contextual panel
- Close Customize -> contextual panel unaffected
- Close contextual panel -> Customize unaffected

### Test 6: Image overlay non-interference
- With contextual panel open, hover image on canvas left side -> overlay appears
- Hover image behind/under panel -> overlay may be hidden (acceptable)
- Image replace flow works regardless of panel state

### Test 7: Keyboard accessibility
- Tab through panel controls
- Enter on variant button applies it
- Escape closes popover first, then panel on second press

### Edge cases:
- Rapidly toggle panel open/close -> no animation glitch
- Resize browser window -> panel stays positioned correctly
- Switch screen mode (desktop/tablet/mobile) -> panel remains functional
- Open left panel (Outline) + right panel simultaneously -> no overlap issues (left panel is 260px, right panel is 360px, canvas fills remaining)
