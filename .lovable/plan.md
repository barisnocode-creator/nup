
# Scalable Template Architecture - Non-Destructive Extension Plan

## Current Architecture Summary

The system uses a dual-layer approach:
- **Editor layer**: ChaiBuilder SDK with registered custom blocks (Hero, About, Services, etc.) stored as `chai_blocks` JSON in the database
- **Publish layer**: `deploy-to-netlify` edge function with mirrored HTML renderers for each block type
- **Theme layer**: `ChaiThemeValues` presets mapped via `templateToPreset` record, stored as `chai_theme` in DB
- **Content generation**: `generate-website` edge function produces `GeneratedContent`, then `convertGeneratedContentToChaiBlocks()` transforms it into block arrays

Templates today are NOT layout blueprints -- they are just theme presets (fonts + colors). The actual layout is determined by the block sequence in `chai_blocks`.

## Proposed Schema-Driven Template System

### 1. Template Definition Schema

A new file `src/templates/catalog/definitions.ts` will hold template definitions as pure data (no components):

```typescript
interface TemplateDefinition {
  id: string;
  name: string;
  industry: string;
  category: string;
  description: string;
  preview: string;               // static image path
  themePresetKey: string;         // maps to existing presets
  sections: TemplateSectionDef[];
  supportedIndustries: string[];
}

interface TemplateSectionDef {
  type: string;        // existing block _type: 'HeroCentered', 'ServicesGrid', etc.
  variant?: string;    // future: 'split' | 'centered' | 'overlay' for hero
  defaultProps: Record<string, any>;  // default content/config
  required?: boolean;  // e.g. hero cannot be removed
}
```

This maps directly to the output format requested:
```json
{
  "template_id": "wellness-studio",
  "industry": "wellness",
  "sections": [
    { "type": "HeroCentered", "variant": "centered", "component_id": "HeroCentered", "style_tokens": {} }
  ]
}
```

### 2. Template Resolution Flow

```text
User selects template
        |
        v
TemplateDefinition (pure data)
        |
        +---> themePresetKey --> existing ChaiThemeValues preset
        |
        +---> sections[] --> map to ChaiBlock[] using defaultProps
        |
        v
  Save to DB: chai_blocks + chai_theme
        |
        v
  Editor loads normally (no changes needed)
```

### 3. Conversion Function (extends existing `convertToChaiBlocks.ts`)

A new function `convertTemplateToBlocks()`:

```typescript
function convertTemplateToBlocks(
  definition: TemplateDefinition,
  content?: GeneratedContent
): ChaiBlock[] {
  return definition.sections.map(section => ({
    _id: generateBlockId(),
    _type: section.type,
    ...section.defaultProps,
    // Override with AI-generated content if available
    ...extractContentForBlockType(section.type, content),
  }));
}
```

This reuses the existing block type system -- no new component types needed.

### 4. Variant Mapping (Future-Safe)

For blocks with multiple variants (e.g., Hero has Split/Centered/Overlay), the variant is simply the `_type` field:

| Variant | _type | Already Registered |
|---------|-------|--------------------|
| Hero Centered | HeroCentered | Yes |
| Hero Split | HeroSplit | Yes |
| Hero Overlay | HeroOverlay | Yes |

No new renderer logic needed. Variants map 1:1 to existing registered blocks.

### 5. File Changes

| File | Change | Risk |
|------|--------|------|
| `src/templates/catalog/definitions.ts` | NEW - Template definitions as data | None (additive) |
| `src/templates/catalog/index.ts` | NEW - Registry + lookup functions | None (additive) |
| `src/components/chai-builder/utils/convertToChaiBlocks.ts` | ADD `convertTemplateToBlocks()` function | Low (additive, no existing code changed) |
| `src/components/chai-builder/TemplateGalleryOverlay.tsx` | UPDATE to read from new catalog | Low (gallery reads template list) |
| `src/templates/index.ts` | UPDATE `getAllTemplates()` to merge catalog definitions | Low |
| `src/components/chai-builder/themes/presets.ts` | No change -- new templates reference existing presets | None |

### 6. Editor Compatibility Safeguards

- Templates resolve to standard `ChaiBlock[]` arrays -- the editor sees blocks, not templates
- No editor UI changes; gallery overlay already exists and works
- Drag/drop unaffected because blocks are standard registered types
- Inline editing works because blocks use `inlineEditProps` (already configured)
- Theme switching uses existing `themePresets` array passed to `ChaiBuilderEditor`
- Auto-save writes to same `chai_blocks` / `chai_theme` columns

### 7. Publish Pipeline Compatibility

- `deploy-to-netlify` already renders by `_type` switch -- any block sequence works
- No new block types means no new HTML renderers needed
- Theme CSS variables are already extracted from `chai_theme`

### 8. AI Generation Alignment

Update `generate-website` edge function to:
1. Accept optional `template_id` parameter
2. Look up `TemplateDefinition` for section order
3. Generate content that fills the template's section structure
4. Return blocks matching the template layout

This is a content-only change in the edge function -- no layout restructuring.

### 9. Scaling to 20 Templates

Each new template is just a data object (~30 lines):
- Pick a theme preset (8 available)
- Define section order from existing 11 block types
- Set default prop values
- Add a preview image

No new components, no renderer changes, no editor modifications.

### 10. Migration Avoidance

- No database schema changes needed
- Existing projects keep their `chai_blocks` and `chai_theme` unchanged
- Template definitions are purely additive metadata
- Old template IDs in DB (`pilates1`, `temp1`, etc.) continue to resolve via backward-compatible lookup

### 11. Performance Impact

- Template definitions are lightweight JSON (~2KB each, 20 templates = ~40KB)
- No runtime rendering overhead -- templates resolve at creation time only
- Gallery overlay already uses lazy loading and error boundaries
- Static preview images for mobile already implemented

### Safety Assessment

```text
safe_changes:
  - New catalog files (purely additive)
  - convertTemplateToBlocks function (new, non-breaking)
  - Gallery reads from expanded template list

requires_migration: []

parity_risk_points: []

editor_impact_assessment:
  Zero editor changes. Templates become blocks before touching the editor.

rollback_plan:
  Delete catalog files, revert getAllTemplates() to current implementation.
  No data migration needed.
```
