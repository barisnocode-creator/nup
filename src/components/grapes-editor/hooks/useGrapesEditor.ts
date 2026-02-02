import { useCallback, useRef } from 'react';
import type { Editor } from 'grapesjs';

export function useGrapesEditor() {
  const editorRef = useRef<Editor | null>(null);

  const setEditor = useCallback((editor: Editor) => {
    editorRef.current = editor;
  }, []);

  const getEditor = useCallback(() => {
    return editorRef.current;
  }, []);

  const saveProject = useCallback(async () => {
    const editor = editorRef.current;
    if (!editor) return;

    try {
      await editor.store();
      return true;
    } catch (error) {
      console.error('Error saving project:', error);
      return false;
    }
  }, []);

  const loadProject = useCallback(async () => {
    const editor = editorRef.current;
    if (!editor) return;

    try {
      await editor.load();
      return true;
    } catch (error) {
      console.error('Error loading project:', error);
      return false;
    }
  }, []);

  const undo = useCallback(() => {
    editorRef.current?.runCommand('core:undo');
  }, []);

  const redo = useCallback(() => {
    editorRef.current?.runCommand('core:redo');
  }, []);

  const preview = useCallback(() => {
    editorRef.current?.runCommand('preview');
  }, []);

  const setDevice = useCallback((device: 'desktop' | 'tablet' | 'mobile') => {
    editorRef.current?.setDevice(device);
  }, []);

  const getHtml = useCallback(() => {
    return editorRef.current?.getHtml() || '';
  }, []);

  const getCss = useCallback(() => {
    return editorRef.current?.getCss() || '';
  }, []);

  const getProjectData = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return null;

    return editor.getProjectData();
  }, []);

  const loadProjectData = useCallback((data: Record<string, any>) => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.loadProjectData(data);
  }, []);

  const selectComponent = useCallback((component: any) => {
    editorRef.current?.select(component);
  }, []);

  const clearSelection = useCallback(() => {
    editorRef.current?.select();
  }, []);

  return {
    setEditor,
    getEditor,
    saveProject,
    loadProject,
    undo,
    redo,
    preview,
    setDevice,
    getHtml,
    getCss,
    getProjectData,
    loadProjectData,
    selectComponent,
    clearSelection,
  };
}
