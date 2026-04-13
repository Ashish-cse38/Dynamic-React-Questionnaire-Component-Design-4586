import React from 'react';
import { motion } from 'framer-motion';
import { EFFECT_COLORS } from './colors';

const ConfettiOverlay = ({ active }) => {
  if (!active) return null;

  const pieces = Array.from({ length: 70 }, (_, i) => {
    const left = Math.random() * 100; // vw
    const size = 6 + Math.random() * 8; // px
    const delay = Math.random() * 0.25; // s
    const duration = 1.6 + Math.random() * 0.9; // s
    const rotate = Math.random() * 720 - 360;
    const drift = Math.random() * 40 - 20; // vw
    const color = EFFECT_COLORS[i % EFFECT_COLORS.length];
    const shape = Math.random() > 0.75 ? 'rounded-full' : 'rounded-sm';

    return {
      key: i,
      left,
      size,
      delay,
      duration,
      rotate,
      drift,
      color,
      shape,
    };
  });

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-[60]"
      aria-hidden="true"
    >
      {pieces.map((p) => (
        <motion.span
          key={p.key}
          className={['absolute top-0', p.shape].join(' ')}
          style={{
            left: `${p.left}vw`,
            width: `${p.size}px`,
            height: `${p.size * 0.6}px`,
            backgroundColor: p.color,
            boxShadow: '0 10px 25px rgba(15, 23, 42, 0.15)',
          }}
          initial={{ y: '-10vh', x: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: '110vh',
            x: `${p.drift}vw`,
            rotate: p.rotate,
            opacity: [0, 1, 1, 0.9],
          }}
          transition={{
            delay: p.delay,
            duration: p.duration,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
};

export default ConfettiOverlay;

