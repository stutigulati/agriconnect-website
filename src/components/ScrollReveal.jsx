import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * Wraps children in a smooth fade-in-up animation triggered on scroll.
 * @param {object} props
 * @param {'up'|'left'|'right'|'none'} [props.direction='up']
 * @param {number} [props.delay=0]
 * @param {number} [props.duration=0.6]
 * @param {number} [props.distance=40]
 * @param {string} [props.className]
 */
const ScrollReveal = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 40,
  className = '',
  once = true,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-60px 0px' });

  const directionMap = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    none: { x: 0, y: 0 },
  };

  const initial = {
    opacity: 0,
    ...directionMap[direction],
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={initial}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : initial}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // custom cubic-bezier for smooth organic feel
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
