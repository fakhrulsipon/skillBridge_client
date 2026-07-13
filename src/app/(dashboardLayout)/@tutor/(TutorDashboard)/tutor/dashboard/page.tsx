"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  LayoutDashboard,
  LoaderCircle,
  MessageSquareQuote,
  ShieldCheck,
  Star,
  Video,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  fetchTutorBookings,
  type TutorBooking,
} from "@/lib/tutor-bookings";

type Review = {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  student: {
    name: string;
  };
};

type TutorProfileSummary = {
  id: number;
  avgRating: number;
  totalReviews: number;
  availability: { id?: number }[];
  reviews: Review[];
};

const TutorDashboard = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const { user, token, isLoading } = useAuth();
  const [bookings, setBookings] = useState<TutorBooking[]>([]);
  const [profile, setProfile] = useState<TutorProfileSummary | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        setIsLoadingData(false);
        return;
      }

      try {
        const [profileResponse, tutorBookings] = await Promise.all([
          fetch(`${baseUrl}/tutors/me`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }),
          fetchTutorBookings(baseUrl, token, user?.id).catch(() => []),
        ]);

        const profileResult = await profileResponse.json();

        if (profileResponse.ok && profileResult.data) {
          setProfile(profileResult.data as TutorProfileSummary);
        }

        setBookings(tutorBookings);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchDashboardData();
  }, [baseUrl, token, user?.id]);

  const activeCount = useMemo(
    () =>
      bookings.filter((booking) =>
        ["PENDING", "CONFIRMED"].includes(booking.status),
      ).length,
    [bookings],
  );

  const completedCount = useMemo(
    () => bookings.filter((booking) => booking.status === "COMPLETED").length,
    [bookings],
  );

  const nextSession = useMemo(
    () =>
      [...bookings]
        .filter((booking) => ["PENDING", "CONFIRMED"].includes(booking.status))
        .sort(
          (a, b) =>
            new Date(a.scheduledAt).getTime() -
            new Date(b.scheduledAt).getTime(),
        )[0] ?? null,
    [bookings],
  );

  if (isLoading || isLoadingData) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">
        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
        Loading dashboard...
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* ─── HERO SECTION: REFINED GRADIENT & DEPTH ─── */}
      <div className="rounded-[32px] bg-gradient-to-br from-primary via-primary to-primary p-8 text-white shadow-xl shadow-primary">
        <div className="flex items-start gap-5">
          <div className="rounded-2xl bg-white/20 p-3.5 backdrop-blur-md border border-white/10 shadow-inner">
            <LayoutDashboard className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              {user?.name ? `Welcome back, ${user.name}` : "Tutor dashboard"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-medium text-white/80">
              Manage your sessions, track your performance, and see what students are saying about your teaching.
            </p>
          </div>
        </div>
      </div>

      {/* ─── STATS GRID: CLEANER CARDS ─── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Slots", val: profile?.availability?.length ?? 0, icon: CalendarDays, color: "text-white", bg: "bg-primary" },
          { label: "Requests", val: activeCount, icon: Video, color: "text-white", bg: "bg-primary" },
          { label: "Completed", val: completedCount, icon: ShieldCheck, color: "text-white", bg: "bg-primary" },
          { label: "Rating", val: profile?.avgRating ? profile.avgRating.toFixed(1) : "0.0", icon: Star, color: "text-white", bg: "bg-secondary", fill: true },
        ].map((stat, i) => (
          <div key={i} className="rounded-[28px] border border-primary/10 bg-card p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className={`h-5 w-5 ${stat.fill ? 'fill-current' : ''}`} />
              </div>
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">{stat.label}</h2>
            </div>
            <p className="mt-4 text-3xl font-black text-slate-900 tracking-tight">
              {stat.val}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* Left: Next Session & Reviews */}
        <div className="space-y-6">
          <div className="rounded-[32px] border border-primary/10 bg-card p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Next Session</h2>
              </div>
              <Button asChild variant="ghost" className="text-primary font-bold hover:bg-primary rounded-xl">
                <Link href="/tutor/sessions">View all</Link>
              </Button>
            </div>
            
            {nextSession ? (
              <div className="rounded-2xl bg-canvas/50 p-6 border border-primary/10 transition-colors hover:bg-canvas">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {nextSession.status === "PENDING" ? "Pending request" : "Student"}
                </p>
                <p className="text-xl font-black text-slate-900 mt-1">{nextSession.student.name}</p>
                <div className="flex items-center gap-2 mt-4 text-sm font-bold text-slate-600 bg-card w-fit px-3 py-1.5 rounded-lg border border-primary/10 shadow-sm">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  {new Date(nextSession.scheduledAt).toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="text-center py-10 rounded-2xl border-2 border-dashed border-primary/10 text-slate-400 font-medium">
                No upcoming sessions found.
              </div>
            )}
          </div>

          <div className="rounded-[32px] border border-primary/10 bg-card p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <MessageSquareQuote className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Recent Student Reviews</h2>
            </div>
            
            <div className="space-y-5">
              {profile?.reviews && profile.reviews.length > 0 ? (
                profile.reviews.slice(0, 5).map((review) => (
                  <div key={review.id} className="border-b border-slate-50 pb-5 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <p className="font-black text-slate-800">{review.student.name}</p>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${i < review.rating ? "fill-secondary text-secondary" : "text-slate-200"}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mt-3 leading-relaxed font-medium">&quot;{review.comment}&quot;</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-3 uppercase tracking-tighter">
                      {new Date(review.createdAt).toLocaleDateString(undefined, { year:'numeric', month:'long', day:'numeric' })}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-400 font-medium">
                  No reviews yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Quick Actions & Profile info */}
        <div className="space-y-6">
          <div className="rounded-[32px] border border-primary/10 bg-card p-8 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 mb-6 tracking-tight">Quick Actions</h2>
            <div className="grid gap-3">
              <Button asChild className="h-12 rounded-xl w-full bg-primary font-bold text-white hover:bg-primary shadow-lg shadow-primary transition-all active:scale-[0.98]">
                <Link href="/tutor/profile">Update Profile</Link>
              </Button>
              <Button asChild variant="outline" className="h-12 rounded-xl w-full border-primary/10 font-bold text-slate-600 hover:bg-canvas">
                <Link href="/tutor/availability">Modify Availability</Link>
              </Button>
              <Button asChild variant="outline" className="h-12 rounded-xl w-full border-primary/10 font-bold text-slate-600 hover:bg-canvas">
                <Link href="/tutor/sessions">Manage Sessions</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-[32px] border border-primary/10 bg-canvas/50 p-8">
            <h2 className="text-xl font-black text-slate-900 mb-6 tracking-tight">Account Info</h2>
            <div className="space-y-5">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tutor Name</p>
                <p className="font-bold text-slate-700 mt-0.5">{user?.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                <p className="font-bold text-slate-700 mt-0.5">{user?.email}</p>
              </div>
              <div className="pt-5 border-t border-primary/15">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-500">Profile Status</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-[10px] font-black text-white uppercase">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TutorDashboard;
