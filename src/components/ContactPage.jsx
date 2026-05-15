import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaLinkedinIn,
  FaInstagram,
  FaGithub,
  FaYoutube,
  FaPaperPlane,
  FaCheckCircle,
  FaUser,
  FaTag,
  FaCommentAlt,
  FaArrowRight,
  FaWhatsapp,
  FaBuilding,
  FaClock,
  FaHeadset,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import { MdOutlineWarningAmber } from 'react-icons/md';

import Navbar from './Navbar';
import Footer from './Footer';

import getInTouchImg from '../assets/getintouch.jpeg';
import gogLogo from '../assets/gog-logo.png';
import contactPhoneImg from '../assets/contact-phone.png';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 rounded-2xl px-6 py-4 text-sm font-semibold shadow-2xl ${
        type === 'success'
          ? 'border border-green-200 bg-white text-green-800'
          : 'border border-red-200 bg-white text-red-700'
      }`}
    >
      {type === 'success' ? (
        <FaCheckCircle className="text-lg text-green-500" />
      ) : (
        <MdOutlineWarningAmber className="text-lg text-red-500" />
      )}
      {message}
    </motion.div>
  );
}

function FormField({
  label,
  icon,
  type = 'text',
  value,
  onChange,
  name,
  required,
  rows,
}) {
  const [focused, setFocused] = useState(false);

  const baseClass = `w-full rounded-2xl border px-4 text-sm font-semibold text-gray-800 outline-none transition-all duration-200 placeholder:text-gray-500 ${
  focused
    ? 'border-green-500 bg-green-50 shadow-lg shadow-green-900/10 ring-4 ring-green-100'
    : 'border-green-200 bg-green-50/70 hover:border-green-300 hover:bg-green-50'
}`;

  return (
    <div className="flex flex-col gap-2">
     <label className="text-sm font-black bg-gradient-to-r from-green-700 via-emerald-600 to-lime-600 bg-clip-text text-transparent">
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </label>

      <div className="relative">
        <span
          className={`absolute left-4 z-10 transition-colors duration-200 ${
            focused ? 'text-green-600' : 'text-gray-400'
          }`}
          style={{
            top: rows ? '16px' : '50%',
            transform: rows ? 'none' : 'translateY(-50%)',
          }}
        >
          {icon}
        </span>

        {rows ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows={rows}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={label + (required ? ' *' : '')}
            className={`${baseClass} min-h-[150px] resize-none py-4 pl-11 pr-4`}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={label + (required ? ' *' : '')}
            className={`${baseClass} h-12 py-3 pl-11 pr-4`}
          />
        )}
      </div>
    </div>
  );
}

function ContactCard({
  icon,
  title,
  value,
  href,
  actionLabel,
  iconColor,
  buttonClass,
  delay,
}) {
  return (
    <motion.a
      {...fadeUp(delay)}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block overflow-hidden rounded-3xl border border-green-100 bg-white p-7 shadow-lg shadow-green-900/5 transition-all duration-300 hover:-translate-y-2 hover:border-green-200 hover:shadow-2xl hover:shadow-green-900/10"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-yellow-400" />

      <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-green-100/70 blur-3xl transition-all duration-300 group-hover:bg-yellow-100" />

      <div className="relative z-10 flex items-center gap-5">
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border border-green-100 bg-gradient-to-br from-white to-green-50 shadow-sm">
          <span className={`text-3xl ${iconColor}`}>{icon}</span>
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-wider text-gray-400">
            {title}
          </p>

          <p className="mt-1 text-lg font-black leading-tight text-gray-950">
            {value}
          </p>

          <span
            className={`mt-3 inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-black text-white shadow-md transition-all duration-200 group-hover:translate-x-1 ${buttonClass}`}
          >
            {actionLabel}
            <FaArrowRight className="text-[10px]" />
          </span>
        </div>
      </div>
    </motion.a>
  );
}

export default function ContactPage({ onLoginOpen, onSignupOpen } = {}) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      setToast({
        message: 'Please fill in all required fields.',
        type: 'error',
      });
      return;
    }

    setSending(true);

    await new Promise((r) => setTimeout(r, 1800));

    setSending(false);
    setToast({
      message: "Message sent! We'll get back to you within 24 hours.",
      type: 'success',
    });

    setForm({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  const socials = [
    {
      icon: <FaLinkedinIn />,
      label: 'LinkedIn',
      href: '#',
      color: 'bg-blue-600',
    },
    {
      icon: <FaInstagram />,
      label: 'Instagram',
      href: '#',
      color: 'bg-gradient-to-br from-pink-500 to-rose-500',
    },
    {
      icon: <FaGithub />,
      label: 'GitHub',
      href: '#',
      color: 'bg-gray-900',
    },
    {
      icon: <FaYoutube />,
      label: 'YouTube',
      href: '#',
      color: 'bg-red-600',
    },
    {
      icon: <FaWhatsapp />,
      label: 'WhatsApp',
      href: 'https://wa.me/919109976089',
      color: 'bg-green-500',
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <Navbar onLoginOpen={onLoginOpen} onSignupOpen={onSignupOpen} />

      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      {/* HERO */}
      <section className="relative flex min-h-screen items-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img
            src={getInTouchImg}
            alt="Contact AgriConnect"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-br from-green-950/58 via-green-800/42 to-emerald-700/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.16)_1px,transparent_0)] [background-size:34px_34px]" />
        </div>

        <div className="absolute left-10 top-24 hidden h-32 w-32 rounded-full bg-yellow-300/20 blur-3xl lg:block" />
        <div className="absolute bottom-12 right-16 hidden h-44 w-44 rounded-full bg-green-300/20 blur-3xl lg:block" />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 md:grid-cols-2 lg:px-8">
          {/* Phone Image Left */}
          <motion.div
            initial={{ opacity: 0, x: -40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative order-2 flex justify-center md:order-1 md:justify-start"
          >
            <div className="absolute top-10 h-[420px] w-[420px] rounded-full bg-yellow-300/20 blur-3xl" />
            <div className="absolute bottom-10 h-[380px] w-[380px] rounded-full bg-green-300/10 blur-3xl" />

            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative z-20"
            >
              <img
                src={contactPhoneImg}
                alt="Get in Touch phone mockup"
                className="h-[430px] w-auto object-contain drop-shadow-2xl sm:h-[500px] md:h-[560px] lg:h-[640px]"
              />
            </motion.div>

          

            
          </motion.div>

          {/* Hero Content Right */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="order-1 text-center md:order-2 md:text-left"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white shadow-2xl backdrop-blur-md">
              <FaHeadset className="text-sm text-yellow-300" />
              <span className="text-sm font-bold">
                AgriConnect Support Center
              </span>
            </div>

            <h1
  className="text-5xl font-black tracking-tight text-white lg:text-7xl"
  style={{
    textShadow: `
      0 4px 18px rgba(0,0,0,0.55),
      0 2px 6px rgba(0,0,0,0.45)
    `,
  }}
>
  Get In <span className="text-yellow-300">Touch</span>
</h1>

            <p
  className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-8 text-green-50 md:mx-0 lg:text-xl"
  style={{
    textShadow: '0 2px 10px rgba(0,0,0,0.45)',
  }}
>
              Connect with us for collaborations, platform support, agricultural
              innovation, and technical partnerships.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 md:justify-start">
              {[
                { icon: <FaClock />, text: '24hr Response' },
                { icon: <FaEnvelope />, text: 'Email Support' },
                { icon: <FaMapMarkerAlt />, text: 'Bhopal, MP' },
              ].map((item) => (
                <div
                  key={item.text}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white/90 backdrop-blur-sm"
                >
                  <span className="text-yellow-300">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 md:justify-start">
              <a
                href="tel:+919109976089"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-black text-green-800 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <FaPhone />
                Call Now
              </a>

              <a
                href="mailto:admin@geeksofgurukul.com"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-6 py-3.5 font-black text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
              >
                <FaEnvelope className="text-yellow-300" />
                Send Email
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CONTACT AREA */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-green-50 to-white" />
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-green-100/60 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-yellow-100/50 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="mb-14 text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-100 bg-white px-4 py-1.5 text-sm font-black text-green-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Reach Us Directly
            </span>

            <h2 className="text-4xl font-black tracking-tight text-gray-950 lg:text-5xl">
              Contact Information
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-7 text-gray-500">
              Choose the fastest way to reach our AgriConnect support and
              project team.
            </p>
          </motion.div>

          {/* Clean React Icon Contact Cards */}
          <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3">
            <ContactCard
              delay={0.1}
              icon={<FaPhone />}
              title="Call Us"
              value="+91 9109976089"
              href="tel:+919109976089"
              actionLabel="Call Now"
              iconColor="text-green-600"
              buttonClass="bg-green-600 hover:bg-green-700"
            />

            <ContactCard
              delay={0.18}
              icon={<FaEnvelope />}
              title="Email Us"
              value="admin@geeksofgurukul.com"
              href="mailto:admin@geeksofgurukul.com"
              actionLabel="Send Email"
              iconColor="text-emerald-600"
              buttonClass="bg-emerald-600 hover:bg-emerald-700"
            />

            <ContactCard
              delay={0.26}
              icon={<FaMapMarkerAlt />}
              title="Visit Us"
              value="Bhopal, Madhya Pradesh"
              href="https://maps.google.com/?q=Bhopal,Madhya Pradesh"
              actionLabel="Get Directions"
              iconColor="text-orange-500"
              buttonClass="bg-orange-500 hover:bg-orange-600"
            />
          </div>

          <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-5">
            <motion.div {...fadeUp(0.1)} className="h-full lg:col-span-3">
              <div className="relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-green-100 bg-white p-8 shadow-2xl shadow-green-900/10 lg:p-10">
                <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-green-100/70 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-60 w-60 rounded-full bg-yellow-100/60 blur-3xl" />

                <div className="relative z-10">
                  <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-black uppercase tracking-wider text-green-700 ring-1 ring-green-100">
                        <FaPaperPlane className="text-green-600" />
                        Quick Message
                      </span>

                      <h3 className="text-3xl font-black text-gray-950">
                        Send a Message
                      </h3>

                      <p className="mt-2 text-sm font-medium text-gray-500">
                        We respond within 24 hours on business days.
                      </p>
                    </div>

                    <div className="hidden rounded-2xl bg-green-600 p-4 text-white shadow-lg shadow-green-700/20 sm:block">
                      <FaHeadset className="text-2xl" />
                    </div>
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-1 flex-col gap-5"
                  >
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <FormField
                        label="Your Name"
                        icon={<FaUser className="text-sm" />}
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />

                      <FormField
                        label="Email Address"
                        icon={<FaEnvelope className="text-sm" />}
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <FormField
                      label="Subject"
                      icon={<FaTag className="text-sm" />}
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                    />

                    <FormField
                      label="Your Message"
                      icon={<FaCommentAlt className="text-sm" />}
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={9}
                      required
                    />

                    <button
                      type="submit"
                      disabled={sending}
                      className="flex w-full items-center justify-center gap-3 rounded-2xl bg-green-700 py-4 text-sm font-black text-white shadow-xl shadow-green-700/25 transition-all duration-300 hover:-translate-y-1 hover:bg-green-800 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-70 disabled:translate-y-0"
                    >
                      {sending ? (
                        <>
                          <svg
                            className="h-4 w-4 animate-spin"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <FaPaperPlane className="text-sm" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>

            <motion.div
              {...fadeUp(0.2)}
              className="flex h-full flex-col gap-10 lg:col-span-2"
            >
              <div className="relative overflow-hidden rounded-[2rem] border border-green-100 bg-white shadow-2xl shadow-green-900/10">
                <div className="absolute inset-x-0 top-0 h-28 bg-green-700" />

                <div className="relative z-10 flex flex-col items-center p-8 pt-10 text-center">
                  <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-[2rem] border border-green-100 bg-white p-5 shadow-2xl shadow-green-900/15">
                    <img
                      src={gogLogo}
                      alt="Organization Logo"
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-black text-green-700">
                    <FaBuilding className="text-[11px]" />
                    Project Support Partner
                  </span>

                  <h4 className="text-2xl font-black text-gray-950">
                    Geeks of Gurukul
                  </h4>

                  <p className="mt-3 max-w-xs text-sm font-medium leading-6 text-gray-500">
                    Supporting AgriConnect with innovation, guidance, and
                    technical project mentorship.
                  </p>

                  <div className="mt-8 grid w-full grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-green-100 bg-green-50 p-4 shadow-sm">
                      <p className="text-[11px] font-bold text-gray-400">
                        Location
                      </p>
                      <p className="mt-1 text-sm font-black text-gray-900">
                        Bhopal
                      </p>
                    </div>

                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
                      <p className="text-[11px] font-bold text-gray-400">
                        Status
                      </p>
                      <p className="mt-1 text-sm font-black text-green-700">
                        Active
                      </p>
                    </div>
                  </div>

                  <a
                    href="https://maps.google.com/?q=Bhopal,Madhya Pradesh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-green-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-green-700/20 transition-all duration-300 hover:-translate-y-1 hover:bg-green-800 hover:shadow-xl"
                  >
                    <FaMapMarkerAlt />
                    Open in Maps
                    <FaExternalLinkAlt className="text-xs" />
                  </a>
                </div>
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-green-100 bg-white p-7 shadow-xl shadow-green-900/5">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-green-700">
                      Follow Us
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-500">
                      Stay updated with platform news and updates.
                    </p>
                  </div>

                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-white shadow-lg shadow-yellow-600/20">
                    <FaArrowRight />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={s.label}
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl text-base text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl ${s.color}`}
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-green-900" />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-yellow-300/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <motion.div {...fadeUp(0)}>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-bold text-white backdrop-blur-sm">
              <FaCheckCircle className="text-yellow-300" />
              Let’s Build Together
            </span>

            <h3 className="text-3xl font-black text-white lg:text-4xl">
              Want to know more about AgriConnect?
            </h3>

            <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-7 text-green-100">
              Read our story or explore what the platform offers farmers across
              India.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3.5 font-black text-green-800 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                Read About Us
                <FaArrowRight />
              </Link>

              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-7 py-3.5 font-black text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
              >
                Explore Platform
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}