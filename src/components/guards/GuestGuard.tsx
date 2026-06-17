import { useAuthStore } from "@/stores/authStore";
import { Navigate, Outlet } from "react-router-dom";

export default function GuestGuard() {
  const accessToken = useAuthStore((s) => s.accessToken);

  // already logged in → go dashboard
  if (accessToken) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
