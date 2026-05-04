"use client";

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  Sparkles,
  UserRound,
  Video,
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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
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
      <section className="rounded-3xl bg-gradient-to-br from-sky-600 via-cyan-600 to-teal-500 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]">
              <Sparkles className="h-3.5 w-3.5" />
              Tutor sessions
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {user?.name ? `${user.name}'s Sessions` : "View your sessions"}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-sky-50/90">
                Review confirmed sessions, keep track of completed lessons, and
                mark a booking complete after the lesson ends.
              </p>
            </div>
          </div>

          <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold">
            {confirmedBookings.length} confirmed, {completedBookings.length} completed
          </div>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total sessions</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{bookings.length}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Ready to teach</p>
          <p className="mt-2 text-3xl font-bold text-sky-700">{confirmedBookings.length}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Completed sessions</p>
          <p className="mt-2 text-3xl font-bold text-emerald-700">{completedBookings.length}</p>
        </div>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Session pipeline</h2>
          <p className="mt-1 text-sm text-slate-500">
            Bookings start as confirmed. Tutors can move them to completed after
            the session is delivered.
          </p>
        </div>

        <div className="space-y-4">
          {bookings.length ? (
            bookings.map((booking) => (
              <article
                key={booking.id}
                className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold text-slate-900">
                        Session #{booking.id}
                      </h3>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusTone[booking.status]}`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2 xl:grid-cols-4">
                      <div className="inline-flex items-center gap-2">
                        <UserRound className="h-4 w-4 text-sky-600" />
                        {booking.student.name}
                      </div>
                      <div className="inline-flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-sky-600" />
                        {new Date(booking.scheduledAt).toLocaleString()}
                      </div>
                      <div className="inline-flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-sky-600" />
                        {booking.duration} minutes
                      </div>
                      <div className="inline-flex items-center gap-2">
                        <Video className="h-4 w-4 text-sky-600" />
                        ${booking.totalPrice.toFixed(2)}
                      </div>
                    </div>

                    {booking.note ? (
                      <p className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                        {booking.note}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-3 sm:min-w-56">
                    {booking.status === "CONFIRMED" ? (
                      <Button
                        onClick={() => handleMarkComplete(booking.id)}
                        disabled={updatingBookingId === booking.id}
                        className="rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700"
                      >
                        {updatingBookingId === booking.id ? (
                          <>
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            Mark complete
                          </>
                        )}
                      </Button>
                    ) : (
                      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
                        {booking.status === "COMPLETED"
                          ? "This session is already completed."
                          : "This session was cancelled by the student."}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
              No sessions yet. Once students book you, they will appear here.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TutorSessionsPage;
