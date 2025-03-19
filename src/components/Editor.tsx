import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useState, useCallback } from 'react';
import { EditMathNode } from './MathNode';
import Toolbar from './Toolbar';
import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { MathDisplay } from './MathDisplay';
import { Extension } from '@tiptap/core';
import TextStyle from '@tiptap/extension-text-style';

// Shared font size logic that can be reused
const createFontSizeAttribute = () => ({
  default: null,
  parseHTML: element => {
    const fontSize = element.style.fontSize;
    return fontSize ? fontSize.replace('px', '') : null;
  },
  renderHTML: attributes => {
    if (!attributes.fontSize) {
      return {};
    }
    
    // Always ensure we have 'px' appended
    const fontSize = attributes.fontSize.toString();
    const value = fontSize.endsWith('px') ? fontSize : `${fontSize}px`;
    
    return {
      style: `font-size: ${value}`,
    };
  },
});

// FontSize extension
const FontSize = Extension.create({
  name: 'fontSize',
  
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontSize: createFontSizeAttribute(),
        },
      },
    ];
  },
});

// Heading Font Size extension (duplicate of font size menu)
const HeadingFontSize = Extension.create({
  name: 'headingFontSize',
  
  addGlobalAttributes() {
    return [
      {
        types: ['heading'],
        attributes: {
          fontSize: createFontSizeAttribute(),
        },
      },
    ];
  },
});

const MathEquation = Node.create({
  name: 'mathEquation',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      latex: {
        default: '',
      },
      size: {
        default: 1,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'math-equation',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['math-equation', HTMLAttributes];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MathDisplay);
  },
});

const Editor = () => {
  const [showMathInput, setShowMathInput] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit, 
      MathEquation, 
      TextStyle.configure(), // Required for FontSize extension
      FontSize,
      HeadingFontSize, // Add the new extension
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px]',
      },
    },
  });

  const insertMathNode = useCallback((latex: string) => {
    if (editor) {
      editor.chain().focus().insertContent({
        type: 'mathEquation',
        attrs: { latex, size: 1 }
      }).run();
      setShowMathInput(false);
    }
  }, [editor]);

  const handleSlash = useCallback((event: KeyboardEvent) => {
    if (event.key === '/' && editor?.isFocused) {
      event.preventDefault(); // Prevent the slash from being inserted
      const command = prompt('Enter command (e.g., "math"):');
      if (command === 'math') {
        setShowMathInput(true);
      }
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <Toolbar editor={editor} />
          <div className="px-4 py-3">
            <EditorContent editor={editor} onKeyDown={handleSlash} />
          </div>
        </div>
        
        {showMathInput && (
          <EditMathNode
            onSubmit={insertMathNode}
            onClose={() => setShowMathInput(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Editor;