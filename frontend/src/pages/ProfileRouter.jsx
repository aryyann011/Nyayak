import React, { useEffect, useState } from "react";
import { useAuth } from "../context/Authcontext";
import { getProfile } from "../lib/profileService";
import Profile from "./Profile";
import LawyerProfile from "./lawyer/LawyerProfile";

export default function ProfileRouter() {
  const { user } = useAuth();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function resolveRole() {
      if (!user) {
        setLoading(false);
        return;
      }
      if (user.user_metadata?.role) {
        setRole(user.user_metadata.role);
        setLoading(false);
      } else {
        const profile = await getProfile(user.id);
        setRole(profile?.role || "citizen");
        setLoading(false);
      }
    }
    resolveRole();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (role === "lawyer") {
    return <LawyerProfile />;
  }

  return <Profile />;
}
