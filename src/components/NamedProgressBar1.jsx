import React from 'react';
import { motion } from 'framer-motion';

/**
 * Progress indicator focused on stage names with separators.
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

const NamedProgressBar1 = ({ stages, currentStageIndex, themeColor = '#4338CA' }) => {
  return (
    <nav aria-label="Form progress" className="w-full">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm">
        {stages.map((stage, index) => {
          const isCompleted = index < currentStageIndex;
          const isCurrent = index === currentStageIndex;
          const textClass = isCurrent
            ? 'font-semibold'
            : isCompleted
              ? 'text-gray-700'
              : 'text-gray-900';

          const currentStyle = isCurrent
            ? { color: themeColor, borderColor: withAlpha(themeColor, 0.18), backgroundColor: withAlpha(themeColor, 0.08) }
            : undefined;

          return (
            <li key={stage} className="flex items-center">
              <motion.span
                className={[
                  'inline-flex items-center rounded-full px-3 py-1.5 border transition-colors',
                  isCurrent
                    ? ''
                    : isCompleted
                      ? 'border-gray-200 bg-white'
                      : 'border-transparent bg-transparent',
                  textClass,
                ].join(' ')}
                style={currentStyle}
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

