import React from 'react';
import Questionnaire from './components/Questionnaire';
import { formConfig } from './data/config';

function App() {
  const handleSubmit = (formData) => {
    console.log('Form submitted with data:', formData);
  };

  return (
    <div className="min-h-screen bg-[#f4f7fa] py-14 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl">
        <Questionnaire config={formConfig} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}

export default App;