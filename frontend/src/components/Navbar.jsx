import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scale, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../context/themeContext';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Helper: Scroll to Features section
  const scrollToFeatures = () => {
    if (location.pathname === '/') {
      const element = document.getElementById('features');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ✅ Helper: Scroll to Top when Logo is clicked
  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4"
    >
      <nav className={`relative flex items-center justify-between px-6 py-3 rounded-full shadow-xl border backdrop-blur-md transition-all duration-300 w-full max-w-5xl ${
        isDark 
          ? 'bg-[#0B1120]/80 border-white/10 shadow-black/20' 
          : 'bg-white/80 border-white/40 shadow-orange-500/5'
      }`}>
        
        {/* Logo Section - Now scrolls to top on click */}
        <Link to="/" onClick={handleLogoClick}>
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-full ${isDark ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
              <Scale className="w-5 h-5 text-orange-500" />
            </div>
            <span className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Nyaya<span className="text-orange-500">Sahayak</span>
            </span>
          </div>
        </Link>

        {/* Center Links (Desktop) */}
        <div className={`hidden md:flex items-center gap-8 text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          {/* Features Link */}
          {location.pathname === '/' ? (
             <button onClick={scrollToFeatures} className="hover:text-orange-500 transition-colors cursor-pointer">
               Features
             </button>
          ) : (
             <Link to="/#features" className="hover:text-orange-500 transition-colors">
               Features
             </Link>
          )}

          {/* How It Works Link */}
          <Link to="/how-it-works" className="hover:text-orange-500 transition-colors">
            How it Works
          </Link>

          <Link to="/about" className="hover:text-orange-500 transition-colors">
            About
          </Link>

          <Link to="/contact" className="hover:text-orange-500 transition-colors">
            Contact-Us
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className={`p-2 border-none rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-yellow-400' : 'hover:bg-slate-100 text-slate-600'}`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Desktop Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link to="/login" className={`text-sm font-semibold transition-colors ${isDark ? 'text-white hover:text-orange-400' : 'text-slate-700 hover:text-orange-600'}`}>
              Log in
            </Link>
            <Link to="/signup" className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-full transition-transform hover:scale-105 shadow-lg shadow-orange-500/20">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-full"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className={`absolute top-full mt-4 left-0 right-0 mx-4 rounded-2xl p-6 shadow-xl border md:hidden ${
            isDark ? 'bg-[#0B1120] border-white/10' : 'bg-white border-slate-200'
          }`}>
            <div className="flex flex-col gap-4 text-sm font-medium">
              <Link to="/" onClick={() => { setIsOpen(false); handleLogoClick(); }} className="hover:text-orange-500">
                Home
              </Link>
              <button onClick={() => { setIsOpen(false); setTimeout(scrollToFeatures, 100); }} className="text-left hover:text-orange-500">
                Features
              </button>
              <Link to="/how-it-works" onClick={() => setIsOpen(false)} className="hover:text-orange-500">
                How It Works
              </Link>
              <Link to="/map" onClick={() => setIsOpen(false)} className="hover:text-orange-500">
                Safety Map
              </Link>
               <Link to="/about" onClick={() => setIsOpen(false)} className="hover:text-orange-500">
                About
              </Link>
              <hr className="border-slate-200 dark:border-slate-700" />
              <Link to="/login" onClick={() => setIsOpen(false)}>
                Log in
              </Link>
              <Link to="/signup" className="bg-orange-500 text-white px-4 py-2 rounded-lg text-center">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>
    </motion.div>
  );
};

export default Navbar;