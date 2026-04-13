import React from 'react';
import { motion } from 'framer-motion';
import { EFFECT_COLORS } from './colors';

const FireworkOverlay = ({ active }) => {
  if (!active) return null;

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Performance tuning: lots of individual motion elements can drop frames.
  // Keep it punchy, but cap total animated nodes.
  const burstCount = prefersReducedMotion ? 3 : 6;
  const particleCount = prefersReducedMotion ? 18 : 30;
  const sparkCount = prefersReducedMotion ? 8 : 12;

  const bursts = Array.from({ length: burstCount }, (_, i) => {
    // Keep bursts clustered around the center (not scattered across the screen)
    const x = 50 + (Math.random() * 22 - 11); // vw
    const y = 36 + (Math.random() * 16 - 8); // vh
    const delay = i * 0.16 + Math.random() * 0.12;
    const color = EFFECT_COLORS[(i * 2) % EFFECT_COLORS.length];
    return { key: i, x, y, delay, color };
  });

  const particles = Array.from({ length: particleCount }, (_, i) => {
    const angle = (i / particleCount) * Math.PI * 2;
    const distance = 80 + Math.random() * 120; // px
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance + (8 + Math.random() * 22); // slight gravity
    const size = 3 + Math.random() * 4.5;
    const rot = Math.random() * 360;
    return { key: i, dx, dy, size, rot };
  });

  const sparks = Array.from({ length: sparkCount }, (_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 30 + Math.random() * 90;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance + (18 + Math.random() * 34);
    const size = 2 + Math.random() * 2.8;
    const rot = Math.random() * 360;
    const delayJitter = 0.08 + Math.random() * 0.26;
    return { key: i, dx, dy, size, rot, delayJitter };
  });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[60]" aria-hidden="true">
      {bursts.map((b) => (
        <motion.div
          key={b.key}
          className="absolute"
          style={{
            left: `${b.x}vw`,
            top: `${b.y}vh`,
            willChange: 'transform, opacity',
            transform: 'translateZ(0)',
          }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.6, 1, 1.05, 1] }}
          transition={{ delay: b.delay, duration: 1.55, ease: 'easeOut' }}
        >
          <motion.div
            className="absolute -left-10 -top-10 w-20 h-20 rounded-full"
            style={{ border: `2px solid ${b.color}`, willChange: 'transform, opacity' }}
            initial={{ opacity: 0, scale: 0.25 }}
            animate={{ opacity: [0, 0.9, 0], scale: [0.25, 1.25, 1.6] }}
            transition={{ delay: b.delay, duration: 0.8, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute -left-14 -top-14 w-28 h-28 rounded-full"
            style={{ border: `1px solid ${b.color}`, willChange: 'transform, opacity' }}
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: [0, 0.5, 0], scale: [0.2, 1.05, 1.35] }}
            transition={{ delay: b.delay + 0.06, duration: 0.95, ease: 'easeOut' }}
          />

          {particles.map((p) => (
            <motion.span
              key={p.key}
              className="absolute left-0 top-0 rounded-sm"
              style={{
                width: `${p.size}px`,
                height: `${Math.max(2, p.size * 0.6)}px`,
                backgroundColor: EFFECT_COLORS[(p.key + b.key) % EFFECT_COLORS.length],
                willChange: 'transform, opacity',
                transform: 'translateZ(0)',
              }}
              initial={{ x: 0, y: 0, opacity: 0, rotate: 0, scale: 1 }}
              animate={{
                x: p.dx,
                y: p.dy,
                opacity: [0, 1, 1, 0],
                rotate: p.rot,
                scale: [1, 1.1, 0.95, 0.88],
              }}
              transition={{
                delay: b.delay,
                duration: 1.3,
                ease: 'easeOut',
              }}
            />
          ))}

          {sparks.map((s) => (
            <motion.span
              key={`spark-${s.key}`}
              className="absolute left-0 top-0 rounded-full"
              style={{
                width: `${s.size}px`,
                height: `${s.size}px`,
                backgroundColor: EFFECT_COLORS[(s.key + b.key + 2) % EFFECT_COLORS.length],
                willChange: 'transform, opacity',
                transform: 'translateZ(0)',
              }}
              initial={{ x: 0, y: 0, opacity: 0, scale: 0.9, rotate: 0 }}
              animate={{
                x: s.dx,
                y: s.dy,
                opacity: [0, 1, 0],
                scale: [0.9, 1.1, 0.7],
                rotate: s.rot,
              }}
              transition={{
                delay: b.delay + s.delayJitter,
                duration: 0.9,
                ease: 'easeOut',
              }}
            />
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export default FireworkOverlay;

