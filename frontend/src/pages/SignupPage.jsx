import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { supabase } from "../lib/supabase"; 
import { Mail, Lock, User, Phone, Shield, Briefcase, ArrowRight, Upload, Loader2, FileText, Building2, AlertTriangle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import justiceBg from "../assets/justice-bg.jpg";

const SignupPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState("citizen");
    const [idFile, setIdFile] = useState(null);
    const [globalError, setGlobalError] = useState("");
    
    const navigate = useNavigate();
    
    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: "onBlur" // Validate on blur
    });

    const uploadIdProof = async (userId, file) => {
        if (!file) return null;
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}_ID.${fileExt}`;
        const filePath = `${selectedRole}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('id_proofs')
            .upload(filePath, file, { upsert: true });

        if (uploadError) throw uploadError;
        return filePath; 
    };

    const onSubmit = async (formData) => {
        setIsLoading(true);
        setGlobalError("");

        try {
            // 1. Manual Validation for File Upload
            if ((selectedRole === 'police' || selectedRole === 'lawyer') && !idFile) {
                setGlobalError("Official ID Document is mandatory for Police and Lawyers.");
                setIsLoading(false);
                return;
            }

            // 2. SignUp
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        role: selectedRole,
                        phone: formData.phone,
                    },
                },
            });

            if (authError) throw authError;

            const user = authData.user;
            if (!user) throw new Error("Signup failed. Please check your network.");

            // 3. Upload File
            let idDocPath = null;
            if (selectedRole !== 'citizen' && idFile) {
                idDocPath = await uploadIdProof(user.id, idFile);
            }

            // 4. Create Profile
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    email: formData.email,
                    full_name: formData.fullName,
                    role: selectedRole,
                    phone: formData.phone,
                    gov_id: formData.govId || null,
                    station_code: formData.stationCode || null,
                    id_document_url: idDocPath || null,
                    verification_status: selectedRole === 'citizen' ? 'verified' : 'pending'
                });

            if (profileError) throw profileError;

            toast.success("Account created successfully!");
            navigate(selectedRole === 'citizen' ? "/dashboard" : "/verification-pending");

        } catch (error) {
            console.error("Signup Error:", error);
            setGlobalError(error.message || "Failed to create account.");
        } finally {
            setIsLoading(false);
        }
    };

    // Form Error Handler
    const onError = () => {
        toast.error("Please fix the errors in the form before submitting.");
    };

    return (
        <div className="min-h-screen w-full flex bg-[#FFFAF0] font-sans">
            {/* LEFT SIDE: BRANDING */}
            <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-16 overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${justiceBg})` }} />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120]/90 to-[#0B1120]/95"></div>
                <div className="relative z-10 mt-10">
                    <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                        Join the <span className="text-orange-500">Network</span>
                    </h1>
                    <p className="text-slate-300 text-lg max-w-md">Create an account to access legal aid, file complaints, or manage cases securely.</p>
                </div>
            </div>

            {/* RIGHT SIDE: FORM */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
                <div className="w-full max-w-lg space-y-6">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900">Create Account</h2>
                        <p className="text-slate-500 font-medium mt-1">Already have an account? <Link to="/login" className="text-orange-600 font-bold hover:underline">Log in</Link></p>
                    </div>

                    {/* ERROR BANNER */}
                    <AnimatePresence>
                        {globalError && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start gap-3 text-sm font-medium"
                            >
                                <AlertTriangle className="w-5 h-5 shrink-0" />
                                {globalError}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ROLE SELECTOR */}
                    <div className="grid grid-cols-3 gap-3">
                        {['citizen', 'police', 'lawyer'].map((role) => (
                            <div 
                                key={role}
                                onClick={() => setSelectedRole(role)} 
                                className={`cursor-pointer h-20 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${selectedRole === role ? "border-orange-500 bg-orange-50 text-orange-700" : "border-slate-200 bg-white text-slate-400 hover:border-slate-300"}`}
                            >
                                {role === 'citizen' && <User size={20} />}
                                {role === 'police' && <Shield size={20} />}
                                {role === 'lawyer' && <Briefcase size={20} />}
                                <span className="text-[10px] font-bold uppercase tracking-wide">{role}</span>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
                        <InputField 
                            label="Full Name" 
                            name="fullName" 
                            icon={<User size={18} />} 
                            placeholder="John Doe" 
                            register={register} 
                            errors={errors} 
                            validation={{ required: "Full name is required" }}
                        />
                        
                        <InputField 
                            label="Email Address" 
                            name="email" 
                            type="email" 
                            icon={<Mail size={18} />} 
                            placeholder="name@email.com" 
                            register={register} 
                            errors={errors} 
                            validation={{ 
                                required: "Email is required",
                                pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" }
                            }}
                        />
                        
                        <InputField 
                            label="Phone Number" 
                            name="phone" 
                            type="tel" 
                            icon={<Phone size={18} />} 
                            placeholder="10-digit mobile number" 
                            register={register} 
                            errors={errors} 
                            validation={{ 
                                required: "Phone number is required",
                                minLength: { value: 10, message: "Must be at least 10 digits" }
                            }}
                        />

                        {/* CONDITIONAL FIELDS */}
                        <AnimatePresence>
                            {selectedRole === 'police' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-2 gap-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
                                    <InputField label="Badge ID" name="govId" icon={<Shield size={16} />} placeholder="ID-123" register={register} errors={errors} validation={{ required: "Badge ID is required" }} />
                                    <InputField label="Station Code" name="stationCode" icon={<Building2 size={16} />} placeholder="STN-01" register={register} errors={errors} validation={{ required: "Station code is required" }} />
                                </motion.div>
                            )}
                            {selectedRole === 'lawyer' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                                    <InputField label="Bar Council ID" name="govId" icon={<FileText size={16} />} placeholder="MAH/1234/23" register={register} errors={errors} validation={{ required: "Bar Council ID is required" }} />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* FILE UPLOAD */}
                        {selectedRole !== 'citizen' && (
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500">Upload ID Card <span className="text-red-500">*</span></label>
                                <div className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${!idFile ? 'border-slate-300 hover:border-orange-500 bg-white' : 'border-emerald-500 bg-emerald-50'}`}>
                                    <input type="file" accept="image/*,.pdf" onChange={(e) => { setIdFile(e.target.files[0]); setGlobalError(""); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                    <div className="flex items-center justify-center gap-2 text-slate-500">
                                        <Upload size={18} />
                                        <span className="text-sm font-medium">{idFile ? idFile.name : "Click to upload document"}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <InputField 
                            label="Password" 
                            name="password" 
                            type="password" 
                            icon={<Lock size={18} />} 
                            placeholder="Min 6 characters" 
                            register={register} 
                            errors={errors} 
                            validation={{ 
                                required: "Password is required",
                                minLength: { value: 6, message: "Password must be at least 6 characters" }
                            }}
                        />

                        <button type="submit" disabled={isLoading} className="w-full h-12 bg-[#0B1120] hover:bg-black text-white font-bold rounded-xl flex items-center justify-center gap-2 mt-4 shadow-lg transition-all disabled:opacity-70">
                            {isLoading ? <Loader2 className="animate-spin" size={20}/> : <>Create Account <ArrowRight size={18} /></>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Reusable Input Component with Error Display
const InputField = ({ label, icon, register, name, validation, errors, ...props }) => (
    <div className="w-full">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1 block">
            {label} {validation?.required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
            <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors?.[name] ? 'text-red-400' : 'text-slate-400'}`}>
                {icon}
            </div>
            <input 
                {...register(name, validation)}
                {...props}
                className={`w-full h-12 pl-12 pr-4 bg-white border-2 rounded-xl outline-none transition-all font-medium text-sm 
                ${errors?.[name] 
                    ? 'border-red-300 focus:border-red-500 bg-red-50/10 placeholder-red-300' 
                    : 'border-slate-200 focus:border-orange-500 text-slate-900'}`}
            />
        </div>
        {errors?.[name] && (
            <p className="text-red-500 text-xs font-semibold mt-1 flex items-center gap-1">
                <AlertCircle size={10} /> {errors[name].message}
            </p>
        )}
    </div>
);

export default SignupPage;