import React, { useState } from "react";
import { Bot, FileText, Sparkles, Send } from "lucide-react";
import { useTheme } from "../../context/themeContext";

export default function DraftingTool() {
  const { isDark } = useTheme();
  const scalesBgUrl = "/scale.png";

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans relative ${isDark ? "bg-[#0B1120] text-slate-100" : "bg-[#FFFAF0] text-slate-900"}`}>
      <div className={`fixed inset-0 pointer-events-none z-0 bg-center bg-no-repeat bg-contain transition-opacity ${isDark ? "opacity-[0.03] invert" : "opacity-[0.05]"}`} style={{ backgroundImage: `url(${scalesBgUrl})` }} />
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <div className={`mb-8 flex items-center justify-between px-6 py-5 rounded-2xl border backdrop-blur-md ${isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-white/40"}`}>
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
            Coming Soon
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`px-6 py-6 rounded-2xl border lg:col-span-2 ${isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-white/40"}`}>
            <div className="flex items-center gap-2 mb-4">
              <Bot className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-bold">Chatbot</h2>
            </div>
            <ChatUI isDark={isDark} />
          </div>
          <div className={`px-6 py-6 rounded-2xl border lg:col-span-1 ${isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-white/40"}`}>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-bold">Written Drafts</h2>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? "bg-white/5 border-white/10" : "bg-white/70 border-white/40"}`}>
              <div className="text-sm font-bold">Coming Soon</div>
              <p className={`mt-2 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Generate petitions, affidavits, notices, and contracts with guided templates and compliance checks.
              </p>
              <ul className={`mt-3 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                <li>Templates library</li>
                <li>Clause suggestions</li>
                <li>Export PDF</li>
                <li>Share with client</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatUI({ isDark }) {
  const [messages, setMessages] = useState([
    { id: 1, role: "system", text: "Welcome to the AI Legal Chatbot." },
    { id: 2, role: "user", text: "Draft a bail application for theft case." },
    { id: 3, role: "assistant", text: "Please provide FIR number, court, and client details." },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now(), role: "user", text: input.trim() }]);
    setInput("");
  };

  return (
    <div className={`h-[520px] flex flex-col rounded-xl border ${isDark ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-200"}`}>
      <div className={`px-4 py-2 border-b ${isDark ? "border-slate-800 text-slate-200" : "border-slate-200 text-slate-700"} text-xs font-bold uppercase`}>AI Legal Assistant</div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`max-w-[80%] px-4 py-2 rounded-xl text-sm ${m.role === "user"
              ? isDark ? "bg-orange-900/30 text-orange-200 ml-auto" : "bg-orange-50 text-orange-700 ml-auto"
              : m.role === "assistant"
                ? isDark ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-800"
                : isDark ? "text-slate-400" : "text-slate-500"
            }`}>
            {m.text}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className={`p-3 border-t flex items-center gap-2 ${isDark ? "border-slate-800" : "border-slate-200"}`}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your prompt..."
          className={`flex-1 px-4 py-2 rounded-lg outline-none border ${isDark ? "bg-slate-800 text-white border-slate-700 placeholder:text-slate-500" : "bg-white border-slate-200"}`}
        />
        <button className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 ${isDark ? "bg-orange-600 hover:bg-orange-500 text-white" : "bg-slate-900 hover:bg-black text-white"}`}>
          <Send className="w-4 h-4" />
          Send
        </button>
      </form>
    </div>
  );
}
