import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTheme } from "../../context/themeContext";
import { useAuth } from "../../context/Authcontext";
import { supabase } from "../../lib/supabase"; // Ensure correct import path
import {
  User,
  Mail,
  Phone,
  BadgeCheck,
  IdCard,
  Building2,
  Shield,
  MapPin,
  Camera,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";

export default function PoliceProfile() {
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
      badge_id: "",
      badge_number: "",
      station_name: "",
      rank: "",
      department: "",
      city: "",
      state: "",
      years_experience: "",
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
          // Map 'gov_id' -> badge_number
          // Map 'station_code' -> station_name (if name is empty)
          reset({
            full_name: data.full_name || "",
            email: data.email || user.email,
            phone: data.phone || "",
            badge_id: data.badge_id || "",
            badge_number: data.badge_number || data.gov_id || "",
            station_name: data.station_name || data.station_code || "",
            rank: data.rank || "",
            department: data.department || "",
            city: data.city || "",
            state: data.state || "",
            years_experience: data.years_experience || "",
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

      // Upload
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Save Path
      const { error: dbError } = await supabase
        .from("profiles")
        .update({ avatar_url: filePath })
        .eq("id", user.id);

      if (dbError) throw dbError;

      // Update UI
      const { data: imgData } = await supabase.storage
        .from("avatars")
        .createSignedUrl(filePath, 3600);
        
      setAvatarUrl(imgData?.signedUrl);
      toast.success("Profile photo updated!");

    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload photo.");
    } finally {
      setUploading(false);
    }
  };

  // --- 3. SAVE PROFILE ---
  const onSubmit = async (values) => {
    setSaving(true);
    try {
      const updates = {
        id: user.id,
        full_name: values.full_name,
        phone: values.phone,
        badge_id: values.badge_id,
        badge_number: values.badge_number,
        station_name: values.station_name,
        rank: values.rank,
        department: values.department,
        city: values.city,
        state: values.state,
        years_experience: values.years_experience,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);
      if (error) throw error;

      toast.success("Profile saved successfully!");
      reset(values);
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 font-sans overflow-hidden relative ${
        isDark ? "bg-[#0B1120] text-slate-100" : "bg-[#FFFAF0] text-slate-900"
      }`}
    >
      <div
        className={`fixed inset-0 pointer-events-none z-0 bg-center bg-no-repeat bg-contain transition-opacity duration-500 ${
          isDark ? "opacity-[0.03] invert" : "opacity-[0.05]"
        }`}
        style={{ backgroundImage: `url(${scalesBgUrl})` }}
      />
      <div className="fixed inset-0 pointer-events-none transition-opacity duration-700">
        <div
          className={`absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full blur-[150px] mix-blend-multiply transition-colors duration-700 ${
            isDark ? "bg-indigo-900/20" : "bg-amber-200/30"
          }`}
        />
        <div
          className={`absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full blur-[150px] mix-blend-multiply transition-colors duration-700 ${
            isDark ? "bg-blue-900/20" : "bg-orange-200/30"
          }`}
        />
      </div>

      <div className="relative z-10">
        <div className="h-6 md:h-8" />
        <div className="max-w-7xl mx-auto px-6 py-10 md:py-16">
          <div
            className={`mb-8 flex items-center justify-between px-6 py-4 rounded-2xl border backdrop-blur-md ${
              isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-white/40"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`h-12 w-12 rounded-full flex items-center justify-center font-bold ${
                  isDark ? "bg-orange-500/20 text-orange-400" : "bg-orange-100 text-orange-600"
                }`}
              >
                {initials || "OF"}
              </div>
              <div>
                <h1
                  className={`text-2xl md:text-3xl font-serif-heading font-bold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Police Profile
                </h1>
                <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Verified personnel details
                </p>
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                watch("verified")
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
              }`}
            >
              <BadgeCheck className="w-4 h-4" />
              {watch("verified") ? "Verified" : "Unverified"}
            </span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Photo Section */}
            <section
              className={`px-6 py-6 rounded-2xl border lg:col-span-1 flex flex-col items-center ${
                isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-white/40"
              }`}
            >
              <div className="flex items-center gap-2 mb-4 w-full">
                <Camera className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-bold">Profile Photo</h2>
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <div
                    className={`h-32 w-32 rounded-full ring-4 ring-orange-100 overflow-hidden flex items-center justify-center font-bold bg-slate-200`}
                  >
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
                <p className="text-xs opacity-60">Click image to update</p>
              </div>
            </section>

            {/* Identity Section */}
            <section
              className={`px-6 py-6 rounded-2xl border lg:col-span-2 ${
                isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-white/40"
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-bold">Identity</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-1">
                  <span className="text-xs font-bold opacity-70 uppercase">Full Name</span>
                  <input className="w-full px-4 py-2 rounded-lg border bg-transparent" {...register("full_name")} />
                </label>
                <label className="space-y-1">
                  <span className="text-xs font-bold opacity-70 uppercase">Email</span>
                  <input className="w-full px-4 py-2 rounded-lg border bg-transparent opacity-70" {...register("email")} disabled />
                </label>
                <label className="space-y-1">
                  <span className="text-xs font-bold opacity-70 uppercase">Phone</span>
                  <input className="w-full px-4 py-2 rounded-lg border bg-transparent" {...register("phone")} />
                </label>
              </div>
            </section>

            {/* Service Details */}
            <section
              className={`px-6 py-6 rounded-2xl border lg:col-span-3 ${
                isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-white/40"
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <IdCard className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-bold">Service Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <label className="space-y-1">
                  <span className="text-xs opacity-70">Badge ID</span>
                  <input className="w-full px-4 py-2 rounded-lg border bg-transparent" {...register("badge_id")} />
                </label>
                <label className="space-y-1">
                  <span className="text-xs opacity-70">Badge No</span>
                  <input className="w-full px-4 py-2 rounded-lg border bg-transparent" {...register("badge_number")} placeholder="From Signup" />
                </label>
                <label className="space-y-1">
                  <span className="text-xs opacity-70">Rank</span>
                  <select className="w-full px-4 py-2 rounded-lg border bg-transparent bg-opacity-10" {...register("rank")}>
                    <option value="" className="text-slate-900">Select Rank</option>
                    <option value="Inspector" className="text-slate-900">Inspector</option>
                    <option value="Sub-Inspector" className="text-slate-900">Sub-Inspector</option>
                    <option value="Constable" className="text-slate-900">Constable</option>
                    <option value="Superintendent" className="text-slate-900">Superintendent</option>
                  </select>
                </label>
                <label className="space-y-1">
                  <span className="text-xs opacity-70">Station</span>
                  <input className="w-full px-4 py-2 rounded-lg border bg-transparent" {...register("station_name")} />
                </label>
                <label className="space-y-1 md:col-span-2">
                  <span className="text-xs opacity-70">City</span>
                  <input className="w-full px-4 py-2 rounded-lg border bg-transparent" {...register("city")} />
                </label>
                <label className="space-y-1 md:col-span-2">
                  <span className="text-xs opacity-70">State</span>
                  <input className="w-full px-4 py-2 rounded-lg border bg-transparent" {...register("state")} />
                </label>
              </div>
            </section>

            <div className="lg:col-span-3 flex justify-end">
              <button
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
    </div>
  );
}