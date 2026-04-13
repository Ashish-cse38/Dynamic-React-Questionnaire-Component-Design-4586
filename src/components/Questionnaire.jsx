import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NumberedProgressBar1 from './NumberedProgressBar1';
import NamedProgressBar1 from './NamedProgressBar1';
import FieldRenderer from './FieldRenderer';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { BigCheckOverlay, ConfettiOverlay, FireworkOverlay } from '../effects';

const { FiArrowRight, FiArrowLeft, FiCheck, FiRefreshCw } = FiIcons;

const resolveToken = (template, stageName) =>
  template?.replace('{stage}', stageName) ?? stageName;

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
  // Fallback for non-hex CSS colors (e.g. "green", "rgb(...)")
  return `color-mix(in srgb, ${color} ${Math.round(a * 100)}%, transparent)`;
};

const headerGradient = (themeColor) =>
  `linear-gradient(135deg, ${withAlpha(themeColor, 0.12)} 0%, #FFFFFF 100%)`;

const Questionnaire = ({ config, onSubmit }) => {
  const {
    stages,
    fields,
    topHeading,
    topSubHeading,
    mainHeading,
    subHeading,
    stageHeading,
    stageDescription,
    progressBarVariant = 'numberedprogressbar1',
    colors,
    area,
    EffectOnSubmit,
    themeColor: themeColorProp,
    endHeader = 'All Done!',
    endSubHeader = 'Your responses have been recorded successfully.\nThank you for taking the time to fill this out.',
    enableStartOver = true,
    previewMode = false,
  } = config;

  const resolvedThemeColor =
    themeColorProp ?? colors?.headings?.stageHeading ?? '#4338CA';

  const color = {
    background: colors?.background,
    cardHeader: colors?.cardHeader ?? headerGradient(resolvedThemeColor),
    cardMain: colors?.cardMain,
    cardFooter: colors?.cardFooter,
    headings: {
      topHeading: colors?.headings?.topHeading,
      mainHeading: colors?.headings?.mainHeading,
      stageHeading: resolvedThemeColor,
    },
    subHeadings: {
      topSubHeading: colors?.subHeadings?.topSubHeading,
      subHeading: colors?.subHeadings?.subHeading,
      stageDescription: colors?.subHeadings?.stageDescription,
    },
    text: {
      default: colors?.text?.default,
      muted: colors?.text?.muted,
    },
  };

  const accentBadgeStyle = {
    color: resolvedThemeColor,
    backgroundColor: withAlpha(resolvedThemeColor, 0.08),
    borderColor: withAlpha(resolvedThemeColor, 0.16),
  };

  const primaryButtonStyle = {
    backgroundColor: resolvedThemeColor,
    boxShadow: `0 12px 24px ${hexToRgb(resolvedThemeColor) ? withAlpha(resolvedThemeColor, 0.18) : 'rgba(15, 23, 42, 0.14)'}`,
  };

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [direction, setDirection] = useState(1);
  const [confettiActive, setConfettiActive] = useState(false);
  const [bigCheckActive, setBigCheckActive] = useState(false);
  const [fireworkActive, setFireworkActive] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const clampPercent = (n) => {
    if (typeof n !== 'number' || Number.isNaN(n)) return undefined;
    return Math.min(100, Math.max(0, n));
  };

  const cardWidthPercent = clampPercent(area?.cardWidthPercent);
  const cardHeightPercent = clampPercent(area?.cardHeightPercent);
  const headerPercent = clampPercent(area?.headerPercent);
  const footerPercent = clampPercent(area?.footerPercent);
  const isConstrainedHeight = cardHeightPercent !== undefined;

  const cardStyle = {
    ...(cardWidthPercent !== undefined ? { width: `${cardWidthPercent}%` } : {}),
    ...(cardHeightPercent !== undefined ? { height: `${cardHeightPercent}vh` } : {}),
    backgroundColor: color.cardMain,
  };

  const useGridRows =
    cardHeightPercent !== undefined &&
    headerPercent !== undefined &&
    footerPercent !== undefined;

  const computedMainPercent =
    headerPercent !== undefined && footerPercent !== undefined
      ? Math.max(0, 100 - headerPercent - footerPercent)
      : undefined;

  const cardGridStyle = useGridRows
    ? {
        display: 'grid',
        gridTemplateRows: `${headerPercent}% ${computedMainPercent}% ${footerPercent}%`,
      }
    : {};

  const currentStageName = stages[currentStageIndex];
  const currentFields = fields.filter((f) => f.stage === currentStageName);
  const isLastStage = currentStageIndex === stages.length - 1;
  const isOnPreviewStep = Boolean(previewMode && isPreviewing);

  const resolvedStageHeading = stageHeading
    ? resolveToken(stageHeading, currentStageName)
    : currentStageName;

  const resolvedStageDescription = stageDescription
    ? resolveToken(stageDescription, currentStageName)
    : null;

  const formatAnswer = (value) => {
    if (value === undefined || value === null) return '—';
    if (Array.isArray(value)) return value.length ? value.join(', ') : '—';
    if (typeof value === 'string') return value.trim() ? value : '—';
    return String(value);
  };

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
        const isEmpty =
          val === undefined ||
          val === null ||
          val === '' ||
          (Array.isArray(val) && val.length === 0);
        if (isEmpty) newErrors[field.name] = 'This field is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStage()) return;
    if (isLastStage) {
      if (previewMode && !isPreviewing) {
        setDirection(1);
        setIsPreviewing(true);
        return;
      }
      if (onSubmit) onSubmit(formData);
      else console.log('Submitted:', formData);
      if (EffectOnSubmit === 'confetti') {
        setConfettiActive(true);
        window.setTimeout(() => setConfettiActive(false), 2200);
      } else if (EffectOnSubmit === 'bigCheck') {
        setBigCheckActive(true);
        window.setTimeout(() => setBigCheckActive(false), 1600);
      } else if (EffectOnSubmit === 'firework') {
        setFireworkActive(true);
        window.setTimeout(() => setFireworkActive(false), 2600);
      }
      setIsSubmitted(true);
    } else {
      setDirection(1);
      setCurrentStageIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (previewMode && isPreviewing) {
      setDirection(-1);
      setIsPreviewing(false);
      return;
    }
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
    setIsPreviewing(false);
    setConfettiActive(false);
    setBigCheckActive(false);
    setFireworkActive(false);
  };

  if (isSubmitted) {
    return (
      <div
        className={[
          'w-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8',
          isConstrainedHeight ? 'h-screen overflow-hidden py-4' : 'min-h-screen py-8',
        ].join(' ')}
        style={{ backgroundColor: color.background, color: color.text.default }}
      >
        <ConfettiOverlay active={confettiActive} />
        <BigCheckOverlay active={bigCheckActive} />
        <FireworkOverlay active={fireworkActive} />
        {(topHeading || topSubHeading) && (
          <div className="w-full max-w-4xl mb-4">
            {topHeading && (
              <h1
                className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight"
                style={{ color: color.headings.topHeading }}
              >
                {topHeading}
              </h1>
            )}
            {topSubHeading && (
              <p
                className="mt-2 text-gray-600 text-base sm:text-lg leading-relaxed"
                style={{ color: color.subHeadings.topSubHeading ?? color.text.muted }}
              >
                {topSubHeading}
              </p>
            )}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-14 text-center"
          role="status"
          aria-live="polite"
          style={cardStyle}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <SafeIcon icon={FiCheck} className="text-green-500 text-5xl" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3" style={{ color: color.headings.mainHeading }}>
            {endHeader}
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed whitespace-pre-line" style={{ color: color.text.muted }}>
            {endSubHeader}
          </p>
          {enableStartOver && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-7 py-3 text-white font-semibold rounded-xl hover:brightness-95 active:scale-95 transition-all duration-200 shadow-md"
              style={primaryButtonStyle}
            >
              <SafeIcon icon={FiRefreshCw} /> Start Over
            </button>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className={[
        'w-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8',
        isConstrainedHeight ? 'h-screen overflow-hidden py-4' : 'min-h-screen py-8',
      ].join(' ')}
      style={{ backgroundColor: color.background, color: color.text.default }}
    >
      <ConfettiOverlay active={confettiActive} />
      <BigCheckOverlay active={bigCheckActive} />
      <FireworkOverlay active={fireworkActive} />
      {(topHeading || topSubHeading) && (
        <div className="w-full max-w-4xl mb-4">
          {topHeading && (
            <h1
              className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight"
              style={{ color: color.headings.topHeading }}
            >
              {topHeading}
            </h1>
          )}
          {topSubHeading && (
            <p
              className="mt-2 text-gray-600 text-base sm:text-lg leading-relaxed"
              style={{ color: color.subHeadings.topSubHeading ?? color.text.muted }}
            >
              {topSubHeading}
            </p>
          )}
        </div>
      )}

      <div className="w-full max-w-4xl">
        <div
          className="w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col"
          role="main"
          aria-label="Multi-step questionnaire"
          style={{ ...cardStyle, ...cardGridStyle }}
        >
          {/* Header */}
          <div
            className="px-8 pt-4 border-b border-gray-100"
            style={{ background: color.cardHeader }}
          >
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-2xl font-bold text-gray-800" style={{ color: color.headings.mainHeading }}>
              {mainHeading}
            </h2>
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full border"
              aria-live="polite"
              style={accentBadgeStyle}
            >
              {isOnPreviewStep ? 'Preview' : `Step ${currentStageIndex + 1} of ${stages.length}`}
            </span>
          </div>
          <p className="text-sm text-gray-400 mb-6" style={{ color: color.subHeadings.subHeading ?? color.text.muted }}>
            {subHeading}
          </p>
          {progressBarVariant === 'namedprogressbar1'
            ? <NamedProgressBar1 stages={stages} currentStageIndex={currentStageIndex} themeColor={resolvedThemeColor} />
            : <NumberedProgressBar1 stages={stages} currentStageIndex={currentStageIndex} themeColor={resolvedThemeColor} />
          }
          </div>

          {/* Fields */}
          <div
          className={[
            'flex-1 px-8 py-4 min-h-[380px]',
            isConstrainedHeight ? 'overflow-y-auto' : 'overflow-visible',
          ].join(' ')}
            style={{ backgroundColor: color.cardMain }}
          >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={isOnPreviewStep ? 'preview' : currentStageIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction * 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -30 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {isOnPreviewStep ? (
                <div>
                  <h3
                    className="text-base font-bold uppercase tracking-widest mb-4"
                    style={{ color: color.headings.stageHeading }}
                  >
                    Preview your answers
                  </h3>

                  <div className="space-y-8">
                    {stages.map((stage) => {
                      const stageFields = fields.filter((f) => f.stage === stage);
                      if (!stageFields.length) return null;

                      return (
                        <section key={stage} className="rounded-2xl border border-gray-100 bg-white/60">
                          <div className="px-5 py-4 border-b border-gray-100">
                            <h4 className="text-sm font-bold tracking-wide" style={{ color: color.headings.mainHeading }}>
                              {stage}
                            </h4>
                          </div>
                          <div className="px-5 py-4">
                            <dl className="space-y-4">
                              {stageFields.map((f) => (
                                <div key={f.name} className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4">
                                  <dt className="text-sm font-semibold" style={{ color: color.text.default }}>
                                    {f.label}
                                  </dt>
                                  <dd className="text-sm sm:col-span-2" style={{ color: color.text.muted }}>
                                    {formatAnswer(formData[f.name])}
                                  </dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                        </section>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div>
                  <h3
                    className="text-base font-bold uppercase tracking-widest mb-1 flex items-center gap-2"
                    style={{ color: color.headings.stageHeading }}
                  >
                    <span
                      className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-bold"
                      style={{ backgroundColor: resolvedThemeColor }}
                    >
                      {currentStageIndex + 1}
                    </span>
                    {resolvedStageHeading}
                  </h3>

                  {resolvedStageDescription && (
                    <p
                      className="text-sm text-gray-400 mb-6 ml-8"
                      style={{ color: color.subHeadings.stageDescription ?? color.text.muted }}
                    >
                      {resolvedStageDescription}
                    </p>
                  )}

                  {!resolvedStageDescription && <div className="mb-6" />}

                  {currentFields.map((field) => (
                    <FieldRenderer
                      key={field.name}
                      field={field}
                      value={formData[field.name] ?? ''}
                      onChange={handleChange}
                      error={errors[field.name]}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          </div>

          {/* Footer nav */}
          <div
            className="px-8 pb-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between"
            style={{ backgroundColor: color.cardFooter }}
          >
          <button
            onClick={handlePrev}
            disabled={currentStageIndex === 0 && !isOnPreviewStep}
            aria-label={isOnPreviewStep ? 'Back to edit' : 'Go to previous step'}
            className={[
              'flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200',
              (currentStageIndex === 0 && !isOnPreviewStep)
                ? 'opacity-0 pointer-events-none'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300',
            ].join(' ')}
          >
            <SafeIcon icon={FiArrowLeft} /> {isOnPreviewStep ? 'Back to Edit' : 'Previous'}
          </button>

          <button
            onClick={handleNext}
            aria-label={isLastStage ? (isOnPreviewStep ? 'Confirm submit' : 'Submit form') : 'Go to next step'}
            className="flex items-center gap-2 px-7 py-2.5 rounded-xl font-semibold text-sm text-white hover:brightness-95 active:scale-95 transition-all duration-200 shadow-md"
            style={primaryButtonStyle}
          >
            {isLastStage ? (
              <><SafeIcon icon={FiCheck} /> {isOnPreviewStep ? 'Confirm & Submit' : 'Preview'}</>
            ) : (
              <> Next Step <SafeIcon icon={FiArrowRight} /></>
            )}
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;