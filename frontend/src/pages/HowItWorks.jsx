import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Search, FileText, Gavel, ShieldCheck, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/themeContext';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const { isDark } = useTheme();

  const steps = [
    {
      icon: UserPlus,
      title: "1. Create Your Identity",
      desc: "Sign up securely using your Government ID. Select your role: Citizen, Lawyer, or Police Official. Our verification system ensures a safe, trusted environment."
    },
    {
      icon: Search,
      title: "2. Choose Your Service",
      desc: "Access the dashboard. Citizens can find lawyers or file complaints. Police can manage dispatch logs. Lawyers can view case dockets. Everything is role-specific."
    },
    {
      icon: FileText,
      title: "3. Digital Action",
      desc: "No more paperwork. File FIRs, draft legal petitions using AI assistance, or schedule consultations digitally. All documents are stored in a secure cloud vault."
    },
    {
      icon: Gavel,
      title: "4. Real-time Tracking",
      desc: "Track your case status, police response, or lawyer activity in real-time. Get instant notifications and transparency at every step of the judicial process."
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans overflow-hidden relative ${isDark ? 'bg-[#0B1120] text-slate-100' : 'bg-[#FFFAF0] text-slate-900'}`}>
      
      {/* Background Gradients (Matches Landing Page) */}
      <div className="fixed inset-0 pointer-events-none transition-opacity duration-700">
        <div className={`absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full blur-[150px] mix-blend-multiply transition-colors duration-700 ${isDark ? 'bg-indigo-900/20' : 'bg-amber-200/30'}`}></div>
        <div className={`absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full blur-[150px] mix-blend-multiply transition-colors duration-700 ${isDark ? 'bg-blue-900/20' : 'bg-orange-200/30'}`}></div>
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* Header Section */}
        <section className="pt-32 pb-16 px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-serif-heading font-bold mb-6">
              Justice, Simplified.
            </h1>
            <p className={`text-xl max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              NyayaSahayak bridges the gap between citizens and the legal system. Here is how we transform complex procedures into simple actions.
            </p>
          </motion.div>
        </section>

        {/* Steps Grid */}
        <section className="pb-32 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-8 rounded-3xl border backdrop-blur-md transition-all duration-300 hover:-translate-y-1 ${
                  isDark 
                    ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                    : 'bg-white/60 border-white/40 shadow-xl shadow-orange-500/5 hover:bg-white/80'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                  isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'
                }`}>
                  <step.icon size={28} />
                </div>
                <h3 className={`text-2xl font-bold mb-4 font-serif-heading ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {step.title}
                </h3>
                <p className={`text-lg leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ / Trust Strip */}
        <div className={`py-16 border-y ${isDark ? 'bg-white/5 border-white/5' : 'bg-white/50 border-orange-100'}`}>
          <div className="max-w-4xl mx-auto px-6 text-center">
             <ShieldCheck className="w-12 h-12 mx-auto mb-6 text-green-500" />
             <h2 className="text-3xl font-bold mb-4">Secure & Encrypted</h2>
             <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
               Every document, chat, and case file is encrypted with enterprise-grade security. 
               Only authorized personnel (Police/Lawyers) with verified credentials can access sensitive data.
             </p>
          </div>
        </div>

        {/* CTA */}
        <section className="py-24 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to get started?</h2>
            <Link to="/signup">
              <button className="px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold text-lg shadow-xl shadow-orange-500/20 hover:scale-105 transition-all flex items-center gap-2 mx-auto">
                Create Account <ArrowRight size={20} />
              </button>
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default HowItWorks;