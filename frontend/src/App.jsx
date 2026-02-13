import { Routes, Route, BrowserRouter } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/Login"; // Ensure naming matches your file (Login vs LoginPage)
import SignupPage from "./pages/SignupPage";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import SafetyMap from "./pages/SafetyMap";

// Contexts
import { ThemeProvider } from "./context/themeContext"; // Capital T (Standardized)
import { AuthProvider } from "./context/Authcontext";   // Capital A (Standardized)

// Layouts & Protection
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider> 
        <BrowserRouter>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />

            {/* 🔒 PROTECTED ROUTES */}
            
            {/* 1. Dashboard (The component handles the Layout internally) */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            {/* 2. Safety Map (Needs explicit Layout wrapper) */}
            <Route 
              path="/map" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <SafetyMap />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;