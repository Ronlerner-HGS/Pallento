import React from 'react';
import Editor from './components/Editor';
import pallentoLogo from './assets/pallento-logo.svg';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex justify-center mb-8">
          <img 
            src={pallentoLogo} 
            alt="Pallento Logo" 
            className="h-16" 
          />
        </div>
        <Editor />
      </div>
    </div>
  );
}

export default App;