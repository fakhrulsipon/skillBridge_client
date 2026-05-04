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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
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
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 p-6 text-white shadow-lg">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] mb-3">
          <Sparkles className="h-3.5 w-3.5" /> My Bookings
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Booking History</h1>
        <p className="mt-2 text-sm text-indigo-50/90">
          All your sessions — upcoming, completed, and cancelled.
        </p>
      </section>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total", key: "ALL", color: "text-slate-900" },
          { label: "Upcoming", key: "CONFIRMED", color: "text-sky-700" },
          { label: "Completed", key: "COMPLETED", color: "text-emerald-700" },
          { label: "Cancelled", key: "CANCELLED", color: "text-rose-700" },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => setStatusFilter(s.key as BookingStatus | "ALL")}
            className={`rounded-3xl border p-4 text-left shadow-sm transition-all ${statusFilter === s.key ? "border-indigo-300 bg-indigo-50" : "border-slate-200 bg-white hover:border-indigo-200"}`}
          >
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className={`mt-1 text-2xl font-bold ${s.color}`}>
              {counts[s.key as keyof typeof counts]}
            </p>
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-400">
            No bookings in this category yet.
          </div>
        ) : (
          filtered.map((booking) => {
            const alreadyReviewed = reviewedBookingIds.includes(booking.id);
            return (
              <article
                key={booking.id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {booking.tutorProfile.user.name}
                      </h3>
                      <span
                        className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${statusTone[booking.status]}`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2 xl:grid-cols-4">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-indigo-600" />
                        {new Date(booking.scheduledAt).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-indigo-600" />
                        {booking.duration} min
                      </div>
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-indigo-600" />$
                        {booking.totalPrice.toFixed(2)}
                      </div>
                    </div>
                    {booking.note && (
                      <p className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-2 text-sm text-slate-500">
                        {booking.note}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 sm:min-w-52">
                    {booking.status === "CONFIRMED" && (
                      <Button
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={updatingBookingId === booking.id}
                        className="rounded-2xl bg-rose-600 text-white hover:bg-rose-700"
                      >
                        {updatingBookingId === booking.id ? (
                          <>
                            <LoaderCircle className="h-4 w-4 animate-spin" />{" "}
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4" /> Cancel
                          </>
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
                        className="rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700"
                      >
                        <MessageSquareQuote className="h-4 w-4" />
                        {alreadyReviewed ? "Review submitted" : "Leave review"}
                      </Button>
                    )}
                    {booking.status === "CANCELLED" && (
                      <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                        Session cancelled.
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Review modal */}
      {reviewDraft && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setReviewDraft(null);
          }}
        >
          <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-2xl font-semibold text-slate-900">
              Leave a review
            </h3>
            <div className="mt-6 space-y-5">
              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() =>
                        setReviewDraft((cur) =>
                          cur ? { ...cur, rating: v } : cur,
                        )
                      }
                      className="rounded-full p-2 hover:bg-amber-50"
                    >
                      <Star
                        className={`h-6 w-6 ${v <= reviewDraft.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="comment">Comment</Label>
                <Textarea
                  id="comment"
                  rows={5}
                  value={reviewDraft.comment}
                  onChange={(e) =>
                    setReviewDraft((cur) =>
                      cur ? { ...cur, comment: e.target.value } : cur,
                    )
                  }
                  placeholder="What did you like about the session?"
                  className="resize-none rounded-2xl"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setReviewDraft(null)}
                className="rounded-2xl"
              >
                Close
              </Button>
              <Button
                onClick={handleSubmitReview}
                disabled={submittingReview}
                className="rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700"
              >
                {submittingReview ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />{" "}
                    Submitting...
                  </>
                ) : (
                  <>
                    <Star className="h-4 w-4" /> Submit review
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentBookingsPage;
