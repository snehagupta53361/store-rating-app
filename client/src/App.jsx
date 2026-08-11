import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";
import Layout from "scenes/layout";
import Login from "scenes/login";
import Signup from "scenes/signup";
import AdminDashboard from "scenes/adminDashboard";
import StoreOwnerDashboard from "scenes/storeOwnerDashboard";
import StoreList from "scenes/stores";
import Profile from "scenes/profile";
import Analytics from "scenes/analytics";

// ─── Protected Route ───────────────────────────
const ProtectedRoute = ({ children, allowedRoles }) => {
  const currentUser = useSelector((state) => state.global.currentUser);
  if (!currentUser) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// ─── Role-based dashboard redirect ──────────────
const DashboardRouter = () => {
  const currentUser = useSelector((state) => state.global.currentUser);
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role === "ADMIN") return <AdminDashboard />;
  if (currentUser.role === "STORE_OWNER") return <StoreOwnerDashboard />;
  // Normal user → show store list as their "dashboard"
  return <StoreList />;
};

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes (inside shared Layout) */}
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* Dashboard — role-based */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardRouter />
                  </ProtectedRoute>
                }
              />

              {/* Store Directory — all roles can browse */}
              <Route
                path="/stores"
                element={
                  <ProtectedRoute>
                    <StoreList />
                  </ProtectedRoute>
                }
              />

              {/* Profile / Change Password — all roles */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Analytics — all roles (adapted dynamically) */}
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />

              {/* Admin only — redirect others to dashboard */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
