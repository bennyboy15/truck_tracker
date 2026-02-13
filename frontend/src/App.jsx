import FloatingShape from "./components/FloatingShape.jsx"
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import SignupPage from "./pages/SignupPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx"
import HomePage from "./pages/HomePage.jsx"
import DataPage from "./pages/DataPage.jsx"
import SchedulePage from "./pages/SchedulePage.jsx"
import CreateWorksheetPage from "./pages/CreateWorksheetPage.jsx"
import { Toaster } from "react-hot-toast"
import { useAuthStore } from "./store/authStore.js"
import { useEffect } from "react"
import LoadingSpinner from "./components/LoadingSpinner.jsx"
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx"
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx"
import AppLayout from "./components/ui/AppLayout.jsx"

// Protect routes that need authentication to access
function ProtectedRoute({children}) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace/>
  }
  
  return children;
};

// Redirect already authenticated users to the HOME page
function RedirectAuthenticatedUser({children}) {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/" replace/>
  }
  return children;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();
  const location = useLocation();
  const isAppRoute = ['/', '/data', '/schedule', '/worksheet/create'].includes(location.pathname);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div
      className={
        isAppRoute
          ? "min-h-screen"
          : "min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden"
      }
    >
      {!isAppRoute && (
        <>
          <FloatingShape color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
          <FloatingShape color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
          <FloatingShape color="bg-lime-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />
        </>
      )}

      <Routes>
        <Route path="/" element={<ProtectedRoute><AppLayout><HomePage /></AppLayout></ProtectedRoute>} />
        <Route path="/signup" element={<RedirectAuthenticatedUser><SignupPage /></RedirectAuthenticatedUser>} />
        <Route path="/login" element={<RedirectAuthenticatedUser><LoginPage /></RedirectAuthenticatedUser>} />
        <Route path="/data" element={<ProtectedRoute><AppLayout><DataPage /></AppLayout></ProtectedRoute>} />
        <Route path="/schedule" element={<ProtectedRoute><AppLayout><SchedulePage /></AppLayout></ProtectedRoute>} />
        <Route path="/worksheet/create" element={<ProtectedRoute><AppLayout><CreateWorksheetPage /></AppLayout></ProtectedRoute>} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<RedirectAuthenticatedUser><ForgotPasswordPage /></RedirectAuthenticatedUser>} />
        <Route path="/reset-password/:token" element={<RedirectAuthenticatedUser><ResetPasswordPage /></RedirectAuthenticatedUser>} />
      </Routes>
      <Toaster />
    </div>
  );

}

export default App
