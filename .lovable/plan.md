

# AI Layout Generation Engine - Non-Destructive Integration

## Current State Analysis

The system has two disconnected pipelines:

1. **AI Content Pipeline**: `generate-website` edge function generates `GeneratedContent` JSON (text + images), saves to `generated_content` column, always sets `template_id = 'pilates1'`
2. **Template Catalog Pipeline**: `definitions.ts` has 8 schema-driven templates, `convertTemplateToBlocks()` can transform them into `ChaiBlock[]` with AI content overlay -- but this function is never called

The gap: AI generation ignores the catalog system. Template selection is hardcoded. The `convertTemplateToBlocks` bridge exists but is unused.

## Implementation Plan

### Step 1: Smart Template Selection in Edge Function

**File**: `supabase/functions/generate-website/index.ts`

Replace the hardcoded `selectTemplate()` (line 56-58, always returns `'pilates1'`) with logic that:
- Reads the sector/profession from extracted data
- Maps it to the best catalog template ID using a server-side mapping table
- Falls back to `'pilates1'` for backward compatibility

```text
Mapping:
  wellness/pilates/yoga/fitness/spa -> 'wellness-studio'
  lawyer/finance/consulting/corporate -> 'corporate-services'
  doctor/dentist/pharmacist/clinic -> 'medical-clinic'
  creative/design/marketing/agency -> 'creative-agency'
  food/restaurant/cafe/bakery -> 'restaurant-cafe'
  video/film/media/production -> 'video-production'
  software/saas/startup/app -> 'saas-platform'
  retail/shop/store/ecommerce -> 'retail-boutique'
  default -> 'pilates1' (backward compatible)
```

### Step 2: Wire convertTemplateToBlocks into Project Loading

**File**: `src/pages/Project.tsx`

Currently (line 292), when a project has `generated_content` but no `chai_blocks`, it calls `convertGeneratedContentToChaiBlocks()` -- this is the old monolithic converter that always produces the same section order.

Add a check: if the project's `template_id` matches a catalog template, use `convertTemplateToBlocks(definition, content)` instead. This respects the template's section order and default props while overlaying AI content.

```text
Logic flow:
  1. Check if template_id exists in catalog (getCatalogTemplate)
  2. If yes: use convertTemplateToBlocks(definition, generatedContent)
  3. If no: fall back to convertGeneratedContentToChaiBlocks() (existing behavior)
```

**File**: `src/components/chai-builder/ChaiBuilderWrapper.tsx`

Same pattern for the template preview flow (line 170-173): when previewing a catalog template, use `convertTemplateToBlocks` instead of `convertGeneratedContentToChaiBlocks`.

### Step 3: Layout Validation Rules

**File**: `src/components/chai-builder/utils/templateToBlocks.ts` (extend)

Add a `validateLayoutSchema()` function that checks the output before saving:

- Every block must have a valid `_type` matching a registered block
- Every block must have a unique `_id`
- Required sections (marked `required: true`) must be present
- No unknown block types allowed
- Maximum 12 sections per layout
- Props must not exceed 50KB total (prevent DB bloat)

This runs after `convertTemplateToBlocks` and before saving to DB.

### Step 4: Failure Fallback Logic

If AI content generation fails or returns invalid JSON, the system must still produce a usable layout:

**In edge function**: Already handles parse errors (returns 500). No change needed.

**In Project.tsx**: If `convertTemplateToBlocks` throws or returns empty, fall back to the catalog template's `defaultProps` only (no AI content overlay). This guarantees a valid layout even without AI content.

```text
Fallback chain:
  1. convertTemplateToBlocks(definition, aiContent)  -- full AI + template
  2. convertTemplateToBlocks(definition)              -- template defaults only
  3. convertGeneratedContentToChaiBlocks(content)     -- legacy converter
  4. Single HeroCentered block                        -- ultimate fallback
```

### Step 5: Theme Auto-Resolution

**File**: `src/pages/Project.tsx`

When the template is from the catalog, also resolve the theme using `getCatalogTheme(templateId)` instead of `getThemeForTemplate(templateId)`. This ensures the correct theme preset is applied for catalog templates.

## File Changes Summary

| File | Change | Risk |
|------|--------|------|
| `supabase/functions/generate-website/index.ts` | Replace `selectTemplate()` with sector-aware catalog mapping | Low - additive, backward compatible |
| `src/pages/Project.tsx` | Add catalog template check before block conversion | Low - fallback to existing logic |
| `src/components/chai-builder/ChaiBuilderWrapper.tsx` | Use catalog resolution in template preview | Low - preview only |
| `src/components/chai-builder/utils/templateToBlocks.ts` | Add `validateLayoutSchema()` function | None - additive |

## Safety Assessment

- **Editor impact**: Zero. Blocks arrive as standard `ChaiBlock[]` arrays regardless of which converter produced them.
- **Publish parity**: Guaranteed. No new block types. Same `chai_blocks` / `chai_theme` DB columns.
- **Backward compatibility**: Projects with `template_id = 'pilates1'` continue using the old `convertGeneratedContentToChaiBlocks` path unchanged.
- **Performance**: Template resolution is instant (dictionary lookup). No additional AI calls. Validation adds ~1ms.
- **Rollback**: Revert `selectTemplate()` to return `'pilates1'` and remove the catalog check in Project.tsx.

## Parity Testing Checklist

1. Create a new project in each sector (wellness, corporate, healthcare, creative, food, video, saas, retail)
2. Verify correct template is auto-selected (check `template_id` in DB)
3. Verify blocks load in editor with correct section order matching the template definition
4. Verify AI content (titles, descriptions, images) populates correctly into template sections
5. Verify inline editing works on all populated blocks
6. Verify drag-and-drop reordering works
7. Verify publish produces identical output to editor preview
8. Verify legacy projects (template_id = 'pilates1') still load correctly
9. Verify template switching via gallery still works
10. Verify fallback chain works when AI content is missing/invalid

