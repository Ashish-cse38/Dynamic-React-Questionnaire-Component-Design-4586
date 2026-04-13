import React from 'react';
import { motion } from 'framer-motion';

const BigCheckOverlay = ({ active }) => {
  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[60]" aria-hidden="true">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        style={{
          background:
            'radial-gradient(60% 60% at 50% 40%, rgba(99, 102, 241, 0.18), rgba(15, 23, 42, 0) 70%)',
        }}
      />

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          initial={{ y: -160, scale: 0.82, rotateX: 60, rotateZ: -10, opacity: 0 }}
          animate={{ y: 0, scale: 1, rotateX: 0, rotateZ: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16 }}
        >
        <div
          className="relative"
          style={{
            filter: 'drop-shadow(0 40px 60px rgba(15, 23, 42, 0.25))',
            transformStyle: 'preserve-3d',
          }}
        >
          <div
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-[28px] grid place-items-center"
            style={{
              background: 'linear-gradient(145deg, #22c55e, #16a34a)',
              boxShadow:
                'inset 0 2px 0 rgba(255,255,255,0.45), inset 0 -14px 24px rgba(15,23,42,0.18)',
            }}
          >
            <div
              className="absolute inset-2 rounded-[22px]"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.22), rgba(255,255,255,0))',
                border: '1px solid rgba(255,255,255,0.30)',
              }}
            />
            <svg
              className="relative z-10"
              width="74"
              height="74"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                filter: 'drop-shadow(0 6px 10px rgba(15, 23, 42, 0.18))',
              }}
            >
              <path
                d="M20 7L9 18l-5-5"
                stroke="#FFFFFF"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div
            className="absolute inset-0 rounded-[28px]"
            style={{
              transform: 'translateZ(-14px)',
              background: 'linear-gradient(145deg, #15803d, #166534)',
              opacity: 0.95,
            }}
          />
        </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BigCheckOverlay;

