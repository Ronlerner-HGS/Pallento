import { Editor } from '@tiptap/react';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Code,
  ChevronDown
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ToolbarProps {
  editor: Editor;
}

const Toolbar = ({ editor }: ToolbarProps) => {
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);
  const [currentFontSize, setCurrentFontSize] = useState('16px');
  const headingMenuRef = useRef<HTMLDivElement>(null);
  const fontSizeMenuRef = useRef<HTMLDivElement>(null);
  
  if (!editor) {
    return null;
  }

  const fontSizes = ['8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px', '60px', '72px'];
  
  // Handle font size application
  const handleFontSizeClick = (size: string) => {
    // Remove 'px' and convert to number for the editor command
    const sizeValue = size.replace('px', '');
    
    // Apply the font size using the editor's command
    editor.chain().focus().setMark('textStyle', { fontSize: sizeValue }).run();
    
    // Update the displayed current font size
    setCurrentFontSize(size);
    
    // Close the menu
    setShowFontSizeMenu(false);
  };

  // Handle clicks outside of dropdown menus
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (headingMenuRef.current && !headingMenuRef.current.contains(event.target as Node)) {
        setShowHeadingMenu(false);
      }
      
      if (fontSizeMenuRef.current && !fontSizeMenuRef.current.contains(event.target as Node)) {
        setShowFontSizeMenu(false);
      }
    }
    
    // Handle escape key
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setShowHeadingMenu(false);
        setShowFontSizeMenu(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="border-b border-gray-200 p-2 flex gap-2 flex-wrap items-center">
      {/* Text Type/Heading Dropdown */}
      <div className="relative" ref={headingMenuRef}>
        <button
          onClick={() => setShowHeadingMenu(!showHeadingMenu)}
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 text-sm"
        >
          {editor.isActive('heading', { level: 1 }) ? 'Heading 1' :
           editor.isActive('heading', { level: 2 }) ? 'Heading 2' :
           editor.isActive('heading', { level: 3 }) ? 'Heading 3' :
           editor.isActive('heading', { level: 4 }) ? 'Heading 4' :
           editor.isActive('heading', { level: 5 }) ? 'Heading 5' :
           editor.isActive('heading', { level: 6 }) ? 'Heading 6' : 'Normal Text'}
          <ChevronDown size={16} />
        </button>
        
        {showHeadingMenu && (
          <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded border border-gray-200 z-10 w-40">
            <button
              onClick={() => {
                editor.chain().focus().setParagraph().run();
                setShowHeadingMenu(false);
              }}
              className={`w-full text-left px-3 py-1 hover:bg-gray-100 ${editor.isActive('paragraph') ? 'bg-gray-100' : ''}`}
            >
              Normal Text
            </button>
            {[1, 2, 3, 4, 5, 6].map((level) => (
              <button
                key={level}
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level }).run();
                  setShowHeadingMenu(false);
                }}
                className={`w-full text-left px-3 py-1 hover:bg-gray-100 ${editor.isActive('heading', { level }) ? 'bg-gray-100' : ''}`}
              >
                Heading {level}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* COMPLETELY REWRITTEN Font Size Dropdown */}
      <div className="relative inline-block" ref={fontSizeMenuRef}>
        <button
          type="button"
          onClick={() => setShowFontSizeMenu(!showFontSizeMenu)}
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 text-sm"
        >
          <span style={{ fontSize: '16px' }}>
            {currentFontSize}
          </span>
          <ChevronDown size={16} />
        </button>
        
        {showFontSizeMenu && (
          <div 
            className="absolute top-full left-0 z-10 mt-1 bg-white shadow-lg border border-gray-200 rounded"
            style={{ width: "120px", maxHeight: "300px", overflowY: "auto" }}
          >
            <div className="py-1">
              {fontSizes.map((size) => (
                <div
                  key={size}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleFontSizeClick(size);
                  }}
                >
                  {size}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="h-6 border-r border-gray-300 mx-1"></div>

      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-100' : ''}`}
      >
        <Bold size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-100' : ''}`}
      >
        <Italic size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('bulletList') ? 'bg-gray-100' : ''}`}
      >
        <List size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('orderedList') ? 'bg-gray-100' : ''}`}
      >
        <ListOrdered size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`p-1 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-100' : ''}`}
      >
        <AlignLeft size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`p-1 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-100' : ''}`}
      >
        <AlignCenter size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`p-1 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-100' : ''}`}
      >
        <AlignRight size={18} />
      </button>
      <button
        onClick={() => {
          const url = window.prompt('Enter URL');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('link') ? 'bg-gray-100' : ''}`}
      >
        <Link size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('code') ? 'bg-gray-100' : ''}`}
      >
        <Code size={18} />
      </button>
    </div>
  );
};

export default Toolbar;