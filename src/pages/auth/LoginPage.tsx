import { Box } from "@/components/ui/box";
import LoginForm from "./forms/LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <Box className="mb-1">
        <img
          src="/gxpress.svg"
          alt="Gxpress"
          className="h-32 w-auto object-contain"
        />
      </Box>

      {/* Card */}
      <Box className="w-full max-w-sm rounded-xl border border-border/60 bg-card shadow-sm p-8 space-y-6">
        {/* Heading */}
        <Box className="space-y-1 flex flex-col items-center">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Log in to your account to continue
          </p>
        </Box>

        <LoginForm />

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground pt-1">
          Don't have an account?{" "}
          <a
            href="#"
            className="text-foreground font-medium hover:underline underline-offset-4"
          >
            Contact your admin
          </a>
        </p>
      </Box>

      {/* Page footer */}
      <p className="mt-8 text-xs text-muted-foreground">
        © {new Date().getFullYear()} Gxpress. All rights reserved.
      </p>
    </div>
  );
};

export default LoginPage;
