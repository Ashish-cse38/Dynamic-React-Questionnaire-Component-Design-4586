import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheck } = FiIcons;

/**
 * Visual step-progress indicator.
 *
 * @param {import('../types').ProgressBarProps} props
 */
const ProgressBar = ({ stages, currentStageIndex }) => {
  const progressPercentage =
    stages.length > 1 ? (currentStageIndex / (stages.length - 1)) * 100 : 100;

  return (
    <div className="w-full pt-4 pb-12 mb-2 relative" role="list" aria-label="Form progress">
      {/* Background track */}
      <div className="absolute left-5 right-5 top-9 h-1.5 bg-gray-200 rounded-full z-0" />

      {/* Animated fill track */}
      <motion.div
        className="absolute left-5 top-9 h-1.5 bg-indigo-600 rounded-full z-0"
        style={{ right: 'auto' }}
        initial={{ width: '0%' }}
        animate={{ width: `calc(${progressPercentage}% * (100% - 40px) / 100%)` }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />

      {/* Stage nodes */}
      <div className="flex items-start justify-between relative z-10">
        {stages.map((stage, index) => {
          const isCompleted = index < currentStageIndex;
          const isCurrent = index === currentStageIndex;
          const nodeColor = isCompleted || isCurrent ? 'border-indigo-600 text-indigo-600' : 'border-gray-300 text-gray-400';
          const labelColor = isCurrent ? 'text-indigo-700' : isCompleted ? 'text-gray-600' : 'text-gray-400';

          return (
            <div
              key={index}
              role="listitem"
              aria-current={isCurrent ? 'step' : undefined}
              className="flex flex-col items-center w-full"
            >
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-4 bg-white transition-colors duration-300 ${nodeColor}`}
                animate={{ scale: isCurrent ? 1.15 : 1 }}
                transition={{ duration: 0.25 }}
              >
                {isCompleted
                  ? <SafeIcon icon={FiCheck} className="text-lg" />
                  : <span className="font-bold text-sm">{index + 1}</span>
                }
              </motion.div>
              <span className={`mt-2 text-xs font-semibold text-center leading-tight transition-colors duration-300 ${labelColor}`}>
                {stage}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;