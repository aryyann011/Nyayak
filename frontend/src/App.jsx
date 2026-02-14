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
import IncidentReports from "./pages/police/IncidentReports";

import LawyerDashboard from "./pages/lawyer/LawyerDashboard";
import CaseDetails from "./pages/dashboards/CaseDetails";

/* ================= LAYOUTS ================= */
import DashboardLayout from "./layouts/DashboardLayout";
import LawyerLayout from "./layouts/LawyerLayout";
import ProfileLayout from "./layouts/ProfileLayout";

/* ================= CONTEXT ================= */
import { ThemeProvider } from "./context/themeContext";
import { AuthProvider } from "./context/Authcontext";
import LawyerProfile from "./pages/dashboards/LawyerDetails";

/* ================= ROUTE PROTECTION ================= */
import ProtectedRoute from "./components/ProtectedRoute";
import PoliceDashboard from "./pages/police/PoliceDashboard";
import ComplaintPage from "./pages/dashboards/ComplaintPage";
import EmergencyLogs from "./pages/EmergencyLogs";
import FindLawyer from "./pages/dashboards/FindLawyer";

/* ================= PAYMENT ================= */
import PaymentPage from "./pages/PaymentPage";
import LawyerCaseRequests from "./pages/lawyer/CaseRequest";
import LawyerDocket from "./pages/lawyer/CaseManagement";
import CaseDrafts from "./pages/dashboards/CaseDrafts";
import PaymentSuccess from "./pages/PaymentSuccess";
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
            <Route path="/payment-success" element={<PaymentSuccess />} />

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
              <Route path="/police/reports" element={<IncidentReports/>} />
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
              <Route path="/lawyer/requests" element={<LawyerCaseRequests/>} />
              <Route
                path="/lawyer/cases"
                element={<LawyerDocket />}
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
              <Route path="/emergency-logs" element={<EmergencyLogs/>} />
              <Route path="/find-lawyer" element={<FindLawyer/>} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/cases" element={<CaseDetails />} />
              <Route path="/case-drafts" element={<CaseDrafts/>} />
              {/* <Route path="/" */}
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
