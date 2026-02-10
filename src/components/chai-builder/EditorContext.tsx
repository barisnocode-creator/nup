import { createContext, useContext } from 'react';

interface EditorContextValue {
  projectName: string;
  onDashboard: () => void;
  onPublish: () => void;
  onPreview: () => void;
  onImageSearch: () => void;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export const EditorProvider = EditorContext.Provider;

export function useEditorContext() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error('useEditorContext must be inside EditorProvider');
  return ctx;
}
