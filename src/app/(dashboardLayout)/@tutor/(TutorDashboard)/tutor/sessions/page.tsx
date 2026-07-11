"use client";

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  LoaderCircle,
  Sparkles,
  UserRound,
  Video,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

type BookingStatus = "CONFIRMED" | "COMPLETED" | "CANCELLED";

type TutorBooking = {
  id: number;
  scheduledAt: string;
  duration: number;
  totalPrice: number;
  note: string | null;
  status: BookingStatus;
  student: {
    id: number;
    name: string;
    email: string;
  };
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

const statusTone: Record<BookingStatus, string> = {
  CONFIRMED: "border-sky-200 bg-sky-50 text-sky-700",
  COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  CANCELLED: "border-rose-200 bg-rose-50 text-rose-700",
};

const TutorSessionsPage = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const { token, user, isLoading: isAuthLoading } = useAuth();

  const [bookings, setBookings] = useState<TutorBooking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [updatingBookingId, setUpdatingBookingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) {
        setIsLoadingBookings(false);
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/booking`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const result: ApiResponse<TutorBooking[]> = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load sessions");
        }

        setBookings(Array.isArray(result.data) ? result.data : []);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load sessions";

        await Swal.fire({
          icon: "error",
          title: "Unable to load sessions",
          text: message,
          confirmButtonColor: "#0284c7",
        });
      } finally {
        setIsLoadingBookings(false);
      }
    };

    fetchBookings();
  }, [baseUrl, token]);

  const confirmedBookings = useMemo(
    () => bookings.filter((booking) => booking.status === "CONFIRMED"),
    [bookings],
  );

  const completedBookings = useMemo(
    () => bookings.filter((booking) => booking.status === "COMPLETED"),
    [bookings],
  );

  const handleMarkComplete = async (bookingId: number) => {
    if (!token) {
      return;
    }

    setUpdatingBookingId(bookingId);

    try {
      const response = await fetch(`${baseUrl}/booking/${bookingId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "COMPLETED",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update session");
      }

      setBookings((current) =>
        current.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: "COMPLETED" }
            : booking,
        ),
      );

      await Swal.fire({
        icon: "success",
        title: "Session completed",
        text: "The booking status is now marked as completed.",
        confirmButtonColor: "#0284c7",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update session";

      await Swal.fire({
        icon: "error",
        title: "Update failed",
        text: message,
        confirmButtonColor: "#0284c7",
      });
    } finally {
      setUpdatingBookingId(null);
    }
  };

  if (isAuthLoading || isLoadingBookings) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-600 shadow-sm">
          <LoaderCircle className="h-5 w-5 animate-spin text-sky-600" />
          <span className="text-sm font-medium">Loading your sessions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
  {/* ─── PREMIUM TUTOR HERO ─── */}
  <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-sky-600 via-cyan-600 to-teal-500 p-8 text-white shadow-xl shadow-cyan-100">
    {/* Decorative Elements */}
    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
    
    <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] border border-white/10">
          <Sparkles size={14} className="text-yellow-200" /> Tutor Sessions
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            {user?.name ? `${user.name}'s Sessions` : "Session Manager"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm font-medium text-sky-50/90 leading-relaxed">
            Review confirmed sessions, track your completed lessons, and manage your teaching pipeline efficiently.
          </p>
        </div>
      </div>

      <div className="inline-flex items-center gap-4 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md px-5 py-3 text-sm font-bold shadow-lg">
        <div className="text-center">
          <span className="block text-[10px] uppercase tracking-widest opacity-70">Confirmed</span>
          <span>{confirmedBookings.length}</span>
        </div>
        <div className="h-8 w-px bg-white/20" />
        <div className="text-center">
          <span className="block text-[10px] uppercase tracking-widest opacity-70">Completed</span>
          <span>{completedBookings.length}</span>
        </div>
      </div>
    </div>
  </section>

  {/* ─── STATS GRID ─── */}
  <div className="grid gap-6 md:grid-cols-3">
    {[
      { label: "Total sessions", value: bookings.length, color: "text-slate-900", icon: Video },
      { label: "Ready to teach", value: confirmedBookings.length, color: "text-sky-700", icon: CheckCircle2 },
      { label: "Completed lessons", value: completedBookings.length, color: "text-emerald-700", icon: GraduationCap },
    ].map((stat, i) => (
      <div key={i} className="group rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
          <stat.icon size={18} className="text-slate-300 group-hover:text-sky-500 transition-colors" />
        </div>
        <p className={`mt-2 text-3xl font-black ${stat.color}`}>{stat.value}</p>
      </div>
    ))}
  </div>

  {/* ─── SESSION PIPELINE ─── */}
  <section className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-sm">
    <div className="mb-8">
      <h2 className="text-xl font-black text-slate-900 tracking-tight">Session Pipeline</h2>
      <p className="mt-1 text-sm font-medium text-slate-500 italic">
        Mark a session as complete once the delivery is finished to track your progress.
      </p>
    </div>

    <div className="space-y-5">
      {bookings.length ? (
        bookings.map((booking) => (
          <article
            key={booking.id}
            className="group rounded-[28px] border border-slate-100 bg-slate-50/50 p-6 transition-all hover:bg-white hover:border-sky-100 hover:shadow-lg hover:shadow-sky-500/5"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-black text-slate-900">
                    Session <span className="text-sky-600">#{String(booking.id).slice(-6).toUpperCase()}</span>
                  </h3>
                  <span className={`rounded-lg border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest ${statusTone[booking.status]}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="grid gap-4 text-xs font-bold text-slate-500 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="flex items-center gap-2">
                    <UserRound size={16} className="text-sky-600" />
                    {booking.student.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays size={16} className="text-sky-600" />
                    {new Date(booking.scheduledAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock3 size={16} className="text-sky-600" />
                    {booking.duration} mins
                  </div>
                  <div className="flex items-center gap-2">
                    <Wallet size={16} className="text-sky-600" />
                    ${booking.totalPrice.toFixed(2)}
                  </div>
                </div>

                {booking.note && (
                  <div className="rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm text-slate-500 italic">
                    &ldquo;{booking.note}&rdquo;
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:min-w-[220px]">
                {booking.status === "CONFIRMED" ? (
                  <Button
                    onClick={() => handleMarkComplete(booking.id)}
                    disabled={updatingBookingId === booking.id}
                    className="w-full h-12 rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all font-bold"
                  >
                    {updatingBookingId === booking.id ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 size={16} /> Mark Complete
                      </span>
                    )}
                  </Button>
                ) : (
                  <div className="flex flex-col items-center justify-center h-12 rounded-xl bg-white border border-slate-100 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {booking.status === "COMPLETED" ? "Service Delivered" : "Student Cancelled"}
                  </div>
                )}
              </div>
            </div>
          </article>
        ))
      ) : (
        <div className="rounded-[28px] border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
          <p className="text-sm font-bold text-slate-400">Your teaching pipeline is currently empty.</p>
        </div>
      )}
    </div>
  </section>
</div>
  );
};

export default TutorSessionsPage;
