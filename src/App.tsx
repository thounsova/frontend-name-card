import { Route, Routes } from "react-router";
import AuthLayout from "./components/auth-screen/login";
import LoginForm from "./components/auth-screen/login";
import DashboardLayout from "./components/Layout/dashboard-layout";
import Dashboard from "./screens/dashboard";
import Users from "./screens/users";
import Cards from "./screens/cards"; // ✅ Make sure this exists
import { useAuthStore } from "@/store/auth-store";
import { useEffect } from "react";
import ProtectedRoute from "./components/protect-route";
import Profile from "./screens/profile";

function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    checkAuth(); // Automatically run on load/refresh
    console.log(checkAuth());
    console.log("wroking");
  }, [checkAuth]);

  return (
    <Routes>
      {/* Auth Route */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginForm />} />
      </Route>

      {/* Dashboard route */}
      <Route element={<ProtectedRoute roles={["admin", "super_admin"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cards" element={<Cards />} /> {/* ✅ Added */}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
