import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaArrowRight, FaTimes } from "react-icons/fa";

import farmerImg from "../assets/role-farmer.jpg";
import agronomistImg from "../assets/role-agronomist.jpg";
import buyerImg from "../assets/role-buyer.jpg";

const roleCards = [
  {
    id: "farmers",
    tag: "FOR FARMERS",
    title: "For Farmers",
    modalTitle: "How AgriConnect Helps Farmers",
    image: farmerImg,
    shortDesc:
      "Farmers can use AgriConnect to sell crops directly, check mandi prices, post crop problems, get expert advice, and receive weather-based farming guidance.",
    points: ["Direct Selling", "Pest Diagnosis", "Expert Assistance"],
    modalPoints: [
      "Post crop disease or pest problems with images",
      "Connect directly with agronomists for solutions",
      "Check daily mandi prices before selling crops",
      "Sell produce directly to buyers without middlemen",
      "Get weather alerts and smart farming suggestions",
    ],
    button: "Join as Farmer",
  },
  {
    id: "agronomists",
    tag: "FOR AGRONOMISTS",
    title: "For Agronomists",
    modalTitle: "How AgriConnect Helps Agronomists",
    image: agronomistImg,
    shortDesc:
      "Agronomists can guide farmers, solve crop-related problems, manage cases, build trust, and provide expert farming recommendations through the platform.",
    points: ["Case Management", "Analytics Dashboard", "Reputation Badges"],
    modalPoints: [
      "View farmer crop problems in one dashboard",
      "Reply with expert solutions and treatment steps",
      "Help farmers with soil, pest, irrigation and fertilizer issues",
      "Build reputation through helpful expert responses",
      "Support smart agriculture with data-driven advice",
    ],
    button: "Join as Agronomist",
  },
  {
    id: "buyers",
    tag: "FOR BUYERS",
    title: "For Buyers",
    modalTitle: "How AgriConnect Helps Buyers",
    image: buyerImg,
    shortDesc:
      "Buyers can explore fresh crops, compare prices, contact farmers directly, check crop quality, and purchase produce without depending on middlemen.",
    points: ["Bulk Orders", "Quality Checks", "Traceability"],
    modalPoints: [
      "Explore fresh crop listings uploaded by farmers",
      "Compare crop prices and available quantity",
      "Contact farmers directly for purchase discussion",
      "Check crop location, quality and availability",
      "Reduce dependency on middlemen and extra commissions",
    ],
    button: "Join as Buyer",
  },
];

const ActiveUsersSection = ({ onSignupOpen }) => {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleJoinClick = () => {
    setSelectedRole(null);
    if (onSignupOpen) onSignupOpen();
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(22,163,74,0.08)_1px,transparent_0)] [background-size:24px_24px]" />
      <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-green-200/40 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <h2 className="text-4xl font-black leading-tight tracking-tight text-gray-950 md:text-5xl">
            Connecting Every Important Role in Agriculture
          </h2>

          <p className="mt-5 text-base font-medium text-gray-500">
            AgriConnect brings farmers, agronomists and buyers together on one
            smart platform.
          </p>

          <div className="mx-auto mt-6 h-1.5 w-16 rounded-full bg-green-600" />
        </motion.div>

        {/* Cards */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-7 md:grid-cols-3 items-stretch">
          {roleCards.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12, duration: 0.55 }}
              className="group flex h-full min-h-[510px] flex-col overflow-hidden rounded-[2rem] border border-green-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-200/50"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={role.image}
                  alt={role.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

                <span className="absolute left-5 top-4 rounded-full bg-white px-4 py-2 text-[10px] font-black uppercase tracking-wider text-green-700 shadow-md">
                  {role.tag}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-2xl font-black text-gray-950">
                  {role.title}
                </h3>

                <p className="mt-3 min-h-[120px] text-sm leading-6 text-gray-600">
                  {role.shortDesc}
                </p>

                <div className="mt-5 space-y-3 pb-5">
                  {role.points.map((point) => (
                    <div key={point} className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs text-green-700">
                        <FaCheck />
                      </span>

                      <span className="text-sm font-semibold text-gray-700">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-8">
                  <button
                    onClick={() => setSelectedRole(role)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-green-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-green-700 hover:shadow-xl"
                  >
                    Learn More
                    <FaArrowRight className="text-xs" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedRole && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/65 px-4 py-8 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedRole(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 25 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative grid w-full max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-2xl md:grid-cols-[1fr_1fr]"
            >
              <button
                onClick={() => setSelectedRole(null)}
                className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-500 shadow-md transition hover:bg-gray-100 hover:text-gray-900"
              >
                <FaTimes />
              </button>

              <div className="relative h-64 overflow-hidden bg-green-50 md:h-auto md:min-h-[470px]">
                <img
                  src={selectedRole.image}
                  alt={selectedRole.title}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
              </div>

              <div className="p-8 md:p-10">
                <h3 className="pr-8 text-2xl font-black leading-tight text-gray-950 md:text-3xl">
                  {selectedRole.modalTitle}
                </h3>

                <p className="mt-4 text-sm leading-6 text-gray-600">
                  {selectedRole.shortDesc}
                </p>

                <div className="mt-6 space-y-4">
                  {selectedRole.modalPoints.map((point) => (
                    <div key={point} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs text-green-700">
                        <FaCheck />
                      </span>

                      <p className="text-sm font-medium leading-6 text-gray-700">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleJoinClick}
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-green-600/25 transition-all duration-300 hover:-translate-y-1 hover:bg-green-700 hover:shadow-xl"
                >
                  {selectedRole.button}
                  <FaArrowRight className="text-xs" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ActiveUsersSection;