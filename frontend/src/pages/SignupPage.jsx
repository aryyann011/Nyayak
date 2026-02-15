import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { supabase } from "../lib/supabase"; // Direct Import
import { Mail, Lock, User, Phone, Shield, Briefcase, ArrowRight, Upload, Loader2, FileText, Building2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import justiceBg from "../assets/justice-bg.jpg";

const SignupPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState("citizen");
    const [idFile, setIdFile] = useState(null);
    const navigate = useNavigate();
    
    // We do NOT use 'signup' from useAuth() because it is returning undefined
    const { register, handleSubmit, formState: { errors } } = useForm();

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
        console.log("Starting signup for:", formData.email);

        try {
            // 1. Validation for ID Card
            if ((selectedRole === 'police' || selectedRole === 'lawyer') && !idFile) {
                toast.error("Please upload your Official ID Card.");
                setIsLoading(false);
                return;
            }

            // 2. DIRECT SUPABASE CALL (Bypassing AuthContext to fix 'undefined' error)
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

            // 3. Handle Auth Errors
            if (authError) {
                if (authError.message.includes("already registered")) {
                    toast.error("User already registered. Please login.");
                    navigate("/login");
                    return;
                }
                throw authError;
            }

            const user = authData.user;
            
            // 4. Critical Safety Check
            if (!user || !user.id) {
                console.error("Full Auth Response:", authData);
                throw new Error("Signup successful, but Supabase did not return a User ID. Check if Email Confirmation is disabled.");
            }

            console.log("User created successfully:", user.id);

            // 5. Upload ID Proof
            let idDocPath = null;
            if (selectedRole !== 'citizen' && idFile) {
                try {
                    idDocPath = await uploadIdProof(user.id, idFile);
                } catch (err) {
                    console.error("Image upload failed (non-critical):", err);
                }
            }

            // 6. Create Profile Row (Manual Upsert)
            const updatePayload = {
                id: user.id,
                email: formData.email,
                full_name: formData.fullName,
                role: selectedRole,
                phone: formData.phone,
                gov_id: formData.govId || null,
                station_code: formData.stationCode || null,
                id_document_url: idDocPath || null,
                verification_status: selectedRole === 'citizen' ? 'verified' : 'pending'
            };

            const { error: profileError } = await supabase
                .from('profiles')
                .upsert(updatePayload);

            if (profileError) {
                console.error("Profile Insert Error:", profileError);
                toast.warning("Account created, but profile sync failed.");
            }

            // 7. Success & Redirect
            if (selectedRole === 'citizen') {
                toast.success("Welcome! Redirecting...");
                navigate("/dashboard");
            } else {
                toast.info("Application submitted for verification.");
                navigate("/verification-pending");
            }

        } catch (error) {
            console.error("Signup System Error:", error);
            toast.error(error.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to catch validation errors
    const onError = (errors) => {
        console.log("Form Validation Errors:", errors);
        toast.error("Please fill in all required fields marked in red.");
    };

    return (
        <div className="min-h-screen w-full flex bg-[#FFFAF0] font-sans">
            {/* LEFT SIDE: BRANDING */}
            <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-16 overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-[center_top]" style={{ backgroundImage: `url(${justiceBg})` }} />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120]/90 via-[#0B1120]/80 to-[#0B1120]/95"></div>
                <div className="relative z-10 mt-10">
                    <h1 className="text-6xl font-bold text-white mb-8 leading-tight tracking-tight">
                        Bridging Citizens <br /> to <span className="text-orange-500 ml-4">Justice</span>
                    </h1>
                    <div className="border-l-4 border-orange-500 pl-6">
                        <p className="text-slate-200 text-lg max-w-md font-medium leading-relaxed">
                            Secure identity verification ensures that only authorized personnel handle sensitive legal data.
                        </p>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: FORM */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16 overflow-y-auto">
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <h2 className="text-4xl font-extrabold text-slate-900">Create Account</h2>
                        <p className="mt-2 text-slate-600 font-medium">Join the verified legal network.</p>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <RoleCard icon={<User size={18} />} label="Citizen" selected={selectedRole === "citizen"} onClick={() => setSelectedRole("citizen")} />
                        <RoleCard icon={<Shield size={18} />} label="Police" selected={selectedRole === "police"} onClick={() => setSelectedRole("police")} />
                        <RoleCard icon={<Briefcase size={18} />} label="Lawyer" selected={selectedRole === "lawyer"} onClick={() => setSelectedRole("lawyer")} />
                    </div>

                    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-5">
                        <InputField label="Full Name" name="fullName" icon={<User size={18} />} placeholder="John Doe" register={register} errors={errors} required />
                        <InputField label="Email Address" name="email" type="email" icon={<Mail size={18} />} placeholder="name@email.com" register={register} errors={errors} required />
                        <InputField label="Phone" name="phone" type="tel" icon={<Phone size={18} />} placeholder="+91 98765 43210" register={register} errors={errors} required />

                        {selectedRole === 'police' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <div className="grid grid-cols-2 gap-3">
                                    <InputField label="Badge No." name="govId" icon={<Shield size={16} />} placeholder="MH-P-1234" register={register} errors={errors} required />
                                    <InputField label="Station Code" name="stationCode" icon={<Building2 size={16} />} placeholder="STN-01" register={register} errors={errors} required />
                                </div>
                            </motion.div>
                        )}

                        {selectedRole === 'lawyer' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                                <InputField label="Bar Enrollment No." name="govId" icon={<FileText size={16} />} placeholder="MAH/1234/2023" register={register} errors={errors} required />
                            </motion.div>
                        )}

                        {selectedRole !== 'citizen' && (
                            <div className="group">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">Upload Official ID Card *</label>
                                <div className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors bg-white cursor-pointer ${!idFile ? 'border-slate-300 hover:border-orange-500' : 'border-emerald-500 bg-emerald-50/20'}`}>
                                    <input type="file" accept="image/*,.pdf" onChange={(e) => setIdFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="p-3 bg-slate-100 rounded-full text-slate-400">
                                            <Upload size={20} />
                                        </div>
                                        <p className="text-sm font-medium text-slate-600">
                                            {idFile ? <span className="text-emerald-600 font-bold">{idFile.name}</span> : "Click to upload ID proof"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <InputField label="Password" name="password" type="password" icon={<Lock size={18} />} placeholder="••••••••" register={register} errors={errors} required />

                        <button type="submit" disabled={isLoading} className="w-full h-14 bg-[#0B1120] hover:bg-black text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-70">
                            {isLoading ? <Loader2 className="animate-spin" size={18}/> : <>Create Account <ArrowRight size={18} /></>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// --- Helper Components ---
const RoleCard = ({ icon, label, selected, onClick }) => (
    <div onClick={onClick} className={`cursor-pointer h-20 rounded-xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all ${selected ? "border-orange-500 bg-orange-50 text-orange-700" : "border-slate-200 bg-white text-slate-400 hover:border-slate-300"}`}>
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-wide">{label}</span>
    </div>
);

const InputField = ({ label, icon, register, name, required, errors, ...props }) => (
    <div className="group">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 flex justify-between">
            <span>{label} {required && <span className="text-red-500">*</span>}</span>
            {errors?.[name] && <span className="text-red-500 normal-case flex items-center gap-1"><AlertCircle size={10} /> Required</span>}
        </label>
        <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                {icon}
            </div>
            <input 
                {...register(name, { required })}
                {...props}
                className={`w-full h-12 pl-12 pr-4 bg-white border-2 rounded-xl outline-none transition-all font-medium text-sm ${errors?.[name] ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-orange-500'}`}
            />
        </div>
    </div>
);

export default SignupPage;