import React from 'react';
import { motion } from 'framer-motion';

/**
 * Progress indicator focused on stage names with separators.
 *
 * @param {import('../types').ProgressBarProps} props
 */
const NamedProgressBar1 = ({ stages, currentStageIndex }) => {
  return (
    <nav aria-label="Form progress" className="w-full">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm">
        {stages.map((stage, index) => {
          const isCompleted = index < currentStageIndex;
          const isCurrent = index === currentStageIndex;
          const textClass = isCurrent
            ? 'text-indigo-700 font-semibold'
            : isCompleted
              ? 'text-gray-700'
              : 'text-gray-400';

          return (
            <li key={stage} className="flex items-center">
              <motion.span
                className={[
                  'inline-flex items-center rounded-full px-3 py-1.5 border transition-colors',
                  isCurrent
                    ? 'border-indigo-200 bg-indigo-50'
                    : isCompleted
                      ? 'border-gray-200 bg-white'
                      : 'border-transparent bg-transparent',
                  textClass,
                ].join(' ')}
                aria-current={isCurrent ? 'step' : undefined}
                initial={false}
                animate={{ scale: isCurrent ? 1.02 : 1 }}
                transition={{ duration: 0.15 }}
              >
                {stage}
              </motion.span>

              {index < stages.length - 1 && (
                <span className="mx-2 text-gray-300 select-none" aria-hidden="true">
                  &gt;
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default NamedProgressBar1;

