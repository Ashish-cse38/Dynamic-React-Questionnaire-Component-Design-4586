import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressBar from './ProgressBar';
import FieldRenderer from './FieldRenderer';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowRight, FiArrowLeft, FiCheck, FiRefreshCw } = FiIcons;

const Questionnaire = ({ config, onSubmit }) => {
  const { stages, fields } = config;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [direction, setDirection] = useState(1);

  const currentStageName = stages[currentStageIndex];
  const currentFields = fields.filter((f) => f.stage === currentStageName);
  const isLastStage = currentStageIndex === stages.length - 1;

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateStage = () => {
    const newErrors = {};
    currentFields.forEach((field) => {
      if (field.required) {
        const val = formData[field.name];
        if (!val || val === '' || (Array.isArray(val) && val.length === 0)) {
          newErrors[field.name] = 'This field is required';
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStage()) return;
    if (isLastStage) {
      if (onSubmit) onSubmit(formData);
      else console.log('Submitted:', formData);
      setIsSubmitted(true);
    } else {
      setDirection(1);
      setCurrentStageIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStageIndex > 0) {
      setDirection(-1);
      setCurrentStageIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({});
    setErrors({});
    setCurrentStageIndex(0);
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-14 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <SafeIcon icon={FiCheck} className="text-green-500 text-5xl" />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-800 mb-3">All Done!</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Your responses have been recorded successfully.<br />
          Thank you for taking the time to fill this out.
        </p>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 px-7 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 active:scale-95 transition-all duration-200 shadow-md shadow-indigo-200"
        >
          <SafeIcon icon={FiRefreshCw} />
          Start Over
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col">
      <div className="px-8 pt-8 pb-4 bg-gradient-to-br from-indigo-50 to-white border-b border-gray-100">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold text-gray-800">Questionnaire</h1>
          <span className="text-xs font-semibold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Step {currentStageIndex + 1} of {stages.length}
          </span>
        </div>
        <p className="text-sm text-gray-400 mb-6">Fill out the information below to proceed.</p>
        <ProgressBar stages={stages} currentStageIndex={currentStageIndex} />
      </div>

      <div className="flex-1 px-8 py-8 overflow-hidden min-h-[380px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStageIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction * 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -30 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <h2 className="text-base font-bold text-indigo-700 uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">
                {currentStageIndex + 1}
              </span>
              {currentStageName}
            </h2>
            {currentFields.map((field) => (
              <FieldRenderer
                key={field.name}
                field={field}
                value={formData[field.name]}
                onChange={handleChange}
                error={errors[field.name]}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <button
          onClick={handlePrev}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
            currentStageIndex === 0
              ? 'opacity-0 pointer-events-none'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'
          }`}
        >
          <SafeIcon icon={FiArrowLeft} />
          Previous
        </button>
        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-7 py-2.5 rounded-xl font-semibold text-sm bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 transition-all duration-200 shadow-md shadow-indigo-200"
        >
          {isLastStage ? (
            <>
              <SafeIcon icon={FiCheck} />
              Submit
            </>
          ) : (
            <>
              Next Step
              <SafeIcon icon={FiArrowRight} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Questionnaire;