import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTheme } from "../../context/themeContext";
import { useAuth } from "../../context/Authcontext";
import {
  User,
  Mail,
  Phone,
  BadgeCheck,
  IdCard,
  Building2,
  Shield,
  MapPin,
  Briefcase,
  Camera,
} from "lucide-react";

export default function PoliceProfile() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const scalesBgUrl = "/scale.png";

  const {
    register,
    handleSubmit,
    watch,
    formState: { isDirty },
    reset,
  } = useForm({
    defaultValues: {
      full_name: user?.user_metadata?.full_name || "",
      email: user?.email || "",
      phone: user?.user_metadata?.phone || "",
      badge_id: "",
      badge_number: "",
      station_name: "",
      rank: "",
      department: "",
      city: "",
      state: "",
      years_experience: "",
      verified: true,
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

  const onSubmit = async (values) => {
    setSaving(true);
    try {
      // Placeholder: Integrate with backend later
      // For now, just simulate a save and keep values in form
      await new Promise((r) => setTimeout(r, 600));
      reset(values);
    } finally {
      setSaving(false);
    }
  };

  const onPhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
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
            <section
              className={`px-6 py-6 rounded-2xl border lg:col-span-1 ${
                isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-white/40"
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <Camera className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-bold">Profile Photo</h2>
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div
                    className={`h-28 w-28 rounded-full ring-2 ring-orange-200 overflow-hidden flex items-center justify-center font-bold ${
                      isDark ? "bg-orange-500/20 text-orange-400" : "bg-orange-50 text-orange-600"
                    }`}
                  >
                    {photoPreview ? (
                      <img src={photoPreview} alt="preview" className="h-full w-full object-cover" />
                    ) : (
                      initials || "OF"
                    )}
                  </div>
                </div>
                <label className="w-full">
                  <div className="w-full text-center text-xs font-bold px-4 py-2 rounded-lg border bg-transparent cursor-pointer hover:border-orange-400 transition-colors">
                    Upload Photo
                  </div>
                  <input type="file" accept="image/*" onChange={onPhotoChange} className="hidden" />
                </label>
              </div>
            </section>

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
                <label className="space-y-2">
                  <span className="text-sm">Full Name</span>
                  <input className="w-full px-4 py-2 rounded-lg border bg-transparent" {...register("full_name", { required: true })} />
                </label>
                <label className="space-y-2">
                  <span className="text-sm">Email</span>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <input className="w-full px-4 py-2 rounded-lg border bg-transparent" {...register("email", { required: true })} />
                  </div>
                </label>
                <label className="space-y-2">
                  <span className="text-sm">Phone Number</span>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <input className="w-full px-4 py-2 rounded-lg border bg-transparent" {...register("phone", { required: true })} />
                  </div>
                </label>
                <label className="space-y-2">
                  <span className="text-sm">Verification Status</span>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="rounded" {...register("verified")} />
                    <span className="text-xs">Toggle Verified</span>
                  </div>
                </label>
              </div>
            </section>

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
                <label className="space-y-2 md:col-span-1">
                  <span className="text-sm">Badge ID / Reg. ID</span>
                  <input className="w-full px-4 py-2 rounded-lg border bg-transparent" {...register("badge_id", { required: true })} />
                </label>
                <label className="space-y-2 md:col-span-1">
                  <span className="text-sm">Badge Number</span>
                  <input className="w-full px-4 py-2 rounded-lg border bg-transparent" {...register("badge_number")} />
                </label>
                <label className="space-y-2 md:col-span-1">
                  <span className="text-sm">Rank</span>
                  <select className="w-full px-4 py-2 rounded-lg border bg-transparent" {...register("rank", { required: true })}>
                    <option value="">Select</option>
                    <option value="Director General of Police">Director General of Police</option>
                    <option value="Additional Director General">Additional Director General</option>
                    <option value="Inspector General">Inspector General</option>
                    <option value="Deputy Inspector General">Deputy Inspector General</option>
                    <option value="Senior Superintendent">Senior Superintendent</option>
                    <option value="Superintendent of Police">Superintendent of Police</option>
                    <option value="Additional SP">Additional SP</option>
                    <option value="Assistant SP">Assistant SP</option>
                    <option value="Deputy SP">Deputy SP</option>
                    <option value="Inspector">Inspector</option>
                    <option value="Sub-Inspector">Sub-Inspector</option>
                    <option value="Assistant Sub-Inspector">Assistant Sub-Inspector</option>
                    <option value="Head Constable">Head Constable</option>
                    <option value="Constable">Constable</option>
                  </select>
                </label>
                <label className="space-y-2 md:col-span-1">
                  <span className="text-sm">Years of Experience</span>
                  <input type="number" min="0" className="w-full px-4 py-2 rounded-lg border bg-transparent" {...register("years_experience", { required: true })} />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm">Department</span>
                  <select className="w-full px-4 py-2 rounded-lg border bg-transparent" {...register("department", { required: true })}>
                    <option value="">Select</option>
                    <option value="Crime Branch">Crime Branch</option>
                    <option value="Cyber Crime">Cyber Crime</option>
                    <option value="Traffic">Traffic</option>
                    <option value="Special Branch">Special Branch</option>
                    <option value="Anti-Narcotics">Anti-Narcotics</option>
                    <option value="Anti-Terrorism Squad">Anti-Terrorism Squad</option>
                    <option value="Economic Offences Wing">Economic Offences Wing</option>
                    <option value="Women & Child Safety">Women & Child Safety</option>
                    <option value="Forensic">Forensic</option>
                    <option value="Communications">Communications</option>
                    <option value="Training">Training</option>
                    <option value="Operations">Operations</option>
                  </select>
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm">Police Station Name</span>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-500" />
                    <input className="w-full px-4 py-2 rounded-lg border bg-transparent" {...register("station_name", { required: true })} />
                  </div>
                </label>
              </div>
            </section>

            <section
              className={`px-6 py-6 rounded-2xl border lg:col-span-3 ${
                isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-white/40"
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-bold">Location</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm">City</span>
                  <input className="w-full px-4 py-2 rounded-lg border bg-transparent" {...register("city", { required: true })} />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm">State</span>
                  <input className="w-full px-4 py-2 rounded-lg border bg-transparent" {...register("state", { required: true })} />
                </label>
              </div>
            </section>

            <div className="lg:col-span-3 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={saving}
                className={`px-6 py-3 rounded-full font-bold ${
                  isDark ? "bg-orange-500 hover:bg-orange-600 text-white" : "bg-slate-900 hover:bg-black text-white"
                }`}
              >
                {saving ? "Saving..." : isDirty ? "Save Changes" : "Saved"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
