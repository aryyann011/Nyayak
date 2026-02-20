import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTheme } from "../context/themeContext";
import { useAuth } from "../context/Authcontext";
import { supabase } from "../lib/supabase";
import {
  User,
  Mail,
  Phone,
  BadgeCheck,
  AlertCircle,
  Calendar,
  Home,
  Building2,
  FileText,
  Camera,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";

function VerifiedBadge({ verified }) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
        verified
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
      }`}
    >
      {verified ? <BadgeCheck className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      {verified ? "Verified" : "Unverified"}
    </span>
  );
}

export default function Profile() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  
  // Stats
  const [firCount, setFirCount] = useState(0);
  const [draftCount, setDraftCount] = useState(0);
  
  const scalesBgUrl = "/scale.png";

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      aadhar_verified: false,
      dob: "",
      gender: "",
      address: "",
      home_station: "",
      user_id: "",
    },
    mode: "onBlur",
  });

  const address = watch("address");
  const displayName = watch("full_name") || user?.email?.split("@")[0];
  const initials = (displayName || "")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // --- Dynamic Station Logic ---
  const computeHomeStation = useMemo(
    () => (addr) => {
      if (!addr) return "";
      const lower = addr.toLowerCase();
      if (lower.includes("delhi")) return "Delhi Police HQ";
      if (lower.includes("mumbai")) return "Mumbai Police HQ";
      if (lower.includes("kolkata")) return "Kolkata Police HQ";
      return "Nearest Jurisdiction Station";
    },
    []
  );

  useEffect(() => {
    if (address) setValue("home_station", computeHomeStation(address));
  }, [address, computeHomeStation, setValue]);

  // --- 1. FETCH DATA ON LOAD ---
  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!user) return;
      try {
        setLoading(true);
        
        // Fetch Profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        // Fetch Stats
        const { count: fCount } = await supabase.from("cases").select("*", { count: 'exact', head: true }).eq("user_id", user.id);
        
        if (mounted) {
          setFirCount(fCount || 0);
          
          if (profile) {
            // Load Avatar
            if (profile.avatar_url) {
                const { data: imgData } = await supabase.storage.from('avatars').createSignedUrl(profile.avatar_url, 3600);
                if (imgData) setAvatarUrl(imgData.signedUrl);
            }

            // Pre-fill Form
            reset({
              full_name: profile.full_name || "",
              email: profile.email || user.email,
              phone: profile.phone || "",
              aadhar_verified: profile.aadhar_verified || false,
              dob: profile.dob || "",
              gender: profile.gender || "",
              address: profile.address || "",
              home_station: profile.home_station || computeHomeStation(profile.address || ""),
              user_id: user.id,
            });
          }
        }
      } catch (err) {
        console.error("Profile load error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [user, reset, computeHomeStation]);

  // --- 2. HANDLE PHOTO UPLOAD ---
  const handleImageUpload = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file);
      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase.from("profiles").update({ avatar_url: filePath }).eq("id", user.id);
      if (updateError) throw updateError;

      const { data: imgData } = await supabase.storage.from("avatars").createSignedUrl(filePath, 3600);
      setAvatarUrl(imgData?.signedUrl);
      toast.success("Profile photo updated!");
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // --- 3. SAVE DATA ---
  // --- 3. SAVE DATA ---
  // --- 3. SAVE DATA ---
  const onSubmit = async (values) => {
    setSaving(true);
    try {
      const updates = {
        id: user.id,
        full_name: values.full_name,
        phone: values.phone,
        aadhar_verified: values.aadhar_verified,
        // FIX: Send null if dob is an empty string
        dob: values.dob ? values.dob : null, 
        gender: values.gender,
        address: values.address,
        home_station: values.home_station,
      };

      const { error } = await supabase.from("profiles").upsert(updates);
      if (error) throw error;

      toast.success("Profile updated!");
      reset(values);
    } catch (e) {
      console.error(e);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`relative w-full ${isDark ? "text-slate-100" : "text-slate-900"}`}>
      {/* Background */}
      <div
        className={`fixed inset-0 pointer-events-none z-0 bg-center bg-no-repeat bg-contain transition-opacity duration-500 ${
          isDark ? "opacity-[0.03] invert" : "opacity-[0.05]"
        }`}
        style={{ backgroundImage: `url(${scalesBgUrl})` }}
      />

      <div className="relative z-10 max-w-7xl mx-auto py-6">
        
        {/* Header */}
        <div
          className={`mb-8 flex items-center justify-between px-6 py-4 rounded-2xl border backdrop-blur-md ${
            isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-white/40"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="relative group">
                <div
                className={`h-16 w-16 rounded-full overflow-hidden flex items-center justify-center font-bold text-xl border-2 ${
                    isDark ? "bg-orange-500/20 border-orange-500/50 text-orange-400" : "bg-orange-100 border-orange-200 text-orange-600"
                }`}
                >
                {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : initials}
                </div>
                {/* Upload Overlay */}
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
                    <Camera className="text-white w-6 h-6" />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                </label>
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                Citizen Identity
              </h1>
              <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Verification & Emergency Details
              </p>
            </div>
          </div>
          {user && <VerifiedBadge verified={watch("aadhar_verified")} />}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={`grid grid-cols-1 lg:grid-cols-3 gap-6`}>
          
          {/* Core Identity */}
          <section className={`lg:col-span-2 px-6 py-6 rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-white/40"}`}>
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-bold">Core Identity</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-2">
                <span className="text-sm">Full Name</span>
                <input
                  className="w-full px-4 py-2 rounded-lg border bg-transparent border-slate-300 dark:border-white/10"
                  {...register("full_name")}
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm">Email</span>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <input
                    className="w-full px-4 py-2 rounded-lg border bg-transparent border-slate-300 dark:border-white/10 opacity-70"
                    {...register("email")}
                    disabled
                  />
                </div>
              </label>
              <label className="space-y-2">
                <span className="text-sm">Phone Number</span>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <input
                    className="w-full px-4 py-2 rounded-lg border bg-transparent border-slate-300 dark:border-white/10"
                    {...register("phone")}
                  />
                </div>
              </label>
              <label className="space-y-2">
                <span className="text-sm">User ID</span>
                <input
                  disabled
                  className="w-full px-4 py-2 rounded-lg border bg-transparent border-slate-300 dark:border-white/10 opacity-50"
                  {...register("user_id")}
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm">Aadhar Status</span>
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="rounded" {...register("aadhar_verified")} />
                  <span className="text-xs">Self-declare verified (Demo)</span>
                </div>
              </label>
            </div>
          </section>

          {/* Stats Snapshot */}
          <section className={`px-6 py-6 rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-white/40"}`}>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-bold">Activity Snapshot</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200/50 dark:border-white/10 bg-white/70 dark:bg-white/5 text-center">
                <div className="text-xs uppercase font-bold text-slate-500 mb-1">FIRs Filed</div>
                <div className="text-2xl font-extrabold">{firCount}</div>
              </div>
              <div className="p-4 rounded-xl border border-slate-200/50 dark:border-white/10 bg-white/70 dark:bg-white/5 text-center">
                <div className="text-xs uppercase font-bold text-slate-500 mb-1">Drafts</div>
                <div className="text-2xl font-extrabold">{draftCount}</div>
              </div>
            </div>
          </section>

          {/* Personal Details */}
          <section className={`lg:col-span-3 px-6 py-6 rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-white/40"}`}>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-bold">Personal Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="space-y-2">
                <span className="text-sm">Date of Birth</span>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <input
                    type="date"
                    className="w-full px-4 py-2 rounded-lg border bg-transparent border-slate-300 dark:border-white/10"
                    {...register("dob")}
                  />
                </div>
              </label>
              <label className="space-y-2">
                <span className="text-sm">Gender</span>
                <select
                  className="w-full px-4 py-2 rounded-lg border bg-transparent border-slate-300 dark:border-white/10"
                  {...register("gender")}
                >
                  <option value="" className="text-black">Select</option>
                  <option value="male" className="text-black">Male</option>
                  <option value="female" className="text-black">Female</option>
                  <option value="other" className="text-black">Other</option>
                </select>
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm">Permanent Address</span>
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-slate-500" />
                  <input
                    className="w-full px-4 py-2 rounded-lg border bg-transparent border-slate-300 dark:border-white/10"
                    placeholder="House, Street, City, State"
                    {...register("address")}
                  />
                </div>
              </label>
              <div className="md:col-span-2">
                <span className="text-sm">Home Station (Auto-Assigned)</span>
                <input
                  disabled
                  className="w-full px-4 py-2 rounded-lg border bg-transparent border-slate-300 dark:border-white/10 opacity-70"
                  {...register("home_station")}
                />
              </div>
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