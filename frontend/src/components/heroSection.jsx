import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Scale, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/themeContext';

const HeroSection = () => {
  const { isDark } = useTheme();

  return (
    <div className="font-sans">
      <main className="relative flex flex-col items-center justify-center pt-36 md:pt-48 pb-20 max-w-[100vw] overflow-hidden">
        
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`text-center text-4xl md:text-6xl font-serif-heading font-black tracking-tight leading-[1.1] mb-8 px-4 ${isDark ? 'text-white' : 'text-slate-900'}`}
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
          className={`text-center text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed px-4 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}
        >
          Your government-backed digital legal companion. Draft documents, track FIRs, and access emergency services through a single, secure platform.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-6 mb-24"
        >
          <Link to="/signup" className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 hover:bg-black text-white rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 dark:bg-orange-600 dark:hover:bg-orange-700">
            Launch Platform
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/login" className={`w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border rounded-full font-bold text-lg transition-all hover:-translate-y-0.5 ${isDark ? 'border-white/10 text-white hover:bg-white/5' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
            View Services
          </Link>
        </motion.div>

        {/* Auto-Playing AI Card */}
        <AIFeatureCard isDark={isDark} />
      </main>
    </div>
  );
};

// --- SINGLE CHAT VIEW (NO SCROLLING) ---
const AIFeatureCard = ({ isDark }) => {
  const [inputValue, setInputValue] = useState("");
  
  // 1. Always start with just the Welcome message
  const WELCOME_MSG = { type: 'ai', text: "Namaste. I am NyayaSahayak's digital assistant. How may I aid your legal query today?" };
  
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const SCRIPT = [
    { type: 'user', text: "Can I file an FIR online?" },
    { type: 'ai', text: "Yes. Under the CCTNS e-FIR system, you can file complaints for cognizable offenses like theft or cybercrime via the official portal." },
    // PAUSE HERE (Index 2) - This dummy entry triggers the reset
    { type: 'reset' }, 
    { type: 'user', text: "What documents do I need for online FIR?" },
    { type: 'ai', text: "You typically need: 1. A valid ID proof (Aadhar/Pan) \n2. Incident details (Date, Time, Location)." }
  ];

  useEffect(() => {
    let timeout;
    
    const runScript = async () => {
      // Loop back to start if finished
      if (currentStep >= SCRIPT.length) {
        timeout = setTimeout(() => {
          setMessages([WELCOME_MSG]);
          setCurrentStep(0);
        }, 2000);
        return;
      }

      const action = SCRIPT[currentStep];

      // --- LOGIC: RESET SCREEN ---
      if (action.type === 'reset') {
        timeout = setTimeout(() => {
          setMessages([WELCOME_MSG]); // Clear old Q&A, keep Welcome
          setCurrentStep(prev => prev + 1);
        }, 3000); // Read time before clearing
        return;
      }

      // --- LOGIC: USER TYPING ---
      if (action.type === 'user') {
        for (let i = 0; i <= action.text.length; i++) {
          setInputValue(action.text.slice(0, i));
          await new Promise(r => setTimeout(r, 40));
        }
        await new Promise(r => setTimeout(r, 400)); 

        // Add User Message (Keep Welcome, Add User)
        setMessages([WELCOME_MSG, { type: 'user', text: action.text }]);
        setInputValue("");
        setIsTyping(true);
        setCurrentStep(prev => prev + 1);
      
      // --- LOGIC: AI RESPONDING ---
      } else if (action.type === 'ai') {
        await new Promise(r => setTimeout(r, 1500)); 
        setIsTyping(false);
        
        // Add AI Message (Keep Welcome + User, Add AI)
        setMessages(prev => [...prev, { type: 'ai', text: action.text }]);
        
        // Immediately move to next step (which might be a Reset)
        setCurrentStep(prev => prev + 1);
      }
    };

    runScript();
    return () => clearTimeout(timeout);
  }, [currentStep]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      // ✨ CHANGED: Deeper shadow for Obsidian theme
      className={`w-full max-w-4xl p-1 rounded-[2.5rem] bg-gradient-to-br shadow-2xl z-20 ${isDark ? 'from-white/10 to-white/0 shadow-black/50' : 'from-white/60 to-white/20 shadow-orange-500/10'}`}
    >
      {/* ✨ CHANGED: Background color to bg-[#030712]/80 */}
      <div className={`rounded-[2.4rem] overflow-hidden border backdrop-blur-xl h-[450.1px] flex flex-col ${isDark ? 'bg-[#030712]/80 border-white/10' : 'bg-white/60 border-white/50'}`}>
        
        {/* Header */}
        <div className={`p-5 border-b flex items-center justify-between ${isDark ? 'border-white/5 bg-white/5' : 'border-black/5 bg-white/40'}`}>
          <div className="flex items-center gap-3">
             <div className={`p-1.5 rounded-lg ${isDark ? 'bg-orange-600' : 'bg-orange-100'}`}>
               <Scale className={`w-5 h-5 ${isDark ? 'text-white' : 'text-orange-600'}`} />
             </div>
             <span className={`text-sm font-bold tracking-wide ${isDark ? 'text-white' : 'text-slate-800'}`}>LEGAL ASSISTANT</span>
          </div>
          <div className={`text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5 ${isDark ? 'bg-green-500/10 text-green-400' : 'bg-green-100 text-green-700'}`}>
             <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
             Online
          </div>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-hidden p-6 space-y-6 flex flex-col justify-end">
          <AnimatePresence mode='wait'>
            {messages.map((msg, index) => (
              <motion.div
                key={index + msg.text.slice(0,5)} // Unique key forces re-render animation
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] p-5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.type === 'user' 
                    ? 'bg-orange-600 text-white rounded-br-none font-medium' 
                    // ✨ CHANGED: Cleaner Obsidian message bubble
                    : isDark ? 'bg-white/5 text-gray-200 rounded-bl-none border border-white/10' : 'bg-white text-slate-700 rounded-bl-none border border-black/5'
                }`}>
                  {msg.text.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Typing Indicator */}
          {isTyping && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
               <div className={`p-4 rounded-2xl rounded-bl-none flex gap-1.5 ${isDark ? 'bg-white/5' : 'bg-white border border-black/5'}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
               </div>
             </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className={`p-4 border-t ${isDark ? 'border-white/5 bg-white/5' : 'border-black/5 bg-white/40'}`}>
          <div className="relative">
            <input
              type="text"
              readOnly
              value={inputValue}
              placeholder="Ask a legal question..."
              className={`w-full pl-5 pr-14 py-4 rounded-2xl outline-none transition-all font-medium cursor-default ${
                isDark 
                  // ✨ CHANGED: Cleaner input field for Obsidian
                  ? 'bg-black/30 text-white placeholder-gray-500 border border-white/10 focus:border-orange-500/50' 
                  : 'bg-white text-slate-800 placeholder-slate-400 border border-slate-200 focus:border-orange-500/50 shadow-sm'
              }`}
            />
            <button 
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all shadow-md ${
                inputValue 
                ? 'bg-orange-600 text-white hover:bg-orange-700' 
                : 'bg-slate-700/10 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroSection;