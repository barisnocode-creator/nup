import { useState, useRef, useCallback } from 'react';
import { TemplateProps } from '../types';
import { NaturalHeader } from './components/NaturalHeader';
import { NaturalFooter } from './components/NaturalFooter';
import { NaturalFullLandingPage } from './pages/FullLandingPage';
import { UpgradeModal } from '@/components/website-preview/UpgradeModal';
import './styles/natural.css';

export function NaturalTemplate({
  content,
  colorPreference,
  isEditable = false,
  onFieldEdit,
  onLockedFeature,
  editorSelection,
  onEditorSelect,
  sectionOrder,
  onMoveSection,
  onDeleteSection,
  sectionStyles,
  selectedImage,
  onImageSelect,
}: TemplateProps) {
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [lockedFeature, setLockedFeature] = useState<string>('');
  const [isDark, setIsDark] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleLockedFeature = (feature: string) => {
    if (onLockedFeature) {
      onLockedFeature(feature);
    } else {
      setLockedFeature(feature);
      setUpgradeModalOpen(true);
    }
  };

  const handleFieldEdit = (fieldPath: string, newValue: string) => {
    if (onFieldEdit) {
      onFieldEdit(fieldPath, newValue);
    }
  };

  const toggleDark = useCallback(() => {
    setIsDark(prev => !prev);
  }, []);

  const cssVars = {
    '--background': isDark ? '0 0% 10%' : '36 44% 96%',
    '--foreground': isDark ? '36 44% 96%' : '0 0% 18%',
    '--primary': isDark ? '36 44% 96%' : '0 0% 18%',
    '--primary-foreground': isDark ? '0 0% 10%' : '36 44% 96%',
    '--secondary': isDark ? '0 0% 18%' : '33 30% 90%',
    '--secondary-foreground': isDark ? '36 44% 90%' : '0 0% 20%',
    '--muted': isDark ? '0 0% 20%' : '33 30% 88%',
    '--muted-foreground': isDark ? '0 0% 60%' : '0 0% 40%',
    '--accent': isDark ? '140 20% 45%' : '140 20% 50%',
    '--accent-foreground': '36 44% 96%',
    '--card': isDark ? '0 0% 14%' : '33 40% 94%',
    '--card-foreground': isDark ? '36 44% 96%' : '0 0% 18%',
    '--popover': isDark ? '0 0% 14%' : '33 40% 94%',
    '--popover-foreground': isDark ? '36 44% 96%' : '0 0% 18%',
    '--border': isDark ? '0 0% 20%' : '33 25% 85%',
    '--input': isDark ? '0 0% 20%' : '33 25% 85%',
    '--ring': isDark ? '36 44% 96%' : '0 0% 18%',
    '--surface-elevated': isDark ? '0 0% 14%' : '36 44% 98%',
    '--shadow-soft': isDark ? '0 0% 0%' : '0 0% 18%',
    '--cream': isDark ? '0 0% 14%' : '40 40% 90%',
    '--cream-foreground': isDark ? '36 44% 96%' : '0 0% 18%',
  } as React.CSSProperties;

  return (
    <div
      ref={wrapperRef}
      className={`natural-template min-h-screen bg-background text-foreground${isDark ? ' dark' : ''}`}
      style={cssVars}
    >
      {isEditable && (
        <div className="sticky top-14 z-20 py-2 px-4 border-b bg-background/95 border-border backdrop-blur-sm">
          <div className="container mx-auto flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              ✏️ Düzenlemek için herhangi bir metin veya görsele tıklayın
            </span>
          </div>
        </div>
      )}

      <NaturalHeader
        siteName={content.metadata.siteName}
        isEditable={isEditable}
        onFieldEdit={handleFieldEdit}
        isDark={isDark}
        onToggleDark={toggleDark}
      />

      <NaturalFullLandingPage
        content={content}
        isEditable={isEditable}
        onFieldEdit={handleFieldEdit}
        onLockedFeature={handleLockedFeature}
        editorSelection={editorSelection}
        onEditorSelect={onEditorSelect}
        sectionOrder={sectionOrder}
        onMoveSection={onMoveSection}
        onDeleteSection={onDeleteSection}
        selectedImage={selectedImage}
        onImageSelect={onImageSelect}
      />

      <NaturalFooter
        siteName={content.metadata.siteName}
        tagline={content.metadata.tagline}
      />

      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        feature={lockedFeature}
      />
    </div>
  );
}
