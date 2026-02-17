import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/Authcontext";
import { supabase } from "../lib/supabase";
import { Scale, Lock, Mail, ArrowRight, Shield, User, Briefcase, Gavel, Loader2, AlertTriangle, X } from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import justiceBg from "../assets/justice-bg.jpg";

const LoginPage = () => {
    const [globalError, setGlobalError] = useState(""); // UI Error State
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        mode: "onChange" // Validate as user types
    });
    
    const auth = useAuth();
    const login = auth?.login;
    const [isLoading, setIsLoading] = useState(false);

    const loginUser = async (data) => {
        if (!login) return;
        setGlobalError("");
        setIsLoading(true);
        
        try {
            const response = await login(data);
            const user = response?.user || response?.session?.user;

            if (!user) throw new Error("Invalid credentials. Please try again.");

            // Fetch Profile
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role, verification_status')
                .eq('id', user.id)
                .single();

            if (profileError) console.error("Profile Error:", profileError);

            const role = profile?.role || user.user_metadata?.role || 'citizen';
            const status = profile?.verification_status || 'pending';

            if (status === 'pending' || status === 'rejected') {
                toast.warning(`Account is ${status.toUpperCase()}. Access restricted.`);
                navigate('/verification-pending', { replace: true });
                return;
            }

            toast.success("Login Successful");
            
            // Redirect Logic
            const routes = {
                admin: '/admin',
                police: '/police-dashboard',
                lawyer: '/lawyer/legal-dashboard',
                citizen: '/dashboard'
            };
            navigate(routes[role] || '/dashboard', { replace: true });

        } catch (error) {
            console.error("Login Error:", error);
            // Show user-friendly error
            setGlobalError(error.message.includes("Invalid login credentials") 
                ? "Incorrect email or password." 
                : error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDemoLogin = (role) => {
        const credentials = {
            citizen: ["citizen@demo.com", "password@_180905"],
            police: ["officer@police.gov.in", "password@_180905"],
            lawyer: ["advocate@law.com", "password@_180905"],
            admin: ["admin@nyaya.gov.in", "password@_180905"]
        };
        setValue("email", credentials[role][0]);
        setValue("password", credentials[role][1]);
        setGlobalError(""); // Clear errors on demo click
    };

    return (
        <div className="min-h-screen w-full flex bg-[#FFFAF0] font-sans">
            {/* LEFT SIDE (Branding) - Kept same as your code */}
            <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-16 overflow-hidden">
                <motion.div
                    initial={{ scale: 1.15, opacity: 0 }}
                    animate={{ scale: 1.05, opacity: 1 }}
                    transition={{ duration: 2.5 }}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${justiceBg})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120]/95 via-[#0B1120]/80 to-[#0B1120]/95"></div>
                
                {/* Branding Content */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="p-3 bg-orange-500/20 rounded-xl border border-orange-500/30">
                            <Scale className="w-8 h-8 text-orange-500" />
                        </div>
                        <span className="text-2xl font-black text-white tracking-tighter">NYAYA<span className="text-orange-500">SAHAYAK</span></span>
                    </div>
                    <h1 className="text-6xl font-extrabold text-white mb-8 leading-tight">
                        Securing Truth, <br />
                        <span className="text-orange-500">Delivering Justice.</span>
                    </h1>
                </div>
            </div>

            {/* RIGHT SIDE: FORM */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16">
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Sign in</h2>
                        <p className="mt-3 text-slate-500 font-medium">
                            Or <Link to="/signup" className="text-orange-600 hover:underline">create a new account</Link>
                        </p>
                    </div>

                    {/* GLOBAL ERROR ALERT */}
                    <AnimatePresence>
                        {globalError && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md flex items-start gap-3"
                            >
                                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <h3 className="text-sm font-bold text-red-800">Login Failed</h3>
                                    <p className="text-sm text-red-700">{globalError}</p>
                                </div>
                                <button onClick={() => setGlobalError("")}><X className="w-4 h-4 text-red-400" /></button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit(loginUser)} className="mt-8 space-y-5">
                        {/* EMAIL FIELD */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.email ? 'text-red-400' : 'text-slate-400 group-focus-within:text-orange-500'}`} />
                                <input 
                                    type="email"
                                    className={`w-full h-12 pl-12 pr-4 bg-white border-2 rounded-xl outline-none transition-all font-medium ${errors.email ? 'border-red-300 focus:border-red-500 bg-red-50/10' : 'border-slate-200 focus:border-orange-500'}`}
                                    placeholder="name@email.com"
                                    {...register("email", { 
                                        required: "Email address is required",
                                        pattern: { value: /^\S+@\S+$/i, message: "Please enter a valid email address" }
                                    })}
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs font-semibold ml-1 flex items-center gap-1"><AlertTriangle size={10} /> {errors.email.message}</p>}
                        </div>

                        {/* PASSWORD FIELD */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.password ? 'text-red-400' : 'text-slate-400 group-focus-within:text-orange-500'}`} />
                                <input 
                                    type="password"
                                    className={`w-full h-12 pl-12 pr-4 bg-white border-2 rounded-xl outline-none transition-all font-medium ${errors.password ? 'border-red-300 focus:border-red-500 bg-red-50/10' : 'border-slate-200 focus:border-orange-500'}`}
                                    placeholder="••••••••"
                                    {...register("password", { required: "Password is required" })}
                                />
                            </div>
                            {errors.password && <p className="text-red-500 text-xs font-semibold ml-1 flex items-center gap-1"><AlertTriangle size={10} /> {errors.password.message}</p>}
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full h-12 bg-[#0B1120] hover:bg-black text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
                        </button>
                    </form>

                    {/* DEMO BUTTONS */}
                    <div className="mt-8 pt-8 border-t border-slate-200">
                        <p className="text-center text-xs font-bold uppercase text-slate-400 tracking-widest mb-4">Quick Demo Access</p>
                        <div className="grid grid-cols-4 gap-2">
                            <DemoButton icon={<User size={16} />} label="Citizen" onClick={() => handleDemoLogin('citizen')} />
                            <DemoButton icon={<Shield size={16} />} label="Police" onClick={() => handleDemoLogin('police')} />
                            <DemoButton icon={<Briefcase size={16} />} label="Lawyer" onClick={() => handleDemoLogin('lawyer')} />
                            <DemoButton icon={<Gavel size={16} />} label="Admin" onClick={() => handleDemoLogin('admin')} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DemoButton = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center p-2 rounded-lg border border-slate-200 bg-white hover:border-orange-500 hover:text-orange-600 transition-all text-slate-500">
        {icon}
        <span className="text-[10px] font-bold mt-1 uppercase">{label}</span>
    </button>
);

export default LoginPage;