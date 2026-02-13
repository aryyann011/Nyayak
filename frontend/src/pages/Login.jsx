import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/Authcontext"; // <--- FIXED CASING
import { Scale, Lock, Mail, ArrowRight, Shield, User, Briefcase } from "lucide-react";
import { toast } from "react-toastify";

const LoginPage = () => {
    const [error, setError] = useState("");
    const navigate = useNavigate();
    
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        mode: "onBlur"
    });
    
    const auth = useAuth();
    const login = auth?.login;
    const loginWithGoogle = auth?.loginWithGoogle;

    const [isLoading, setIsLoading] = useState(false);

    const loginUser = async (data) => {
        if (!login) {
            console.error("Auth context is missing!");
            return;
        }
        setError("");
        setIsLoading(true);
        try {
            const { user, session } = await login(data); // Get user/session from response
            
            if (user || session) {
                toast.success("Welcome back!");
                
                // --- LOGIC: CHECK ROLE & REDIRECT ---
                // We check the metadata stored in Supabase Auth
                const role = user?.user_metadata?.role || session?.user?.user_metadata?.role;

                if (role === 'police') {
                    navigate('/police-dashboard', { replace: true });
                } else if (role === 'lawyer') {
                    navigate('/lawyer/legal-dashboard', { replace: true });
                } else {
                    navigate('/dashboard', { replace: true });
                }
            }
        } catch (error) {
            setError(error.message);
            toast.error("Login Failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        if (!loginWithGoogle) return;
        try {
            await loginWithGoogle();
        } catch (error) {
            console.log(error);
            toast.error("Google Login Failed");
        }
    };

    const handleDemoLogin = (role) => {
        if (role === 'citizen') {
            setValue("email", "citizen@demo.com"); 
            setValue("password", "pass1234");      
        } else if (role === 'police') {
            setValue("email", "officer@police.gov.in"); 
            setValue("password", "pass1234");       
        } else {
            setValue("email", "advocate@law.com"); 
            setValue("password", "pass1234");       
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-[#FFFAF0]">
            {/* LEFT SIDE: BRANDING */}
            <div className="hidden lg:flex w-1/2 bg-[#0B1120] relative flex-col justify-between p-12 overflow-hidden">
                <div className="absolute inset-0 opacity-20" 
                     style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '32px 32px' }}>
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="p-2 bg-orange-500/20 rounded-lg">
                            <Scale className="w-6 h-6 text-orange-500" />
                        </div>
                        {/* <span className="text-2xl font-bold text-white tracking-tight">NyayaSahayak</span> */}
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                        Not sure what to put here <br/>
                        {/* at the speed of <span className="text-orange-500">Trust.</span> */}
                    </h1>
                    {/* <p className="text-slate-400 text-lg max-w-md">
                        Secure access for Citizens, Law Enforcement, and Judiciary professionals.
                    </p> */}
                </div>
                <div className="relative z-10">
                    <blockquote className="text-slate-500 italic border-l-2 border-orange-500 pl-4">
                        "Satyameva Jayate"
                    </blockquote>
                </div>
            </div>

            {/* RIGHT SIDE: FORM */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900">Sign in to your account</h2>
                        <p className="mt-2 text-slate-600">
                            Or <Link to="/signup" className="font-bold text-orange-600 hover:text-orange-500">create a new account</Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(loginUser)} className="mt-8 space-y-6">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-700">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input 
                                    type="email"
                                    className="w-full h-12 pl-10 pr-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                    placeholder="name@email.com"
                                    {...register("email", { required: "Email is required" })}
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-700">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input 
                                    type="password"
                                    className="w-full h-12 pl-10 pr-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                    placeholder="••••••••"
                                    {...register("password", { required: "Password is required" })}
                                />
                            </div>
                            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full h-12 bg-slate-900 hover:bg-black text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? "Signing in..." : "Sign in"}
                            {!isLoading && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-[#FFFAF0] text-slate-500">Quick Demo Login</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-3 gap-3">
                            <DemoButton icon={<User className="w-4 h-4" />} label="Citizen" onClick={() => handleDemoLogin('citizen')} />
                            <DemoButton icon={<Shield className="w-4 h-4" />} label="Police" onClick={() => handleDemoLogin('police')} />
                            <DemoButton icon={<Briefcase className="w-4 h-4" />} label="Lawyer" onClick={() => handleDemoLogin('lawyer')} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DemoButton = ({ icon, label, onClick }) => (
    <button type="button" onClick={onClick} className="flex flex-col items-center justify-center p-3 border border-slate-200 bg-white hover:border-orange-300 hover:bg-orange-50 rounded-xl transition-all group">
        <div className="mb-1 text-slate-400 group-hover:text-orange-600">{icon}</div>
        <span className="text-xs font-semibold text-slate-600 group-hover:text-orange-700">{label}</span>
    </button>
);

export default LoginPage;