import { Routes, Route, BrowserRouter, Outlet } from "react-router-dom";

/* ================= PAGES ================= */
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/SignupPage";
import ContactPage from "./pages/Contact-page";
import AboutPage from "./pages/About";

import { NotificationProvider } from "./context/NotificationContext";
import Dashboard from "./pages/Dashboard";
import SafetyMap from "./pages/SafetyMap";
import Chat from "./pages/citizen/Chat";
import Profile from "./pages/Profile";
import PoliceLayout from "./layouts/PoliceLayout";
import IncidentReports from "./pages/police/IncidentReports";
import PoliceProfile from "./pages/police/PoliceProfile";

import LawyerDashboard from "./pages/lawyer/LawyerDashboard";
import CaseDetails from "./pages/citizen/CaseDetails";
import ProfileRouter from "./pages/ProfileRouter";
import MyCases from "./pages/citizen/citizencases";

/* ================= LAYOUTS ================= */
import DashboardLayout from "./layouts/DashboardLayout";
import LawyerLayout from "./layouts/LawyerLayout";
import ProfileLayout from "./layouts/ProfileLayout";

/* ================= CONTEXT ================= */
import { ThemeProvider } from "./context/themeContext";
import { AuthProvider } from "./context/Authcontext";
// removed duplicate LawyerProfile import from LawyerDetails

/* ================= ROUTE PROTECTION ================= */
import ProtectedRoute from "./components/ProtectedRoute";
import PoliceDashboard from "./pages/police/PoliceDashboard";
import ComplaintPage from "./pages/citizen/ComplaintPage";
import EmergencyLogs from "./pages/EmergencyLogs";
import FindLawyer from "./pages/citizen/FindLawyer";
import Casedetails from "./pages/lawyer/FiledCaseDetail";

/* ================= PAYMENT ================= */
import PaymentPage from "./pages/PaymentPage";
import LawyerCaseRequests from "./pages/lawyer/CaseRequest";
import LawyerDocket from "./pages/lawyer/MyDocket";
import CaseDrafts from "./pages/citizen/CaseDrafts";
import PaymentSuccess from "./pages/PaymentSuccess";
import Schedule from "./pages/lawyer/Schedule";
import ActiveCaseDetails from "./pages/lawyer/ActiveCaseDetail";
import VerificationPending from "./pages/VerificationPending";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminUserDetails from "./pages/Admin/AdminUserDetails";
import DraftingTool from "./pages/lawyer/DraftingTool";
import HowItWorks from "./pages/HowItWorks";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
        <NotificationProvider>
          <Routes>

            {/* ================= PUBLIC ROUTES ================= */}
            <Route path="/" element={<LandingPage />} />
            <Route path='/How-it-works' element={<HowItWorks/>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/verification-pending" element={<VerificationPending />} />

            <Route
            path="/admin"
              element={
                <ProtectedRoute>
                    <AdminDashboard />
                </ProtectedRoute>
              }
            ></Route>
            <Route path="/admin/user/:id" element={
              <ProtectedRoute>
                    <AdminUserDetails />
                </ProtectedRoute>
            } />

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
              <Route path="/police/profile" element={<PoliceProfile/>} />
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
              <Route path="/lawyer/case/:id" element={<Casedetails />} />
              <Route path="/lawyer/schedule" element={<Schedule/>} />
              <Route path="/lawyer/active-cases/:id" element={<ActiveCaseDetails/>} />
              <Route
                path="/lawyer/cases"
                element={<LawyerDocket />}
              />
              <Route path="/lawyer/tools" element={<DraftingTool />} />
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
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/cases" element={<MyCases />} />

              <Route path="/cases/:id" element={<CaseDetails />} />
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
              <Route path="/profile" element={<ProfileRouter />} />
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
          </NotificationProvider>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
