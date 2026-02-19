import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useEditorState } from './useEditorState';
import { useSiteSave } from './useSiteSave';
import { EditorToolbar } from './EditorToolbar';
import { EditorCanvas } from './EditorCanvas';
import { SectionEditPanel } from './SectionEditPanel';
import { AddSectionPanel } from './AddSectionPanel';
import { CustomizePanel } from './CustomizePanel';
import { PublishModal } from '@/components/website-preview/PublishModal';
import { ChangeTemplateModal } from '@/components/website-preview/ChangeTemplateModal';
import { hexToHSL } from '@/lib/utils';
import type { SiteSection, SiteTheme } from '@/components/sections/types';

interface SiteEditorProps {
  projectId: string;
  projectName: string;
  initialSections: SiteSection[];
  initialTheme: SiteTheme;
  subdomain?: string | null;
  isPublished?: boolean;
  onPublished?: (subdomain: string) => void;
  projectData?: { generatedContent?: any; formData?: any; sector?: string } | null;
}

export function SiteEditor({
  projectId, projectName, initialSections, initialTheme,
  subdomain, isPublished, onPublished, projectData,
}: SiteEditorProps) {
  const editor = useEditorState(initialSections, initialTheme);
  const { isSaving, hasUnsavedChanges, forceSave } = useSiteSave({
    projectId, sections: editor.sections, theme: editor.theme,
  });
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Sync initial data when it changes (e.g., after migration)
  useEffect(() => {
    if (initialSections.length > 0 && editor.sections.length === 0) {
      editor.setSections(initialSections);
    }
  }, [initialSections]);

  useEffect(() => {
    if (Object.keys(initialTheme).length > 0 && Object.keys(editor.theme).length === 0) {
      editor.setTheme(initialTheme);
    }
  }, [initialTheme]);

  // Apply theme CSS variables with hex-to-HSL conversion
  useEffect(() => {
    const colors = editor.theme.colors || {};
    const root = document.documentElement;
    Object.entries(colors).forEach(([key, val]) => {
      if (typeof val === 'string') {
        // Convert hex to HSL for Tailwind compatibility
        const hslVal = val.startsWith('#') ? hexToHSL(val) : val;
        root.style.setProperty(`--${key}`, hslVal);
      }
    });
    if (editor.theme.fonts?.heading) {
      root.style.setProperty('--font-heading', `'${editor.theme.fonts.heading}', sans-serif`);
    }
    if (editor.theme.fonts?.body) {
      root.style.setProperty('--font-body', `'${editor.theme.fonts.body}', sans-serif`);
    }
    if (editor.theme.borderRadius) {
      root.style.setProperty('--radius', editor.theme.borderRadius);
    }
  }, [editor.theme]);

  const handlePublish = async () => {
    await forceSave();
    setPublishModalOpen(true);
  };

  const handleApplyTemplate = (templateId: string) => {
    editor.applyTemplate(templateId, projectData);
    setTemplateModalOpen(false);
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-50 dark:bg-zinc-950">
      <EditorToolbar
        projectName={projectName}
        isEditing={editor.isEditing}
        onToggleEdit={() => editor.setIsEditing(!editor.isEditing)}
        onOpenCustomize={() => editor.setCustomizePanelOpen(!editor.customizePanelOpen)}
        customizePanelOpen={editor.customizePanelOpen}
        onPublish={handlePublish}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
        canUndo={editor.canUndo}
        onUndo={editor.undo}
        previewDevice={previewDevice}
        onChangeDevice={setPreviewDevice}
      />

      <div className="flex-1 flex overflow-hidden relative">
        <EditorCanvas
          sections={editor.sections}
          isEditing={editor.isEditing}
          selectedSectionId={editor.selectedSectionId}
          onSelectSection={editor.selectSection}
          onUpdateProps={editor.updateSectionProps}
          onMoveUp={editor.moveSectionUp}
          onMoveDown={editor.moveSectionDown}
          onRemove={editor.removeSection}
          onDuplicate={editor.duplicateSection}
          onAddAt={(index) => editor.openAddPanel(index)}
          previewDevice={previewDevice}
        />

        <AnimatePresence>
          {editor.selectedSection && editor.isEditing && (
            <SectionEditPanel
              key={editor.selectedSectionId}
              section={editor.selectedSection}
              onUpdateProps={(props) => editor.updateSectionProps(editor.selectedSectionId!, props)}
              onUpdateStyle={(style) => editor.updateSectionStyle(editor.selectedSectionId!, style)}
              onClose={() => editor.selectSection(null)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {editor.addPanelOpen && (
            <AddSectionPanel
              onAdd={(type, defaultProps) => editor.addSection(type, defaultProps, editor.addInsertIndex ?? undefined)}
              onClose={() => editor.setAddPanelOpen(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {editor.customizePanelOpen && (
            <CustomizePanel
              theme={editor.theme}
              onUpdateTheme={editor.updateTheme}
              onClose={() => editor.setCustomizePanelOpen(false)}
              onOpenTemplateModal={() => {
                editor.setCustomizePanelOpen(false);
                setTemplateModalOpen(true);
              }}
            />
          )}
        </AnimatePresence>
      </div>

      <ChangeTemplateModal
        isOpen={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        currentTemplateId="specialty-cafe"
        onSelectTemplate={handleApplyTemplate}
        onPreview={(id) => handleApplyTemplate(id)}
        projectData={projectData}
      />

      <PublishModal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        projectId={projectId}
        projectName={projectName}
        currentSubdomain={subdomain}
        isPublished={isPublished}
        onPublished={(sub) => { onPublished?.(sub); }}
      />
    </div>
  );
}
