import { Routes, Route, BrowserRouter, Outlet } from "react-router-dom";

/* ================= PAGES ================= */
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/SignupPage";

import Dashboard from "./pages/Dashboard";
import SafetyMap from "./pages/SafetyMap";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";

import LawyerDashboard from "./pages/lawyer/LawyerDashboard";
import CaseManagement from "./pages/lawyer/CaseManagement";

/* ================= LAYOUTS ================= */
import DashboardLayout from "./layouts/DashboardLayout";
import LawyerLayout from "./layouts/LawyerLayout";
import ProfileLayout from "./layouts/ProfileLayout";

/* ================= CONTEXT ================= */
import { ThemeProvider } from "./context/themeContext";
import { AuthProvider } from "./context/Authcontext";

/* ================= ROUTE PROTECTION ================= */
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
