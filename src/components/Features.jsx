import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import { useLanguage } from '../context/LanguageContext.jsx';

/* Animated SVG Icons */

function PriceIcon() {
  return (
    <svg viewBox="0 0 56 56" fill="none" className="w-16 h-16">
      <motion.rect
        x="6"
        y="30"
        width="9"
        height="18"
        rx="2"
        fill="#2e7d32"
        animate={{ height: [18, 26, 18], y: [30, 22, 30] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
      />

      <motion.rect
        x="19"
        y="22"
        width="9"
        height="26"
        rx="2"
        fill="#388e3c"
        animate={{ height: [26, 34, 26], y: [22, 14, 22] }}
        transition={{
          repeat: Infinity,
          duration: 1.8,
          delay: 0.2,
          ease: 'easeInOut',
        }}
      />

      <motion.rect
        x="32"
        y="14"
        width="9"
        height="34"
        rx="2"
        fill="#43a047"
        animate={{ height: [34, 42, 34], y: [14, 6, 14] }}
        transition={{
          repeat: Infinity,
          duration: 1.8,
          delay: 0.4,
          ease: 'easeInOut',
        }}
      />

      <motion.path
        d="M6 38 L15 26 L28 18 L41 10"
        stroke="#81c784"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 1, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
      />

      <motion.circle
        cx="47"
        cy="9"
        r="7"
        fill="#e8f5e9"
        stroke="#4caf50"
        strokeWidth="1.5"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />

      <text
        x="47"
        y="13"
        textAnchor="middle"
        fontSize="8"
        fontWeight="bold"
        fill="#2e7d32"
      >
        ₹
      </text>
    </svg>
  );
}

function SellIcon() {
  return (
   <svg viewBox="0 0 56 56" fill="none" className="w-16 h-16">
      <rect
        x="10"
        y="18"
        width="30"
        height="20"
        rx="4"
        fill="#e8f5e9"
        stroke="#4caf50"
        strokeWidth="1.5"
      />

      <motion.rect
        x="19"
        y="22"
        width="12"
        height="10"
        rx="2"
        fill="#4caf50"
        animate={{ x: [19, 21, 19], y: [22, 20, 22] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
      />

      <circle cx="18" cy="42" r="4" fill="#2e7d32" />
      <circle cx="32" cy="42" r="4" fill="#2e7d32" />

      <path
        d="M5 14 L10 18"
        stroke="#388e3c"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <motion.circle
        cx="44"
        cy="14"
        r="8"
        fill="#4caf50"
        animate={{ scale: [0, 1, 1, 0] }}
        transition={{
          repeat: Infinity,
          duration: 2.5,
          times: [0, 0.2, 0.7, 1],
        }}
      />

      <motion.path
        d="M40 14 l3 3 l6-6"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{ pathLength: [0, 1, 1, 0] }}
        transition={{
          repeat: Infinity,
          duration: 2.5,
          times: [0, 0.3, 0.7, 1],
        }}
      />
    </svg>
  );
}

function ScanIcon() {
  return (
    <svg viewBox="0 0 56 56" fill="none" className="w-16 h-16">
      <rect
        x="6"
        y="16"
        width="38"
        height="28"
        rx="6"
        fill="#e8f5e9"
        stroke="#4caf50"
        strokeWidth="1.5"
      />

      <rect
        x="20"
        y="10"
        width="16"
        height="8"
        rx="3"
        fill="#c8e6c9"
        stroke="#4caf50"
        strokeWidth="1.5"
      />

      <circle
        cx="25"
        cy="30"
        r="9"
        fill="white"
        stroke="#4caf50"
        strokeWidth="1.5"
      />

      <motion.circle
        cx="25"
        cy="30"
        r="5"
        fill="#4caf50"
        animate={{ r: [5, 6, 5], opacity: [1, 0.7, 1] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
      />

      <motion.line
        x1="16"
        y1="30"
        x2="34"
        y2="30"
        stroke="#81c784"
        strokeWidth="1.5"
        animate={{ y1: [22, 38, 22], y2: [22, 38, 22] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      />

      <motion.circle
        cx="40"
        cy="22"
        r="3"
        fill="#fdd835"
        animate={{ opacity: [1, 0, 1], scale: [1, 1.5, 1] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
      />
    </svg>
  );
}

function ExpertIcon() {
  return (
    <svg viewBox="0 0 56 56" fill="none" className="w-16 h-16">
      <motion.rect
        x="4"
        y="8"
        width="30"
        height="20"
        rx="8"
        fill="#e8f5e9"
        stroke="#4caf50"
        strokeWidth="1.5"
        animate={{ y: [8, 6, 8] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      />

      <path
        d="M10 28 L6 34 L16 28"
        fill="#e8f5e9"
        stroke="#4caf50"
        strokeWidth="1"
        strokeLinejoin="round"
      />

      <motion.rect
        x="20"
        y="28"
        width="30"
        height="20"
        rx="8"
        fill="#4caf50"
        animate={{ y: [28, 30, 28] }}
        transition={{
          repeat: Infinity,
          duration: 2,
          delay: 0.5,
          ease: 'easeInOut',
        }}
      />

      <path d="M44 48 L48 54 L38 48" fill="#4caf50" />

      {[12, 18, 24].map((x, i) => (
        <motion.circle
          key={x}
          cx={x}
          cy="18"
          r="2.5"
          fill="#4caf50"
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
        />
      ))}

      {[28, 34, 40].map((x, i) => (
        <motion.circle
          key={x}
          cx={x}
          cy="38"
          r="2.5"
          fill="white"
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
          transition={{
            repeat: Infinity,
            duration: 1,
            delay: i * 0.2 + 0.3,
          }}
        />
      ))}
    </svg>
  );
}

const FEATURE_KEYS = [
  { key: 'checkPrices', Icon: PriceIcon },
  { key: 'sellDirectly', Icon: SellIcon },
  { key: 'scanCrop', Icon: ScanIcon },
  { key: 'askExpert', Icon: ExpertIcon },
];

const Features = () => {
  const { t } = useLanguage();

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-agri-primary text-sm font-semibold rounded-full mb-4 border border-green-100">
              <span className="w-1.5 h-1.5 bg-agri-accent rounded-full" />
              {t('features.badge')}
            </span>

            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
              {t('features.title')}
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURE_KEYS.map((f, i) => (
            <ScrollReveal key={f.key} delay={i * 0.1} direction="up">
              <motion.div
                id={`feature-${f.key}`}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="group relative bg-green-50 rounded-2xl p-8 border-2 border-green-200 shadow-md shadow-green-100/60 transition-all duration-500 hover:shadow-xl hover:shadow-green-300/40 hover:border-green-400 hover:bg-green-100/80 cursor-pointer h-full overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-t-2xl" />

                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-green-300/20 rounded-full blur-2xl group-hover:bg-green-400/30 transition-all duration-500" />

                <div className="flex justify-center mb-6 relative z-10">
                  <motion.div
                    className="w-24 h-24 rounded-2xl bg-white shadow-md shadow-green-200/60 flex items-center justify-center border border-green-100 group-hover:scale-110 group-hover:shadow-lg transition-all duration-500"
                    whileHover={{ rotate: [0, -3, 3, 0] }}
                    transition={{ duration: 0.4 }}
                  >
                    <f.Icon />
                  </motion.div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-agri-primary transition-colors duration-300 relative z-10 text-center">
                  {t(`features.items.${f.key}.title`)}
                </h3>

                <p className="text-gray-500 text-sm leading-relaxed relative z-10 text-center">
                  {t(`features.items.${f.key}.desc`)}
                </p>

                <div className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-gray-400 group-hover:text-agri-accent transition-all duration-300 relative z-10">
                  {t('features.learnMore')} →
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;