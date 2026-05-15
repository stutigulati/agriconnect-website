import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaMicrophone, FaMicrophoneSlash, FaVolumeUp, FaChevronRight,
  FaHandPaper, FaLanguage, FaChartLine, FaTimes,
} from 'react-icons/fa';
import { MdSettings } from 'react-icons/md';
import heroVoice from '../assets/hero_voice_new.png';
import Navbar from './Navbar';
import Footer from './Footer';

const SUPPORTED_LANGS = [
  { code: 'en-IN', label: 'English (India)', abbr: 'EN' },
  { code: 'hi-IN', label: 'हिंदी (Hindi)',   abbr: 'HI' },
  { code: 'mr-IN', label: 'मराठी',           abbr: 'MR' },
  { code: 'gu-IN', label: 'ગુજરાતી',         abbr: 'GU' },
  { code: 'pa-IN', label: 'ਪੰਜਾਬੀ',           abbr: 'PA' },
  { code: 'te-IN', label: 'తెలుగు',           abbr: 'TE' },
];

const QUICK_QUESTIONS = [
  'What is the best time to sow wheat?',
  'मेरी टमाटर की पत्तियाँ पीली क्यों हो रही हैं?',
  'How to prevent cotton bollworm?',
  'मिट्टी की जाँच कैसे करें?',
  'When should I irrigate my rice crop?',
];

const POWER_CARDS = [
  {
    icon: FaHandPaper,
    iconBg: '#fef3c7',
    iconColor: '#d97706',
    title: 'Hands-Free Field Operation',
    desc: 'Get answers while working in the fields without needing to stop or type on a smartphone screen.',
    border: '#fde68a',
  },
  {
    icon: FaLanguage,
    iconBg: '#dbeafe',
    iconColor: '#2563eb',
    title: 'Local Language Nuance',
    desc: 'Our AI understands regional dialects and slang specific to Indian farming communities across the subcontinent.',
    border: '#bfdbfe',
  },
  {
    icon: FaChartLine,
    iconBg: '#fef9c3',
    iconColor: '#ca8a04',
    title: 'Real-time Market Insights',
    desc: 'Instantly check Mandi prices and demand fluctuations by simply asking "What is the price of Mustard in India today?".',
    border: '#fde68a',
  },
];

const getAnswer = (text) => {
  const q = text.toLowerCase();
  if (q.includes('wheat') && (q.includes('sow') || q.includes('time') || q.includes('when')))
    return 'Best time to sow wheat is October to November in North India. Sowing after 15th November causes significant yield loss. Use HD-2967 or PBW-343 variety for best results.';
  if (q.includes('tomato') || q.includes('टमाटर'))
    return 'Yellow leaves in tomato are usually caused by nitrogen deficiency or early blight fungus. Apply urea at 5g/L as foliar spray and Mancozeb 2.5g/L to control blight.';
  if (q.includes('cotton') || q.includes('bollworm'))
    return 'For cotton bollworm: Install pheromone traps at 5 per acre. Spray Emamectin Benzoate 0.5g/L when infestation starts. Use Bt cotton varieties for long-term prevention.';
  if (q.includes('rice') || q.includes('irrigat'))
    return 'Rice needs 2–5 cm standing water during tillering stage. Drain field 7–10 days before harvesting. Alternate wetting and drying saves 30% water without yield loss.';
  if (q.includes('soil') || q.includes('मिट्टी'))
    return 'Soil testing should be done once every 2 years. Collect samples from 6–8 spots at 15–20 cm depth. Mix and send 500g to nearest Soil Testing Lab. Government provides testing free or at ₹10.';
  if (q.includes('गेहूं') || q.includes('किस्म'))
    return 'सबसे अच्छी गेहूं किस्में: HD-2967 (उत्तर भारत), GW-322 (गुजरात), K-307 (मध्य प्रदेश). ये किस्में रस्ट रोग प्रतिरोधी हैं।';
  return `Your question: "${text}" — I can help with crop advisory, pest management, soil health, irrigation timing and government schemes. Please ask a more specific farming question.`;
};

export default function VoiceAssistantPage({ onLoginOpen, onSignupOpen }) {
  const [lang,       setLang]       = useState('en-IN');
  const [listening,  setListening]  = useState(false);
  const [transcript, setTranscript] = useState('');
  const [answer,     setAnswer]     = useState('');
  const [status,     setStatus]     = useState('idle');
  const [history,    setHistory]    = useState([]);
  const [modal,      setModal]      = useState(false);
  const recognitionRef = useRef(null);
  const transcriptRef  = useRef('');

  const supported = typeof window !== 'undefined' &&
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    window.speechSynthesis.speak(utter);
  };

  const showResult = (q, resp) => {
    setTranscript(q);
    setAnswer(resp);
    setStatus('done');
    setHistory(h => [{ q, a: resp }, ...h.slice(0, 4)]);
    speak(resp);
  };

  const startListening = useCallback(() => {
    if (!supported) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = lang;
    rec.interimResults = true;
    recognitionRef.current = rec;
    transcriptRef.current = '';

    rec.onstart  = () => { setListening(true); setStatus('listening'); setTranscript(''); setAnswer(''); setModal(true); };
    rec.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join('');
      setTranscript(t);
      transcriptRef.current = t;
    };
    rec.onend = () => {
      setListening(false);
      setStatus('processing');
      setTimeout(() => {
        const resp = getAnswer(transcriptRef.current);
        showResult(transcriptRef.current, resp);
      }, 800);
    };
    rec.onerror = () => { setListening(false); setStatus('idle'); };
    rec.start();
  }, [lang, supported]);

  const stopListening = () => recognitionRef.current?.stop();

  const askQuestion = (q) => {
    setStatus('processing');
    setAnswer('');
    setModal(true);
    setTimeout(() => {
      const resp = getAnswer(q);
      showResult(q, resp);
    }, 700);
  };

  const currentLang = SUPPORTED_LANGS.find(l => l.code === lang);

  return (
    <div className="min-h-screen" style={{ background: '#f0f0eb' }}>
      <Navbar onLoginOpen={onLoginOpen} onSignupOpen={onSignupOpen} />

      {/* HERO */}
      <div className="relative overflow-hidden" style={{ height: 520, paddingTop: 64 }}>
        <motion.img
          src={heroVoice}
          alt="Seedlings"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 12, ease: 'linear' }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.30) 60%, rgba(0,0,0,0.10) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.50) 0%, transparent 55%)' }} />

        <div className="relative z-10 h-full flex flex-col justify-center px-8 lg:px-16 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-300 text-xs font-bold uppercase tracking-widest">AI Voice Intelligence</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-4" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.6)' }}>
              बोलिए, हम सुनेंगे।<br />
              <span className="text-green-400">Ask Anything by Voice.</span>
            </h1>
            <p className="text-white/85 text-base max-w-lg leading-relaxed" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}>
              Ask farming questions in Hindi, English or your regional language.
              Get instant expert answers spoken back to you.
            </p>
          </motion.div>
        </div>
      </div>

      {/* MAIN 2-COL SECTION */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

          {/* LEFT — Language + Mic */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
           className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200 h-full"
            style={{ borderTop: '3px solid #16a34a' }}
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <p className="font-bold text-gray-900 text-base">Select Language</p>
              <MdSettings className="text-gray-400 text-xl" />
            </div>

            <div className="px-5 pb-4">
              <div className="grid grid-cols-3 gap-2">
                {SUPPORTED_LANGS.map(l => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                      lang === l.code
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <span className={`text-[9px] font-black px-1 py-0.5 rounded ${lang === l.code ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {l.abbr}
                    </span>
                    <span className="truncate">{l.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-100 mx-5" />

            {/* Mic */}
            <div className="flex flex-col items-center py-8 px-5">
              {supported ? (
                <>
                  <motion.button
                    onClick={listening ? stopListening : startListening}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    className="relative flex items-center justify-center rounded-full mb-5"
                    style={{
                      width: 80, height: 80,
                      background: 'linear-gradient(135deg,#dc2626,#b91c1c)',
                      boxShadow: listening
                        ? '0 0 0 14px rgba(220,38,38,0.15), 0 0 0 28px rgba(220,38,38,0.07)'
                        : '0 4px 20px rgba(220,38,38,0.35)',
                    }}
                  >
                    {listening
                      ? <FaMicrophoneSlash style={{ fontSize: 28, color: 'white' }} />
                      : <FaMicrophone style={{ fontSize: 28, color: 'white' }} />}
                    {listening && (
                      <>
                        <motion.span animate={{ scale: [1, 1.7], opacity: [0.5, 0] }} transition={{ duration: 1.2, repeat: Infinity }}
                          className="absolute inset-0 rounded-full border-2 border-red-400" />
                        <motion.span animate={{ scale: [1, 2.2], opacity: [0.3, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
                          className="absolute inset-0 rounded-full border-2 border-red-300" />
                      </>
                    )}
                  </motion.button>

                  {status === 'listening' && (
                    <div className="flex items-end gap-1 h-7 mb-3">
                      {[1,2,4,5,4,3,2,1].map((h, i) => (
                        <motion.div key={i}
                          animate={{ height: [4, h * 5 + 4, 4] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.08 }}
                          className="w-1.5 rounded-full bg-red-500"
                        />
                      ))}
                    </div>
                  )}

                  <p className="font-bold text-gray-800 text-sm mb-1">
                    {listening ? 'Tap to stop' : 'Tap mic to ask by voice'}
                  </p>
                  <p className="text-xs text-gray-400">{currentLang?.label} · Web Speech API</p>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="font-bold text-gray-700 mb-1">Voice not supported</p>
                  <p className="text-sm text-gray-400">Please use Google Chrome</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* RIGHT — Quick Questions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4 h-full"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col justify-between" style={{ borderTop: '3px solid #16a34a' }}>
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <p className="font-bold text-gray-900 text-base">Quick Questions</p>
                <FaMicrophone className="text-gray-400" />
              </div>

              <div className="px-5 pb-5 flex flex-col gap-2">
                {QUICK_QUESTIONS.map((q, i) => (
                  <motion.button
                    key={i}
                    onClick={() => askQuestion(q)}
                    whileHover={{ x: 3 }}
                    className="flex items-center justify-between w-full text-left px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 hover:border-green-300 hover:bg-green-50 transition-all text-sm text-gray-700 font-medium group"
                  >
                    <span>{q}</span>
                    <FaChevronRight className="text-gray-300 group-hover:text-green-500 text-xs flex-shrink-0 ml-2 transition-colors" />
                  </motion.button>
                ))}
              </div>

              {/* Sarvam */}
              <div className="mx-5 mb-5 rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg,#14532d,#166534)' }}>
                <div className="p-4 relative">
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-black bg-green-400 text-green-900 uppercase">
                    Coming Soon
                  </span>
                  <p className="font-bold text-green-300 text-xs uppercase tracking-wider mb-1">Sarvam AI Integration</p>
                  <p className="text-white/80 text-xs leading-relaxed">
                    Advanced multilingual agricultural AI with deep support for all 22 official Indian languages and regional dialects.
                  </p>
                </div>
              </div>
            </div>

            {/* History */}
            <AnimatePresence>
              {history.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                  <p className="font-bold text-gray-900 text-sm mb-3">Recent Questions</p>
                  {history.map((h, i) => (
                    <div key={i} className={`mb-3 pb-3 ${i < history.length - 1 ? 'border-b border-gray-100' : ''}`}>
                      <p className="text-xs text-gray-400 italic mb-1">"{h.q}"</p>
                      <p className="text-xs text-gray-600 leading-relaxed">{h.a.slice(0, 100)}...</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* POWER OF VOICE */}
<section className="max-w-5xl mx-auto px-6 lg:px-8 pb-16">
  <div
    className="rounded-[28px] p-8 border border-green-100"
    style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 45%, #ecfdf5 100%)',
      boxShadow: '0 18px 45px rgba(22, 101, 52, 0.10)',
    }}
  >
    <div className="text-center mb-8">
      <p className="text-green-600 text-xs font-black uppercase tracking-[0.22em] mb-2">
        Smart Farming Assistant
      </p>
      <h2 className="text-3xl font-black text-gray-900 mb-3">
        The Power of Voice Intelligence
      </h2>
      <p className="text-gray-500 text-sm max-w-2xl mx-auto">
        Ask farming questions naturally, get quick answers, and use AI guidance without typing.
      </p>
      <div className="w-20 h-1 bg-green-500 rounded-full mx-auto mt-5" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {POWER_CARDS.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ y: -6, scale: 1.02 }}
          className="rounded-2xl p-6 border bg-white"
          style={{
            borderColor: card.border,
            boxShadow: '0 10px 25px rgba(15, 23, 42, 0.07)',
          }}
        >
          <div
  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
  style={{
    background: card.iconBg,
    color: card.iconColor,
  }}
>
  <card.icon className="text-xl" />
</div>

          <h3 className="font-black text-gray-900 text-base mb-3">
            {card.title}
          </h3>

          <p className="text-gray-600 text-sm leading-relaxed">
            {card.desc}
          </p>
        </motion.div>
      ))}
    </div>
  </div>
</section>

      {/* RESULTS MODAL */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <div className="absolute inset-0" onClick={() => status === 'done' && setModal(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 24 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl bg-white"
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-green-500 to-emerald-600" />

              <button
                onClick={() => status === 'done' && setModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors z-10"
              >
                <FaTimes className="text-xs" />
              </button>

              <div className="p-7">
                {status === 'processing' && (
                  <div className="flex flex-col items-center py-8 gap-4">
                    <div className="w-14 h-14 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                    <p className="font-semibold text-gray-700">
                      {listening ? 'Listening...' : 'Processing your question...'}
                    </p>
                    <p className="text-sm text-gray-400">Analysing farming knowledge base</p>
                    {transcript && (
                      <p className="text-sm text-gray-500 italic bg-gray-50 px-4 py-2 rounded-xl">"{transcript}"</p>
                    )}
                  </div>
                )}

                {status === 'listening' && (
                  <div className="flex flex-col items-center py-8 gap-4">
                    <div className="flex items-end gap-1.5 h-10">
                      {[2,4,6,8,6,4,2].map((h, i) => (
                        <motion.div key={i}
                          animate={{ height: [8, h * 4, 8] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                          className="w-2 rounded-full bg-red-500"
                        />
                      ))}
                    </div>
                    <p className="font-semibold text-red-600">Listening... speak now</p>
                    {transcript && <p className="text-sm text-gray-500 italic">"{transcript}"</p>}
                  </div>
                )}

                {status === 'done' && answer && (
                  <>
                    <div className="mb-5">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">You Asked</p>
                      <p className="text-gray-700 text-sm italic bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">"{transcript}"</p>
                    </div>

                    <div className="rounded-2xl overflow-hidden mb-5" style={{ background: 'linear-gradient(135deg,#14532d,#166534)' }}>
                      <div className="px-5 py-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-black text-green-300 uppercase tracking-wider">AI Answer</span>
                          <button
                            onClick={() => speak(answer)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <FaVolumeUp /> Play
                          </button>
                        </div>
                        <p className="text-white/90 text-sm leading-relaxed">{answer}</p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 text-center mb-4">
                      {currentLang?.label} · Tap Play to hear it spoken aloud
                    </p>

                    <button
                      onClick={() => setModal(false)}
                      className="w-full py-3 rounded-xl font-bold text-sm text-white"
                      style={{ background: 'linear-gradient(135deg,#15803d,#166534)' }}
                    >
                      Close
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
