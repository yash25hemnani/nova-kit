import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { FormProvider } from "@/components/ui/form-provider";
import { useAlertStore } from "@/stores/alertStore";
import { useAuthStore } from "@/stores/authStore";
import { handleApiError } from "@/utils/handleApiError";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { loginSchema, type LoginFormValues } from "../schemas/login.schema";
import { loginMutation } from "../queries/auth.mutations";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const setAuth = useAuthStore((state) => state.setAuth);
  const showAlert = useAlertStore((s) => s.showAlert);
  const navigate = useNavigate();

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);

    try {
      const { access, user } = await loginMutation(data);

      setAuth(access, {
        id: user.id,
        company_id: user.company_id,
        full_name: user.full_name,
        user_type: user.user_type,
        email: user.email,
        role: user.role,
        force_password_change: user.force_password_change,
      });

      showAlert("Logged in successfully!", "Welcome to Warehousing by Gxpress", "success");

      navigate("/");
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit} className="space-y-4">
      {/* Email */}
      <FormInput
        name="email"
        label="Email address"
        placeholder="you@example.com"
        inputProps={{
          type: "email",
          autoComplete: "email",
          disabled: isLoading,
        }}
      />

      {/* Password */}
      <Box className="space-y-2">
        <Box className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Password</span>
          <a
            href="#"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Forgot password?
          </a>
        </Box>

        <Box className="relative">
          <FormInput
            name="password"
            placeholder="••••••••"
            inputProps={{
              type: showPassword ? "text" : "password",
              autoComplete: "current-password",
              disabled: isLoading,
              className: "pr-10",
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 -top-1 h-10 flex items-center text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </Box>
      </Box>

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        className="w-full gap-2 rounded-lg mt-2"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Logging in…
          </>
        ) : (
          <>
            Log in
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </FormProvider>
  );
};

export default LoginForm;
