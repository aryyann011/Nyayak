import React, { useEffect, useState } from "react";
import { useAuth } from "../context/Authcontext";
import { getProfile } from "../lib/profileService";

// Import the sub-dashboards
import CitizenDashboard from "./citizen/CitizenDashboard";
import LawyerDashboard from "./lawyer/LawyerDashboard";
// import PoliceDashboard from "./police/PoliceDashboard"; // Uncomment when ready

const Dashboard = () => {
  const { user } = useAuth();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
      if (user) {
        // 1. Check Metadata first (Fastest)
        if (user.user_metadata?.role) {
          setRole(user.user_metadata.role);
          setLoading(false);
        } else {
          // 2. Fallback to DB fetch (Reliable)
          const profile = await getProfile(user.id);
          setRole(profile?.role || 'citizen');
          setLoading(false);
        }
      }
    }
    fetchRole();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
            <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 font-bold text-sm tracking-widest uppercase">Loading Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {role === 'citizen' && <CitizenDashboard user={user} />}
      {role === 'lawyer' && <LawyerDashboard />}
      {role === 'police' && <div className="p-10 text-center font-bold text-slate-500">Police Dashboard Coming Soon</div>}
    </>
  );
};

export default Dashboard;