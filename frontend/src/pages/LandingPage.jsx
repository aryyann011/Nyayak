import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/heroSection';
import Footer from '../components/Footer';
import { useTheme } from '../context/themeContext';
import { motion } from 'framer-motion';
import { Shield, Clock, FileCheck, Map, Users, ArrowRight, TrendingUp } from 'lucide-react';

const scalesBgUrl = "/scale.png";

// --- PLACEHOLDER LOGOS (Replace with your official assets) ---
const logos = {
  delhiPolice: "delhi.png",
  // Using a text placeholder for Kolkata as a good direct url was not available. Replace with an image.
  kolkata: "kolkata.jpg",
  barCouncil: "barcouncil.png",
  nitiAayog: "niti.jpeg"
};

const LandingPage = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans overflow-hidden relative ${isDark ? 'bg-[#0B1120] text-slate-100' : 'bg-[#FFFAF0] text-slate-900'}`}>
      
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none transition-opacity duration-700">
        <div className={`absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full blur-[150px] mix-blend-multiply transition-colors duration-700 ${isDark ? 'bg-indigo-900/20' : 'bg-amber-200/30'}`}></div>
        <div className={`absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full blur-[150px] mix-blend-multiply transition-colors duration-700 ${isDark ? 'bg-blue-900/20' : 'bg-orange-200/30'}`}></div>
      </div>

      {/* Watermark */}
      <div 
        className={`fixed inset-0 pointer-events-none z-0 bg-center bg-no-repeat bg-contain transition-opacity duration-500 ${isDark ? 'opacity-[0.03] invert' : 'opacity-[0.05]'}`}
        style={{ backgroundImage: `url(${scalesBgUrl})` }}
      ></div>

      <div className="relative z-10">
        <Navbar />
        
        {/* 1. HERO SECTION */}
        <HeroSection />

        {/* 2. TRUST STRIP - UPDATED WITH LOGOS */}
        <div className={`py-16 border-y ${isDark ? 'bg-white/5 border-white/5' : 'bg-white/50 border-orange-100'}`}>
  <div className="max-w-7xl mx-auto px-6 text-center">
    
    <p className={`text-sm font-semibold uppercase tracking-widest mb-12 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
      Trusted by Public Safety Departments
    </p>

    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 items-center justify-items-center">
      
      {/* Delhi Police */}
      <div className="flex flex-col items-center gap-4 group">
        <div className="h-20 flex items-center justify-center group-hover:grayscale-0 transition-all duration-300">
          <img src={logos.delhiPolice} alt="Delhi Police" className="max-h-16 object-contain" />
        </div>
        <span className={`text-sm font-semibold ${isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-600 group-hover:text-orange-600'} transition-colors`}>
          Delhi Police
        </span>
      </div>

      {/* Kolkata Traffic Police */}
      <div className="flex flex-col items-center gap-4 group">
        <div className="h-20 flex items-center justify-center group-hover:grayscale-0 transition-all duration-300">
          <img src={logos.kolkata} alt="Kolkata Traffic Police" className="max-h-16 object-contain" />
        </div>
        <span className={`text-sm font-semibold ${isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-600 group-hover:text-orange-600'} transition-colors`}>
          Kolkata Traffic Police
        </span>
      </div>

      {/* Bar Council */}
      <div className="flex flex-col items-center gap-4 group">
        <div className="h-20 flex items-center justify-center group-hover:grayscale-0 transition-all duration-300">
          <img src={logos.barCouncil} alt="Bar Council of India" className="max-h-16 object-contain" />
        </div>
        <span className={`text-sm font-semibold ${isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-600 group-hover:text-orange-600'} transition-colors`}>
          Bar Council of India
        </span>
      </div>

      {/* NITI Aayog */}
      <div className="flex flex-col items-center gap-4 group">
        <div className="h-20 flex items-center justify-center group-hover:grayscale-0 transition-all duration-300">
          <img src={logos.nitiAayog} alt="NITI Aayog" className="max-h-14 object-contain" />
        </div>
        <span className={`text-sm font-semibold ${isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-600 group-hover:text-orange-600'} transition-colors`}>
          NITI Aayog
        </span>
      </div>

    </div>
  </div>
</div>


        {/* ... (Rest of the file is unchanged) ... */}
        {/* 3. PROBLEM / SOLUTION GRID */}
        <section className="py-24 px-6 max-w-7xl mx-auto" id="how-it-works">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                The Legal System is <span className="text-orange-500">Broken.</span> <br/>
                We Fixed It.
              </h2>
              <p className={`text-lg mb-8 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Citizens currently face long queues, confusing paperwork, and zero transparency. NyayaSahayak replaces bureaucracy with code.
              </p>
              
              <div className="space-y-6">
                <ComparisonRow 
                  bad="Waiting 4 hours to file an FIR"
                  good="Instant Online Filing via AI"
                  isDark={isDark}
                />
                <ComparisonRow 
                  bad="Paying ₹5000 for a Rent Agreement"
                  good="Free AI-Drafted Documents"
                  isDark={isDark}
                />
                <ComparisonRow 
                  bad="Unsafe routes at night"
                  good="Real-time Crime Heatmaps"
                  isDark={isDark}
                />
              </div>
            </div>
            
            <div className={`relative p-8 rounded-3xl border ${isDark ? 'bg-slate-800/50 border-white/10' : 'bg-white border-orange-100 shadow-xl shadow-orange-100'}`}>
               {/* Abstract Visual of System Architecture */}
               <div className="grid grid-cols-2 gap-4">
                  <StatCard icon={<Users />} label="Users Active" value="12,402" isDark={isDark} />
                  <StatCard icon={<FileCheck />} label="Docs Drafted" value="8,930" isDark={isDark} />
                  <StatCard icon={<Shield />} label="Crimes Prevented" value="450+" isDark={isDark} />
                  <StatCard icon={<TrendingUp />} label="Efficiency Gain" value="300%" isDark={isDark} />
               </div>
            </div>
          </div>
        </section>

        {/* 4. BENTO FEATURES GRID */}
        <section className={`py-24 px-6 ${isDark ? 'bg-[#050914]' : 'bg-[#FFF8F0]'}`} id="features">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-orange-500 font-bold uppercase tracking-wider text-sm">System Modules</span>
              <h2 className="text-4xl font-bold mt-2 mb-4">Everything you need for Justice.</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Large Card */}
              <FeatureCard 
                className="md:col-span-2"
                icon={<Map className="w-8 h-8 text-blue-500" />}
                title="Predictive Crime Heatmap"
                desc="Avoid danger zones. Our geospatial engine analyzes real-time FIR data to visualize safety levels in your neighborhood."
                isDark={isDark}
              />
              {/* Tall Card */}
              <FeatureCard 
                className="md:row-span-2"
                icon={<FileCheck className="w-8 h-8 text-green-500" />}
                title="AI Legal Drafter"
                desc="Generate court-compliant affidavits, rent agreements, and notices in seconds. Powered by Gemini 1.5 Pro."
                isDark={isDark}
              />
              <FeatureCard 
                icon={<Shield className="w-8 h-8 text-orange-500" />}
                title="Blockchain Evidence"
                desc="Upload media securely. We hash it to the blockchain so it can never be tampered with."
                isDark={isDark}
              />
              <FeatureCard 
                icon={<Clock className="w-8 h-8 text-purple-500" />}
                title="Case Timeline"
                desc="Track your court dates and police investigation status in a simple progress bar."
                isDark={isDark}
              />
            </div>
          </div>
        </section>

        {/* 5. CALL TO ACTION */}
        <section className="py-24 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to claim your rights?</h2>
            <p className={`text-xl mb-10 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Join 10,000+ citizens using NyayaSahayak to navigate the legal system with confidence.
            </p>
            <button className="px-10 py-5 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold text-xl shadow-xl shadow-orange-500/20 transition-transform hover:-translate-y-1">
              Get Started Now
            </button>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const ComparisonRow = ({ bad, good, isDark }) => (
  <div className="flex items-center gap-4">
    <div className={`flex-1 p-4 rounded-xl border-l-4 border-red-400 ${isDark ? 'bg-red-900/10' : 'bg-red-50'}`}>
      <span className={`text-sm font-medium ${isDark ? 'text-red-300' : 'text-red-700'}`}>{bad}</span>
    </div>
    <ArrowRight className="text-slate-400" />
    <div className={`flex-1 p-4 rounded-xl border-l-4 border-green-500 ${isDark ? 'bg-green-900/10' : 'bg-green-50'}`}>
      <span className={`text-sm font-bold ${isDark ? 'text-green-300' : 'text-green-800'}`}>{good}</span>
    </div>
  </div>
);

const StatCard = ({ icon, label, value, isDark }) => (
  <div className={`p-6 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
    <div className="mb-3 opacity-80">{icon}</div>
    <div className="text-2xl font-bold mb-1">{value}</div>
    <div className="text-xs uppercase tracking-wide opacity-60">{label}</div>
  </div>
);

const FeatureCard = ({ className, icon, title, desc, isDark }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={`p-8 rounded-3xl border transition-all ${className} ${
      isDark 
        ? 'bg-white/5 border-white/10 hover:border-white/20' 
        : 'bg-white border-orange-100 hover:shadow-xl hover:shadow-orange-100'
    }`}
  >
    <div className="mb-6 p-3 rounded-2xl bg-slate-100/10 w-fit">{icon}</div>
    <h3 className="text-2xl font-bold mb-3">{title}</h3>
    <p className={`leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{desc}</p>
  </motion.div>
);

export default LandingPage;