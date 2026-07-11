"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  LoaderCircle,
  Sparkles,
  Star,
  Wallet,
  ArrowRight,
  TrendingUp,
  BookOpen,
  GraduationCap,
  ChevronRight,
  ShieldCheck,
  Zap
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

type BookingStatus = "CONFIRMED" | "COMPLETED" | "CANCELLED";

type StudentBooking = {
  id: number;
  scheduledAt: string;
  duration: number;
  totalPrice: number;
  status: BookingStatus;
  tutorProfile: {
    id: number;
    user: {
      name: string;
      email: string;
    };
  };
};

const StudentDashboardPage = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const { token, user, isLoading: isAuthLoading } = useAuth();
  const [bookings, setBookings] = useState<StudentBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) { setIsLoading(false); return; }
      try {
        const response = await fetch(`${baseUrl}/booking`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();
        if (response.ok) setBookings(Array.isArray(result.data) ? result.data : []);
      } catch {
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, [baseUrl, token]);

  const stats = useMemo(() => {
    const confirmed = bookings.filter((b) => b.status === "CONFIRMED");
    const completed = bookings.filter((b) => b.status === "COMPLETED");
    const totalSpent = completed.reduce((acc, b) => acc + b.totalPrice, 0);
    const nextSession = confirmed.sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0];

    return { confirmed, completed, totalSpent, nextSession };
  }, [bookings]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-8xl mx-auto">
      {/* ─── LIGHT PREMIUM HERO ─── */}
      <section className="relative overflow-hidden rounded-[40px] border border-primary bg-gradient-to-br from-card via-primary/50 to-card p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
        {/* Animated Background Blobs */}
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-[80px] animate-pulse" />
        <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-primary/10 blur-[80px]" />
        
        <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-primary">
              <Zap size={14} className="fill-current" /> Overview
            </div>
            <div>
              <h1 className="text-5xl font-black tracking-tight text-slate-900 leading-tight">
                Hello, <span className="text-primary relative inline-block">
                  {user?.name?.split(" ")[0]}!
                  <span className="absolute bottom-1 left-0 h-2 w-full bg-primary -z-10 rounded-full" />
                </span>
              </h1>
              <p className="mt-4 max-w-lg text-lg font-medium text-slate-500 leading-relaxed">
                You have <span className="text-primary font-black border-b-2 border-primary">{stats.confirmed.length} sessions</span> scheduled. 
                Your learning journey is looking great this week.
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Link href="/tutors" className="group relative rounded-2xl bg-primary px-8 py-5 font-black text-white hover:bg-slate-900 transition-all shadow-2xl shadow-primary active:scale-95 flex items-center gap-3">
              Book New Session <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── QUICK STATS ─── */}
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: "Total Investment", value: `$${stats.totalSpent.toFixed(0)}`, icon: Wallet, color: "text-primary", bg: "bg-primary", desc: "Knowledge assets" },
          { label: "Completed Lessons", value: stats.completed.length, icon: GraduationCap, color: "text-primary", bg: "bg-primary", desc: "Skills mastered" },
          { label: "Avg. Learning Score", value: "4.9", icon: Star, color: "text-secondary", bg: "bg-secondary", desc: "Top 5% student" },
        ].map((s) => (
          <div key={s.label} className="group relative rounded-[32px] border border-primary/10 bg-card p-8 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5">
            <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${s.bg} ${s.color} group-hover:rotate-12 transition-transform shadow-sm`}>
              <s.icon size={28} />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.15em]">{s.label}</p>
            <p className="mt-2 text-4xl font-black text-slate-900 tracking-tighter">{s.value}</p>
            <p className="mt-4 text-sm font-bold text-slate-400 flex items-center gap-2">
              <Sparkles size={14} className="text-primary animate-bounce" /> {s.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* ─── FEATURED NEXT SESSION ─── */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Upcoming <span className="text-primary underline decoration-primary decoration-4 underline-offset-4">Focus</span>
            </h2>
            <Link href="/student/bookings" className="text-sm font-black text-primary hover:text-slate-900 flex items-center gap-1 transition-colors">
              Full Schedule <ChevronRight size={18} />
            </Link>
          </div>

          {stats.nextSession ? (
            <div className="group relative overflow-hidden rounded-[40px] border border-primary/10 bg-card p-1 transition-all hover:shadow-2xl hover:border-primary">
              <div className="bg-canvas/50 rounded-[38px] p-9 flex flex-col gap-8 md:flex-row md:items-center">
                <div className="relative">
                  <div className="h-24 w-24 flex-shrink-0 rounded-[30px] bg-gradient-to-br from-primary to-primary flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-primary group-hover:scale-105 transition-transform">
                    {stats.nextSession.tutorProfile.user.name[0]}
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-primary border-4 border-white flex items-center justify-center text-white">
                    <ShieldCheck size={14} />
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
                    Confirmed Session
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight italic">{stats.nextSession.tutorProfile.user.name}</h3>
                  <div className="flex flex-wrap gap-4 text-base font-bold text-slate-500">
                    <span className="flex items-center gap-2 px-3 py-1 bg-card rounded-lg shadow-sm"><CalendarDays size={18} className="text-primary" /> {new Date(stats.nextSession.scheduledAt).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                    <span className="flex items-center gap-2 px-3 py-1 bg-card rounded-lg shadow-sm"><Clock3 size={18} className="text-primary" /> {new Date(stats.nextSession.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                <Link href="/student/bookings" className="rounded-xl bg-primary px-8 py-4 text-sm font-black text-white hover:bg-slate-900 transition-all shadow-lg shadow-primary">
                  Join Room
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-[40px] border-2 border-dashed border-primary/15 bg-canvas/50 p-16 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-card text-slate-200 shadow-sm border border-slate-50">
                <CalendarDays size={40} />
              </div>
              <p className="text-xl font-black text-slate-400">Ready for your next challenge?</p>
              <Link href="/tutors" className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 text-sm font-black text-white hover:bg-primary transition shadow-lg shadow-primary">
                Book a Mentor <ArrowRight size={18} />
              </Link>
            </div>
          )}
        </div>

        {/* ─── SIDEBAR: QUICK ACTIONS ─── */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight px-2">Quick Actions</h2>
          <div className="grid gap-4">
            {[
              { href: "/student/profile", icon: Wallet, title: "Manage Profile", desc: "Account security & settings", color: "text-primary", bg: "bg-primary" },
              { href: "/tutors", icon: BookOpen, title: "Explore Subjects", desc: "Discover new expert mentors", color: "text-primary", bg: "bg-primary" },
            ].map((action) => (
              <Link key={action.title} href={action.href} className="group flex items-center justify-between rounded-[32px] border border-primary/10 bg-card p-2 transition-all hover:border-primary hover:shadow-xl">
                <div className="flex items-center gap-5 p-5">
                  <div className={`h-14 w-14 rounded-2xl ${action.bg} ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                    <action.icon size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-slate-900 text-lg tracking-tight">{action.title}</p>
                    <p className="text-sm font-bold text-slate-400">{action.desc}</p>
                  </div>
                </div>
                <div className="mr-6 h-10 w-10 rounded-full bg-canvas flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all">
                   <ChevronRight size={20} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
