"use client";

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  CalendarDays,
  Clock3,
  LoaderCircle,
  MessageSquareQuote,
  Sparkles,
  Star,
  Wallet,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";

type BookingStatus = "CONFIRMED" | "COMPLETED" | "CANCELLED";
type StudentBooking = {
  id: number;
  scheduledAt: string;
  duration: number;
  totalPrice: number;
  note: string | null;
  status: BookingStatus;
  tutorProfile: {
    id: number;
    bio?: string;
    user: { id: number; name: string; email: string };
  };
};
type ReviewDraft = { bookingId: number; rating: number; comment: string };

const statusTone: Record<BookingStatus, string> = {
  CONFIRMED: "border-sky-200 bg-sky-50 text-sky-700",
  COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  CANCELLED: "border-rose-200 bg-rose-50 text-rose-700",
};

const StudentBookingsPage = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const { token, isLoading: isAuthLoading } = useAuth();
  const [bookings, setBookings] = useState<StudentBooking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [updatingBookingId, setUpdatingBookingId] = useState<number | null>(
    null,
  );
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewedBookingIds, setReviewedBookingIds] = useState<number[]>([]);
  const [reviewDraft, setReviewDraft] = useState<ReviewDraft | null>(null);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "ALL">(
    "ALL",
  );

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) {
        setIsLoadingBookings(false);
        return;
      }
      try {
        const res = await fetch(`${baseUrl}/booking`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        const result = await res.json();
        if (!res.ok)
          throw new Error(result.message || "Failed to load bookings");
        setBookings(Array.isArray(result.data) ? result.data : []);
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "Unable to load bookings",
          confirmButtonColor: "#4f46e5",
        });
      } finally {
        setIsLoadingBookings(false);
      }
    };
    fetchBookings();
  }, [baseUrl, token]);

  const handleCancelBooking = async (bookingId: number) => {
    if (!token) return;
    setUpdatingBookingId(bookingId);
    try {
      const res = await fetch(`${baseUrl}/booking/${bookingId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "CANCELLED" }),
      });
      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Failed");
      setBookings((cur) =>
        cur.map((b) =>
          b.id === bookingId ? { ...b, status: "CANCELLED" } : b,
        ),
      );
      await Swal.fire({
        icon: "success",
        title: "Booking cancelled",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error: any) {
      await Swal.fire({
        icon: "error",
        title: "Cancel failed",
        text: error.message,
        confirmButtonColor: "#4f46e5",
      });
    } finally {
      setUpdatingBookingId(null);
    }
  };

  const handleSubmitReview = async () => {
    if (!token || !reviewDraft) return;
    setSubmittingReview(true);
    try {
      const res = await fetch(`${baseUrl}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingId: reviewDraft.bookingId,
          rating: reviewDraft.rating,
          comment: reviewDraft.comment.trim(),
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed");
      setReviewedBookingIds((cur) => [...cur, reviewDraft.bookingId]);
      setReviewDraft(null);
      await Swal.fire({
        icon: "success",
        title: "Review submitted",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error: any) {
      await Swal.fire({
        icon: "error",
        title: "Review failed",
        text: error.message,
        confirmButtonColor: "#4f46e5",
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  const filtered = useMemo(
    () =>
      statusFilter === "ALL"
        ? bookings
        : bookings.filter((b) => b.status === statusFilter),
    [bookings, statusFilter],
  );

  if (isAuthLoading || isLoadingBookings)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <LoaderCircle className="h-5 w-5 animate-spin text-indigo-600" />
          <span className="text-sm font-medium text-slate-600">
            Loading bookings...
          </span>
        </div>
      </div>
    );

  const counts = {
    ALL: bookings.length,
    CONFIRMED: bookings.filter((b) => b.status === "CONFIRMED").length,
    COMPLETED: bookings.filter((b) => b.status === "COMPLETED").length,
    CANCELLED: bookings.filter((b) => b.status === "CANCELLED").length,
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* ─── HEADER SECTION ─── */}
      <section className="relative overflow-hidden rounded-[32px] bg-slate-950 p-8 text-white shadow-2xl">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-4">
            <Sparkles size={14} /> My Bookings
          </div>
          <h1 className="text-4xl font-black tracking-tight">
            Booking History
          </h1>
          <p className="mt-2 text-slate-400 font-medium">
            Manage your academic journey — upcoming, completed, and past
            sessions.
          </p>
        </div>
      </section>

      {/* ─── STATS / FILTERS ─── */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total",
            key: "ALL",
            color: "bg-slate-100 text-slate-900",
            border: "border-slate-200",
          },
          {
            label: "Upcoming",
            key: "CONFIRMED",
            color: "bg-blue-50 text-blue-700",
            border: "border-blue-100",
          },
          {
            label: "Completed",
            key: "COMPLETED",
            color: "bg-emerald-50 text-emerald-600",
            border: "border-emerald-100",
          },
          {
            label: "Cancelled",
            key: "CANCELLED",
            color: "bg-rose-50 text-rose-700",
            border: "border-rose-100",
          },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => setStatusFilter(s.key as BookingStatus | "ALL")}
            className={`group relative overflow-hidden rounded-[24px] border p-5 text-left transition-all duration-300 ${
              statusFilter === s.key
                ? `${s.border} ring-2 ring-indigo-500 ring-offset-2 bg-white shadow-lg`
                : "border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md"
            }`}
          >
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-indigo-500 transition-colors">
              {s.label}
            </p>
            <p
              className={`mt-2 text-3xl font-black tracking-tight ${s.color.split(" ")[1]}`}
            >
              {counts[s.key as keyof typeof counts]}
            </p>
            <div
              className={`absolute bottom-0 left-0 h-1 transition-all duration-300 ${statusFilter === s.key ? "w-full bg-indigo-500" : "w-0 bg-slate-200 group-hover:w-1/2"}`}
            />
          </button>
        ))}
      </div>

      {/* ─── BOOKING LIST ─── */}
      <div className="space-y-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-slate-200 bg-slate-50/50 py-20 text-center">
            <div className="mb-4 rounded-full bg-slate-100 p-4 text-slate-400">
              <CalendarDays size={40} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              No sessions found
            </h3>
            <p className="text-sm text-slate-500">
              Try changing your filters or book a new session.
            </p>
          </div>
        ) : (
          filtered.map((booking) => {
            const alreadyReviewed = reviewedBookingIds.includes(booking.id);
            return (
              <article
                key={booking.id}
                className="group overflow-hidden rounded-[32px] border border-slate-200 bg-white p-2 transition-all hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-6 p-6">
                  {/* Tutor Info & Status */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between lg:justify-start gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xl shadow-inner">
                        {booking.tutorProfile.user.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none group-hover:text-indigo-600 transition-colors">
                          {booking.tutorProfile.user.name}
                        </h3>
                        <span
                          className={`mt-2 inline-block rounded-lg px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest border ${statusTone[booking.status]}`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-slate-50 text-slate-400 group-hover:text-indigo-500 transition-colors">
                          <CalendarDays size={18} />
                        </div>
                        <span className="text-sm font-bold text-slate-600">
                          {new Date(booking.scheduledAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-slate-50 text-slate-400 group-hover:text-indigo-500 transition-colors">
                          <Clock3 size={18} />
                        </div>
                        <span className="text-sm font-bold text-slate-600">
                          {booking.duration} min
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-slate-50 text-slate-400 group-hover:text-indigo-500 transition-colors">
                          <Wallet size={18} />
                        </div>
                        <span className="text-sm font-bold text-slate-900">
                          ${booking.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {booking.note && (
                      <div className="relative rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-500 italic border-l-4 border-indigo-200">
                        "{booking.note}"
                      </div>
                    )}
                  </div>

                  {/* Actions Area */}
                  <div className="lg:pl-6 lg:border-l border-slate-100 flex flex-col gap-3 min-w-[200px]">
                    {booking.status === "CONFIRMED" && (
                      <Button
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={updatingBookingId === booking.id}
                        className="w-full h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white transition-all font-bold"
                      >
                        {updatingBookingId === booking.id ? (
                          <LoaderCircle className="animate-spin" />
                        ) : (
                          "Cancel Session"
                        )}
                      </Button>
                    )}

                    {booking.status === "COMPLETED" && (
                      <Button
                        onClick={() =>
                          setReviewDraft({
                            bookingId: booking.id,
                            rating: 5,
                            comment: "",
                          })
                        }
                        disabled={alreadyReviewed}
                        className={`w-full h-12 rounded-2xl font-bold transition-all ${
                          alreadyReviewed
                            ? "bg-slate-100 text-slate-400"
                            : "bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5"
                        }`}
                      >
                        {alreadyReviewed ? "Reviewed" : "Leave a Review"}
                      </Button>
                    )}

                    {booking.status === "CANCELLED" && (
                      <div className="flex items-center justify-center h-12 rounded-2xl bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-100">
                        Inactive
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StudentBookingsPage;
