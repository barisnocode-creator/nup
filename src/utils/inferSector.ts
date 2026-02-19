/**
 * Smart sector inference from form data.
 * Scans business name, services, and other fields to determine
 * the most appropriate sector profile key.
 */

const SECTOR_KEYWORDS: Record<string, string[]> = {
  doctor: [
    'estetik', 'cerrahi', 'doktor', 'klinik', 'muayene', 'hasta',
    'tıp', 'sağlık', 'saglik', 'medical', 'clinic', 'hospital',
    'hastane', 'ameliyat', 'tedavi', 'rinoplasti', 'liposuction',
    'botox', 'dolgu', 'ortopedi', 'kardiyoloji', 'dermatoloji',
    'göz', 'kulak', 'burun', 'nöroloji', 'üroloji', 'jinekolog',
    'pratisyen', 'uzman', 'hekim', 'cerrah', 'surgeon', 'doctor',
    'health', 'wellness', 'fizyoterapi', 'fizik tedavi',
  ],
  dentist: [
    'diş', 'dis', 'dental', 'ortodonti', 'implant', 'periodont',
    'endodonti', 'dentist', 'ağız', 'çene',
  ],
  pharmacy: [
    'eczane', 'eczacı', 'ilaç', 'ilac', 'pharmacy', 'pharmacist',
    'dermokozmetik',
  ],
  restaurant: [
    'restoran', 'restaurant', 'yemek', 'mutfak', 'lezzet',
    'bistro', 'fine dining', 'lokanta', 'kebap', 'pizza',
    'burger', 'sushi', 'steak',
  ],
  cafe: [
    'kafe', 'cafe', 'kahve', 'coffee', 'barista', 'espresso',
    'pastane', 'patisserie', 'bakery', 'fırın',
  ],
  hotel: [
    'otel', 'hotel', 'konaklama', 'resort', 'motel', 'hostel',
    'pansiyon', 'apart', 'butik otel',
  ],
  lawyer: [
    'avukat', 'hukuk', 'lawyer', 'büro', 'buro', 'attorney',
    'hukuki', 'dava', 'mahkeme', 'arabulucu', 'noter',
  ],
  beauty_salon: [
    'güzellik', 'guzellik', 'salon', 'kuaför', 'kuafor', 'beauty',
    'cilt', 'makyaj', 'bakım', 'bakim', 'spa', 'nail', 'tırnak',
    'kirpik', 'kaş', 'epilasyon', 'lazer', 'saç', 'sac',
  ],
  gym: [
    'spor', 'gym', 'fitness', 'antrenman', 'pilates', 'yoga',
    'crossfit', 'boks', 'yüzme', 'dans', 'jimnastik',
  ],
  veterinary: [
    'veteriner', 'hayvan', 'pet', 'evcil', 'kedi', 'köpek',
    'kopek', 'kuş', 'kus',
  ],
};

/**
 * Infer a sector profile key from form data by scanning
 * business name, services, and other text fields.
 *
 * Returns a sectorProfiles key (e.g. 'doctor', 'dentist') or empty string.
 */
export function inferSectorFromFormData(formData: any): string {
  if (!formData) return '';

  // Collect all text sources to scan
  const texts: string[] = [];

  // Business names
  const businessName =
    formData?.extractedData?.businessName ||
    formData?.businessInfo?.businessName ||
    formData?.businessName ||
    '';
  if (businessName) texts.push(businessName);

  // Services arrays
  const serviceSources = [
    formData?.extractedData?.services,
    formData?.professionalDetails?.services,
    formData?.services,
  ];
  for (const src of serviceSources) {
    if (Array.isArray(src)) {
      src.forEach((s: any) => {
        if (typeof s === 'string') texts.push(s);
        else if (s?.name) texts.push(s.name);
        else if (s?.title) texts.push(s.title);
      });
    }
  }

  // Additional text fields
  const extraFields = [
    formData?.extractedData?.sector,
    formData?.extractedData?.targetAudience,
    formData?.extractedData?.uniqueValue,
    formData?.extractedData?.story,
    formData?.professionalDetails?.specialty,
  ];
  for (const f of extraFields) {
    if (typeof f === 'string' && f) texts.push(f);
  }

  // Normalize all text into a single searchable string
  const haystack = texts.join(' ').toLowerCase().replace(/[İıÖöÜüÇçŞşĞğ]/g, (c) => {
    const map: Record<string, string> = {
      'İ': 'i', 'ı': 'i', 'Ö': 'o', 'ö': 'o',
      'Ü': 'u', 'ü': 'u', 'Ç': 'c', 'ç': 'c',
      'Ş': 's', 'ş': 's', 'Ğ': 'g', 'ğ': 'g',
    };
    return map[c] || c;
  });

  // Score each sector by keyword matches
  let bestSector = '';
  let bestScore = 0;

  for (const [sector, keywords] of Object.entries(SECTOR_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      if (haystack.includes(kw)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestSector = sector;
    }
  }

  return bestSector;
}

/**
 * Resolve the effective sector from form_data using multiple strategies:
 * 1. form_data.businessType (explicit)
 * 2. form_data.sector (explicit)
 * 3. Keyword inference from all text fields
 */
export function resolveEffectiveSector(formData: any): string {
  if (!formData) return '';

  // Direct sector values
  const direct =
    formData?.businessType ||
    formData?.sector ||
    '';

  // If we have a specific (non-generic) value, use it
  const generic = ['service', 'other', 'retail', 'creative', 'technology', 'food'];
  if (direct && !generic.includes(direct.toLowerCase())) {
    return direct.toLowerCase().replace(/[\s-]/g, '_');
  }

  // Infer from content
  const inferred = inferSectorFromFormData(formData);
  if (inferred) return inferred;

  // Return the generic direct value as last resort
  return direct || '';
}
