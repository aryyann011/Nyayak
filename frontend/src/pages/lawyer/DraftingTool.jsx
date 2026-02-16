import React, { useState } from "react";
import { Bot, FileText, Sparkles, Send, Scale } from "lucide-react";
import { useTheme } from "../../context/themeContext";

export default function DraftingTool() {
  const { isDark } = useTheme();
  // Using a generic scale icon if the image fails, or keep your url
  const scalesBgUrl = "/scale.png"; 

  return (
    // ADDED: w-full to ensure it grabs full width
    // NOTE: If you still see a white border around this component, 
    // check your parent <Layout> component for 'p-8' or 'p-4' and remove it for this route.
    <div className={`min-h-screen w-full transition-colors duration-500 font-sans relative flex flex-col ${isDark ? "bg-[#0B1120] text-slate-100" : "bg-[#FFFAF0] text-slate-900"}`}>
      
      {/* Background Image Layer */}
      <div 
        className={`fixed inset-0 pointer-events-none z-0 bg-center bg-no-repeat bg-contain transition-opacity ${isDark ? "opacity-[0.03] invert" : "opacity-[0.05]"}`} 
        style={{ backgroundImage: `url(${scalesBgUrl})` }} 
      />

      {/* Main Content - Changed max-w-5xl to w-full/max-w-[1600px] and reduced py-12 to py-6 */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 md:px-6 py-6 flex-1 flex flex-col">
        
        {/* Header */}
        <div className={`mb-6 flex items-center justify-between px-6 py-5 rounded-2xl border backdrop-blur-md ${isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-white/40"}`}>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${isDark ? "bg-orange-500/20 text-orange-400" : "bg-orange-100 text-orange-600"}`}>
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className={`text-2xl md:text-3xl font-serif-heading font-bold ${isDark ? "text-white" : "text-slate-900"}`}>AI Legal Chatbot</h1>
              <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>Drafting assistant and document generator</p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${isDark ? "bg-slate-800 text-slate-300 border border-slate-700" : "bg-slate-100 text-slate-700 border border-slate-200"}`}>
            <Sparkles className="w-4 h-4" />
            Beta v1.0
          </span>
        </div>

        {/* Grid Layout - Expanded height */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[600px]">
          
          {/* Chat Section - Takes 2/3 width */}
          <div className={`flex flex-col rounded-2xl border lg:col-span-2 overflow-hidden ${isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-white/40"}`}>
            <div className={`px-6 py-4 border-b flex items-center gap-2 ${isDark ? "border-white/10" : "border-slate-200/60"}`}>
              <Bot className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-bold">Chatbot</h2>
            </div>
            {/* Pass className to fill height */}
            <div className="flex-1 p-0">
               <ChatUI isDark={isDark} />
            </div>
          </div>

          {/* Sidebar / Tools - Takes 1/3 width */}
          <div className={`flex flex-col rounded-2xl border lg:col-span-1 ${isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-white/40"}`}>
            <div className={`px-6 py-4 border-b flex items-center gap-2 ${isDark ? "border-white/10" : "border-slate-200/60"}`}>
              <FileText className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-bold">Written Drafts</h2>
            </div>
            
            <div className="p-6 flex-1">
              <div className={`h-full p-6 rounded-xl border flex flex-col items-center justify-center text-center ${isDark ? "bg-white/5 border-white/10" : "bg-white/50 border-white/40"}`}>
                <Scale className={`w-12 h-12 mb-4 ${isDark ? "text-slate-600" : "text-slate-300"}`} />
                <div className="text-base font-bold mb-2">Draft Generation</div>
                <p className={`text-sm mb-6 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Generate petitions, affidavits, notices, and contracts with guided templates and compliance checks.
                </p>
                <div className="w-full space-y-3">
                    {["Templates Library", "Clause Suggestions", "Export PDF", "Client Sharing"].map((item) => (
                        <div key={item} className={`w-full py-2 px-4 rounded-lg text-sm font-medium text-left flex items-center gap-3 ${isDark ? "bg-slate-800 text-slate-300" : "bg-white text-slate-600"}`}>
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                            {item}
                        </div>
                    ))}
                </div>
                <button className="mt-auto w-full py-3 bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-xl font-bold text-sm cursor-not-allowed mt-8">
                    Coming Soon
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function ChatUI({ isDark }) {
  const [messages, setMessages] = useState([
    { id: 1, role: "system", text: "Welcome to the AI Legal Chatbot. I can help you draft legal documents, summarize cases, or find specific IPC codes." },
    { id: 2, role: "user", text: "Draft a bail application for theft case." },
    { id: 3, role: "assistant", text: "Certainly. To draft a robust bail application under Section 437/439 CrPC, I need the FIR number, Police Station name, and specific grounds for bail (e.g., medical issues, false implication)." },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now(), role: "user", text: input.trim() }]);
    setInput("");
  };

  return (
    <div className="h-full flex flex-col">
      {/* Messages Area - Added h-full and removed fixed height */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
             <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                m.role === "user"
                  ? isDark ? "bg-orange-600 text-white rounded-tr-none" : "bg-orange-600 text-white rounded-tr-none"
                  : m.role === "assistant"
                    ? isDark ? "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700" : "bg-white text-slate-800 rounded-tl-none border border-slate-200"
                    : isDark ? "bg-slate-900/50 text-slate-400 w-full text-center text-xs mb-2" : "bg-slate-100 text-slate-500 w-full text-center text-xs mb-2"
              }`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className={`p-4 border-t ${isDark ? "border-white/10 bg-slate-900/50" : "border-slate-200 bg-slate-50/50"}`}>
        <form onSubmit={sendMessage} className="flex items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your legal query here..."
            className={`flex-1 px-5 py-3 rounded-xl outline-none border transition-all ${
                isDark 
                ? "bg-slate-800 text-white border-slate-700 placeholder:text-slate-500 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10" 
                : "bg-white border-slate-200 text-slate-900 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10"
            }`}
          />
          <button className={`p-3 rounded-xl font-bold flex items-center justify-center transition-transform active:scale-95 shadow-lg ${isDark ? "bg-orange-600 hover:bg-orange-500 text-white" : "bg-slate-900 hover:bg-black text-white"}`}>
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}