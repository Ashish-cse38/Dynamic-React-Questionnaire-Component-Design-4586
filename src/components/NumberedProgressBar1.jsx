import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheck } = FiIcons;

/**
 * Visual step-progress indicator (numbered nodes).
 *
 * @param {import('../types').ProgressBarProps} props
 */
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

const hexToRgb = (hex) => {
  if (typeof hex !== 'string') return null;
  const cleaned = hex.trim().replace('#', '');
  if (![3, 6].includes(cleaned.length)) return null;
  const full =
    cleaned.length === 3
      ? cleaned
          .split('')
          .map((c) => c + c)
          .join('')
      : cleaned;
  const num = Number.parseInt(full, 16);
  if (Number.isNaN(num)) return null;
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
};

const withAlpha = (color, alpha) => {
  const a = clamp(alpha, 0, 1);
  const rgb = hexToRgb(color);
  if (rgb) return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`;
  return `color-mix(in srgb, ${color} ${Math.round(a * 100)}%, transparent)`;
};

const NumberedProgressBar1 = ({ stages, currentStageIndex, themeColor = '#4338CA' }) => {
  const progressPercentage =
    stages.length > 1 ? (currentStageIndex / (stages.length - 1)) * 100 : 100;

  return (
    <div className="w-full pt-4 pb-12 mb-2 relative" role="list" aria-label="Form progress">
      {/* Background track */}
      <div className="absolute left-5 right-5 top-9 h-1.5 bg-gray-200 rounded-full z-0" />

      {/* Animated fill track */}
      <motion.div
        className="absolute left-5 top-9 h-1.5 rounded-full z-0"
        style={{ right: 'auto', backgroundColor: themeColor }}
        initial={{ width: '0%' }}
        animate={{ width: `calc(${progressPercentage}% * (100% - 40px) / 100%)` }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />

      {/* Stage nodes */}
      <div className="flex items-start justify-between relative z-10">
        {stages.map((stage, index) => {
          const isCompleted = index < currentStageIndex;
          const isCurrent = index === currentStageIndex;
          const nodeClass = isCompleted || isCurrent ? '' : 'border-gray-300 text-gray-400';
          const labelClass = isCompleted ? 'text-gray-600' : 'text-gray-400';

          const nodeStyle =
            isCompleted || isCurrent
              ? { borderColor: themeColor, color: themeColor, boxShadow: `0 10px 18px ${withAlpha(themeColor, 0.12)}` }
              : undefined;

          const labelStyle = isCurrent ? { color: themeColor } : undefined;

          return (
            <div
              key={index}
              role="listitem"
              aria-current={isCurrent ? 'step' : undefined}
              className="flex flex-col items-center w-full"
            >
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-4 bg-white transition-colors duration-300 ${nodeClass}`}
                style={nodeStyle}
                animate={{ scale: isCurrent ? 1.15 : 1 }}
                transition={{ duration: 0.25 }}
              >
                {isCompleted
                  ? <SafeIcon icon={FiCheck} className="text-lg" />
                  : <span className="font-bold text-sm">{index + 1}</span>
                }
              </motion.div>
              <span
                className={`mt-2 text-xs font-semibold text-center leading-tight transition-colors duration-300 ${labelClass}`}
                style={labelStyle}
              >
                {stage}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NumberedProgressBar1;

