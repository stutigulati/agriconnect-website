import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import logoIcon    from '../assets/logo-icon.png';
import heroBg      from '../assets/hero-bg.png';
import imgFarmer   from '../assets/step-sell-directly.png';
import imgBuyer    from '../assets/step-check-prices.png';
import imgAgronomist from '../assets/step-list-crop.png';
import { register, login } from '../lib/communityApi';

const EyeIcon = ({ open }) => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {open ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-3-9C7.03 3 2.5 8.5 2.5 12S7.03 21 12 21s9.5-5.5 9.5-9S16.97 3 12 3z" />
    ) : (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
      </>
    )}
  </svg>
);

const PhoneIcon  = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const LockIcon   = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const UserIcon   = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const MapPinIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

const AuthPage = ({ onClose, onAuthSuccess, initialMode = 'login' }) => {
  const { t } = useLanguage();
  const [mode,     setMode]     = useState(initialMode);
  const [role,     setRole]     = useState('Farmer');
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [form,     setForm]     = useState({ name: '', email: '', password: '', location: '' });

  const roles = [
    { id: 'Farmer',     img: imgFarmer,     color: 'from-green-500 to-green-700',  bgLight: 'bg-green-50',  border: 'border-green-500',  text: 'text-green-700'  },
    { id: 'Buyer',      img: imgBuyer,      color: 'from-amber-500 to-orange-600', bgLight: 'bg-amber-50',  border: 'border-amber-500',  text: 'text-amber-700'  },
    { id: 'Agronomist', img: imgAgronomist, color: 'from-teal-500 to-cyan-700',   bgLight: 'bg-teal-50',   border: 'border-teal-500',   text: 'text-teal-700'   },
  ];

  const roleLabels = {
    Farmer:     { label: 'Farmer',     desc: t('auth.sellCrops')   },
    Buyer:      { label: 'Buyer',      desc: t('auth.buyProduce')  },
    Agronomist: { label: 'Agronomist', desc: t('auth.guideFarmers')},
  };

  const update = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const selectedRole = roles.find(r => r.id === role);

  const handleSubmit = async () => {
    setError('');
    if (!form.email.trim()) { setError(t('auth.emailRequired')); return; }
    if (!form.password)     { setError(t('auth.passwordRequired')); return; }
    if (mode === 'signup' && !form.name.trim()) { setError(t('auth.nameRequired')); return; }

    setLoading(true);
    try {
      let result;
      if (mode === 'signup') {
        result = await register({ name: form.name, email: form.email, password: form.password, role, location: form.location || 'India' });
      } else {
        result = await login({ email: form.email, password: form.password });
      }
      onAuthSuccess?.(result.token, result.user);
      onClose?.();
    } catch (err) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('failed to fetch') || msg.toLowerCase().includes('networkerror') || msg.includes('fetch')) {
        setError('Cannot reach server. Make sure VITE_API_URL is set in Vercel, or the backend on Render is running.');
      } else {
        setError(msg || t('auth.authFailed'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex" style={{ minHeight: '580px', maxHeight: '95vh' }}>

        {/* Left hero panel */}
        <div className="hidden md:flex md:w-5/12 relative flex-col justify-end overflow-hidden">
          <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-green-950/90 via-green-900/50 to-transparent" />
          <div className="relative z-10 p-10 pb-12">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-11 h-11 rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm p-1">
                <img src={logoIcon} alt="AgriConnect" className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">Agri<span className="text-green-400">Connect</span></span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-4">
              Welcome to<br />AgriConnect
            </h1>
            <p className="text-green-200 text-lg font-medium mb-8">Sell smarter.<br />Grow better.</p>
            <div className="flex gap-6">
              {[{ num: '2.4L+', label: t('auth.farmers') }, { num: '18', label: t('auth.states') }, { num: '₹480Cr', label: t('auth.trade') }].map(s => (
                <div key={s.num} className="text-center">
                  <div className="text-xl font-extrabold text-white">{s.num}</div>
                  <div className="text-xs text-green-300 font-medium mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="flex-1 bg-white overflow-y-auto flex flex-col">
          <button onClick={onClose}
            className="absolute top-5 right-5 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex flex-col gap-5 p-8 md:p-10 flex-1">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">
                {mode === 'login' ? t('auth.welcomeBack') : t('auth.createAccount')}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {mode === 'login' ? t('auth.loginSubtitle') : t('auth.signupSubtitle')}
              </p>
            </div>

            {/* Role selector */}
            <div>
              <p className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-widest">{t('auth.iAmA')}</p>
              <div className="grid grid-cols-3 gap-3">
                {roles.map(r => (
                  <button key={r.id} onClick={() => setRole(r.id)}
                    className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                      role === r.id ? `${r.border} ${r.bgLight} shadow-md scale-[1.03]` : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                    }`}>
                    {role === r.id && (
                      <span className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}
                    <img src={r.img} alt={r.id} className="w-14 h-14 object-contain" />
                    <span className={`text-sm font-bold ${role === r.id ? r.text : 'text-gray-600'}`}>{roleLabels[r.id].label}</span>
                    <span className="text-xs text-gray-400 text-center leading-tight">{roleLabels[r.id].desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">{error}</div>
            )}

            {/* Fields */}
            <div className="flex flex-col gap-4">
              {mode === 'signup' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-600">{t('auth.fullName')} <span className="text-red-400">*</span></label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-gray-400"><UserIcon /></span>
                    <input type="text" placeholder={t('auth.namePlaceholder')} value={form.name} onChange={update('name')}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 text-base font-medium focus:outline-none focus:border-green-500 focus:bg-white transition-all" />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-600">{t('auth.email')} <span className="text-red-400">*</span></label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-gray-400"><PhoneIcon /></span>
                  <input type="email" placeholder={t('auth.emailPlaceholder')} value={form.email} onChange={update('email')}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 text-base font-medium focus:outline-none focus:border-green-500 focus:bg-white transition-all" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-600">{t('auth.password')} <span className="text-red-400">*</span></label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-gray-400"><LockIcon /></span>
                  <input type={showPass ? 'text' : 'password'} placeholder={t('auth.passwordPlaceholder')} value={form.password} onChange={update('password')}
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-800 text-base font-medium focus:outline-none focus:border-green-500 focus:bg-white transition-all" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 text-gray-400 hover:text-gray-600">
                    <EyeIcon open={showPass} />
                  </button>
                </div>
              </div>

              {mode === 'signup' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-600">{t('auth.location')}</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-gray-400"><MapPinIcon /></span>
                    <input type="text" placeholder={t('auth.locationPlaceholder')} value={form.location} onChange={update('location')}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 text-base font-medium focus:outline-none focus:border-green-500 focus:bg-white transition-all" />
                  </div>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex flex-col gap-3 mt-auto">
              <button onClick={handleSubmit} disabled={loading}
                className={`w-full py-4 rounded-2xl text-white text-lg font-bold tracking-wide transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 bg-gradient-to-r disabled:opacity-60 disabled:cursor-not-allowed ${selectedRole.color}`}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('auth.pleaseWait')}
                  </span>
                ) : mode === 'login'
                  ? `${t('auth.loginAs')} ${role}`
                  : t('auth.createAccountAs')}
              </button>

              <div className="flex items-center justify-center gap-2 pt-1">
                <span className="text-gray-500 text-sm">
                  {mode === 'login' ? t('auth.noAccount') : t('auth.haveAccount')}
                </span>
                <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
                  className="text-sm font-bold text-green-600 hover:text-green-800 hover:underline transition-colors">
                  {mode === 'login' ? t('auth.signUp') : t('auth.login')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
