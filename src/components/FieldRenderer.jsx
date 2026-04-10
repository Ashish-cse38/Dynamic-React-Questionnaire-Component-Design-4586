import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiAlertCircle } = FiIcons;

/**
 * @param {{ field: import('../types').FieldConfig, value: string | string[], onChange: (name: string, value: string | string[]) => void, error?: string }} props
 */
const FieldRenderer = ({ field, value, onChange, error }) => {
  const { name, label, type, required, options, placeholder } = field;

  const baseInputClass = `w-full p-3 border rounded-xl outline-none transition-all duration-200 bg-white text-gray-800 ${
    error
      ? 'border-red-400 focus:ring-2 focus:ring-red-100'
      : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
  }`;

  const renderInput = () => {
    switch (type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <input
            type={type}
            id={name}
            value={value || ''}
            onChange={(e) => onChange(name, e.target.value)}
            className={baseInputClass}
            placeholder={placeholder}
          />
        );

      case 'textarea':
        return (
          <textarea
            id={name}
            value={value || ''}
            onChange={(e) => onChange(name, e.target.value)}
            className={`${baseInputClass} min-h-[120px] resize-y`}
            placeholder={placeholder}
          />
        );

      case 'select':
        return (
          <div className="relative">
            <select
              id={name}
              value={value || ''}
              onChange={(e) => onChange(name, e.target.value)}
              className={`${baseInputClass} appearance-none cursor-pointer pr-10`}
            >
              <option value="" disabled>Select an option</option>
              {options?.map((opt, idx) => (
                <option key={idx} value={opt}>{opt}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2 mt-1">
            {options?.map((opt, idx) => (
              <label
                key={idx}
                className={`flex items-center p-3.5 border rounded-xl cursor-pointer transition-all duration-150 ${
                  value === opt
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name={name}
                  value={opt}
                  checked={value === opt}
                  onChange={(e) => onChange(name, e.target.value)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 cursor-pointer"
                />
                <span className="ml-3 text-sm font-medium">{opt}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox': {
        const currentValues = Array.isArray(value) ? value : [];
        const handleCheckboxChange = (opt) => {
          const newValues = currentValues.includes(opt)
            ? currentValues.filter((v) => v !== opt)
            : [...currentValues, opt];
          onChange(name, newValues);
        };
        return (
          <div className="space-y-2 mt-1">
            {options?.map((opt, idx) => (
              <label
                key={idx}
                className={`flex items-center p-3.5 border rounded-xl cursor-pointer transition-all duration-150 ${
                  currentValues.includes(opt)
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <input
                  type="checkbox"
                  value={opt}
                  checked={currentValues.includes(opt)}
                  onChange={() => handleCheckboxChange(opt)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                />
                <span className="ml-3 text-sm font-medium">{opt}</span>
              </label>
            ))}
          </div>
        );
      }

      default:
        return (
          <p className="text-red-500 text-sm">
            Unsupported field type: <code>{type}</code>
          </p>
        );
    }
  };

  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderInput()}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center mt-1.5 text-xs text-red-500 gap-1"
        >
          <SafeIcon icon={FiAlertCircle} className="text-sm shrink-0" />
          {error}
        </motion.div>
      )}
    </motion.div>
  );
};

export default FieldRenderer;