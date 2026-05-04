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
  UserCircle,
  Video,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

type BookingStatus = "CONFIRMED" | "COMPLETED" | "CANCELLED";

type TutorBooking = {
  id: number;
  scheduledAt: string;
  status: BookingStatus;
  student: {
    name: string;
  };
};

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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  const { user, token, isLoading, isAuthenticated } = useAuth();
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
        const [profileResponse, bookingsResponse] = await Promise.all([
          fetch(`${baseUrl}/tutors/me`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }),
          fetch(`${baseUrl}/booking`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }),
        ]);

        const profileResult = await profileResponse.json();
        const bookingsResult = await bookingsResponse.json();

        if (profileResponse.ok && profileResult.data) {
          setProfile(profileResult.data as TutorProfileSummary);
        }

        if (bookingsResponse.ok && Array.isArray(bookingsResult.data)) {
          setBookings(bookingsResult.data as TutorBooking[]);
        }
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchDashboardData();
  }, [baseUrl, token]);

  const confirmedCount = useMemo(
    () => bookings.filter((booking) => booking.status === "CONFIRMED").length,
    [bookings],
  );

  const completedCount = useMemo(
    () => bookings.filter((booking) => booking.status === "COMPLETED").length,
    [bookings],
  );

  const nextSession = useMemo(
    () =>
      bookings.find((booking) => booking.status === "CONFIRMED") ?? null,
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
      <div className="rounded-3xl bg-gradient-to-br from-sky-600 via-cyan-600 to-teal-500 p-6 text-white shadow-lg">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-white/15 p-3">
            <LayoutDashboard className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {user?.name ? `Welcome back, ${user.name}` : "Tutor dashboard"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-sky-50/90">
              Manage your sessions, track your performance, and see what students are saying about your teaching.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-sky-600" />
            <h2 className="text-sm font-semibold text-slate-500">Slots</h2>
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {profile?.availability?.length ?? 0}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Video className="h-5 w-5 text-sky-600" />
            <h2 className="text-sm font-semibold text-slate-500">Upcoming</h2>
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900">{confirmedCount}</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <h2 className="text-sm font-semibold text-slate-500">Completed</h2>
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900">{completedCount}</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            <h2 className="text-sm font-semibold text-slate-500">Rating</h2>
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {profile?.avgRating ? profile.avgRating.toFixed(1) : "0.0"}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* Left: Next Session & Reviews */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Video className="h-5 w-5 text-sky-600" />
                <h2 className="text-xl font-bold text-slate-900">Next Session</h2>
              </div>
              <Button asChild variant="ghost" className="text-sky-600">
                <Link href="/tutor/sessions">View all</Link>
              </Button>
            </div>
            
            {nextSession ? (
              <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100">
                <p className="text-sm text-slate-500 font-medium">STUDENT</p>
                <p className="text-lg font-bold text-slate-900 mt-1">{nextSession.student.name}</p>
                <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
                  <CalendarDays className="h-4 w-4" />
                  {new Date(nextSession.scheduledAt).toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 rounded-2xl border border-dashed border-slate-200 text-slate-400">
                No upcoming sessions found.
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquareQuote className="h-5 w-5 text-sky-600" />
              <h2 className="text-xl font-bold text-slate-900">Recent Student Reviews</h2>
            </div>
            
            <div className="space-y-4">
              {profile?.reviews && profile.reviews.length > 0 ? (
                profile.reviews.slice(0, 5).map((review) => (
                  <div key={review.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-900">{review.student.name}</p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mt-2 line-clamp-2">"{review.comment}"</p>
                    <p className="text-[10px] text-slate-400 mt-2">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-400">
                  No reviews yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Quick Actions & Profile info */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
            <div className="grid gap-3">
              <Button asChild className="rounded-2xl w-full bg-sky-600 text-white hover:bg-sky-700">
                <Link href="/tutor/profile">Update Profile</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-2xl w-full border-slate-200">
                <Link href="/tutor/availability">Modify Availability</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-2xl w-full border-slate-200">
                <Link href="/tutor/sessions">Manage Sessions</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50/50 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Account Info</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Tutor Name</p>
                <p className="font-bold text-slate-700">{user?.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Email</p>
                <p className="font-bold text-slate-700">{user?.email}</p>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Profile Approved</span>
                  <span className="text-emerald-600 font-bold">Yes</span>
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
