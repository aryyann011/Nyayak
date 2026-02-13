import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import { 
  LayoutDashboard, 
  Inbox, 
  Briefcase, 
  ScrollText, 
  Gavel 
} from "lucide-react";

// ⚖️ DEFINE LAWYER LINKS HERE
const LAWYER_LINKS = [
  { icon: LayoutDashboard, label: "Chamber", path: "/lawyer/dashboard" },
  { icon: Inbox, label: "Case Requests", path: "/lawyer/requests" },
  { icon: Briefcase, label: "My Docket", path: "/lawyer/cases" },
  { icon: ScrollText, label: "Drafting Tool", path: "/lawyer/tools" },
  { icon: Gavel, label: "Court Schedule", path: "/lawyer/schedule" },
];

const LawyerLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] transition-colors duration-300">
      
      {/* 1. Reuse Sidebar with Lawyer Props */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        links={LAWYER_LINKS}    // 👈 Inject Lawyer Links
        roleLabel="lawyer"    // 👈 Change Label
      />

      {/* 2. Main Content Wrapper */}
      <div 
        className={`min-h-screen flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        <DashboardNavbar toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default LawyerLayout;