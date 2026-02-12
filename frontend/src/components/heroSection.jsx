import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, Scale } from 'lucide-react';
import { useTheme } from '../context/themeContext';

// --- PLACEHOLDER IMAGE ICONS (Replace with your own professional assets) ---
const featureIcons = {
  document: "https://cdn-icons-png.flaticon.com/512/2921/2921226.png",
  blockchain: "https://cdn-icons-png.flaticon.com/512/3665/3665953.png",
  analytics: "https://cdn-icons-png.flaticon.com/512/2345/2345544.png",
  tracking: "https://cdn-icons-png.flaticon.com/512/3253/3253239.png",
  emergency: "https://cdn-icons-png.flaticon.com/512/5625/5625091.png"
};

const HeroSection = () => {
  const { isDark } = useTheme();

  return (
    <main className="flex flex-col items-center justify-center px-6 pt-36 md:pt-48 pb-32 max-w-6xl mx-auto text-center font-sans">
      
      {/* ... (Badge, Headline, Subheadline, Buttons are unchanged) ... */}
      {/* Badge */}
      {/* <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-8 ${isDark ? 'bg-indigo-950/30 border-indigo-500/30 text-indigo-300' : 'bg-orange-50 border-orange-200 text-orange-800'}`}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
        </span>
        <span className="text-xs font-bold tracking-wide uppercase">Official Government Portal</span>
      </motion.div> */}

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`text-5xl md:text-7xl font-serif-heading font-black tracking-tight leading-[1.1] mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}
      >
        Simplifying Justice. <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500">
          Empowering Citizens.
        </span>
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className={`text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
      >
        Your government-backed digital legal companion. Draft documents, track FIRs, and access emergency services through a single, secure platform.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
      >
        <Link to="/signup" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-slate-900 hover:bg-black text-white rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5">
          Launch Platform
        </Link>
        <Link to="/features" className={`w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border rounded-full font-bold text-lg transition-all hover:-translate-y-0.5 ${isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
          View Services
        </Link>
      </motion.div>

      <AIFeatureCard isDark={isDark} />
      <FeatureTags isDark={isDark} />
    </main>
  );
};

// --- Sub-Components ---

// ... (AIFeatureCard is unchanged) ...
const AIFeatureCard = ({ isDark }) => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([
    { type: 'ai', text: "Namaste. I am NyayaSahayak's digital assistant. How may I aid your legal query today?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setMessages([...messages, { type: 'user', text: inputValue }]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'ai', text: "I understand. According to the Registration Act, 1908, a rental agreement for 11 months does not strictly require registration. Shall I draft a standard compliant template for you?" }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className={`w-full max-w-4xl mt-24 p-1 rounded-[2.5rem] bg-gradient-to-br shadow-2xl ${isDark ? 'from-white/10 to-white/0 shadow-orange-900/20' : 'from-white/60 to-white/20 shadow-orange-500/10'}`}
    >
      <div className={`rounded-[2.4rem] overflow-hidden border backdrop-blur-xl h-[450px] flex flex-col ${isDark ? 'bg-[#0F172A]/80 border-white/10' : 'bg-white/60 border-white/50'}`}>
        {/* Chat Header - Cleaned up */}
        <div className={`p-5 border-b flex items-center justify-between ${isDark ? 'border-white/10 bg-white/5' : 'border-black/5 bg-white/40'}`}>
          <div className="flex items-center gap-3">
             <Scale className={`w-5 h-5 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
             <span className={`text-sm font-bold tracking-wide ${isDark ? 'text-white' : 'text-slate-800'}`}>LEGAL ASSISTANT</span>
          </div>
          <div className={`text-xs font-medium px-3 py-1 rounded-full ${isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700'}`}>Online</div>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] p-5 rounded-2xl text-sm leading-relaxed ${
                  msg.type === 'user' 
                    ? 'bg-orange-600 text-white rounded-br-none font-medium' 
                    : isDark ? 'bg-slate-800/80 text-slate-200 rounded-bl-none' : 'bg-white text-slate-700 shadow-sm rounded-bl-none border border-black/5'
                }`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
               <div className={`p-4 rounded-2xl rounded-bl-none flex gap-2 ${isDark ? 'bg-slate-800/80' : 'bg-white border border-black/5'}`}>
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce delay-75"></span>
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce delay-150"></span>
               </div>
             </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className={`p-4 border-t ${isDark ? 'border-white/10 bg-white/5' : 'border-black/5 bg-white/40'}`}>
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a legal question..."
              className={`w-full pl-5 pr-14 py-4 rounded-2xl outline-none transition-all font-medium ${
                isDark 
                  ? 'bg-slate-900/50 text-white placeholder-slate-500 border border-white/10 focus:border-orange-500/50' 
                  : 'bg-white text-slate-800 placeholder-slate-400 border border-slate-200 focus:border-orange-500/50 shadow-sm'
              }`}
            />
            <button 
              onClick={handleSend}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all shadow-md active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// UPDATED Feature Tags with Real Images
const FeatureTags = ({ isDark }) => {
  const features = [
    { text: "Automated Document Drafting", icon: featureIcons.document },
    { text: "Blockchain Evidence Vault", icon: featureIcons.blockchain },
    { text: "Geospatial Crime Analytics", icon: featureIcons.analytics },
    { text: "Judicial Case Tracking", icon: featureIcons.tracking },
    { text: "Emergency PCR Integration", icon: featureIcons.emergency }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="mt-20 flex flex-wrap justify-center gap-3"
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          whileHover={{ y: -2 }}
          className={`flex items-center gap-3 px-5 py-2.5 rounded-xl text-sm font-bold border cursor-default transition-all ${
            isDark 
              ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' 
              : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-white hover:border-orange-200 shadow-sm'
          }`}
        >
          <img src={feature.icon} alt="" className="w-6 h-6 object-contain" />
          {feature.text}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default HeroSection;