import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Upload, FileText, Loader2, X, Scale, ShieldCheck, Sparkles, Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/themeContext";

const Chat = () => {
  const { isDark, toggleTheme } = useTheme();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Welcome to NyaySetu AI. I am calibrated for Indian Legal procedures. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);



  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() && !uploadedFile) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      file: filePreview,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setLoading(true);

    try {
      const baseUrl = "https://nyayak-1.onrender.com" ;
      let response;
      if (uploadedFile) {
        const formData = new FormData();
        formData.append("query", inputText || "Analyze document");
        formData.append("file", uploadedFile);
        response = await fetch(`${baseUrl}/ask-file`, {
          method: "POST",
          body: formData,
        });
      } else {
        response = await fetch(`${baseUrl}/ask`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: inputText }),
        });
      }
      const data = await response.json();
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        text: data.answer || "Processing complete.",
        sender: "bot",
        source: data.mode,
        confidence: data.confidence,
        disclaimer: data.disclaimer,
      }]);
    } catch (error) {
      setMessages((prev) => [...prev, { id: Date.now() + 1, text: "Server error. Try again.", sender: "bot", isError: true }]);
    } finally {
      setLoading(false);
      setFilePreview(null);
    }
  };

  const theme = {
    bg: isDark ? "#09090b" : "#f8fafc",
    text: isDark ? "#ffffff" : "#0f172a",
    card: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.7)",
    border: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
    accent: "#6366f1"
  };

  return (
    <div style={{ 
      backgroundColor: theme.bg, 
      color: theme.text, 
      transition: "background-color 0.8s ease" 
    }} className="relative min-h-screen overflow-hidden flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* --- ANIMATED BACKGROUND LAYER --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="aura-blob aura-1" style={{ backgroundColor: `${theme.accent}20` }} />
        <div className="aura-blob aura-2" style={{ backgroundColor: "#a855f715" }} />
        <div className="aura-blob aura-3" style={{ backgroundColor: `${theme.accent}10` }} />
      </div>

      {/* Interface Header */}
      <header className="relative z-20 flex justify-between items-center p-8 w-full">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl rotate-animate" style={{ backgroundColor: `${theme.accent}15`, border: `1px solid ${theme.accent}30` }}>
            <Scale size={28} color={theme.accent} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter">NyaySetu <span style={{ color: theme.accent }}>AI</span></h1>
            <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">System Online</p>
            </div>
          </div>
        </div>

        <button 
          onClick={toggleTheme}
          className="p-3 rounded-2xl transition-all hover:scale-110 active:scale-95 backdrop-blur-md shadow-xl"
          style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}` }}
        >
          {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-indigo-600" />}
        </button>
      </header>

      {/* Main Chat Engine */}
      <main className="relative z-10 flex-1 w-full flex flex-col px-6 pb-8 overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-10 pr-4 scrollbar-custom">
          <AnimatePresence mode="popLayout">
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  style={{ 
                    backgroundColor: m.sender === "user" ? theme.accent : theme.card,
                    border: `1px solid ${m.sender === "user" ? "transparent" : theme.border}`,
                    backdropFilter: "blur(25px)",
                    boxShadow: m.sender === "user" ? `0 20px 40px -15px ${theme.accent}50` : "0 10px 30px -10px rgba(0,0,0,0.1)"
                  }}
                  className={`relative p-6 rounded-[32px] max-w-[85%] md:max-w-[75%] ${m.sender === "user" ? "rounded-tr-none text-white font-semibold" : "rounded-tl-none font-medium text-[15.5px]"}`}
                >
                  {m.sender === "bot" && (
                    <div className="absolute -top-4 -left-4 p-2 rounded-xl border shadow-lg backdrop-blur-md" style={{ backgroundColor: theme.bg, borderColor: theme.border }}>
                      <Sparkles size={16} color={theme.accent} className="animate-pulse" />
                    </div>
                  )}

                  <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>

                  {m.file && (
                    <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-black/20 text-xs border border-white/5">
                      <FileText size={16} color={theme.accent} /> 
                      <span className="opacity-80 font-bold uppercase">{m.file.name}</span>
                    </div>
                  )}

                  {m.sender === "bot" && (m.source || m.confidence) && (
                    <div className="mt-5 pt-4 border-t flex items-center gap-5 text-[10px] font-black uppercase tracking-widest opacity-40" style={{ borderColor: theme.border }}>
                      <span className="flex items-center gap-1.5"><ShieldCheck size={14}/> {m.source || "Legal Engine"}</span>
                      {m.confidence && <span className="bg-white/10 px-2 py-1 rounded">{m.confidence}% Accuracy</span>}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* AI Thinking State */}
          <AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex justify-start">
                <div 
                  style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, backdropFilter: "blur(30px)" }}
                  className="p-6 rounded-[32px] rounded-tl-none flex flex-col gap-4 min-w-[260px] relative overflow-hidden"
                >
                  <div className="scanline" />
                  <div className="flex items-center gap-3">
                    <div className="relative h-4 w-4">
                        <div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-20" />
                        <div className="relative h-full w-full bg-indigo-500 rounded-full shadow-[0_0_10px_#6366f1]" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.2em] opacity-60">AI Synthesizing</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="h-1.5 w-full rounded-full bg-indigo-500/10 overflow-hidden relative">
                        <motion.div animate={{ x: ["-100%", "100%"] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="absolute inset-0 bg-indigo-500/40 w-1/2" />
                    </div>
                    <div className="h-1.5 w-[70%] rounded-full bg-indigo-500/10 overflow-hidden relative">
                         <motion.div animate={{ x: ["-100%", "100%"] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.3 }} className="absolute inset-0 bg-indigo-500/40 w-1/2" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Action Center */}
        <div className="mt-8 w-full px-6">
          <form onSubmit={handleSendMessage} className="relative">
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
            
            <div 
              style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, backdropFilter: "blur(30px)" }}
              className="flex items-center gap-4 p-3 rounded-[35px] shadow-2xl transition-all duration-500 focus-within:scale-[1.02] focus-within:shadow-indigo-500/10 focus-within:border-indigo-500/30"
            >
              <button 
                type="button" 
                onClick={() => fileInputRef.current.click()}
                className="p-4 rounded-full hover:bg-indigo-500/10 transition-colors text-gray-400 hover:text-indigo-500"
              >
                <Upload size={24} />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Briefly describe your legal inquiry..."
                className="flex-1 bg-transparent border-none outline-none py-4 text-[16px] font-semibold tracking-tight"
                style={{ color: theme.text }}
              />

              <button
                type="submit"
                disabled={loading || (!inputText.trim() && !uploadedFile)}
                style={{ backgroundColor: theme.accent }}
                className="p-4 text-white rounded-full transition-all active:scale-90 disabled:opacity-20 shadow-[0_10px_20px_-5px_#6366f1]"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
              </button>
            </div>
          </form>
          <p className="text-center text-[8px] font-black uppercase tracking-[0.5em] mt-6 opacity-30">Legal Intelligence & Analysis Framework</p>
        </div>
      </main>

      <style>{`
        @keyframes blob-float {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }

        .aura-blob {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          filter: blur(100px);
          animation: blob-float 15s infinite ease-in-out;
        }

        .aura-1 { top: -10%; left: -10%; }
        .aura-2 { bottom: -10%; right: -10%; animation-delay: -5s; }
        .aura-3 { top: 30%; left: 20%; animation-duration: 12s; opacity: 0.5; }

        .rotate-animate:hover { transform: rotate(10deg); transition: 0.3s; }

        .scanline {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(to bottom, transparent, rgba(99, 102, 241, 0.05), transparent);
          animation: scan 2s linear infinite;
          pointer-events: none;
        }

        @keyframes scan { from { transform: translateY(-100%); } to { transform: translateY(100%); } }

        .scrollbar-custom::-webkit-scrollbar { width: 5px; }
        .scrollbar-custom::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
        input::placeholder { opacity: 0.3; }
      `}</style>
    </div>
  );
};

export default Chat;
