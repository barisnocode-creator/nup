import type { Editor } from 'grapesjs';
import { registerAllBlocks } from '../blocks';

export function templateBlocksPlugin(editor: Editor) {
  // Register all custom template blocks
  registerAllBlocks(editor);
  
  // Add custom components for better control
  editor.DomComponents.addType('editable-text', {
    isComponent: (el) => el.hasAttribute?.('data-gjs-editable'),
    model: {
      defaults: {
        tagName: 'span',
        editable: true,
        traits: [
          {
            type: 'text',
            name: 'content',
            label: 'İçerik',
          },
        ],
      },
    },
  });

  // Custom image component with better positioning
  editor.DomComponents.addType('positioned-image', {
    extend: 'image',
    isComponent: (el) => el.tagName === 'IMG' && el.hasAttribute?.('data-positioned'),
    model: {
      defaults: {
        traits: [
          { name: 'src', label: 'Görsel URL' },
          { name: 'alt', label: 'Alt Metin' },
          { 
            type: 'range',
            name: 'positionX',
            label: 'Yatay Konum',
            min: 0,
            max: 100,
            default: 50,
          },
          { 
            type: 'range',
            name: 'positionY',
            label: 'Dikey Konum',
            min: 0,
            max: 100,
            default: 50,
          },
        ],
      },
      init() {
        this.on('change:positionX change:positionY', this.updatePosition);
      },
      updatePosition() {
        const x = this.get('positionX') || 50;
        const y = this.get('positionY') || 50;
        this.setStyle({ 'object-position': `${x}% ${y}%` });
      },
    },
  });

  // Section container component
  editor.DomComponents.addType('section', {
    isComponent: (el) => el.tagName === 'SECTION',
    model: {
      defaults: {
        tagName: 'section',
        droppable: true,
        traits: [
          { name: 'id', label: 'ID' },
          { name: 'title', label: 'Başlık' },
        ],
      },
    },
  });

  console.log('Template blocks plugin initialized');
}
