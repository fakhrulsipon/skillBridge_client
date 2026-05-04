"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  BookOpen,
  Users,
  Shield,
  LogIn,
} from "lucide-react";
import { persistAuth } from "@/lib/auth";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

const features = [
  {
    icon: <BookOpen size={18} className="text-emerald-400" />,
    title: "10,000+ Courses",
    sub: "Access thousands of expert-led courses.",
  },
  {
    icon: <Users size={18} className="text-indigo-400" />,
    title: "Live Mentorship",
    sub: "Get guidance from industry experts.",
  },
  {
    icon: <Shield size={18} className="text-amber-400" />,
    title: "Secure Learning",
    sub: "Safe & verified learning environment.",
  },
];

const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.data.user) {
          persistAuth(result.data.user, result.data.token);
        }

        await Swal.fire({
          icon: "success",
          title: "Welcome Back! 🎉",
          text:
            result.message ||
            "Login successful! Redirecting to your dashboard...",
          confirmButtonColor: "#4f46e5",
          confirmButtonText: "Continue",
          timer: 2500,
          timerProgressBar: true,
          showConfirmButton: true,
          backdrop: true,
          customClass: {
            popup: "rounded-2xl shadow-2xl",
            title: "text-2xl font-bold",
            confirmButton: "px-6 py-2 rounded-xl font-semibold",
          },
        });
        if (result.data.user.role === "STUDENT") {
          router.push("/student/dashboard");
        } else if (result.data.user.role === "TUTOR") {
          router.push("/tutor/dashboard");
        } else {
          router.push("/admin");
        }
      } else {
        await Swal.fire({
          icon: "error",
          title: "Login Failed",
          text:
            result.message || "Invalid email or password. Please try again.",
          confirmButtonColor: "#4f46e5",
          confirmButtonText: "Try Again",
          customClass: {
            popup: "rounded-2xl",
            confirmButton: "px-6 py-2 rounded-xl font-semibold",
          },
        });
      }
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Connection Error",
        text: "Unable to connect to the server. Please check your internet connection.",
        confirmButtonColor: "#4f46e5",
        confirmButtonText: "Retry",
        customClass: {
          popup: "rounded-2xl",
          confirmButton: "px-6 py-2 rounded-xl font-semibold",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-4 lg:p-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Main Card Container */}
      <div className="flex w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-indigo-500/10 border border-slate-100 transition-all duration-300 hover:shadow-indigo-500/20">
        {/* --- LEFT PANEL: Welcome Section --- */}
        <div className="relative hidden w-[45%] flex-col justify-between bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 p-10 text-white lg:flex">
          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-white/20 blur-md" />
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm shadow-lg">
                  <Sparkles
                    size={20}
                    className="text-white"
                    fill="currentColor"
                  />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                SkillBridge
              </span>
            </div>

            <div className="mt-12 space-y-3">
              <h1 className="text-4xl font-bold leading-tight tracking-tight">
                Welcome back to
                <span className="block mt-2 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                  SkillBridge
                </span>
              </h1>
              <p className="text-indigo-100 text-sm leading-relaxed">
                Continue your learning journey and unlock new possibilities with
                our expert-led courses.
              </p>
            </div>

            {/* Stats Section */}
            <div className="mt-8 flex gap-6">
              <div>
                <div className="text-2xl font-bold">10k+</div>
                <div className="text-xs text-indigo-200">Active Students</div>
              </div>
              <div>
                <div className="text-2xl font-bold">500+</div>
                <div className="text-xs text-indigo-200">Expert Tutors</div>
              </div>
              <div>
                <div className="text-2xl font-bold">98%</div>
                <div className="text-xs text-indigo-200">Satisfaction Rate</div>
              </div>
            </div>
          </div>

          <div className="relative z-10 space-y-3">
            {features.map((item, idx) => (
              <div
                key={idx}
                className="group flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition-all duration-300 hover:bg-white/10 hover:border-white/20"
              >
                <div className="rounded-lg bg-white/10 p-1.5 transition-all duration-300 group-hover:scale-110 group-hover:bg-indigo-500/30">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-indigo-200 leading-relaxed">
                    {item.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative z-10 flex items-center gap-4 text-xs text-indigo-300">
            <span>© 2026 SkillBridge Inc.</span>
            <span className="h-3 w-px bg-indigo-400/30" />
            <span>Secure Platform</span>
          </div>
        </div>

        {/* --- RIGHT PANEL: Login Form --- */}
        <div className="flex flex-1 flex-col justify-center bg-white px-6 py-12 md:px-12 lg:px-16">
          <div className="mb-8 text-center lg:text-left">
            <div className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-50 px-3 py-1 mb-4 lg:hidden">
              <Sparkles size={14} className="text-indigo-600" />
              <span className="text-xs font-semibold text-indigo-600">
                SkillBridge
              </span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Sign In
            </h2>
            <p className="mt-2 text-slate-500">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-all group-focus-within:text-indigo-500"
                  size={18}
                />
                <input
                  type="email"
                  {...register("email", {
                    required: "Email address is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address",
                    },
                  })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 animate-shake">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Password
                </label>
              </div>
              <div className="relative group">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-all group-focus-within:text-indigo-500"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-10 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-indigo-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 animate-shake">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:shadow-indigo-500/40 hover:from-indigo-700 hover:to-indigo-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  <span>Sign In</span>
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </>
              )}

              {/* Shimmer Effect */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <a
                href="/register"
                className="font-semibold text-indigo-600 transition-colors hover:text-indigo-700 hover:underline underline-offset-4"
              >
                Create free account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
