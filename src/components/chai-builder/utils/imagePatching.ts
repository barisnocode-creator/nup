import { GeneratedContent } from '@/types/generated-website';

/**
 * Resolves the best available image URL from multiple fallback keys.
 */
function resolveImage(images: Record<string, any> | undefined, ...keys: string[]): string {
  if (!images) return '';
  for (const key of keys) {
    const val = images[key];
    if (typeof val === 'string' && val.length > 0) {
      if (val.startsWith('http://') || val.startsWith('https://')) return val;
      if (val.startsWith('data:') && val.length > 200000) continue;
      return val;
    }
  }
  return '';
}

/**
 * Checks if existing chai_blocks are missing image data that could be filled from generated_content.
 */
export function blocksNeedImageRefresh(blocks: any[], content: GeneratedContent): boolean {
  if (!blocks || blocks.length === 0 || !content?.images) return false;
  
  const images = content.images;
  const hasAvailableImages = Object.values(images).some(
    v => typeof v === 'string' && v.length > 0 && (
      v.startsWith('http://') || v.startsWith('https://') || v.length < 200000
    )
  );
  if (!hasAvailableImages) return false;

  const heroBlock = blocks.find(b => b._type === 'HeroCentered' || b._type === 'HeroSplit' || b._type === 'HeroOverlay');
  if (heroBlock && !heroBlock.backgroundImage && !heroBlock.image) {
    const heroImage = resolveImage(images, 'heroHome', 'heroAbout', 'heroSplit', 'heroServices');
    if (heroImage) return true;
  }

  const aboutBlock = blocks.find(b => b._type === 'AboutSection');
  if (aboutBlock && !aboutBlock.image) {
    const aboutImage = resolveImage(images, 'aboutImage', 'heroAbout', 'aboutTeam');
    if (aboutImage) return true;
  }

  return false;
}

/**
 * Patches existing blocks with image data from generated_content without regenerating all blocks.
 */
export function patchBlocksWithImages(blocks: any[], content: GeneratedContent): any[] {
  if (!content?.images) return blocks;
  const images = content.images;

  return blocks.map(block => {
    switch (block._type) {
      case 'HeroCentered':
      case 'HeroSplit':
      case 'HeroOverlay': {
        const imgKey = block._type === 'HeroSplit' ? 'image' : 'backgroundImage';
        if (!block[imgKey]) {
          const heroImage = resolveImage(images, 'heroHome', 'heroAbout', 'heroSplit', 'heroServices');
          if (heroImage) return { ...block, [imgKey]: heroImage };
        }
        return block;
      }
      case 'AboutSection': {
        if (!block.image) {
          const aboutImage = resolveImage(images, 'aboutImage', 'heroAbout', 'aboutTeam');
          if (aboutImage) return { ...block, image: aboutImage };
        }
        return block;
      }
      case 'ImageGallery': {
        const galleryImages = images.galleryImages as string[] | undefined;
        if (galleryImages && galleryImages.length > 0) {
          const patches: Record<string, string> = {};
          for (let i = 0; i < Math.min(6, galleryImages.length); i++) {
            const key = `image${i + 1}`;
            if (!block[key] && galleryImages[i]) {
              const img = galleryImages[i];
              if (typeof img === 'string') {
                if (img.startsWith('http://') || img.startsWith('https://')) {
                  patches[key] = img;
                } else if (img.length < 200000) {
                  patches[key] = img;
                }
              }
            }
          }
          if (Object.keys(patches).length > 0) return { ...block, ...patches };
        }
        return block;
      }
      default:
        return block;
    }
  });
}
