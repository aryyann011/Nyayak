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

// ⚖️ LAWYER LINKS
const LAWYER_LINKS = [
  { icon: LayoutDashboard, label: "Chamber", path: "/lawyer/legal-dashboard" },
  { icon: Inbox, label: "Case Requests", path: "/lawyer/requests" },
  { icon: Briefcase, label: "My Docket", path: "/lawyer/cases" },
  { icon: ScrollText, label: "Drafting Tool", path: "/lawyer/tools" },
  { icon: Gavel, label: "Court Schedule", path: "/lawyer/schedule" },
];

const LawyerLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    // 1. OUTER CONTAINER: Locks the screen height so the window doesn't scroll.
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] dark:bg-[#0B1120] transition-colors duration-300">
      
      {/* 2. SIDEBAR: Stays FIXED on the left because it is outside the scrollable area */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        links={LAWYER_LINKS}    
        roleLabel="Advocate"    
      />

      {/* 3. SCROLLABLE AREA: This right side handles the scrolling for Navbar + Content */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        
        {/* Navbar is part of the flow, so it scrolls up when you scroll down */}
        <DashboardNavbar toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default LawyerLayout;