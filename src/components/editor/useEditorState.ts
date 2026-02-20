import { useState, useCallback, useRef } from 'react';
import type { SiteSection, SiteTheme } from '@/components/sections/types';
import { getCatalogTemplate, getCatalogTheme } from '@/templates/catalog';
import { mapContentToTemplate, type ProjectData } from '@/templates/catalog/contentMapper';
import { filterIncompatibleSections } from '@/templates/catalog/mappers';
import { injectImages, injectContactInfo, buildFooterSection } from '@/utils/sectionInjectors';


// Map of addable section keys to their section type and default props
const addableSectionConfig: Record<string, { type: string; defaultProps: Record<string, any> }> = {
  appointment: { type: 'AddableAppointment', defaultProps: {} },
  faq: { type: 'AddableFAQ', defaultProps: {} },
  messageForm: { type: 'AddableMessageForm', defaultProps: {} },
  workingHours: { type: 'AddableWorkingHours', defaultProps: {} },
  onlineConsultation: { type: 'AddableOnlineConsultation', defaultProps: {} },
  insurance: { type: 'AddableInsurance', defaultProps: {} },
  menuHighlights: { type: 'AddableMenuHighlights', defaultProps: {} },
  roomAvailability: { type: 'AddableRoomAvailability', defaultProps: {} },
  caseEvaluation: { type: 'AddableCaseEvaluation', defaultProps: {} },
  beforeAfter: { type: 'AddableBeforeAfter', defaultProps: {} },
  petRegistration: { type: 'AddablePetRegistration', defaultProps: {} },
  callUs: { type: 'AddableCallUs', defaultProps: {} },
  socialProof: { type: 'AddableSocialProof', defaultProps: {} },
  teamGrid: { type: 'AddableTeamGrid', defaultProps: {
    title: 'Uzman Ekibimiz',
    subtitle: 'Alanında uzman, deneyimli kadromuzla hizmetinizdeyiz.',
    members: [
      { name: 'Dr. Ayşe Kaya', role: 'Uzman', bio: 'Alanında 15 yıllık deneyimiyle en iyi hizmeti sunmaktadır.', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face' },
      { name: 'Mehmet Yıldız', role: 'Kıdemli Uzman', bio: '10 yıllık tecrübesiyle ekibimizin değerli üyesi.', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face' },
      { name: 'Zeynep Demir', role: 'Uzman', bio: 'Uluslararası sertifikalı, müşteri memnuniyeti odaklı çalışmaktadır.', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face' },
    ],
  }},
  promotionBanner: { type: 'AddablePromotionBanner', defaultProps: {} },
  blog: {
    type: 'AddableBlog',
    defaultProps: {
      sectionTitle: 'Blog & Haberler',
      sectionSubtitle: 'Güncel makalelerimizi ve sektör bilgilerini keşfedin',
      post1Title: 'Sektördeki Son Gelişmeler ve Trendler',
      post1Category: 'Genel',
      post1Excerpt: 'Sektörümüzdeki en güncel gelişmeleri, yenilikleri ve önemli trendleri sizin için derliyoruz. Bilmeniz gereken tüm detayları bulabilirsiniz.',
      post1Image: '',
      post1Date: '2026-01-15',
      post1Slug: 'sektor-son-gelismeler',
      post1Keywords: '',
      post2Title: 'Profesyonellerden Pratik İpuçları ve Öneriler',
      post2Category: 'İpuçları',
      post2Excerpt: 'Alanında uzman profesyonellerden derlediğimiz pratik ipuçları ve önerilerle işinizi ve yaşamınızı kolaylaştırın.',
      post2Image: '',
      post2Date: '2026-01-22',
      post2Slug: 'profesyonel-ipuclari',
      post2Keywords: '',
      post3Title: 'Sık Yapılan Hatalar ve Nasıl Önlenir?',
      post3Category: 'Rehber',
      post3Excerpt: 'En yaygın yapılan hatalar nelerdir? Bu rehberde sık karşılaşılan sorunları ve bunlardan nasıl korunabileceğinizi anlatıyoruz.',
      post3Image: '',
      post3Date: '2026-02-01',
      post3Slug: 'sik-yapilan-hatalar',
      post3Keywords: '',
      post4Title: 'Başarılı Sonuçlar İçin Bilmeniz Gerekenler',
      post4Category: 'Başarı',
      post4Excerpt: 'Başarılı sonuçlara ulaşmak için hangi adımları izlemelisiniz? Uzman görüşleri ve gerçek vakalar ışığında kapsamlı bir inceleme.',
      post4Image: '',
      post4Date: '2026-02-10',
      post4Slug: 'basarili-sonuclar',
      post4Keywords: '',
    }
  },
};

interface EditorState {
  sections: SiteSection[];
  theme: SiteTheme;
  selectedSectionId: string | null;
  isEditing: boolean;
  addPanelOpen: boolean;
  customizePanelOpen: boolean;
}

interface UndoSnapshot {
  sections: SiteSection[];
  theme: SiteTheme;
}

export function useEditorState(initialSections: SiteSection[] = [], initialTheme: SiteTheme = {}) {
  const [sections, setSections] = useState<SiteSection[]>(initialSections);
  const [theme, setTheme] = useState<SiteTheme>(initialTheme);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(true);
  const [addPanelOpen, setAddPanelOpen] = useState(false);
  const [customizePanelOpen, setCustomizePanelOpen] = useState(false);
  const [addInsertIndex, setAddInsertIndex] = useState<number | null>(null);
  const [addableSections, setAddableSections] = useState<Record<string, boolean>>({});
  // Simple undo: store previous snapshot
  const undoStack = useRef<UndoSnapshot[]>([]);

  const pushUndo = useCallback(() => {
    undoStack.current.push({
      sections: JSON.parse(JSON.stringify(sections)),
      theme: JSON.parse(JSON.stringify(theme)),
    });
    // Keep max 20 snapshots
    if (undoStack.current.length > 20) undoStack.current.shift();
  }, [sections, theme]);

  const undo = useCallback(() => {
    const snapshot = undoStack.current.pop();
    if (snapshot) {
      setSections(snapshot.sections);
      setTheme(snapshot.theme);
    }
  }, []);

  const canUndo = undoStack.current.length > 0;

  const selectSection = useCallback((id: string | null) => {
    setSelectedSectionId(id);
  }, []);

  const updateSectionProps = useCallback((sectionId: string, newProps: Record<string, any>) => {
    pushUndo();
    setSections(prev => prev.map(s =>
      s.id === sectionId ? { ...s, props: { ...s.props, ...newProps } } : s
    ));
  }, [pushUndo]);

  const updateSectionStyle = useCallback((sectionId: string, style: Record<string, any>) => {
    pushUndo();
    setSections(prev => prev.map(s =>
      s.id === sectionId ? { ...s, style: { ...s.style, ...style } } : s
    ));
  }, [pushUndo]);

  const addSection = useCallback((type: string, defaultProps: Record<string, any>, atIndex?: number) => {
    pushUndo();
    const newSection: SiteSection = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type,
      props: defaultProps,
    };
    setSections(prev => {
      const idx = atIndex ?? prev.length;
      const next = [...prev];
      next.splice(idx, 0, newSection);
      return next;
    });
    setSelectedSectionId(newSection.id);
    setAddPanelOpen(false);
  }, [pushUndo]);

  const removeSection = useCallback((sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (section?.locked) return;
    pushUndo();
    setSections(prev => prev.filter(s => s.id !== sectionId));
    if (selectedSectionId === sectionId) setSelectedSectionId(null);
  }, [sections, selectedSectionId, pushUndo]);

  const duplicateSection = useCallback((sectionId: string) => {
    pushUndo();
    setSections(prev => {
      const idx = prev.findIndex(s => s.id === sectionId);
      if (idx === -1) return prev;
      const original = prev[idx];
      const clone: SiteSection = {
        ...JSON.parse(JSON.stringify(original)),
        id: `${original.type}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        locked: false,
      };
      const next = [...prev];
      next.splice(idx + 1, 0, clone);
      return next;
    });
  }, [pushUndo]);

  const moveSectionUp = useCallback((sectionId: string) => {
    pushUndo();
    setSections(prev => {
      const idx = prev.findIndex(s => s.id === sectionId);
      if (idx <= 0) return prev;
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  }, [pushUndo]);

  const moveSectionDown = useCallback((sectionId: string) => {
    pushUndo();
    setSections(prev => {
      const idx = prev.findIndex(s => s.id === sectionId);
      if (idx === -1 || idx >= prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  }, [pushUndo]);

  const updateTheme = useCallback((updates: Partial<SiteTheme>) => {
    pushUndo();
    setTheme(prev => ({ ...prev, ...updates }));
  }, [pushUndo]);

  const applyTemplate = useCallback((templateId: string, projectData?: ProjectData | null) => {
    const def = getCatalogTemplate(templateId);
    if (!def) return;
    pushUndo();

    // Filter incompatible sections for user's sector, then map content
    const sector = projectData?.sector || '';
    const filteredDefs = filterIncompatibleSections(def.sections, sector);
    const mappedSections = mapContentToTemplate(filteredDefs, projectData);

    // Build new sections, also preserving matching content from old sections
    const oldProps: Record<string, Record<string, any>> = {};
    sections.forEach(s => { oldProps[s.type] = s.props || {}; });

    const gc = projectData?.generatedContent;
    const formData = projectData?.formData;

    const newSections: SiteSection[] = mappedSections.map((secDef, i) => {
      const mergedProps = { ...secDef.defaultProps };
      // If old site had same section type, carry over ALL non-empty string/number props
      if (oldProps[secDef.type]) {
        const old = oldProps[secDef.type];
        for (const key of Object.keys(old)) {
          if (key.startsWith('_')) continue; // skip internals
          const val = old[key];
          // Carry over strings (non-empty) and numbers — skip arrays/objects (those come from mapper)
          if (typeof val === 'string' && val.trim() !== '') {
            mergedProps[key] = val;
          } else if (typeof val === 'number') {
            mergedProps[key] = val;
          }
        }
      }
      // Inject images and contact info from generated content
      if (gc) {
        injectImages(secDef.type, mergedProps, gc);
        injectContactInfo(mergedProps, gc, formData);
      }
      // Inject sector so image pickers can use sector-aware queries
      mergedProps._sector = sector;
      return {
        id: `${secDef.type}_${Date.now()}_${i}`,
        type: secDef.type,
        props: mergedProps,
        locked: secDef.required,
      };
    });

    // Ensure footer is last section
    if (!newSections.find(s => s.type === 'AddableSiteFooter') && gc) {
      newSections.push(buildFooterSection(gc, formData));
    }

    setSections(newSections);

    // Apply theme preset
    const preset = getCatalogTheme(templateId);
    if (preset) {
      const lightColors: Record<string, string> = {};
      if (preset.colors) {
        Object.entries(preset.colors).forEach(([key, vals]) => {
          if (Array.isArray(vals) && vals.length > 0) lightColors[key] = vals[0];
        });
      }
      setTheme({
        colors: lightColors,
        fonts: {
          heading: preset.fontFamily?.heading || 'Inter',
          body: preset.fontFamily?.body || 'Inter',
        },
        borderRadius: preset.borderRadius || '0.5rem',
      });
    }
  }, [sections, pushUndo]);

  const openAddPanel = useCallback((insertIndex?: number) => {
    setAddInsertIndex(insertIndex ?? null);
    setAddPanelOpen(true);
  }, []);

  const toggleAddableSection = useCallback((key: string) => {
    setAddableSections(prev => {
      const isOn = !prev[key];
      const config = addableSectionConfig[key];
      if (!config) return prev;

      if (isOn) {
        // Add section at end
        pushUndo();
        const newSection: SiteSection = {
          id: `${config.type}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          type: config.type,
          props: { ...config.defaultProps },
        };
        setSections(p => [...p, newSection]);
      } else {
        // Remove all sections of this addable type
        pushUndo();
        setSections(p => p.filter(s => s.type !== config.type));
      }

      return { ...prev, [key]: isOn };
    });
  }, [pushUndo]);

  const selectedSection = sections.find(s => s.id === selectedSectionId) || null;

  return {
    sections,
    setSections,
    theme,
    setTheme,
    selectedSectionId,
    selectedSection,
    isEditing,
    setIsEditing,
    addPanelOpen,
    setAddPanelOpen,
    addInsertIndex,
    customizePanelOpen,
    setCustomizePanelOpen,
    selectSection,
    updateSectionProps,
    updateSectionStyle,
    addSection,
    removeSection,
    duplicateSection,
    moveSectionUp,
    moveSectionDown,
    updateTheme,
    applyTemplate,
    openAddPanel,
    toggleAddableSection,
    addableSections,
    undo,
    canUndo,
  };
}
