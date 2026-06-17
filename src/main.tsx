import { QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";

import { Toaster } from "@/components/ui/sonner";
import { queryClient } from "@/api/queryClient";
import { App } from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <Toaster richColors />
  </QueryClientProvider>,
);
