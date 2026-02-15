import React, { useState } from 'react';
import { Scale, ShieldCheck, Users, Zap, Gavel, Cpu, Mail, ChevronDown, Github, Linkedin, Instagram, User } from 'lucide-react';
import Navbar from '../components/Navbar';

const AboutPage = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const stats = [
    { label: 'Cases Processed', value: '10k+' },
    { label: 'Active Lawyers', value: '500+' },
    { label: 'Police Stations', value: '120+' },
    { label: 'Avg. Response', value: '2 hrs' },
  ];

  const pillars = [
    {
      title: "Citizen Centric",
      desc: "Demystifying complex legal jargon into actionable steps for the common man.",
      icon: <Users className="text-[#E67E22]" size={32} />
    },
    {
      title: "Lawyer Efficiency",
      desc: "Providing tools for legal professionals to manage cases and documents digitally.",
      icon: <Gavel className="text-[#E67E22]" size={32} />
    },
    {
      title: "Police Integration",
      desc: "Streamlining FIR tracking and inter-departmental communication.",
      icon: <ShieldCheck className="text-[#E67E22]" size={32} />
    }
  ];

  const team = [
    { name: 'Chirabrata Ghosal', linkedin: '#', github: '#', image : "", insta: '#' },
    { name: 'Aryan Mishra', linkedin: 'https://www.linkedin.com/in/aryan-mishra-987b4a321/', image : '/Aryans.png', github: 'https://github.com/aryyann011', insta: '#' },
    { name: 'Arnab Sarkar', linkedin: '#', image : '', github: '#', insta: '#' },
    { name: 'Jyotish Kumar Jha', linkedin: '#', image : '',  github: '#', insta: '#' },
    { name: 'Arpan Atha', linkedin: '#', image : '', github: '#', insta: '#' },
    { name: 'Vikram Singh', linkedin: '#', image : '', github: '#', insta: '#' }
  ];

  const faqs = [
    {
      q: "Is NyayaSahayak a replacement for a lawyer?",
      a: "No. We provide tools to simplify documentation and tracking. For legal representation in court, we connect you with verified legal professionals through our platform."
    },
    {
      q: "How secure is my data (FIRs and Documents)?",
      a: "We use AES-256 encryption and secure digital vaults to ensure that case files remain tamper-proof and accessible only to authorized personnel."
    },
    {
      q: "Can police officers update case status directly?",
      a: "Yes. The Police Portal allows verified officers to update investigation milestones, which are then reflected in the citizen's dashboard in real-time."
    }
  ];

  return (
    <>
    <Navbar /> <br/> <br/>
    <div className="bg-[#FFF9F1] min-h-screen font-sans selection:bg-orange-100">
      
      {/* 1. HERO / MISSION SECTION */}
      <section className="py-20 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 bg-orange-100 px-4 py-2 rounded-full mb-6">
          <Cpu size={18} className="text-[#E67E22]" />
          <span className="text-sm font-bold text-[#E67E22] uppercase tracking-wider">Our Mission</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-[#1A1A1A] mb-6 leading-tight">
          Modernizing India's <span className="text-[#E67E22]">Legal Fabric</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          NyayaSahayak is a digital bridge designed to ensure that justice is accessible, 
          transparent, and efficient for every stakeholder in the Indian legal ecosystem.
        </p>
      </section>

      {/* 2. MEET THE TEAM (Moved up above Unified Ecosystem and Stats) */}
      <section className="py-12 px-6 max-w-7xl mx-auto border-t border-orange-100/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#1A1A1A]">The Founding Board</h2>
          <p className="text-gray-500 mt-2">The architects of modern legal infrastructure.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16">
          {team.map((member, idx) => (
            <div key={idx} className="group text-center">
              <div className="w-44 h-44 bg-orange-100 rounded-full mx-auto mb-6 flex items-center justify-center text-[#E67E22] border-4 border-white shadow-md group-hover:bg-[#E67E22] group-hover:text-white transition-all duration-300 overflow-hidden">
                {member.image ? (
            <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
          ) : (
            <User size={80} strokeWidth={1.5} /> /* This is the placeholder icon */
          )}
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">{member.name}</h3>
              
              <div className="flex justify-center space-x-6 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                <a href={member.linkedin} className="text-gray-500 hover:text-blue-600 transition-colors">
                  <Linkedin size={20} />
                </a>
                <a href={member.insta} className="text-gray-500 hover:text-pink-600 transition-colors">
                  <Instagram size={20} />
                </a>
                <a href={member.github} className="text-gray-500 hover:text-black transition-colors">
                  <Github size={20} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. STATS BAR (The Black Card) */}
      

      {/* 4. THE 3 PILLARS (Unified Ecosystem) */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#1A1A1A]">A Unified Ecosystem</h2>
          <div className="w-20 h-1.5 bg-[#E67E22] mx-auto mt-4 rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <div key={index} className="bg-white p-10 rounded-3xl shadow-sm border border-orange-50 hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="mb-6 bg-orange-50 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:bg-[#E67E22] group-hover:text-white transition-colors">
                {pillar.icon}
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">{pillar.title}</h3>
              <p className="text-gray-600 leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. OUR STORY */}
      <section className="pb-24 px-6 max-w-7xl mx-auto">
        <div className="bg-[#E67E22] rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl min-h-[400px]">
          <div className="md:w-1/2 p-12 md:p-20 flex flex-col justify-center text-white">
            <Scale size={40} className="mb-8 opacity-80" />
            <h2 className="text-3xl font-bold mb-6">Transparency by Design</h2>
            <p className="text-orange-50 text-lg leading-relaxed mb-8">
              Born from a need for speed in the legal system, NyayaSahayak eliminates 
              procedural bottlenecks. From tracking FIRs to generating valid affidavits, 
              we are the digital backbone of modern justice.
            </p>
            <button className="w-fit bg-[#1A1A1A] text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform">
              Our Vision Paper
            </button>
          </div>
          <div className="hidden md:flex md:w-1/2 bg-[#1A1A1A] items-center justify-center p-12">
             <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl font-mono">
                <p className="text-orange-400 text-sm">{"// System_Init.log"}</p>
                <p className="text-gray-400 text-sm mt-2">{"> Encryption: AES_256"}</p>
                <p className="text-gray-400 text-sm">{"> Nodes: Citizen, Lawyer, Police"}</p>
                <p className="text-green-400 text-sm">{"> Justice_Module: DEPLOYED"}</p>
             </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="py-24 bg-white border-t border-orange-100">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-orange-50/20 transition-colors"
                >
                  <span className="font-bold text-[#1A1A1A]">{faq.q}</span>
                  <ChevronDown className={`text-[#E67E22] transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} size={20} />
                </button>
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openFaq === idx ? 'max-h-40' : 'max-h-0'}`}>
                  <div className="p-6 bg-orange-50/10 text-gray-600 border-t border-orange-50 leading-relaxed">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#1A1A1A] py-12 mt-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SIMPLE FOOTER */}
      <footer className="py-12 border-t border-orange-100 text-center">
        <p className="text-gray-400 text-sm">© 2026 NyayaSahayak. Built for Justice Innovation Hackathon.</p>
      </footer>
    </div>
    </>
  );
};

export default AboutPage;