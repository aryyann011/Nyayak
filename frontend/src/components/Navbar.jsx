import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scale, Sun, Moon, Menu } from 'lucide-react';
import { useTheme } from '../context/themeContext';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4"
    >
      <nav className={`flex items-center justify-between px-6 py-3 rounded-full shadow-xl border backdrop-blur-md transition-all duration-300 w-full max-w-5xl ${
        isDark 
          ? 'bg-[#0B1120]/80 border-white/10 shadow-black/20' 
          : 'bg-white/80 border-white/40 shadow-orange-500/5'
      }`}>
        
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-full ${isDark ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
            <Scale className="w-5 h-5 text-orange-500" />
          </div>
          <span className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Nyaya<span className="text-orange-500">Sahayak</span>
          </span>
        </div>

        {/* Center Links (Desktop) */}
        <div className={`hidden md:flex items-center gap-8 text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          {['Features', 'How It Works', 'Safety Map', 'About'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase().replace(/ /g, '-')}`} 
              className="hover:text-orange-500 transition-colors"
            >
              {item}
            </a>
          ))}
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

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

          {/* Buttons */}
          <Link to="/login" className={`hidden sm:block text-sm font-semibold transition-colors ${isDark ? 'text-white hover:text-orange-400' : 'text-slate-700 hover:text-orange-600'}`}>
            Log in
          </Link>
          <Link to="/signup" className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-full transition-transform hover:scale-105 shadow-lg shadow-orange-500/20">
            Get Started
          </Link>
        </div>
      </nav>
    </motion.div>
  );
};

export default Navbar;