import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTheme } from "../../context/themeContext";
import { useAuth } from "../../context/Authcontext";
import { supabase } from "../../lib/supabase";
import {
  User,
  Mail,
  Phone,
  BadgeCheck,
  Briefcase,
  Building2,
  BookOpen,
  Star,
  MessageSquare,
  IndianRupee,
  CalendarClock,
  Camera,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";

export default function LawyerProfile() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const scalesBgUrl = "/scale.png";

  const {
    register,
    handleSubmit,
    watch,
    formState: { isDirty },
    reset,
  } = useForm({
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      bar_reg_no: "",
      specialization: "",
      years_practice: "",
      court_name: "",
      education: "",
      rating: "",
      reviews: "",
      consultation_fee: "",
      availability: "",
      verified: false,
    },
    mode: "onBlur",
  });

  const displayName = watch("full_name") || (user?.email || "").split("@")[0];
  const initials = (displayName || "")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // --- 1. FETCH DATA (Pre-fill from Signup) ---
  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        if (mounted && data) {
          // Load Avatar
          if (data.avatar_url) {
            const { data: imgData } = await supabase.storage
              .from("avatars")
              .createSignedUrl(data.avatar_url, 3600);
            if (imgData) setAvatarUrl(imgData.signedUrl);
          }

          // PRE-FILL LOGIC
          // If bar_reg_no is empty in profile, try to use gov_id (from signup)
          const barId = data.bar_reg_no || data.gov_id || "";

          reset({
            full_name: data.full_name || "",
            email: data.email || user.email,
            phone: data.phone || "",
            bar_reg_no: barId, 
            specialization: data.specialization || "",
            years_practice: data.years_practice || "",
            court_name: data.court_name || "",
            education: data.education || "",
            rating: data.rating || "",
            reviews: data.reviews || "",
            consultation_fee: data.consultation_fee || "",
            availability: data.availability || "",
            verified: data.verification_status === "verified",
          });
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    }

    loadProfile();
    return () => { mounted = false; };
  }, [user, reset]);

  // --- 2. HANDLE PHOTO UPLOAD ---
  const onPhotoChange = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from("profiles")
        .update({ avatar_url: filePath })
        .eq("id", user.id);

      if (dbError) throw dbError;

      const { data: imgData } = await supabase.storage
        .from("avatars")
        .createSignedUrl(filePath, 3600);
        
      setAvatarUrl(imgData?.signedUrl);
      toast.success("Photo updated!");

    } catch (error) {
      toast.error("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // --- 3. SAVE (Partial Save Allowed) ---
  const onSubmit = async (values) => {
    setSaving(true);
    try {
      const updates = {
        id: user.id,
        full_name: values.full_name,
        phone: values.phone,
        bar_reg_no: values.bar_reg_no,
        specialization: values.specialization,
        years_practice: values.years_practice,
        court_name: values.court_name,
        education: values.education,
        rating: values.rating,
        reviews: values.reviews,
        consultation_fee: values.consultation_fee,
        availability: values.availability,
        updated_at: new Date(),
      };

      const { error } = await supabase
        .from("profiles")
        .upsert(updates);

      if (error) throw error;

      toast.success("Profile saved!");
      reset(values); 
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`relative w-full ${isDark ? "text-slate-100" : "text-slate-900"}`}>
      {/* Background - Fixed Layout */}
      <div
        className={`fixed inset-0 pointer-events-none z-0 bg-center bg-no-repeat bg-contain transition-opacity duration-500 ${
          isDark ? "opacity-[0.03] invert" : "opacity-[0.05]"
        }`}
        style={{ backgroundImage: `url(${scalesBgUrl})` }}
      />

      <div className="relative z-10 max-w-7xl mx-auto py-6">
        
        {/* Header */}
        <div className={`mb-8 flex items-center justify-between px-6 py-4 rounded-2xl border backdrop-blur-md ${isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-white/40"}`}>
          <div className="flex items-center gap-4">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold ${isDark ? "bg-orange-500/20 text-orange-400" : "bg-orange-100 text-orange-600"}`}>
              {initials}
            </div>
            <div>
              <h1 className={`text-2xl md:text-3xl font-serif-heading font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                Lawyer Profile
              </h1>
              <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Professional details and availability
              </p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${watch("verified") ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
            <BadgeCheck className="w-4 h-4" />
            {watch("verified") ? "Verified" : "Pending"}
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Photo Section */}
          <section className={`px-6 py-6 rounded-2xl border lg:col-span-1 flex flex-col items-center ${isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-white/40"}`}>
            <div className="flex items-center gap-2 mb-4 w-full">
              <Camera className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-bold">Profile Photo</h2>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <div className={`h-32 w-32 rounded-full ring-4 ring-orange-100 overflow-hidden flex items-center justify-center font-bold bg-slate-200`}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-4xl text-slate-400">{initials}</span>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="animate-spin text-white" />
                    </div>
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
                  <Camera className="text-white w-8 h-8" />
                  <input type="file" accept="image/*" onChange={onPhotoChange} className="hidden" disabled={uploading} />
                </label>
              </div>
              <div className="w-full text-center text-xs font-bold px-4 py-2 rounded-lg border bg-transparent cursor-pointer hover:border-orange-400 transition-colors">
                 {uploading ? "Uploading..." : "Click to Update"}
              </div>
            </div>
          </section>

          {/* Identity Section */}
          <section className={`px-6 py-6 rounded-2xl border lg:col-span-2 ${isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-white/40"}`}>
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-bold">Identity</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-2">
                <span className="text-sm">Full Name</span>
                <input className="w-full px-4 py-2 rounded-lg border bg-transparent" {...register("full_name")} />
              </label>
              <label className="space-y-2">
                <span className="text-sm">Email</span>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <input className="w-full px-4 py-2 rounded-lg border bg-transparent opacity-70" {...register("email")} disabled />
                </div>
              </label>
              <label className="space-y-2">
                <span className="text-sm">Phone Number</span>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <input className="w-full px-4 py-2 rounded-lg border bg-transparent" {...register("phone")} />
                </div>
              </label>
              <label className="space-y-2">
                <span className="text-sm">Verification Status</span>
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="rounded" {...register("verified")} disabled />
                  <span className="text-xs">Status Locked</span>
                </div>
              </label>
            </div>
          </section>

          {/* Professional Details */}
          <section className={`px-6 py-6 rounded-2xl border lg:col-span-3 ${isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-white/40"}`}>
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-bold">Professional Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <label className="space-y-2 md:col-span-1">
                <span className="text-sm">Bar Reg. No</span>
                <input className="w-full px-4 py-2 rounded-lg border bg-transparent" {...register("bar_reg_no")} placeholder="From Signup" />
              </label>
              <label className="space-y-2 md:col-span-1">
                <span className="text-sm">Specialization</span>
                <select className="w-full px-4 py-2 rounded-lg border bg-transparent bg-opacity-10" {...register("specialization")}>
                  <option value="" className="text-slate-900">Select</option>
                  <option value="Criminal" className="text-slate-900">Criminal</option>
                  <option value="Civil" className="text-slate-900">Civil</option>
                  <option value="Cyber" className="text-slate-900">Cyber</option>
                  <option value="Family" className="text-slate-900">Family</option>
                  <option value="Corporate" className="text-slate-900">Corporate</option>
                  <option value="IPR" className="text-slate-900">IPR</option>
                  <option value="Tax" className="text-slate-900">Tax</option>
                </select>
              </label>
              <label className="space-y-2 md:col-span-1">
                <span className="text-sm">Years of Practice</span>
                <input type="number" min="0" className="w-full px-4 py-2 rounded-lg border bg-transparent" {...register("years_practice")} />
              </label>
              <label className="space-y-2 md:col-span-1">
                <span className="text-sm">Court Name</span>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  <input className="w-full px-4 py-2 rounded-lg border bg-transparent" {...register("court_name")} />
                </div>
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm">Education</span>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-slate-500" />
                  <input className="w-full px-4 py-2 rounded-lg border bg-transparent" placeholder="LL.B, LL.M" {...register("education")} />
                </div>
              </label>
              <label className="space-y-2 md:col-span-1">
                <span className="text-sm">Ratings</span>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-slate-500" />
                  <input type="number" min="0" max="5" step="0.1" className="w-full px-4 py-2 rounded-lg border bg-transparent" {...register("rating")} />
                </div>
              </label>
              <label className="space-y-2 md:col-span-1">
                <span className="text-sm">Consultation Fee (₹)</span>
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-slate-500" />
                  <input type="number" min="0" className="w-full px-4 py-2 rounded-lg border bg-transparent" {...register("consultation_fee")} />
                </div>
              </label>
            </div>
          </section>

          {/* Availability */}
          <section className={`px-6 py-6 rounded-2xl border lg:col-span-3 ${isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-white/40"}`}>
            <div className="flex items-center gap-2 mb-4">
              <CalendarClock className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-bold">Availability Schedule</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-2">
                <span className="text-sm">Availability</span>
                <textarea rows="4" className="w-full px-4 py-2 rounded-lg border bg-transparent" placeholder="Mon–Fri, 10 AM – 6 PM; Sat by appointment" {...register("availability")} />
              </label>
            </div>
          </section>

          <div className="lg:col-span-3 flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={saving}
              className={`px-8 py-3 rounded-full font-bold transition-all disabled:opacity-50 ${
                isDark ? "bg-orange-500 hover:bg-orange-600 text-white" : "bg-slate-900 hover:bg-black text-white"
              }`}
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4" /> Saving...
                </span>
              ) : isDirty ? "Save Changes" : "Saved"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}