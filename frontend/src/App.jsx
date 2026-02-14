import { Routes, Route, BrowserRouter, Outlet } from "react-router-dom";

/* ================= PAGES ================= */
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/SignupPage";

import Dashboard from "./pages/Dashboard";
import SafetyMap from "./pages/SafetyMap";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import PoliceLayout from "./layouts/PoliceLayout";

import LawyerDashboard from "./pages/lawyer/LawyerDashboard";
import CaseManagement from "./pages/lawyer/CaseManagement";

/* ================= LAYOUTS ================= */
import DashboardLayout from "./layouts/DashboardLayout";
import LawyerLayout from "./layouts/LawyerLayout";
import ProfileLayout from "./layouts/ProfileLayout";

/* ================= CONTEXT ================= */
import { ThemeProvider } from "./context/themeContext";
import { AuthProvider } from "./context/Authcontext";
import LawyerDashboard from "./pages/lawyer/LawyerDashboard";
import LawyerLayout from "./layouts/LawyerLayout";
import Schedule from "./pages/lawyer/schedule/Schedule";
// Layouts & Protection
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PoliceDashboard from "./pages/police/PoliceDashboard";
import ComplaintPage from "./pages/ComplaintPage";

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
              <Route path="/lawyer/schedule" element={<Schedule />} />
            <Route
              element={
                <ProtectedRoute>
                  <PoliceLayout>
                    <Outlet />
                  </PoliceLayout>
                </ProtectedRoute>
              }
            >
              <Route path="/police-dashboard" element={<PoliceDashboard />} />
              {/* Add other police pages here later */}
            </Route>

            {/* ================= LAWYER PROTECTED ROUTES ================= */}
            <Route
              element={
                <ProtectedRoute>
                  <LawyerLayout>
                    <Outlet />
                  </LawyerLayout>
                </ProtectedRoute>
              }
            >
              <Route
                path="/lawyer/legal-dashboard"
                element={<LawyerDashboard />}
              />

              <Route
                path="/lawyer/cases"
                element={<CaseManagement />}
              />
            </Route>

            {/* ================= USER PROTECTED ROUTES ================= */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Outlet />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/map" element={<SafetyMap />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/complaint" element={<ComplaintPage/>} />
            </Route>

            {/* ================= PROFILE ROUTES ================= */}
            <Route
              element={
                <ProtectedRoute>
                  <ProfileLayout>
                    <Outlet />
                  </ProfileLayout>
                </ProtectedRoute>
              }
            >
              <Route path="/profile" element={<Profile />} />
              <Route
                path="/profile/security"
                element={
                  <div className="p-10">
                    Security Settings (Coming Soon)
                  </div>
                }
              />
            </Route>

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
