"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  User,
  GraduationCap,
  Mail,
  Lock,
  UserCircle,
  BookOpen,
  Zap,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  Users,
} from "lucide-react";

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  role: "STUDENT" | "TUTOR";
}

const features = [
  {
    icon: <Users size={18} className="text-indigo-400" />,
    title: "Expert Tutors",
    sub: "Learn from the best in the industry.",
  },
  {
    icon: <BookOpen size={18} className="text-emerald-400" />,
    title: "Curated Courses",
    sub: "High-quality content for all levels.",
  },
  {
    icon: <Zap size={18} className="text-amber-400" />,
    title: "Instant Access",
    sub: "Start your journey in seconds.",
  },
];

const SignUp = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    defaultValues: { role: "STUDENT", name: "", email: "", password: "" },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

    try {
      const response = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        await Swal.fire({
          icon: "success",
          title: "Welcome Aboard! 🎉",
          text: "Your account has been created successfully. Redirecting you to your dashboard...",
          confirmButtonColor: "#4f46e5",
          confirmButtonText: "Continue",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: true,
          backdrop: true,
          customClass: {
            popup: "rounded-2xl shadow-2xl",
            title: "text-2xl font-bold",
            confirmButton: "px-6 py-2 rounded-xl font-semibold",
          },
        });
        router.push("/login");
      } else {
        await Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text:
            result.message ||
            "Unable to create your account. Please try again.",
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
        text: "Unable to reach the server. Please check your internet connection and try again.",
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
      {/* Main Card Container */}
      <div className="flex w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-indigo-500/10 border border-slate-100 transition-all duration-300 hover:shadow-indigo-500/20">
        {/* --- LEFT PANEL: Branding & Features --- */}
        <div className="relative hidden w-[45%] flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-10 text-white lg:flex">
          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-indigo-500 blur-md opacity-50" />
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg">
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
            <h1 className="mt-12 text-4xl font-bold leading-tight tracking-tight">
              Master new skills{" "}
              <span className="block text-slate-300 text-3xl mt-2">
                with absolute clarity.
              </span>
            </h1>
            <p className="mt-4 text-slate-300 text-sm leading-relaxed">
              Join thousands of learners and expert tutors in the most advanced
              learning platform.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            {features.map((item, idx) => (
              <div
                key={idx}
                className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-lg"
              >
                <div className="rounded-xl bg-white/10 p-2 transition-all duration-300 group-hover:scale-110 group-hover:bg-indigo-500/20">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {item.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative z-10 flex items-center gap-4 text-xs text-slate-400">
            <span>© 2026 SkillBridge Inc.</span>
            <span className="h-3 w-px bg-slate-600" />
            <span>All rights reserved</span>
          </div>
        </div>

        {/* --- RIGHT PANEL: Form --- */}
        <div className="flex flex-1 flex-col justify-center bg-white px-6 py-12 md:px-12 lg:px-16">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Create Account
            </h2>
            <p className="mt-2 text-slate-500">
              Join 10,000+ students and start learning today.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-3">
              {(["STUDENT", "TUTOR"] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setValue("role", role)}
                  className={`relative flex flex-col items-center gap-2 rounded-xl border-2 py-3 transition-all duration-200 ${
                    selectedRole === role
                      ? "border-indigo-500 bg-indigo-50 text-indigo-600 shadow-md"
                      : "border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {role === "STUDENT" ? (
                    <GraduationCap size={22} />
                  ) : (
                    <User size={22} />
                  )}
                  <span className="text-xs font-bold uppercase tracking-wide">
                    {role}
                  </span>
                  {selectedRole === role && (
                    <CheckCircle2
                      size={16}
                      className="absolute right-2 top-2 text-indigo-500"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Name Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Full Name
                </label>
                <div className="relative">
                  <UserCircle
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors peer-focus:text-indigo-500"
                    size={18}
                  />
                  <input
                    {...register("name", { required: "Full name is required" })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors peer-focus:text-indigo-500"
                    size={18}
                  />
                  <input
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
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors peer-focus:text-indigo-500"
                    size={18}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-10 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="Create a strong password"
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
                  <p className="text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:shadow-indigo-500/40 hover:from-indigo-700 hover:to-indigo-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-semibold text-indigo-600 transition-colors hover:text-indigo-700 hover:underline underline-offset-4"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
