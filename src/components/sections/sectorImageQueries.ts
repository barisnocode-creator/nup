/**
 * Central map: component context + sector → Pixabay search query
 * Used to pre-fill image pickers with sector-relevant search terms.
 */
export const sectorImageQueries: Record<string, Record<string, string>> = {
  hero: {
    lawyer: 'law office professional attorney',
    doctor: 'medical clinic doctor hospital',
    dentist: 'dental clinic dentist teeth',
    restaurant: 'restaurant fine dining elegant interior',
    cafe: 'specialty coffee cafe barista',
    hotel: 'luxury hotel lobby interior',
    gym: 'fitness gym workout exercise',
    beauty_salon: 'beauty salon spa luxury',
    veterinary: 'veterinary clinic pet animal care',
    pharmacy: 'pharmacy medical store',
    engineer: 'modern office technology workspace',
    developer: 'tech office coding workspace',
    architect: 'modern architecture design studio',
    consultant: 'business consulting office professional',
    education: 'education classroom learning',
    default: 'professional business office modern',
  },
  about: {
    lawyer: 'law library books legal justice',
    doctor: 'medical team hospital doctors',
    dentist: 'dental clinic staff team',
    restaurant: 'restaurant kitchen chef cooking',
    cafe: 'barista coffee making cafe interior',
    hotel: 'hotel service luxury hospitality',
    gym: 'fitness trainer exercise health',
    beauty_salon: 'beauty salon treatment spa',
    veterinary: 'veterinary doctor pet care',
    pharmacy: 'pharmacy pharmacist medicine',
    engineer: 'engineering team technology',
    developer: 'software team coding office',
    architect: 'architectural design blueprints',
    default: 'professional team office collaboration',
  },
  chef: {
    restaurant: 'professional chef cooking kitchen',
    cafe: 'barista coffee art latte',
    default: 'professional chef cooking culinary',
  },
  rooms: {
    hotel: 'luxury hotel room suite bedroom',
    apartment: 'modern apartment interior bedroom',
    default: 'interior modern room elegant',
  },
  gallery: {
    cafe: 'coffee shop cafe interior cozy',
    restaurant: 'restaurant interior elegant dining',
    hotel: 'hotel architecture exterior luxury',
    beauty_salon: 'beauty salon spa interior',
    gym: 'gym fitness equipment modern',
    default: 'modern interior architecture design',
  },
  project: {
    developer: 'software application technology digital',
    engineer: 'engineering construction project',
    architect: 'architectural project building design',
    designer: 'graphic design creative portfolio',
    default: 'professional project work achievement',
  },
  cta: {
    lawyer: 'justice law scales gavel courtroom',
    doctor: 'healthcare medical professional care',
    dentist: 'dental health teeth smile',
    restaurant: 'restaurant food gourmet plating',
    cafe: 'coffee espresso barista latte art',
    hotel: 'luxury hotel pool terrace view',
    gym: 'fitness healthy active lifestyle',
    default: 'professional service business success',
  },
};

/**
 * Returns the best Pixabay search query for a given component context and sector.
 */
export function getSectorImageQuery(component: string, sector: string): string {
  const map = sectorImageQueries[component] || {};
  const normalized = (sector || '').toLowerCase().replace(/[\s-]/g, '_');

  // Direct match
  if (map[normalized]) return map[normalized];

  // Partial match (e.g. "beauty_salon_istanbul" → "beauty_salon")
  for (const key of Object.keys(map)) {
    if (key !== 'default' && (normalized.includes(key) || key.includes(normalized))) {
      return map[key];
    }
  }

  return map.default || 'professional business office';
}

/**
 * Returns a default query for any section type, using the section's props._sector if available.
 */
export function getQueryForSection(sectionType: string, sector: string): string {
  const componentMap: Record<string, string> = {
    HeroCafe: 'hero',
    HeroRestaurant: 'hero',
    HeroDental: 'hero',
    HeroHotel: 'hero',
    HeroPortfolio: 'hero',
    HeroCentered: 'hero',
    HeroSplit: 'hero',
    HeroOverlay: 'hero',
    CafeStory: 'about',
    AboutSection: 'about',
    ChefShowcase: 'chef',
    RoomShowcase: 'rooms',
    CafeGallery: 'gallery',
    ImageGallery: 'gallery',
    ProjectShowcase: 'project',
    CTABanner: 'cta',
  };

  const component = componentMap[sectionType] || 'default';
  return getSectorImageQuery(component, sector);
}
