import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTheme } from "../context/themeContext";
import { useAuth } from "../context/Authcontext";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  BadgeCheck,
  AlertCircle,
  Calendar,
  Home,
  IdCard,
  Building2,
  FileText,
} from "lucide-react";

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
  const { user, session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [firCount, setFirCount] = useState(0);
  const [draftCount, setDraftCount] = useState(0);
  const scalesBgUrl = "/scale.png";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    watch,
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
  const displayName = watch("full_name") || user?.user_metadata?.full_name || (user?.email || "").split("@")[0];
  const initials = (displayName || "")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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
    reset((prev) => ({ ...prev, home_station: computeHomeStation(address) }));
  }, [address]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const { data: profileRows } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .limit(1);

        const base = {
          full_name: user.user_metadata?.full_name || "",
          email: user.email || "",
          phone: user.user_metadata?.phone || "",
          aadhar_verified: profileRows?.[0]?.aadhar_verified || false,
          dob: profileRows?.[0]?.dob || "",
          gender: profileRows?.[0]?.gender || "",
          address: profileRows?.[0]?.address || "",
          home_station:
            profileRows?.[0]?.home_station ||
            computeHomeStation(profileRows?.[0]?.address || ""),
          user_id: user.id,
        };
        if (mounted) reset(base);

        const { data: firs } = await supabase
          .from("firs")
          .select("id")
          .eq("user_id", user.id);
        const { data: drafts } = await supabase
          .from("documents")
          .select("id")
          .eq("user_id", user.id);

        if (mounted) {
          setFirCount(Array.isArray(firs) ? firs.length : 0);
          setDraftCount(Array.isArray(drafts) ? drafts.length : 0);
        }
      } catch (_err) {
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [user, reset, computeHomeStation]);

  const onSubmit = async (values) => {
    if (!user) return;
    setSaving(true);
    try {
      await supabase.from("profiles").upsert(
        {
          user_id: user.id,
          full_name: values.full_name,
          phone: values.phone,
          aadhar_verified: !!values.aadhar_verified,
          dob: values.dob,
          gender: values.gender,
          address: values.address,
          home_station: computeHomeStation(values.address),
        },
        { onConflict: "user_id" }
      );

      if (values.email && values.email !== user.email) {
        try {
          await supabase.auth.updateUser({
            email: values.email,
            data: {
              full_name: values.full_name,
              phone: values.phone,
            },
          });
        } catch (_e) {}
      } else {
        try {
          await supabase.auth.updateUser({
            data: {
              full_name: values.full_name,
              phone: values.phone,
            },
          });
        } catch (_e) {}
      }
      reset({ ...values, home_station: computeHomeStation(values.address), user_id: user.id });
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
        {/* <Navbar /> */}
        <div className="h-24" />
        <div className="max-w-7xl mx-auto px-6 py-24">
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
              {initials || "U"}
            </div>
            <div>
              <h1
                className={`text-2xl md:text-3xl font-serif-heading font-bold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Identity & Safety
              </h1>
              <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Verification and emergency readiness
              </p>
            </div>
          </div>
          {user && <VerifiedBadge verified={watch("aadhar_verified")} />}
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`grid grid-cols-1 lg:grid-cols-3 gap-6`}
        >
          <section
            className={`lg:col-span-2 px-6 py-6 rounded-2xl border ${
              isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-white/40"
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-bold">Core Identity</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-2">
                <span className="text-sm">Full Name</span>
                <input
                  className="w-full px-4 py-2 rounded-lg border bg-transparent"
                  {...register("full_name", { required: true })}
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm">Email</span>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <input
                    className="w-full px-4 py-2 rounded-lg border bg-transparent"
                    {...register("email", { required: true })}
                  />
                </div>
              </label>
              <label className="space-y-2">
                <span className="text-sm">Phone Number</span>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <input
                    className="w-full px-4 py-2 rounded-lg border bg-transparent"
                    {...register("phone", { required: true })}
                  />
                </div>
              </label>
              <label className="space-y-2">
                <span className="text-sm">User ID</span>
                <input
                  disabled
                  className="w-full px-4 py-2 rounded-lg border bg-transparent"
                  {...register("user_id")}
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm">Aadhar Status</span>
                <div className="flex items-center gap-3">
                  <VerifiedBadge verified={watch("aadhar_verified")} />
                  <input
                    type="checkbox"
                    className="rounded"
                    {...register("aadhar_verified")}
                  />
                  <span className="text-xs">Toggle for demo</span>
                </div>
              </label>
            </div>
          </section>

          <section
            className={`px-6 py-6 rounded-2xl border ${
              isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-white/40"
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-bold">Activity Snapshot</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>FIRs Filed</span>
                <span className="font-bold">{firCount} Open Cases</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Documents Drafted</span>
                <span className="font-bold">{draftCount} Saved Drafts</span>
              </div>
            </div>
          </section>

          <section
            className={`lg:col-span-3 px-6 py-6 rounded-2xl border ${
              isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-white/40"
            }`}
          >
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
                    className="w-full px-4 py-2 rounded-lg border bg-transparent"
                    {...register("dob", { required: true })}
                  />
                </div>
              </label>
              <label className="space-y-2">
                <span className="text-sm">Gender</span>
                <select
                  className="w-full px-4 py-2 rounded-lg border bg-transparent"
                  {...register("gender", { required: true })}
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label className="space-y-2 md:col-span-1">
                <span className="text-sm">Permanent Address</span>
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-slate-500" />
                  <input
                    className="w-full px-4 py-2 rounded-lg border bg-transparent"
                    placeholder="House, Street, City, State"
                    {...register("address", { required: true })}
                  />
                </div>
              </label>
              <div className="md:col-span-2">
                <span className="text-sm">Home Station</span>
                <input
                  disabled
                  className="w-full px-4 py-2 rounded-lg border bg-transparent"
                  {...register("home_station")}
                />
              </div>
            </div>
          </section>

          <div className="lg:col-span-3 flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={saving}
              className={`px-6 py-3 rounded-full font-bold ${
                isDark
                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                  : "bg-slate-900 hover:bg-black text-white"
              }`}
            >
              {saving ? "Saving..." : isDirty ? "Save Changes" : "Saved"}
            </button>
          </div>
        </form>

        {loading && (
          <div className="mt-6 text-sm">
            Loading profile...
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
