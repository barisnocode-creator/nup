import { createContext, useContext } from 'react';

export interface FeatureFlags {
  contextualPanel: boolean;
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  contextualPanel: true,
};

interface EditorContextValue {
  projectId?: string;
  projectName: string;
  projectProfession?: string;
  featureFlags: FeatureFlags;
  onDashboard: () => void;
  onPublish: () => void;
  onPreview: () => void;
  onImageSearch: () => void;
  onRegenerateText?: () => void;
  onRegenerateWebsite?: () => void;
  onChangeTemplate?: () => void;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export const EditorProvider = EditorContext.Provider;

export function useEditorContext() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error('useEditorContext must be inside EditorProvider');
  return ctx;
}
