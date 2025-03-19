import { useEffect, useState } from 'react';
import { addStyles, EditableMathField } from 'react-mathquill';

// Initialize MathQuill
addStyles();

interface EditMathNodeProps {
  onSubmit: (latex: string) => void;
  onClose: () => void;
}

export const EditMathNode = ({ onSubmit, onClose }: EditMathNodeProps) => {
  const [latex, setLatex] = useState('');

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-4 w-full max-w-lg">
        <h3 className="text-lg font-medium mb-4">Insert Math Equation</h3>
        <div className="mb-4">
          <EditableMathField
            latex={latex}
            onChange={(mathField) => {
              setLatex(mathField.latex());
            }}
            style={{ fontSize: '1.5rem', minHeight: '3rem', minWidth: '20rem' }} // Added minWidth for initial width
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(latex)}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Insert
          </button>
        </div>
      </div>
    </div>
  );
};