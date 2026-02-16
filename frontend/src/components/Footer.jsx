import React from 'react';
import { Scale, Twitter, Linkedin, Facebook, Mail } from 'lucide-react';
import { useTheme } from '../context/themeContext';

const Footer = () => {
  const { isDark } = useTheme();

  return (
    // ✨ CHANGED: bg-[#050914] -> bg-[#030712] (Deep Obsidian) & refined borders
    <footer className={`py-16 px-6 border-t transition-colors duration-500 ${isDark ? 'bg-[#030712] border-white/10 text-gray-400' : 'bg-[#FFF8F0] border-orange-100 text-slate-600'}`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand Column */}
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <Scale className="w-6 h-6 text-orange-500" />
            <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Nyaya<span className="text-orange-500">Sahayak</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed mb-6">
            Democratizing access to justice through AI, transparency, and real-time public safety infrastructure.
          </p>
          <div className="flex gap-4">
            <SocialIcon icon={<Twitter className="w-4 h-4" />} isDark={isDark} />
            <SocialIcon icon={<Linkedin className="w-4 h-4" />} isDark={isDark} />
            <SocialIcon icon={<Facebook className="w-4 h-4" />} isDark={isDark} />
          </div>
        </div>

        {/* Links Column 1 */}
        <div>
          <h4 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Platform</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-orange-500 transition-colors">AI Legal Assistant</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Crime Heatmap</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Case Tracker</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Emergency SOS</a></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div>
          <h4 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Government</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-orange-500 transition-colors">Department Login</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Police Dashboard</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Judicial Data API</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">RTI Integration</a></li>
          </ul>
        </div>

        {/* Contact Column */}
        <div>
          <h4 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Contact</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-orange-500" /> support@nyayasahayak.in
            </li>
            <li>Helpline: 1800-JUSTICE</li>
            <li>New Delhi, India</li>
          </ul>
        </div>
      </div>
      
      <div className={`mt-12 pt-8 border-t text-center text-xs ${isDark ? 'border-white/10 text-gray-600' : 'border-orange-200/50 text-slate-400'}`}>
        © 2026 NyayaSahayak Foundation. Built for Public Interest.
      </div>
    </footer>
  );
};

// Updated Social Icon to handle the new dark theme
const SocialIcon = ({ icon, isDark }) => (
  <a href="#" className={`p-2 rounded-full transition-colors ${
    isDark 
      ? 'bg-white/5 hover:bg-orange-600 hover:text-white text-gray-400' 
      : 'bg-orange-100 hover:bg-orange-200 text-orange-600'
  }`}>
    {icon}
  </a>
);

export default Footer;