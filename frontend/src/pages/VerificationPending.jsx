import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import { supabase } from "../lib/supabase";
import { Shield, Clock, CheckCircle, XCircle, LogOut, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

const VerificationPending = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState("checking"); // 'checking', 'pending', 'verified', 'rejected'
  const [isChecking, setIsChecking] = useState(false);

  const checkStatus = async () => {
    if (!user) return;
    setIsChecking(true);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('verification_status, role')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      const currentStatus = data?.verification_status;
      setStatus(currentStatus);

      // AUTO-REDIRECT IF VERIFIED
      if (currentStatus === 'verified') {
        const role = data.role;
        if (role === 'police') navigate('/police-dashboard');
        else if (role === 'lawyer') navigate('/lawyer/legal-dashboard');
        else navigate('/dashboard');
      }

    } catch (err) {
      console.error("Error fetching status:", err);
    } finally {
      // Small delay to show the refresh animation
      setTimeout(() => setIsChecking(false), 800);
    }
  };

  // Poll for status every 5 seconds (For Hackathon "Live Demo" effect)
  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100"
      >
        {/* Header Graphic */}
        <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600/10 pattern-grid-lg opacity-20"></div>
          <div className="relative z-10 flex justify-center mb-4">
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
              {status === 'rejected' ? <XCircle size={40} className="text-red-400" /> :
               status === 'verified' ? <CheckCircle size={40} className="text-emerald-400" /> :
               <Shield size={40} className="text-orange-400 animate-pulse" />}
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Identity Verification</h2>
          <p className="text-slate-400 text-sm mt-2">NyayaSahayak Official Gatekeeper</p>
        </div>

        {/* Body Content */}
        <div className="p-8 text-center space-y-6">
          
          {/* STATUS: PENDING */}
          {(status === 'pending' || status === 'checking') && (
            <>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Verification in Progress</h3>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                  Your credentials and official ID are currently being reviewed by our administrative team. This process ensures the security of the judicial network.
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-start gap-3 text-left">
                <Clock className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-orange-800">Estimated Wait</p>
                  <p className="text-xs text-orange-700 mt-1">Usually processed within 2-4 hours. You can keep this page open.</p>
                </div>
              </div>
            </>
          )}

          {/* STATUS: REJECTED */}
          {status === 'rejected' && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
              <h3 className="text-red-800 font-bold">Application Rejected</h3>
              <p className="text-red-600 text-sm mt-1">
                The documents provided did not match official records. Please contact support.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button 
              onClick={checkStatus} 
              disabled={isChecking}
              className="w-full py-3 bg-slate-900 hover:bg-black text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              <RefreshCw size={18} className={isChecking ? "animate-spin" : ""} />
              {isChecking ? "Checking System..." : "Refresh Status"}
            </button>

            <button 
              onClick={handleLogout}
              className="w-full py-3 bg-white border-2 border-slate-100 hover:border-slate-300 text-slate-600 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>

          <p className="text-xs text-slate-400">
            User ID: <span className="font-mono bg-slate-100 px-1 rounded">{user?.id?.slice(0,8)}...</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default VerificationPending;