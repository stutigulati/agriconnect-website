import { motion } from 'framer-motion';
import Navbar        from './Navbar';
import Hero          from './Hero';
import Features      from './Features';
import HowItWorks    from './HowItWorks';
import WeatherAdvisory from './WeatherAdvisory';
import MarketSnapshot  from './MarketSnapshot';
import TrustSection  from './TrustSection';
import FinalCTA      from './FinalCTA';
import Footer        from './Footer';
import PartnerNetwork from "./PartnerNetwork";
import ActiveUsersSection from './ActiveUsersSection';

const HomePage = ({ onLoginOpen, onSignupOpen }) => {
  return (
    <motion.div className="min-h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
      <Navbar onLoginOpen={onLoginOpen} onSignupOpen={onSignupOpen} />
      <Hero />
      <MarketSnapshot />
      <WeatherAdvisory />
      <Features />
      <HowItWorks />
      <ActiveUsersSection />
      <TrustSection />
      <PartnerNetwork />
      <FinalCTA />
      <Footer />
    </motion.div>
  );
};

export default HomePage;
