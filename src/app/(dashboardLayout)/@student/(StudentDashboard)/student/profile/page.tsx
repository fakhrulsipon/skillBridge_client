"use client";

import { useAuth } from "@/hooks/useAuth";
import { LoaderCircle, Mail, Sparkles, UserCircle } from "lucide-react";

const StudentProfilePage = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <LoaderCircle className="h-5 w-5 animate-spin text-indigo-600" />
          <span className="text-sm font-medium text-slate-600">
            Loading your profile...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 p-6 text-white shadow-lg">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          My Profile
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          {user?.name ? `${user.name}'s Profile` : "Student Profile"}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-indigo-50/90">
          Your account information registered with SkillBridge.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Account info card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-slate-900">
            Account Information
          </h2>
          <div className="space-y-5">
            <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
                <UserCircle className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Full Name
                </p>
                <p className="mt-0.5 text-base font-semibold text-slate-900">
                  {user?.name ?? "—"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
                <Mail className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Email Address
                </p>
                <p className="mt-0.5 text-base font-semibold text-slate-900">
                  {user?.email ?? "—"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
                <UserCircle className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Account Role
                </p>
                <p className="mt-0.5 text-base font-semibold text-slate-900">
                  {user?.role ?? "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info card */}
        <div className="rounded-3xl border border-indigo-100 bg-indigo-50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-indigo-900">
            Student Journey
          </h2>
          <ul className="space-y-3 text-sm text-indigo-700">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-indigo-400 mt-1.5"></span>
              Browse and filter tutors by subject, rating, and price.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-indigo-400 mt-1.5"></span>
              Book a session directly from the tutor's profile page.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-indigo-400 mt-1.5"></span>
              View upcoming and past sessions in your Dashboard or Bookings
              page.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-indigo-400 mt-1.5"></span>
              Leave a star rating and review after each completed session.
            </li>
          </ul>

          <div className="mt-6 rounded-2xl bg-white/70 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-indigo-500">
              Next steps
            </p>
            <p className="mt-1 text-sm text-indigo-700">
              Head to the{" "}
              <a
                href="/tutors"
                className="font-semibold underline underline-offset-2 hover:text-indigo-900"
              >
                Browse Tutors
              </a>{" "}
              page to find your perfect match and book your first session.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
