import React from 'react';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/heroSection';
import LegalBentoGrid from '../components/LegalBentoGrid';
import Footer from '../components/Footer';
import { useTheme } from '../context/themeContext';
import { useAuth } from '../context/Authcontext';
import { useNavigate, Link, useLocation } from "react-router-dom";

const scalesBgUrl = "/scales.png";

const LandingPage = () => {
  const { isDark } = useTheme();
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect logged-in users
  useEffect(() => {
    if (!loading && user) {
      const role = userRole || 'citizen';
      if (role === 'admin') navigate('/admin', { replace: true });
      else if (role === 'police') {
        navigate('/police-dashboard', { replace: true });
      } else if (role === 'lawyer') {
        navigate('/lawyer/legal-dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, userRole, loading, navigate]);

  // Handle hash scrolling
  useEffect(() => {
    if (location.hash === '#features') {
      const element = document.getElementById('features');
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  if (loading || (user && !loading)) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#030712]' : 'bg-[#FFFAF0]'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    // ✨ CHANGED: bg-[#0B1120] -> bg-[#030712] (Deep Obsidian)
    <div className={`min-h-screen transition-colors duration-500 font-sans overflow-hidden relative ${isDark ? 'bg-[#030712] text-gray-100' : 'bg-[#FFFAF0] text-slate-900'}`}>
      
      {/* ✨ UPGRADED: Premium Glow Gradients */}
      <div className="fixed inset-0 pointer-events-none transition-opacity duration-700">
        <div className={`absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] mix-blend-screen transition-colors duration-700 ${isDark ? 'bg-indigo-600/10' : 'bg-amber-200/30'}`}></div>
        <div className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] mix-blend-screen transition-colors duration-700 ${isDark ? 'bg-purple-600/10' : 'bg-orange-200/30'}`}></div>
        {isDark && <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full blur-[150px] bg-blue-500/5 mix-blend-screen"></div>}
      </div>

      {/* Watermark */}
      {!isDark && (
        <div 
          className="fixed inset-0 pointer-events-none z-0 bg-center bg-no-repeat bg-contain opacity-[0.05]"
          style={{ backgroundImage: `url(${scalesBgUrl})` }}
        ></div>
      )}

      <div className="relative z-10">
        <Navbar />
        
        {/* 1. HERO SECTION */}
        <HeroSection />

        {/* 2. TRUST STRIP */}
        <div className={`py-12 border-y ${isDark ? 'bg-white/[0.02] border-white/[0.05]' : 'bg-white/50 border-orange-100'}`}>
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className={`text-xs font-bold uppercase tracking-widest mb-10 ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
              Trusted by Public Safety Departments
            </p>

            <div className="flex flex-wrap justify-center items-center gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex flex-col items-center">
                <img src="/delhi.png" alt="Delhi Police" className="h-16 mb-2" />
                <span className="font-serif font-bold text-2xl">Delhi Police</span>
              </div>
              <div className="flex flex-col items-center">
                <img src="/barcouncil.png" alt="Bar Council" className="h-16 mb-2" />
                <span className="font-serif font-bold text-2xl">Bar Council</span>
              </div>
              <div className="flex flex-col items-center">
                <img src="/niti.jpeg" alt="NITI Aayog" className="h-16 mb-2" />
                <span className="font-serif font-bold text-2xl">NITI Aayog</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. BENTO GRID */}
        <div id="features">
          <LegalBentoGrid />
        </div>

        {/* 4. CALL TO ACTION */}
        <section className="py-32 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-serif-heading font-bold mb-8">
              Ready to claim your rights?
            </h2>
            <p className={`text-xl mb-12 max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
              Join 10,000+ citizens using NyayaSahayak to navigate the legal system with confidence.
            </p>

            <Link to="/login">
              <button className="px-12 py-6 bg-white text-black hover:bg-gray-200 dark:bg-orange-600 dark:text-white dark:hover:bg-orange-700 rounded-full font-bold text-xl shadow-2xl hover:-translate-y-1 transition-all">
                Get Started Now
              </button>
            </Link>

          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;