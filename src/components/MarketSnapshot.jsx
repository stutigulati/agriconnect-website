import { GiTomato, GiWheat, GiGarlic, GiRiceCooker, GiPotato } from 'react-icons/gi';
import { Link } from 'react-router-dom';
import ScrollReveal from './ScrollReveal';
import { useLanguage } from '../context/LanguageContext.jsx';

const MARKET_BASE = [
  { crop: 'Tomato', hindiName: 'टमाटर', guName: 'ટામેટા', icon: <GiTomato />, price: '₹1,800/qtl', trend: 'down', change: '-₹250', color: 'text-red-500' },
  { crop: 'Wheat',  hindiName: 'गेहूं',  guName: 'ઘઉં',   icon: <GiWheat />,      price: '₹2,180/qtl', trend: 'up',   change: '+₹45',  color: 'text-amber-600' },
  { crop: 'Onion',  hindiName: 'प्याज',  guName: 'ડુંગળી', icon: <GiGarlic />,     price: '₹2,200/qtl', trend: 'up',   change: '+₹340', color: 'text-purple-500' },
  { crop: 'Rice',   hindiName: 'चावल',   guName: 'ચોખા',  icon: <GiRiceCooker />, price: '₹3,250/qtl', trend: 'down', change: '-₹60',  color: 'text-yellow-600' },
  { crop: 'Potato', hindiName: 'आलू',    guName: 'બટાકા', icon: <GiPotato />,     price: '₹1,200/qtl', trend: 'up',   change: '+₹80',  color: 'text-amber-700' },
];

const MarketSnapshot = () => {
  const { t, lang } = useLanguage();

  return (
    <section id="prices" className="py-24 bg-white/80">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-agri-primary text-sm font-semibold rounded-full mb-4">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              {t('marketSnapshot.badge')}
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
              {t('marketSnapshot.title')}
            </h2>
            <p className="text-gray-500 mt-4 text-lg">{t('marketSnapshot.subtitle')}</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {MARKET_BASE.map((item, i) => (
            <ScrollReveal key={item.crop} delay={i * 0.08} direction="up">
              <Link
                to="/mandi-prices"
                id={`market-${item.crop.toLowerCase()}`}
                className={`group relative rounded-2xl p-6 border transition-all duration-500 hover:-translate-y-2 hover:shadow-xl cursor-pointer h-full block no-underline ${
                  item.trend === 'up'
                    ? 'bg-gradient-to-br from-white to-green-50/30 border-green-100 hover:border-green-200 hover:shadow-green-200/30'
                    : 'bg-gradient-to-br from-white to-red-50/20 border-red-100 hover:border-red-200 hover:shadow-red-200/20'
                }`}
              >
                <div className={`absolute top-0 left-6 right-6 h-1 rounded-b-full ${
                  item.trend === 'up' ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-red-400 to-rose-500'
                }`} />

                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-3xl ${item.color}`}>{item.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{item.crop}</h3>
                    <p className="text-xs text-gray-400 mb-1">
                      {lang === 'hi' ? item.hindiName : lang === 'gu' ? item.guName : item.hindiName}
                    </p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block ${
                      item.trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {item.change} {item.trend === 'up' ? '↑' : '↓'}
                    </span>
                  </div>
                </div>

                <p className="text-xl font-extrabold text-gray-900">{item.price}</p>
                <p className="text-xs text-gray-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {t('marketSnapshot.clickForMore')} →
                </p>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.3}>
          <div className="text-center mt-12">
            <Link
              to="/mandi-prices"
              id="view-full-market"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-agri-primary to-agri-secondary text-white font-semibold rounded-2xl shadow-lg shadow-green-800/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 hover:scale-[1.02]"
            >
              {t('marketSnapshot.viewAll')}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default MarketSnapshot;
