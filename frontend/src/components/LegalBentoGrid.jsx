import React from 'react';
import { FileText, Bell, Siren, Calendar, ArrowRight } from 'lucide-react';
import { BentoGrid, BentoCard } from './ui/bento-Grid';
import { Marquee } from './ui/Marquee';
import { useTheme } from '../context/themeContext';
import { Link } from 'react-router-dom';

// --- VISUAL ASSETS (Optimized) ---

// 1. Document Marquee
const files = [
  { name: "Rent_Agreement.pdf", type: "PDF" },
  { name: "Affidavit.docx", type: "DOC" },
  { name: "Legal_Notice.pdf", type: "PDF" },
  { name: "FIR_Report.jpg", type: "IMG" },
];

const DocumentMarquee = ({ isDark }) => (
    
  <Marquee pauseOnHover className="absolute top-10 [--duration:30s] [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)]">
    {files.map((f, idx) => (
      <div
        key={idx}
        className={`relative w-40 overflow-hidden rounded-xl border p-3 transition-colors ${
            isDark 
            ? "border-white/10 bg-white/5" // ✨ Cleaner Obsidian look
            : "border-orange-200 bg-orange-50"
        }`}
      >
        <div className="flex items-center gap-2">
          <FileText className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-orange-500'}`} />
          <span className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>{f.name}</span>
        </div>
      </div>
    ))}
  </Marquee>
);

// 2. Notification List
const NotificationList = ({ isDark }) => (
    <div className="absolute top-8 right-6 w-full max-w-[280px] flex flex-col gap-3">
        {[
            { title: "Case Updated", desc: "Hearing: 12th Aug", time: "2m", color: "bg-blue-500" },
            { title: "SOS Alert", desc: "Patrol Dispatched", time: "5m", color: "bg-red-500" },
            { title: "Draft Ready", desc: "Rent Agreement", time: "1h", color: "bg-green-500" }
        ].map((item, i) => (
            <div 
                key={i}
                className={`flex items-center gap-3 p-3 rounded-xl border shadow-sm transition-all hover:scale-[1.02] ${
                    isDark 
                    ? "bg-white/5 border-white/10 text-gray-200" // ✨ Cleaner Obsidian look
                    : "bg-white border-slate-200 text-slate-800"
                }`}
            >
                <div className={`w-2 h-2 rounded-full ${item.color} shrink-0`} />
                <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate">{item.title}</div>
                    <div className="text-[10px] opacity-70 truncate">{item.desc}</div>
                </div>
                <div className="text-[10px] opacity-50">{item.time}</div>
            </div>
        ))}
    </div>
);

// 3. Calendar
const CalendarGraphic = ({ isDark }) => (
    <div className={`absolute top-10 right-8 p-4 rounded-xl border shadow-sm rotate-3 transition-transform duration-500 group-hover:rotate-0 ${
        isDark ? "bg-white/5 border-white/10" : "bg-white border-orange-100" // ✨ Cleaner Obsidian look
    }`}>
        <div className="text-center mb-2">
            <span className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>August 2026</span>
        </div>
        <div className="grid grid-cols-7 gap-1 text-[10px]">
            {['S','M','T','W','T','F','S'].map(d => <span key={d} className="opacity-50">{d}</span>)}
            {/* Simple calendar grid generation */}
            {[...Array(14)].map((_, i) => (
                <span key={i} className={`flex items-center justify-center h-5 w-5 rounded-full ${i === 11 ? 'bg-orange-600 text-white font-bold' : 'opacity-80'}`}>
                    {i + 1}
                </span>
            ))}
        </div>
    </div>
);

// 4. Network
const NetworkGraphic = ({ isDark }) => (
    <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
        <div className={`absolute w-32 h-32 rounded-full border border-dashed animate-[spin_10s_linear_infinite] ${isDark ? 'border-gray-600' : 'border-orange-300'}`} />
        <div className={`absolute w-48 h-48 rounded-full border border-dotted animate-[spin_15s_linear_infinite_reverse] ${isDark ? 'border-gray-700' : 'border-orange-200'}`} />
        <div className="relative z-10 p-3 bg-red-600 rounded-full shadow-lg shadow-red-600/30 animate-pulse">
            <Siren className="w-5 h-5 text-white" />
        </div>
    </div>
);

// --- MAIN COMPONENT ---
export function LegalBentoGrid() {
  const { isDark } = useTheme();

  // We define the features array INSIDE the component so it receives the fresh `isDark` value
  const features = [
    {
      Icon: FileText,
      name: "AI Legal Drafter",
      description: "Auto-generate compliant legal documents instantly.",
      href: "#",
      cta: "Start Drafting",
      className: "col-span-3 lg:col-span-1",
      background: <DocumentMarquee isDark={isDark} />,
    },
    {
      Icon: Bell,
      name: "Live Case Updates",
      description: "Real-time notifications for hearings & FIRs.",
      href: "#",
      cta: "Track Case",
      className: "col-span-3 lg:col-span-2",
      background: <NotificationList isDark={isDark} />,
    },
    {
      Icon: Siren,
      name: "Emergency Network",
      description: "GPS-linked SOS to nearest Police & Hospitals.",
      href: "#",
      cta: "View Map",
      className: "col-span-3 lg:col-span-2",
      background: <NetworkGraphic isDark={isDark} />,
    },
    {
      Icon: Calendar,
      name: "Court Scheduler",
      description: "Syncs with High Court databases.",
      className: "col-span-3 lg:col-span-1",
      href: "#",
      cta: "View Calendar",
      background: <CalendarGraphic isDark={isDark} />,
    },
  ];

  return (
    // ✨ CHANGED: bg-[#0B1120] -> bg-[#030712]
    <section className={`py-24 px-6 transition-colors duration-500 ${isDark ? 'bg-[#030712]' : 'bg-[#FFF8F0]'}`}>
        <div className="max-w-7xl mx-auto">
              <div className="mb-16 text-center">
                 <h2 className={`text-3xl md:text-5xl font-serif-heading font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Everything you need for Justice.
                 </h2>
                 <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                    A complete suite of tools designed to modernize the Indian legal experience.
                 </p>
              </div>
              
              <BentoGrid>
                 {features.map((feature, idx) => (
                    // CRITICAL: We pass isDark prop here to FORCE the card theme
                    <Link key={idx} to="/login" className="contents">
                         <BentoCard {...feature} isDark={isDark} />
                    </Link>
                    
                 ))}
              </BentoGrid>
        </div>
    </section>
  );
}

export default LegalBentoGrid;