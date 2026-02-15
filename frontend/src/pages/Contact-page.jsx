import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import { supabase } from '../lib/supabase';
import { toast } from 'react-toastify';
import { useTheme } from '../context/themeContext';

const ContactPage = () => {
  const { isDark } = useTheme();
  const [role, setRole] = useState('Citizen');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // <--- NEW STATE

  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic Validation
    if (!formData.full_name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          {
            role: role,
            full_name: formData.full_name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message
          }
        ]);

      if (error) throw error;

      // --- SUCCESS LOGIC ---
      setIsSubmitting(false);
      setIsSuccess(true); 
      toast.success("Message sent successfully!");
      
      // Reset Form
      setFormData({
        full_name: '',
        email: '',
        subject: '',
        message: ''
      });
      setRole('Citizen');

      // Reset Button text after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <Navbar />
    <div className={`min-h-screen ${isDark ? 'bg-[#0B1120]' : 'bg-[#FFF9F1]'} py-16 px-4 sm:px-6 lg:px-8 font-sans`}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-[#E67E22] tracking-wide uppercase">Contact Us</h2>
          <p className={`mt-2 text-4xl font-extrabold ${isDark ? 'text-slate-100' : 'text-[#1A1A1A]'} sm:text-5xl`}>
            How can we assist you today?
          </p>
          <p className={`mt-4 max-w-2xl mx-auto text-xl ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
            Whether you are seeking legal aid, offering counsel, or representing law enforcement, we are here to bridge the gap.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Contact Information Cards */}
          <div className="space-y-8">
            <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-orange-100'} p-8 rounded-2xl shadow-sm border`}>
              <h3 className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-[#1A1A1A]'} mb-6`}>Get in touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className={`flex-shrink-0 ${isDark ? 'bg-slate-700' : 'bg-orange-100'} p-3 rounded-lg text-[#E67E22]`}>
                    <Mail size={24} />
                  </div>
                  <div className="ml-4">
                    <p className={`text-lg font-medium ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>Email Us</p>
                    <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>support@nyayasahayak.gov.in</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className={`flex-shrink-0 ${isDark ? 'bg-slate-700' : 'bg-orange-100'} p-3 rounded-lg text-[#E67E22]`}>
                    <Phone size={24} />
                  </div>
                  <div className="ml-4">
                    <p className={`text-lg font-medium ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>Helpline</p>
                    <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>+91 1800-NYAYA-HELP</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className={`flex-shrink-0 ${isDark ? 'bg-slate-700' : 'bg-orange-100'} p-3 rounded-lg text-[#E67E22]`}>
                    <MapPin size={24} />
                  </div>
                  <div className="ml-4">
                    <p className={`text-lg font-medium ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>Headquarters</p>
                    <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>Legal Block, Digital India Bhavan, New Delhi</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Hours */}
            <div className={`${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-[#1A1A1A] text-white'} p-8 rounded-2xl shadow-xl`}>
              <h4 className={`text-xl font-bold mb-2 ${isDark ? 'text-slate-100' : ''}`}>Emergency Services?</h4>
              <p className={isDark ? 'text-slate-300' : 'text-gray-400'}>Our automated FIR tracking and emergency drafting tools are available 24/7 via the platform.</p>
              <button className="mt-6 w-full bg-[#E67E22] py-3 rounded-xl font-bold hover:bg-orange-600 transition">
                Launch Platform →
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} p-8 lg:p-10 rounded-2xl shadow-lg border`}>
            <form className="grid grid-cols-1 gap-y-6" onSubmit={handleSubmit}>
              {/* Role Selector Tabs */}
              <div>
                <label className={`block text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-gray-700'} mb-3`}>I am a:</label>
                <div className={`flex p-1 ${isDark ? 'bg-slate-700' : 'bg-gray-100'} rounded-xl space-x-1`}>
                  {['Citizen', 'Lawyer', 'Police'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setRole(item)}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${
                        role === item ? `${isDark ? 'bg-slate-800' : 'bg-white'} text-[#E67E22] shadow` : isDark ? 'text-slate-400 hover:text-slate-300' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="full_name" className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Full Name</label>
                  <input 
                    type="text" 
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-4 py-3 ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-gray-50 border-gray-200 placeholder-gray-500'} border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none`} 
                    placeholder="John Doe" 
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-4 py-3 ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-gray-50 border-gray-200 placeholder-gray-500'} border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none`} 
                    placeholder="john@example.com" 
                    required
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Subject</label>
                <input 
                  type="text" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-4 py-3 ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-gray-50 border-gray-200 placeholder-gray-500'} border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none`} 
                  placeholder={role === 'Police' ? "Station ID / Case Inquiry" : "How can we help?"} 
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Message</label>
                <textarea 
                  rows="4" 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-4 py-3 ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-gray-50 border-gray-200 placeholder-gray-500'} border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none`} 
                  placeholder="Describe your query in detail..."
                  required
                ></textarea>
              </div>

              {/* UPDATED BUTTON LOGIC */}
              <button 
                type="submit" 
                disabled={isSubmitting || isSuccess}
                className={`w-full flex justify-center items-center space-x-2 py-4 px-6 text-white font-bold rounded-xl transition shadow-lg
                  ${isSuccess 
                    ? 'bg-green-600 hover:bg-green-700'  // Success State (Green)
                    : 'bg-[#1A1A1A] hover:bg-gray-800'   // Default State (Black)
                  } 
                  ${(isSubmitting) ? 'opacity-70 cursor-not-allowed' : ''}
                `}
              >
                {isSubmitting ? (
                  <>
                    <span>Sending...</span>
                    <Loader2 size={18} className="animate-spin" />
                  </>
                ) : isSuccess ? (
                  <>
                    <span>Sent Successfully</span>
                    <CheckCircle size={18} />
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
    </>
  );
};

export default ContactPage;