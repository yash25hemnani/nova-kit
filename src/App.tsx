import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import apiClient from "@/api/apiClient";
import { useAuthStore } from "@/stores/authStore";

import GuestGuard from "@/components/guards/GuestGuard";
import ProtectedRoute from "@/components/guards/ProtectedRoute";
import MainLayout from "@/layouts/MainLayout";
import LoginPage from "@/pages/auth/LoginPage";
import Dashboard from "@/pages/dashboard/Dashboard";

export const App = () => {
  const [isRestoring, setIsRestoring] = useState(true);

  const setAuth = useAuthStore((state) => state.setAuth);

  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          element: <ProtectedRoute />,
          children: [
            {
              element: <MainLayout />,
              children: [
                {
                  path: "/",
                  element: <Dashboard />,
                },
              ],
            },
          ],
        },
        {
          element: <GuestGuard />,
          children: [
            {
              path: "/login",
              element: <LoginPage />,
            },
          ],
        },
      ]),
    [],
  );

  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      try {
        const refreshRes = await apiClient.get("/auth/refresh/", {
          withCredentials: true,
        });

        if (refreshRes.status === 200 && !cancelled) {
          const { user, access } = refreshRes.data;

          setAuth(access, user);
        }
      } catch {
        // no session
      } finally {
        if (!cancelled) {
          setIsRestoring(false);
        }
      }
    };

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, [setAuth]);

  if (isRestoring) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-2 bg-background text-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Loading your session...
        </p>
      </div>
    );
  }

  return <RouterProvider router={router} />;
};
