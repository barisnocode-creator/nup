import type { Editor } from 'grapesjs';
import { registerHeroBlocks } from './heroBlocks';
import { registerServicesBlocks } from './servicesBlocks';
import { registerAboutBlocks } from './aboutBlocks';
import { registerContactBlocks } from './contactBlocks';
import { registerSectionBlocks } from './sectionBlocks';

export function registerAllBlocks(editor: Editor) {
  // Register all custom blocks
  registerHeroBlocks(editor);
  registerServicesBlocks(editor);
  registerAboutBlocks(editor);
  registerContactBlocks(editor);
  registerSectionBlocks(editor);
  
  console.log('All custom blocks registered');
}

export {
  registerHeroBlocks,
  registerServicesBlocks,
  registerAboutBlocks,
  registerContactBlocks,
  registerSectionBlocks,
};
