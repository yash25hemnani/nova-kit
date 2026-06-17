import {
  Bell,
  Search,
  ChevronDown,
  Settings,
  LogOut,
  Download,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Box } from "@/components/ui/box";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import apiClient from "@/api/apiClient";
import { useAlertStore } from "@/stores/alertStore";
import { useAuthStore } from "@/stores/authStore";
import { extractApiError } from "@/utils/extractApiError";

const AppTopbar = () => {
  const showAlert = useAlertStore((s) => s.showAlert);
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const handleLogout = async () => {
    try {
      const response = await apiClient.post("/auth/logout/", {});
      if (response.status === 200) {
        logout();
        showAlert(
          "Logged out successfully!",
          "Redirecting to login page.",
          "success",
        );
      }
    } catch (error) {
      const desc = extractApiError(error);
      showAlert("Error Occured", desc, "error");
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
      <Box className="flex h-16 items-center justify-between gap-4 px-6">
        {/* Left — Search */}
        <Box className="relative flex-1 min-w-0 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search anything..."
            className="pl-9 bg-muted/80 border-border/50 focus-visible:ring-primary/20"
          />
        </Box>

        {/* Right */}
        <Box className="flex items-center gap-1">
          {/* Download App */}
          <Button
            variant="default"
            size="lg"
            className="shrink-0 gap-2 rounded-lg"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download App</span>
          </Button>

          <Separator orientation="vertical" className="mx-2 h-8 my-8" />

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-xl h-9 w-9"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
          </Button>

          <Separator orientation="vertical" className="mx-2 h-8 my-8" />

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-10 rounded-xl px-2 hover:bg-accent"
              >
                <Box className="flex items-center gap-2.5">
                  <Box className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-primary/20 to-primary/5 border border-border text-sm font-semibold text-primary shrink-0">
                    {user?.full_name
                      .split(" ")
                      .map((w) => w[0] ?? "")
                      .join("")}
                  </Box>
                  <Box className="hidden md:flex flex-col items-start leading-none gap-0.5">
                    <span className="text-sm font-medium leading-none">
                      {user?.full_name}
                    </span>
                    <span className="text-xs text-muted-foreground capitalize leading-none">
                      {user?.role.split("_").join(" ")}
                    </span>
                  </Box>
                  <ChevronDown className="hidden md:block h-3.5 w-3.5 text-muted-foreground ml-0.5" />
                </Box>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <Box className="flex items-center gap-2.5">
                  <Box className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-primary/20 to-primary/5 border border-border text-sm font-semibold text-primary shrink-0">
                    {user?.full_name
                      .split(" ")
                      .map((w) => w[0] ?? "")
                      .join("")}
                  </Box>
                  <Box className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-sm font-medium leading-none">
                      {user?.full_name}
                    </span>
                    <span className="text-xs text-muted-foreground truncate leading-none mt-0.5">
                      {user?.email}
                    </span>
                  </Box>
                </Box>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="gap-2 cursor-pointer">
                <Settings className="h-4 w-4 text-muted-foreground" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Box>
      </Box>
    </header>
  );
};

export default AppTopbar;
