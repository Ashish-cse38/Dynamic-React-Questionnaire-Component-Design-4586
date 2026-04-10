import React from 'react';
import Questionnaire from './components/Questionnaire';
import { formConfig } from './data/config';

function App() {
  const handleSubmit = (formData) => {
    console.log('Form submitted with data:', formData);
  };

  return (
    <Questionnaire config={formConfig} onSubmit={handleSubmit} />
  );
}

export default App;