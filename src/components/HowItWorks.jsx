import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import { useLanguage } from '../context/LanguageContext.jsx';
import phoneScreen from '../assets/agri-phone-screen.png';

const FLOW_STEPS = [
  {
    num: '01',
    title: 'Open AgriConnect',
    desc: 'Farmer sees weather, crop advisory, mandi prices and quick actions in one dashboard.',
  },
  {
    num: '02',
    title: 'Choose a Service',
    desc: 'User can check crop prices, sell produce, scan crop disease or ask experts.',
  },
  {
    num: '03',
    title: 'Get Smart Guidance',
    desc: 'AgriConnect gives useful information, alerts and personalized agriculture support.',
  },
  {
    num: '04',
    title: 'Take Action Fast',
    desc: 'Farmers connect with buyers, experts and market services directly from the app.',
  },
];

const ArrowConnector = ({ reverse = false }) => {
  return (
    <div className="hidden lg:flex justify-center my-2">
      <svg
        width="180"
        height="70"
        viewBox="0 0 180 70"
        fill="none"
        className={reverse ? 'scale-x-[-1]' : ''}
      >
        <motion.path
          d="M20 15 C70 70, 110 0, 160 45"
          stroke="#22c55e"
          strokeWidth="3"
          strokeDasharray="8 8"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        />
        <path d="M151 33 L164 47 L145 51" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
};

const HowItWorks = () => {
  const { t } = useLanguage();

  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-br from-green-50 via-white to-emerald-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-agri-primary text-sm font-semibold rounded-full mb-4 border border-green-100">
              <span className="w-1.5 h-1.5 bg-agri-accent rounded-full" />
              {t('howItWorks.badge') || 'How It Works'}
            </span>

            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
              {t('howItWorks.title') || 'How AgriConnect Works'}
            </h2>

            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              From checking weather to selling crops, everything happens in one simple farmer-friendly app.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* LEFT SIDE PHONE IMAGE */}
          <ScrollReveal direction="left">
            <div className="relative flex justify-center lg:justify-start">
              <div className="absolute w-72 h-72 bg-green-300/30 rounded-full blur-3xl top-20 left-10" />
              <div className="absolute w-52 h-52 bg-emerald-400/20 rounded-full blur-3xl bottom-20 right-10" />

              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="relative z-10"
              >
                <img
                  src={phoneScreen}
                  alt="AgriConnect mobile app screen"
                  className="w-[300px] sm:w-[360px] lg:w-[430px]"
                />
              </motion.div>
            </div>
          </ScrollReveal>

          {/* RIGHT SIDE FLOW */}
          <div className="relative">
            {FLOW_STEPS.map((step, index) => {
              const isLeft = index % 2 !== 0;

              return (
                <div key={step.num}>
                  <ScrollReveal delay={index * 0.12} direction={isLeft ? 'left' : 'right'}>
                    <motion.div
                      whileHover={{ y: -6, scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className={`relative max-w-sm ${isLeft ? 'lg:mr-auto' : 'lg:ml-auto'}`}
                    >
                      <div className="relative bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-green-100 shadow-lg shadow-green-100/60 hover:shadow-xl hover:shadow-green-200/70 transition-all duration-500">
                        <div className="absolute -top-4 left-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
                          STEP {step.num}
                        </div>

                        <div className="pt-4">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {step.title}
                          </h3>

                          <p className="text-gray-500 text-sm leading-relaxed">
                            {step.desc}
                          </p>
                        </div>

                        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-md hidden lg:block" />
                      </div>
                    </motion.div>
                  </ScrollReveal>

                  {index < FLOW_STEPS.length - 1 && (
                    <ArrowConnector reverse={index % 2 === 0} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;