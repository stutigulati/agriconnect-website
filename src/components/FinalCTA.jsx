import { GiWheat } from 'react-icons/gi';
import ScrollReveal from './ScrollReveal';
import { useLanguage } from '../context/LanguageContext.jsx';

const FinalCTA = () => {
  const { t } = useLanguage();
  return (
    <section id="sell" className="py-24 bg-green-50/50 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-green-100 to-emerald-50 rounded-full blur-3xl opacity-60" />
      </div>

      <ScrollReveal>
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <span className="text-6xl mb-6 block text-green-600"><GiWheat className="inline" /></span>
          <h2 className="text-4xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            {t('finalCTA.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
              {t('finalCTA.titleHighlight')}
            </span>
          </h2>
          <p className="text-xl text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
            {t('finalCTA.subtitle')}
          </p>
          <a
            href="#"
            id="cta-join-agriconnect"
            className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg font-bold rounded-2xl shadow-xl shadow-green-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/40 hover:-translate-y-1 hover:scale-[1.03]"
          >
            {t('finalCTA.cta')}
            <svg className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <p className="mt-6 text-sm text-gray-400">{t('finalCTA.fine')}</p>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default FinalCTA;
