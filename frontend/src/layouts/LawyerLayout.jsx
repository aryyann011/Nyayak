import React, { useState } from "react";
import { useLocation } from "react-router-dom"; // 1. Import useLocation
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
  
  // 2. Get current path
  const location = useLocation();

  // 3. Check if we are on the Drafting Tool page
  const isFullWidthPage = location.pathname.includes('/lawyer/tools');

  return (
    // 1. OUTER CONTAINER: Locks the screen height
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] dark:bg-[#0B1120] transition-colors duration-300">
      
      {/* 2. SIDEBAR */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        links={LAWYER_LINKS}    
        roleLabel="Advocate"    
      />

      {/* 3. SCROLLABLE AREA */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        
        <DashboardNavbar toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

        {/* 4. CONDITIONAL PADDING:
           If we are on the drafting page, use 'p-0' (no padding).
           Otherwise, use the standard 'p-6 md:p-8'.
        */}
        <main className={`flex-1 ${isFullWidthPage ? 'p-0' : 'p-6 md:p-8'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default LawyerLayout;