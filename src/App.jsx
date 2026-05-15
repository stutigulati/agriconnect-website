import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Route, Routes } from 'react-router-dom';
import LoadingScreen   from './components/LoadingScreen';
import HomePage        from './components/HomePage';
import CommunityPage   from './components/CommunityPage';
import MandiPricesPage from './components/MandiPricesPage';
import AboutPage       from './components/AboutPage';
import ContactPage     from './components/ContactPage';
import MarketplacePage from './components/MarketplacePage';
import AuthPage        from './components/AuthPage';
import SoilHealthPage   from './components/SoilHealthPage';
import PestDetectionPage from './components/PestDetectionPage';
import AIScannerPage    from './components/AIScannerPage';
import VoiceAssistantPage from './components/VoiceAssistantPage';
import VideoHubPage     from './components/VideoHubPage';
import WeatherCropPage  from './components/WeatherCropPage';
import { saveSession } from './lib/communityApi';

function App() {
  const [loading,  setLoading]  = useState(() => !sessionStorage.getItem('agriLoadingDone'));
  const [authMode, setAuthMode] = useState(null); // null | 'login' | 'signup'

  const handleLoadingFinish = useCallback(() => {
    sessionStorage.setItem('agriLoadingDone', 'true');
    setLoading(false);
  }, []);

  const handleAuthSuccess = useCallback((token, user) => {
    if (token && user) saveSession(token, user);
    setAuthMode(null);
  }, []);

  const authProps = {
    onLoginOpen:  () => setAuthMode('login'),
    onSignupOpen: () => setAuthMode('signup'),
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <LoadingScreen key="loader" onFinish={handleLoadingFinish} />}
      </AnimatePresence>

      {!loading && (
        <motion.div className="min-h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          <Routes>
            <Route path="/"             element={<HomePage        {...authProps} />} />
            <Route path="/community"    element={<CommunityPage   {...authProps} />} />
            <Route path="/mandi-prices" element={<MandiPricesPage {...authProps} />} />
            <Route path="/about"        element={<AboutPage       {...authProps} />} />
            <Route path="/contact"      element={<ContactPage     {...authProps} />} />
            <Route path="/marketplace"   element={<MarketplacePage {...authProps} />} />
            <Route path="/services/weather"  element={<WeatherCropPage  {...authProps} />} />
            <Route path="/services/soil"     element={<SoilHealthPage    {...authProps} />} />
            <Route path="/services/pest"     element={<PestDetectionPage {...authProps} />} />
            <Route path="/services/scanner"  element={<AIScannerPage     {...authProps} />} />
            <Route path="/services/voice"    element={<VoiceAssistantPage {...authProps} />} />
            <Route path="/services/videos"   element={<VideoHubPage      {...authProps} />} />
          </Routes>

          {/* Global auth modal — works on every page */}
          <AnimatePresence>
            {authMode && (
              <AuthPage
                key="auth-modal"
                initialMode={authMode}
                onClose={() => setAuthMode(null)}
                onAuthSuccess={handleAuthSuccess}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </>
  );
}

export default App;
