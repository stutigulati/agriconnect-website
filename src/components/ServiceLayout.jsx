// Shared layout wrapper for all service pages
import Navbar from './Navbar';
import Footer from './Footer';

export default function ServiceLayout({ children, onLoginOpen, onSignupOpen }) {
  return (
    <div className="min-h-screen" style={{ background: '#f5faf6' }}>
      <Navbar onLoginOpen={onLoginOpen} onSignupOpen={onSignupOpen} />
      <div className="pt-16">
        {children}
      </div>
      <Footer />
    </div>
  );
}
