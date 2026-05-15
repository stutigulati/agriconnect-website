import { FaPhone, FaEnvelope, FaLinkedinIn, FaTwitter, FaInstagram, FaFacebookF } from 'react-icons/fa';
import { GiWheat } from 'react-icons/gi';
import gogLogo from '../assets/gog-logo.png';

const Footer = () => {
  return (
    <footer className="relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0d3320 0%, #1a4d2e 40%, #0f2d1a 100%)' }}>
      {/* Glow blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
        style={{ background: 'rgba(134,239,172,0.06)' }} />
      <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"
        style={{ background: 'rgba(134,239,172,0.06)' }} />
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg,transparent,rgba(134,239,172,0.3),rgba(134,239,172,0.5),rgba(134,239,172,0.3),transparent)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-14 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

          {/* COL 1 — Geeks of Gurukul */}
          <div className="flex flex-col gap-5">
            <div className="inline-flex self-start">
              <div className="bg-white/90 rounded-xl px-3 py-2">
                <img src={gogLogo} alt="Geeks of Gurukul" className="h-9 w-auto object-contain" />
              </div>
            </div>
            <div className="pl-3 border-l-2 border-green-400/40">
              <p className="text-sm font-medium leading-relaxed text-white">
                Unleash the power of learning. Discover a world of possibilities with
                cutting-edge programs in Web Dev, AI, Blockchain &amp; AgriTech.
              </p>
            </div>
            {/* Social icons */}
            <div className="flex items-center gap-2.5">
              {[
                { Icon: FaLinkedinIn, label: 'LinkedIn' },
                { Icon: FaTwitter,    label: 'Twitter'  },
                { Icon: FaInstagram,  label: 'Instagram' },
                { Icon: FaFacebookF,  label: 'Facebook' },
              ].map(({ Icon, label }) => (
                <a key={label} href="#" aria-label={label}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 hover:-translate-y-0.5"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <Icon style={{ fontSize: '11px' }} />
                </a>
              ))}
            </div>
            {/* Legal links */}
            <div className="flex flex-col gap-1.5">
              {['Privacy & Policy', 'Terms & Conditions'].map(link => (
                <a key={link} href="#" className="text-xs font-medium text-white/70 hover:text-emerald-400 transition-colors duration-200">{link}</a>
              ))}
            </div>
          </div>

          {/* COL 2 — AgriConnect brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <GiWheat className="text-emerald-400 text-xl" />
              <h3 className="text-xl font-bold tracking-tight">
                <span className="text-emerald-400">Agri</span>
                <span className="text-white">Connect</span>
              </h3>
            </div>
            <p className="text-xs font-semibold tracking-widest uppercase text-emerald-400/90">
              Empowering India's Farmers
            </p>
            <p className="text-sm font-medium leading-relaxed text-white">
              Direct market access, fair prices, and smart farming tools — bridging
              the gap between farmers and buyers across India.
            </p>
          </div>

          {/* COL 3 — Connect + Resources side by side */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-extrabold tracking-widest uppercase mb-4 text-emerald-400"
                style={{ textShadow: '0 0 12px rgba(52,211,153,0.6)' }}>
                Connect
              </h4>
              <ul className="flex flex-col gap-2.5">
                {['Home', 'About Us', 'Programs', 'Contact'].map(link => (
                  <li key={link}>
                    <a href="#" className="text-sm font-semibold text-white hover:text-emerald-400 hover:pl-1.5 transition-all duration-200 block">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-extrabold tracking-widest uppercase mb-4 text-emerald-400"
                style={{ textShadow: '0 0 12px rgba(52,211,153,0.6)' }}>
                Resources
              </h4>
              <ul className="flex flex-col gap-2.5">
                {['Check Prices', 'Sell Crops', 'Scan Crop', 'Ask Expert', 'FAQ'].map(link => (
                  <li key={link}>
                    <a href="#" className="text-sm font-semibold text-white hover:text-emerald-400 hover:pl-1.5 transition-all duration-200 block">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* COL 4 — Get In Touch */}
          <div className="flex flex-col gap-5">
            <h4 className="text-sm font-extrabold tracking-widest uppercase text-emerald-400"
              style={{ textShadow: '0 0 12px rgba(52,211,153,0.6)' }}>
              Get In Touch
            </h4>
            <a href="tel:+919109976089"
              className="flex items-center gap-3 group rounded-xl p-3 transition-all duration-200 hover:bg-white/10"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(134,239,172,0.15)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.25)' }}>
                <FaPhone className="text-emerald-400" style={{ fontSize: '11px' }} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider mb-0.5 text-emerald-400/70">Phone</p>
                <p className="text-sm font-semibold text-white">+91 9109976089</p>
              </div>
            </a>
            <a href="mailto:admin@geeksofgurukul.com"
              className="flex items-center gap-3 group rounded-xl p-3 transition-all duration-200 hover:bg-white/10"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(134,239,172,0.15)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.25)' }}>
                <FaEnvelope className="text-emerald-400" style={{ fontSize: '11px' }} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider mb-0.5 text-emerald-400/70">Email</p>
                <p className="text-sm font-semibold text-white break-all">admin@geeksofgurukul.com</p>
              </div>
            </a>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-5 flex flex-col md:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid rgba(134,239,172,0.15)' }}>
          <p className="text-xs text-white/80">© Copyright 2026 Skillscan Edtech India Private Ltd. All Rights Reserved.</p>
          <p className="text-xs font-medium text-white/85">
            Built with innovation by{' '}
            <span className="text-emerald-400 font-semibold">Geeks of Gurukul</span>
          </p>
          <p className="text-xs text-white/80">Available in: English · हिन्दी · ਪੰਜਾਬੀ ·</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
