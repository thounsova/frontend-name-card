import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { useAuthStore } from "@/store/auth-store";
import { authRequest } from "@/lib/api/auth-api";
import type { AuthLoginForm } from "@/types/auth-type";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { LogIn } from "lucide-react";
import Cookies from "js-cookie";
import { CookieName } from "@/types";

const loginSchema = z.object({
  user_name: z.string().min(2, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const setTokens = useAuthStore((s) => s.setTokens);
  const { AUTH_LOGIN } = authRequest();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      user_name: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: (payload: AuthLoginForm) => AUTH_LOGIN(payload),
    onSuccess: (data) => {
      const { accessToken, refreshToken, existUser } = data.data;
      const roles = existUser?.roles || [];

      if (accessToken && refreshToken) {
        // Save tokens to cookies
        Cookies.set(CookieName.ACCESS_TOKEN, accessToken);
        Cookies.set(CookieName.REFRESH_TOKEN, refreshToken);

        // Update Zustand auth store with tokens (this also decodes roles)
        setTokens(accessToken, refreshToken);

        // Redirect based on roles
        if (roles.includes("admin") || roles.includes("super_admin")) {
          navigate("/");
        } else {
          // Redirect to a non-login page if user is not admin, adjust as needed
          navigate("/dashboard");
        }
      }
    },
    onError: (err) => {
      console.error("Login error:", err);
    },
  });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(data);
  };

  return (
    <Card className="mx-auto w-full mt-24 max-w-md shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center space-y-4 pb-6">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center shadow-md">
          <LogIn className="w-8 h-8 text-white" />
        </div>
        <div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-600">
            Sign in to your account
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="user_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-orange-500 to-orange-700 text-white font-semibold rounded-md shadow-md hover:brightness-110 transition-all"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <button className="text-orange-600 hover:underline font-medium">
            Sign up
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
