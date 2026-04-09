import React from 'react';
import Questionnaire from './components/Questionnaire';
import { formConfig } from './data/config';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-slate-100 py-14 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-500 bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-full mb-4">
            Multi-Step Form
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Custom Questionnaire
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            A dynamic, JSON-driven multi-step form with stage-based progression, validation, and smooth animations.
          </p>
        </div>

        <Questionnaire config={formConfig} />
      </div>
    </div>
  );
}

export default App;