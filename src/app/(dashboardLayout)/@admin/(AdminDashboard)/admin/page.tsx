"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  BarChart,
  BookOpen,
  FolderOpen,
  LineChart,
  LoaderCircle,
  PieChart,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Bar,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  Pie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart as RechartsPieChart,
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
} from "recharts";
import { useAuth } from "@/hooks/useAuth";

type AdminStats = {
  totalUsers: number;
  totalStudents: number;
  totalTutors: number;
  totalBookings: number;
  totalCategories: number;
};

type AdminUser = { role: string; createdAt?: string };
type AdminBooking = { status?: string; totalPrice?: number; createdAt?: string; scheduledAt?: string };
type AdminCategory = { id?: number; name: string; _count?: { tutors?: number } };
type TutorForCategory = {
  categories?: { categoryId: number; category: { id: number; name: string } }[];
};

const chartColors = ["#B45309", "#047857", "#047857", "#B45309", "#047857"];

const AdminDashboardPage = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const { token } = useAuth();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [roleData, setRoleData] = useState<{ name: string; value: number }[]>([]);
  const [bookingTrendData, setBookingTrendData] = useState<{ name: string; bookings: number; revenue: number }[]>([]);
  const [categoryData, setCategoryData] = useState<{ name: string; tutors: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const [usersRes, bookingsRes, categoriesRes, tutorsRes] = await Promise.all([
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
          fetch("/api/tutors?limit=48", { cache: "no-store" }),
        ]);

        const usersData = await usersRes.json();
        const bookingsData = await bookingsRes.json();
        const categoriesData = await categoriesRes.json();
        const tutorsData = await tutorsRes.json();

        const users: AdminUser[] = Array.isArray(usersData.data) ? usersData.data : [];
        const bookings: AdminBooking[] = Array.isArray(bookingsData.data) ? bookingsData.data : [];
        const categories: AdminCategory[] = Array.isArray(categoriesData.data) ? categoriesData.data : [];
        const tutors: TutorForCategory[] = Array.isArray(tutorsData.data) ? tutorsData.data : [];
        const tutorCountsByCategory = tutors.reduce<Record<string, number>>((acc, tutor) => {
          tutor.categories?.forEach(({ categoryId, category }) => {
            const key = String(categoryId || category.id || category.name);
            acc[key] = (acc[key] || 0) + 1;
          });
          return acc;
        }, {});
        const roleCounts = users.reduce<Record<string, number>>((acc, user) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        }, {});
        const monthlyBookings = bookings.reduce<Record<string, { bookings: number; revenue: number }>>((acc, booking) => {
          const dateValue = booking.scheduledAt || booking.createdAt;
          const date = dateValue ? new Date(dateValue) : new Date();
          const key = date.toLocaleDateString(undefined, { month: "short" });
          acc[key] = acc[key] || { bookings: 0, revenue: 0 };
          acc[key].bookings += 1;
          acc[key].revenue += booking.totalPrice || 0;
          return acc;
        }, {});

        setStats({
          totalUsers: users.length,
          totalStudents: users.filter((u) => u.role === "STUDENT").length,
          totalTutors: users.filter((u) => u.role === "TUTOR").length,
          totalBookings: bookings.length,
          totalCategories: categories.length,
        });
        setRoleData(
          ["STUDENT", "TUTOR", "ADMIN"].map((role) => ({
            name: role,
            value: roleCounts[role] || 0,
          })),
        );
        setBookingTrendData(
          Object.entries(monthlyBookings).map(([name, value]) => ({
            name,
            ...value,
          })),
        );
        setCategoryData(
          categories.slice(0, 8).map((category) => ({
            name: category.name,
            tutors:
              category._count?.tutors ||
              tutorCountsByCategory[String(category.id || category.name)] ||
              0,
          })),
        );
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "Failed to load dashboard",
          confirmButtonColor: "#B45309",
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
        <div className="flex items-center gap-3 rounded-2xl border border-primary/15 bg-card px-5 py-4 shadow-sm">
          <LoaderCircle className="h-5 w-5 animate-spin text-secondary" />
          <span className="text-sm font-medium text-slate-600">Loading admin dashboard...</span>
        </div>
      </div>
    );
  }

  const cards = [
    { label: "Total Users", value: stats?.totalUsers ?? 0, icon: Users, color: "text-primary", bg: "bg-primary" },
    { label: "Students", value: stats?.totalStudents ?? 0, icon: Users, color: "text-primary", bg: "bg-primary" },
    { label: "Tutors", value: stats?.totalTutors ?? 0, icon: TrendingUp, color: "text-primary", bg: "bg-primary" },
    { label: "Bookings", value: stats?.totalBookings ?? 0, icon: BookOpen, color: "text-secondary", bg: "bg-secondary" },
    { label: "Categories", value: stats?.totalCategories ?? 0, icon: FolderOpen, color: "text-secondary", bg: "bg-secondary/10" },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="rounded-3xl bg-gradient-to-br from-primary via-primary to-secondary p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]">
              <Sparkles className="h-3.5 w-3.5" />
              Admin Control Panel
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Platform Overview</h1>
            <p className="text-sm text-white/90 max-w-2xl">
              Monitor platform-wide statistics, manage users, review bookings, and organize categories.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <div key={card.label} className="rounded-3xl border border-primary/15 bg-card p-5 shadow-sm">
            <div className={`inline-flex rounded-2xl p-2 ${card.bg}`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">{card.value}</p>
            <p className="text-sm text-slate-500">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-3xl border border-primary/15 bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <BarChart className="h-5 w-5 text-secondary" />
            <h2 className="text-sm font-semibold text-slate-900">Category Tutors</h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="tutors" fill="#B45309" radius={[8, 8, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-primary/15 bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <LineChart className="h-5 w-5 text-primary" />
            <h2 className="text-sm font-semibold text-slate-900">Booking Trend</h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={bookingTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="bookings" stroke="#047857" strokeWidth={3} dot={{ r: 4 }} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-primary/15 bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-primary" />
            <h2 className="text-sm font-semibold text-slate-900">User Roles</h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie data={roleData} dataKey="value" nameKey="name" outerRadius={88} label>
                  {roleData.map((entry, index) => (
                    <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: "Manage Users", desc: "View all users, ban or unban accounts.", href: "/admin/users", color: "bg-primary" },
          { title: "View Bookings", desc: "See all session bookings across the platform.", href: "/admin/bookings", color: "bg-primary" },
          { title: "Manage Categories", desc: "Create or delete tutoring subject categories.", href: "/admin/categories", color: "bg-secondary" },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="rounded-3xl border border-primary/15 bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
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
