"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  BookOpen,
  FolderOpen,
  LoaderCircle,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

type AdminStats = {
  totalUsers: number;
  totalStudents: number;
  totalTutors: number;
  totalBookings: number;
  totalCategories: number;
};

const AdminDashboardPage = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  const { token } = useAuth();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const [usersRes, bookingsRes, categoriesRes] = await Promise.all([
          fetch(`${baseUrl}/admin/users`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }),
          fetch(`${baseUrl}/admin/bookings`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }),
          fetch(`${baseUrl}/admin/categories`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }),
        ]);

        const usersData = await usersRes.json();
        const bookingsData = await bookingsRes.json();
        const categoriesData = await categoriesRes.json();

        const users = Array.isArray(usersData.data) ? usersData.data : [];
        const bookings = Array.isArray(bookingsData.data) ? bookingsData.data : [];
        const categories = Array.isArray(categoriesData.data) ? categoriesData.data : [];

        setStats({
          totalUsers: users.length,
          totalStudents: users.filter((u: any) => u.role === "STUDENT").length,
          totalTutors: users.filter((u: any) => u.role === "TUTOR").length,
          totalBookings: bookings.length,
          totalCategories: categories.length,
        });
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "Failed to load dashboard",
          confirmButtonColor: "#e11d48",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [baseUrl, token]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <LoaderCircle className="h-5 w-5 animate-spin text-rose-600" />
          <span className="text-sm font-medium text-slate-600">Loading admin dashboard...</span>
        </div>
      </div>
    );
  }

  const cards = [
    { label: "Total Users", value: stats?.totalUsers ?? 0, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Students", value: stats?.totalStudents ?? 0, icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Tutors", value: stats?.totalTutors ?? 0, icon: TrendingUp, color: "text-sky-600", bg: "bg-sky-50" },
    { label: "Bookings", value: stats?.totalBookings ?? 0, icon: BookOpen, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Categories", value: stats?.totalCategories ?? 0, icon: FolderOpen, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="rounded-3xl bg-gradient-to-br from-rose-600 via-pink-600 to-orange-500 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]">
              <Sparkles className="h-3.5 w-3.5" />
              Admin Control Panel
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Platform Overview</h1>
            <p className="text-sm text-rose-50/90 max-w-2xl">
              Monitor platform-wide statistics, manage users, review bookings, and organize categories.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <div key={card.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className={`inline-flex rounded-2xl p-2 ${card.bg}`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">{card.value}</p>
            <p className="text-sm text-slate-500">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: "Manage Users", desc: "View all users, ban or unban accounts.", href: "/admin/users", color: "bg-indigo-600" },
          { title: "View Bookings", desc: "See all session bookings across the platform.", href: "/admin/bookings", color: "bg-emerald-600" },
          { title: "Manage Categories", desc: "Create or delete tutoring subject categories.", href: "/admin/categories", color: "bg-rose-600" },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`inline-block h-2 w-8 rounded-full ${item.color} mb-4`} />
            <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{item.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
