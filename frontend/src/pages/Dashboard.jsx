import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/Authcontext";
import { getProfile } from "../lib/profileService"; 

// Import the sub-dashboards (We will build these next)
import CitizenDashboard from "./dashboards/CitizenDashboard";
// import PoliceDashboard from "./dashboards/PoliceDashboard"; // Placeholder
// import LawyerDashboard from "./dashboards/LawyerDashboard"; // Placeholder

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

  if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>;

  return (
    <DashboardLayout>
      {role === 'citizen' && <CitizenDashboard user={user} />}
      {role === 'police' && <div className="p-10">Police Dashboard Coming Soon</div>}
      {role === 'lawyer' && <div className="p-10">Lawyer Dashboard Coming Soon</div>}
    </DashboardLayout>
  );
};

export default Dashboard;