import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Handshake,
  Sprout,
  Building2,
  Microscope,
  Activity,
  Users,
  Lightbulb,
  BookOpen,
  Tractor,
  Droplets,
  ShieldCheck,
  Drone,
  Wheat,
  Phone,
  Globe2,
  BarChart3,
  Truck,
  FlaskConical,
  Leaf,
} from "lucide-react";

import agriInputPhone from "../assets/partner/agri-input-brands-phone.png";
import farmServicesPhone from "../assets/partner/farm-services-phone.png";
import marketLinkagesPhone from "../assets/partner/market-linkages-phone.png";

const partnerTabs = [
  {
    id: "inputs",
    label: "Agri Input Brands",
    desc: "Our vision is to provide farmers with timely access to quality, affordable, and sustainable inputs. AgriConnect hosts over 25 digital communities, each with 2,000+ members, earning farmers' trust through reliable advisories.",
    image: agriInputPhone,
    items: [
      { icon: Sprout, label: "Product Launch/Announcements" },
      { icon: Building2, label: "Market Development" },
      { icon: Microscope, label: "Expert Advisory-Driven Demand" },
      { icon: Activity, label: "Demo / Trials" },
      { icon: Users, label: "FGM / One-on-One Farm Meetings" },
      { icon: Lightbulb, label: "Advisory Integration" },
      { icon: Leaf, label: "Ground Intelligence" },
      { icon: BookOpen, label: "Farm Diary" },
    ],
  },
  {
    id: "services",
    label: "Farm Services",
    desc: "We connect farmers with verified service providers for mechanization, soil testing, custom hiring, and end-to-end farm management — all booked through one app.",
    image: farmServicesPhone,
    items: [
      { icon: Tractor, label: "Custom Hiring Centers" },
      { icon: FlaskConical, label: "Soil Testing & Analysis" },
      { icon: Droplets, label: "Irrigation Setup" },
      { icon: ShieldCheck, label: "Crop Insurance Help" },
      { icon: Drone, label: "Drone Spraying Services" },
      { icon: Wheat, label: "Harvest Assistance" },
      { icon: BookOpen, label: "Farm Planning" },
      { icon: Phone, label: "Doorstep Support" },
    ],
  },
  {
    id: "market",
    label: "Market Linkages",
    desc: "Bridge the gap between farm gate and end buyers — FPOs, exporters, processors, and modern retail. Get fair prices with transparent trade and quality grading.",
    image: marketLinkagesPhone,
    items: [
      { icon: Users, label: "FPO Partnerships" },
      { icon: Globe2, label: "Export Linkages" },
      { icon: Building2, label: "Processor Network" },
      { icon: BarChart3, label: "Real-time Auctions" },
      { icon: Handshake, label: "Contract Farming" },
      { icon: Truck, label: "Quick Settlement" },
      { icon: ShieldCheck, label: "Quality Grading" },
      { icon: BarChart3, label: "Price Discovery" },
    ],
  },
];

export default function PartnerNetwork() {
  const [activeTab, setActiveTab] = useState("inputs");

  const currentTab =
    partnerTabs.find((tab) => tab.id === activeTab) || partnerTabs[0];

  return (
    <section className="w-full min-h-screen flex items-center bg-gradient-to-br from-white via-green-50/40 to-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        {/* HEADING */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border border-green-200 text-green-700 text-[11px] font-black uppercase tracking-widest mb-3 shadow-sm">
            <Handshake className="w-3.5 h-3.5" />
            Partner Network
          </div>

          <h2 className="font-black text-2xl sm:text-3xl md:text-4xl text-gray-950 mb-2">
            Build Stronger Agri Partnerships
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto text-xs md:text-sm font-medium leading-relaxed">
            Connect farmers with input brands, farm services and reliable market
            linkages through one smart AgriConnect platform.
          </p>

          <div className="w-16 h-1 bg-green-600 rounded-full mx-auto mt-4"></div>
        </div>

        {/* TABS */}
        <div className="flex justify-center mb-5">
          <div className="bg-white/95 backdrop-blur border border-gray-100 shadow-[0_14px_45px_rgba(15,23,42,0.08)] rounded-2xl p-2 flex flex-wrap justify-center gap-2">
            {partnerTabs.map((tab) => (
              <button
                type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 md:px-6 py-2.5 text-xs md:text-sm font-black rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-green-600 text-white shadow-lg shadow-green-600/25"
                    : "text-gray-500 hover:text-green-700 hover:bg-green-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN CARD */}
        <div className="bg-white/95 backdrop-blur rounded-[1.6rem] p-5 md:p-7 lg:p-8 grid grid-cols-1 lg:grid-cols-5 gap-6 border border-green-100 shadow-[0_18px_60px_rgba(15,23,42,0.10)]">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-3 flex flex-col justify-center">
            <p className="text-gray-600 text-sm leading-relaxed mb-5 font-medium max-w-2xl">
              {currentTab.desc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentTab.items.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="group flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-br from-white to-green-50/70 border border-green-100 hover:border-green-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-500"
                >
                  <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-600 group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-4 h-4 text-green-600 group-hover:text-white transition-colors" />
                  </div>

                  <span className="text-xs md:text-sm font-bold text-gray-800">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mt-5">
              <Link
                to="/contact"
                className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs md:text-sm rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                Request a demo
              </Link>

              <Link
                to="/about"
                className="px-5 py-2.5 bg-white text-green-700 font-bold text-xs md:text-sm rounded-xl border border-green-300 hover:bg-green-50 hover:-translate-y-1 shadow-sm hover:shadow-xl transition-all"
              >
                Explore more
              </Link>
            </div>
          </div>

          {/* RIGHT PHONE IMAGE */}
          <div className="lg:col-span-2 flex items-center justify-center">
            <div className="relative w-full flex items-center justify-center overflow-visible">
              <div className="absolute -top-8 -left-6 w-28 h-28 bg-green-300/25 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-8 -right-6 w-32 h-32 bg-emerald-300/25 rounded-full blur-3xl"></div>

              <img
                src={currentTab.image}
                alt={`${currentTab.label} phone preview`}
                className="relative w-[250px] sm:w-[290px] md:w-[330px] lg:w-[380px] xl:w-[410px] max-w-none object-contain drop-shadow-[0_28px_45px_rgba(15,23,42,0.24)] transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}