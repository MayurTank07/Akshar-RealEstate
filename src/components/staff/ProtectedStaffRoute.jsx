import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useStaffAuth } from "../../contexts/useStaffAuth";

export default function ProtectedStaffRoute({ roles }) {
  const location = useLocation();
  const { booting, isStaffAuthenticated, staffUser } = useStaffAuth();

  if (booting) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 text-sm font-bold text-slate-500">
        Loading staff session...
      </div>
    );
  }

  if (!isStaffAuthenticated) {
    return <Navigate to="/stafflogin" replace state={{ from: location }} />;
  }

  if (roles?.length && !roles.includes(staffUser.role)) {
    const fallback = staffUser.role === "admin" ? "/admin/dashboard" : "/supervisor/dashboard";
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}
