import { Routes, Route, BrowserRouter, Outlet } from "react-router-dom";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import SafetyMap from "./pages/SafetyMap";
import Profile from "./pages/Profile";
import ProfileLayout from "./layouts/ProfileLayout";
import Chat from "./pages/Chat"; // ✅ Chat added

// Contexts
import { ThemeProvider } from "./context/themeContext";
import { AuthProvider } from "./context/Authcontext";
import LawyerDashboard from "./pages/lawyer/LawyerDashboard";
import LawyerLayout from "./layouts/LawyerLayout";
// Layouts & Protection
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>

            {/* ================= PUBLIC ROUTES ================= */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* 🔒 PROTECTED APP SHELL */}
            {/* This single Route wraps ALL protected pages with Layout & Auth Check */}
            <Route element={
              <ProtectedRoute>
                <LawyerLayout>
                  <Outlet />
                </LawyerLayout>
              </ProtectedRoute>
            }>
              {/* The Chamber (Main Dashboard) */}
              <Route path="/lawyer/legal-dashboard" element={<LawyerDashboard />} />
              
              {/* The Requests (Marketplace) */}
              {/* <Route path="/lawyer/requests" element={<LawyerRequests />} /> */}
              
              {/* Placeholders for links to prevent crashing */}
              {/* <Route path="/lawyer/cases" element={<div className="p-10">My Cases (Coming Soon)</div>} /> */}
              {/* <Route path="/lawyer/tools" element={<div className="p-10">Drafting Tools (Coming Soon)</div>} /> */}
              {/* <Route path="/lawyer/schedule" element={<div className="p-10">Court Schedule (Coming Soon)</div>} /> */}
            </Route>
            <Route element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Outlet /> {/* This renders the specific child route (Dashboard, Map, Profile) */}
                </DashboardLayout>
                
              </ProtectedRoute>
            }>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/map" element={<SafetyMap />} />
              <Route path="/chat" element={<Chat />} /> {/* ✅ Chat route */}
            </Route>
             <Route element={
              <ProtectedRoute>
                <ProfileLayout>
                  <Outlet />
                </ProfileLayout>
              </ProtectedRoute>
            }>
              {/* ✅ ADD PROFILE HERE */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/security" element={<div className="p-10">Security Settings (Coming Soon)</div>} />
              
            </Route>

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
