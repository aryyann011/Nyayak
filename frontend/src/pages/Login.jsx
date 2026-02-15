import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/Authcontext";
import { supabase } from "../lib/supabase"; 
import { Scale, Lock, Mail, ArrowRight, Shield, User, Briefcase, Gavel, Loader2 } from "lucide-react"; // Added Gavel icon
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import justiceBg from "../assets/justice-bg.jpg";

const LoginPage = () => {
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        mode: "onBlur"
    });
    
    const auth = useAuth();
    const login = auth?.login;
    const [isLoading, setIsLoading] = useState(false);

    const loginUser = async (data) => {
        if (!login) return;
        setError("");
        setIsLoading(true);
        
        try {
            // 1. Perform Auth Login
            const response = await login(data);
            const user = response?.user || response?.session?.user;

            if (!user) throw new Error("Login failed. User not found.");

            // 2. Fetch Profile to check Verification Status & Role
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role, verification_status')
                .eq('id', user.id)
                .single();

            if (profileError) {
                console.error("Profile fetch error:", profileError);
            }

            const role = profile?.role || user.user_metadata?.role || 'citizen';
            const status = profile?.verification_status || 'pending';

            // 3. SECURITY GATEKEEPER logic
            if (status === 'pending' || status === 'rejected') {
                toast.info("Verification status: " + status.toUpperCase());
                navigate('/verification-pending', { replace: true });
                return;
            }

            // 4. Redirect based on Role
            toast.success(`Welcome back, ${role === 'admin' ? 'Admin' : 'Officer'}!`);
            
            if (role === 'admin') {
                navigate('/admin', { replace: true }); // Admin Dashboard
            } else if (role === 'police') {
                navigate('/police-dashboard', { replace: true });
            } else if (role === 'lawyer') {
                navigate('/lawyer/legal-dashboard', { replace: true });
            } else {
                navigate('/dashboard', { replace: true });
            }

        } catch (error) {
            console.error("Login process error:", error);
            setError(error.message);
            toast.error(error.message || "Login Failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDemoLogin = (role) => {
        const credentials = {
            citizen: ["citizen@demo.com", "pass1234"],
            police: ["officer@police.gov.in", "pass1234"],
            lawyer: ["advocate@law.com", "pass1234"],
            admin: ["admin@nyaya.gov.in", "pass1234"] // New Admin Credential
        };
        setValue("email", credentials[role][0]);
        setValue("password", credentials[role][1]);
    };

    return (
        <div className="min-h-screen w-full flex bg-[#FFFAF0] font-sans">
            
            {/* LEFT SIDE: BRANDING */}
            <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-16 overflow-hidden">
                <motion.div
                    initial={{ scale: 1.15, opacity: 0 }}
                    animate={{ scale: 1.05, opacity: 1 }}
                    transition={{ duration: 2.5, ease: "easeOut" }}
                    className="absolute inset-0 bg-cover bg-[center_top]"
                    style={{ backgroundImage: `url(${justiceBg})` }}
                />

                <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120]/95 via-[#0B1120]/80 to-[#0B1120]/95"></div>

                <motion.div 
                    animate={{ x: [-600, 1200], opacity: [0, 0.2, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
                />

                <div className="relative z-10">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="flex items-center gap-3 mb-12"
                    >
                        <div className="p-3 bg-orange-500/20 rounded-xl backdrop-blur-md border border-orange-500/30">
                            <Scale className="w-8 h-8 text-orange-500" />
                        </div>
                        <span className="text-2xl font-black text-white tracking-tighter">NYAYA<span className="text-orange-500">SAHAYAK</span></span>
                    </motion.div>

                    <motion.h1 
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-6xl font-extrabold text-white mb-8 leading-[1.1] tracking-tight"
                    >
                        Securing Truth, <br />
                        <motion.span 
                            initial={{ backgroundPosition: '-200% 0' }}
                            animate={{ backgroundPosition: '200% 0' }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="text-orange-500 bg-gradient-to-r from-orange-500 via-white/80 to-orange-500 bg-[length:200%_auto] bg-clip-text text-transparent"
                        >
                            Delivering Justice.
                        </motion.span>
                    </motion.h1>

                    <motion.div
                        initial={{ x: -30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="relative pl-6 border-l-2 border-orange-500/50"
                    >
                        <p className="text-slate-400 text-xl max-w-md leading-relaxed font-light italic">
                            Official portal for Citizens, Law Enforcement, and Legal professionals.
                        </p>
                    </motion.div>
                </div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="relative z-10"
                >
                    <blockquote className="text-slate-500 text-sm tracking-[0.3em] uppercase font-bold flex items-center gap-4">
                        <div className="h-px w-8 bg-slate-800"></div>
                        "Satyameva Jayate"
                    </blockquote>
                </motion.div>
            </div>

            {/* RIGHT SIDE: FORM */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16">
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md space-y-8"
                >
                    <div className="text-center lg:text-left">
                        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Sign in</h2>
                        <p className="mt-3 text-slate-500 font-medium">
                            Or <Link to="/signup" className="text-orange-600 hover:underline decoration-2 underline-offset-4">create a new account</Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(loginUser)} className="mt-8 space-y-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2 block">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                                <input 
                                    type="email"
                                    className="w-full h-14 pl-12 pr-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-medium"
                                    placeholder="name@email.com"
                                    {...register("email", { required: "Email is required" })}
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2 block">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                                <input 
                                    type="password"
                                    className="w-full h-14 pl-12 pr-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-medium"
                                    placeholder="••••••••"
                                    {...register("password", { required: "Password is required" })}
                                />
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                        </div>

                        {error && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div>
                                {error}
                            </motion.div>
                        )}

                        <motion.button 
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit" 
                            disabled={isLoading}
                            className="w-full h-14 bg-[#0B1120] hover:bg-black text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200 disabled:opacity-70"
                        >
                            {isLoading ? (
                                <>Authenticating <Loader2 className="animate-spin w-4 h-4" /></>
                            ) : (
                                <>Sign in <ArrowRight className="w-4 h-4" /></>
                            )}
                        </motion.button>
                    </form>

                    {/* DEMO ACCESS SECTION */}
                    <div className="mt-10">
                        <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-[0.2em]">
                            <span className="px-4 bg-[#FFFAF0] text-slate-400 relative z-10">Quick Demo Access</span>
                            <div className="absolute inset-0 top-1/2 -translate-y-1/2 border-t border-slate-200"></div>
                        </div>

                        <div className="mt-6 grid grid-cols-4 gap-3">
                            <DemoButton icon={<User className="w-5 h-5" />} label="Citizen" onClick={() => handleDemoLogin('citizen')} />
                            <DemoButton icon={<Shield className="w-5 h-5" />} label="Police" onClick={() => handleDemoLogin('police')} />
                            <DemoButton icon={<Briefcase className="w-5 h-5" />} label="Lawyer" onClick={() => handleDemoLogin('lawyer')} />
                            
                            {/* NEW ADMIN BUTTON */}
                            <DemoButton icon={<Gavel className="w-5 h-5" />} label="Admin" highlight onClick={() => handleDemoLogin('admin')} />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const DemoButton = ({ icon, label, onClick, highlight }) => (
    <motion.button 
        whileHover={{ y: -3, backgroundColor: '#FFF' }}
        whileTap={{ scale: 0.95 }}
        type="button" 
        onClick={onClick} 
        className="flex flex-col items-center justify-center p-3 border-2 rounded-2xl transition-all group
            
            border-slate-100 bg-white/50 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/10
        "
    >
        <div className={`mb-1 transition-colors text-slate-400 group-hover:text-orange-500'`}>
            {icon}
        </div>
        <span className={`text-[9px] font-bold uppercase tracking-wider  'text-slate-500 group-hover:text-orange-700'`}>
            {label}
        </span>
    </motion.button>
);

export default LoginPage;