import AppSidebar from "@/components/AppSidebar";
import AppTopbar from "@/components/AppTopbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Box } from "@/components/ui/box";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import SpeedDial from "@/components/ui/speed-dial";

const MainLayout = () => {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <SidebarProvider open={openSidebar} onOpenChange={setOpenSidebar}>
      <AppSidebar setOpenSidebar={setOpenSidebar} />
      <SidebarInset className="min-h-screen bg-background min-w-0 overflow-x-hidden">
        <AppTopbar />
        <main className="flex-1 overflow-auto">
          <Box className="p-6">
            <Outlet />
          </Box>
        </main>
        <SpeedDial />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default MainLayout;