import { NodeViewWrapper } from '@tiptap/react';
import { StaticMathField } from 'react-mathquill';
import { useState } from 'react';

export const MathDisplay = ({ node, updateAttributes }) => {
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startSize, setStartSize] = useState(1);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
    setStartX(e.clientX);
    setStartSize(node.attrs.size);
    
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      
      const delta = (e.clientX - startX) / 200;
      const newSize = Math.max(0.5, Math.min(2, startSize + delta));
      updateAttributes({ size: newSize });
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <NodeViewWrapper>
      <div className="relative inline-block my-2 group">
        <div 
          style={{ 
            transform: `scale(${node.attrs.size})`,
            transformOrigin: 'left center'
          }}
        >
          <StaticMathField>{node.attrs.latex}</StaticMathField>
        </div>
        <div
          className="absolute right-0 top-1/2 w-4 h-4 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ 
            transform: 'translateY(-50%) translateX(100%)',
          }}
          onMouseDown={handleMouseDown}
        >
          <div className="w-1 h-4 bg-blue-500 rounded-full mx-auto" />
        </div>
      </div>
    </NodeViewWrapper>
  );
};