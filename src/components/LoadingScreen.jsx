import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0); // 0 = seed, 1 = sprout, 2 = plant

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1.5;
      });
    }, 30);

    const t1 = setTimeout(() => setStage(1), 800);
    const t2 = setTimeout(() => setStage(2), 1600);
    const t3 = setTimeout(() => onFinish(), 2800);

    return () => {
      clearInterval(interval);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onFinish]);

  return (
    <motion.div
      className="loading-screen"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      {/* Soft background particles */}
      <div className="loading-particles">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="loading-particle"
            style={{
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 25}%`,
              width: `${40 + i * 12}px`,
              height: `${40 + i * 12}px`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.15, 0.3, 0.15],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Center content */}
      <div className="loading-content">
        {/* Growing plant animation */}
        <div className="loading-plant-container">
          <svg
            viewBox="0 0 200 260"
            className="loading-plant-svg"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ground */}
            <motion.ellipse
              cx="100"
              cy="230"
              rx="60"
              ry="12"
              fill="#5d4037"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 0.6, scaleX: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            <motion.ellipse
              cx="100"
              cy="228"
              rx="50"
              ry="8"
              fill="#795548"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 0.4, scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />

            {/* Stem — grows upward using a rect with scaleY */}
            <motion.rect
              x="98.25"
              width="3.5"
              rx="1.75"
              fill="#4caf50"
              initial={{ y: 228, height: 0 }}
              animate={{
                y: stage >= 2 ? 80 : stage >= 1 ? 140 : 190,
                height: stage >= 2 ? 148 : stage >= 1 ? 88 : 38,
              }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />

            {/* Stage 0: Seed / tiny sprout */}
            <AnimatePresence>
              {stage === 0 && (
                <motion.g
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Tiny leaves */}
                  <motion.path
                    d="M100 190 Q90 180 85 185 Q88 195 100 190"
                    fill="#66bb6a"
                    animate={{ rotate: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ transformOrigin: '100px 190px' }}
                  />
                  <motion.path
                    d="M100 190 Q110 180 115 185 Q112 195 100 190"
                    fill="#81c784"
                    animate={{ rotate: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ transformOrigin: '100px 190px' }}
                  />
                </motion.g>
              )}
            </AnimatePresence>

            {/* Stage 1: Sprout with leaves */}
            <AnimatePresence>
              {stage >= 1 && (
                <motion.g
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Left leaf */}
                  <motion.path
                    d="M100 155 Q75 130 65 145 Q78 165 100 155"
                    fill="#4caf50"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1, rotate: [0, -3, 0] }}
                    transition={{ duration: 0.6, rotate: { duration: 3, repeat: Infinity } }}
                    style={{ transformOrigin: '100px 155px' }}
                  />
                  {/* Right leaf */}
                  <motion.path
                    d="M100 145 Q125 120 135 135 Q122 155 100 145"
                    fill="#66bb6a"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1, rotate: [0, 3, 0] }}
                    transition={{ duration: 0.6, delay: 0.15, rotate: { duration: 3, repeat: Infinity } }}
                    style={{ transformOrigin: '100px 145px' }}
                  />
                  {/* Small center leaf */}
                  <motion.path
                    d="M100 140 Q93 125 100 118 Q107 125 100 140"
                    fill="#81c784"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    style={{ transformOrigin: '100px 130px' }}
                  />
                </motion.g>
              )}
            </AnimatePresence>

            {/* Stage 2: Full wheat / mature plant */}
            <AnimatePresence>
              {stage >= 2 && (
                <motion.g
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Big left leaf */}
                  <motion.path
                    d="M100 120 Q60 90 55 110 Q70 140 100 120"
                    fill="#43a047"
                    animate={{ rotate: [0, -2, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    style={{ transformOrigin: '100px 120px' }}
                  />
                  {/* Big right leaf */}
                  <motion.path
                    d="M100 105 Q140 75 145 95 Q130 125 100 105"
                    fill="#4caf50"
                    animate={{ rotate: [0, 2, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                    style={{ transformOrigin: '100px 105px' }}
                  />
                  {/* Wheat head */}
                  <motion.g
                    animate={{ rotate: [0, 1.5, -1.5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ transformOrigin: '100px 80px' }}
                  >
                    {/* Wheat grains */}
                    {[0, 1, 2, 3, 4].map((i) => (
                      <motion.ellipse
                        key={i}
                        cx={97 + (i % 2) * 6}
                        cy={82 - i * 7}
                        rx="5"
                        ry="3.5"
                        fill="#f9a825"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 * i, duration: 0.3 }}
                        transform={`rotate(${(i % 2) * 20 - 10} ${97 + (i % 2) * 6} ${82 - i * 7})`}
                      />
                    ))}
                    {/* Wheat whiskers */}
                    {[0, 1, 2].map((i) => (
                      <motion.line
                        key={`whisker-${i}`}
                        x1={100}
                        y1={52 + i * 8}
                        x2={108 + i * 2}
                        y2={44 + i * 6}
                        stroke="#f9a825"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.3 }}
                      />
                    ))}
                  </motion.g>
                </motion.g>
              )}
            </AnimatePresence>
          </svg>

          {/* Stage labels */}
          <div className="loading-stage-labels">
            <span className={`loading-stage-label ${stage >= 0 ? 'active' : ''}`}>🌱</span>
            <span className={`loading-stage-divider ${stage >= 1 ? 'active' : ''}`} />
            <span className={`loading-stage-label ${stage >= 1 ? 'active' : ''}`}>🌿</span>
            <span className={`loading-stage-divider ${stage >= 2 ? 'active' : ''}`} />
            <span className={`loading-stage-label ${stage >= 2 ? 'active' : ''}`}>🌾</span>
          </div>
        </div>

        {/* Loading text */}
        <motion.p
          className="loading-text"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Preparing your farming assistant...
        </motion.p>

        {/* Progress bar */}
        <div className="loading-progress-track">
          <motion.div
            className="loading-progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.1 }}
          />
          {/* Leaf decorations on progress bar */}
          <motion.div
            className="loading-progress-leaf"
            animate={{ left: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.1 }}
          >
            🍃
          </motion.div>
        </div>
      </div>

      {/* Branding */}
      <motion.div
        className="loading-brand"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="loading-brand-agri">Agri</span>
        <span className="loading-brand-connect">Connect</span>
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;
