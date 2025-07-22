import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthStore } from "@/store/auth-store";

interface ProtectedRouteProps {
  roles?: string[];
}

const ProtectedRoute = ({ roles = [] }: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthenticated, roles: userRoles, hydrated } = useAuthStore();

  if (!hydrated) {
    // Still loading auth state
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles.length > 0) {
    const hasPermission = roles.some((role) => userRoles.includes(role));
    if (!hasPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
