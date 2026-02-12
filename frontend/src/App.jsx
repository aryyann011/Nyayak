import { Routes, Route, BrowserRouter } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { ThemeProvider } from "./context/themeContext";
import { AuthProvider } from "./context/Authcontext";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider> 
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
