"use client";

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { CalendarDays, ChevronsUpDown, Clock3, Eye, LoaderCircle, Search, Sparkles, Trash2, Wallet, BookOpen } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

type BookingStatus = "CONFIRMED" | "COMPLETED" | "CANCELLED";
type AdminBooking = {
  id: number;
  scheduledAt: string;
  duration: number;
  totalPrice: number;
  status: BookingStatus;
  note: string | null;
  student: { id: number; name: string; email: string };
  tutorProfile: { id: number; user: { id: number; name: string; email: string } };
};

const statusTone: Record<BookingStatus, string> = {
  CONFIRMED: "border-primary bg-primary text-white",
  COMPLETED: "border-primary bg-primary text-white",
  CANCELLED: "border-secondary/30 bg-secondary/10 text-secondary",
};

const AdminBookingsPage = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const { token } = useAuth();
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "ALL">("ALL");
  const [sortKey, setSortKey] = useState<"scheduledAt" | "totalPrice" | "duration" | "status">("scheduledAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const pageSize = 6;

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) { setIsLoading(false); return; }
      try {
        const res = await fetch(`${baseUrl}/admin/bookings`, {
          headers: { Authorization: `Bearer ${token}` }, cache: "no-store",
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Failed");
        setBookings(Array.isArray(result.data) ? result.data : []);
      } catch {
        await Swal.fire({ icon: "error", title: "Failed to load bookings", confirmButtonColor: "#B45309" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, [baseUrl, token]);

  const handleSort = (key: typeof sortKey) => {
    setSortKey(key);
    setSortDirection((current) =>
      sortKey === key && current === "asc" ? "desc" : "asc",
    );
  };

  const handleView = async (booking: AdminBooking) => {
    await Swal.fire({
      icon: "info",
      title: `Booking #${booking.id}`,
      html: `<div style="text-align:left"><p><b>Student:</b> ${booking.student.name}</p><p><b>Tutor:</b> ${booking.tutorProfile.user.name}</p><p><b>Status:</b> ${booking.status}</p><p><b>Total:</b> $${booking.totalPrice.toFixed(2)}</p></div>`,
      confirmButtonColor: "#B45309",
    });
  };

  const handleStatusUpdate = async (booking: AdminBooking, status: BookingStatus) => {
    setUpdatingId(booking.id);
    try {
      const res = await fetch(`${baseUrl}/admin/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to update booking");
      setBookings((prev) => prev.map((item) => item.id === booking.id ? { ...item, status } : item));
    } catch (error: any) {
      await Swal.fire({ icon: "error", title: "Update failed", text: error.message, confirmButtonColor: "#B45309" });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (booking: AdminBooking) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: `Delete booking #${booking.id}?`,
      showCancelButton: true,
      confirmButtonColor: "#B45309",
      confirmButtonText: "Delete",
    });
    if (!confirm.isConfirmed) return;
    setUpdatingId(booking.id);
    try {
      const res = await fetch(`${baseUrl}/admin/bookings/${booking.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const result = await res.json().catch(() => ({}));
        throw new Error(result.message || "Failed to delete booking");
      }
      setBookings((prev) => prev.filter((item) => item.id !== booking.id));
    } catch (error: any) {
      await Swal.fire({ icon: "error", title: "Delete failed", text: error.message, confirmButtonColor: "#B45309" });
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = useMemo(() => {
    return bookings
      .filter((b) => {
        const matchSearch = [b.student.name, b.student.email, b.tutorProfile.user.name, b.tutorProfile.user.email].join(" ").toLowerCase().includes(search.toLowerCase());
        return matchSearch && (statusFilter === "ALL" || b.status === statusFilter);
      })
      .sort((a, b) => {
        const modifier = sortDirection === "asc" ? 1 : -1;
        return String(a[sortKey]).localeCompare(String(b[sortKey]), undefined, { numeric: true }) * modifier;
      });
  }, [bookings, search, statusFilter, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (isLoading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex items-center gap-3 rounded-2xl border border-primary/15 bg-card px-5 py-4 shadow-sm">
        <LoaderCircle className="h-5 w-5 animate-spin text-secondary" />
        <span className="text-sm text-slate-600">Loading bookings...</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-br from-primary via-primary to-secondary p-6 text-white shadow-lg">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] mb-3">
          <Sparkles className="h-3.5 w-3.5" /> Booking Management
        </div>
        <h1 className="text-3xl font-bold tracking-tight">All Bookings</h1>
        <p className="mt-2 text-sm text-white/90">Monitor all platform session bookings.</p>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search student or tutor..."
            className="w-full rounded-2xl border border-primary/15 bg-card py-3 pl-11 pr-4 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["ALL", "CONFIRMED", "COMPLETED", "CANCELLED"] as const).map((s) => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`rounded-2xl border px-3 py-2 text-xs font-semibold transition-colors ${statusFilter === s ? "border-secondary/40 bg-secondary/10 text-secondary" : "border-primary/15 bg-card text-slate-600 hover:bg-canvas"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {[
          { label: "Date", key: "scheduledAt" },
          { label: "Price", key: "totalPrice" },
          { label: "Duration", key: "duration" },
          { label: "Status", key: "status" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => handleSort(item.key as typeof sortKey)}
            className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-semibold transition-colors ${sortKey === item.key ? "border-secondary/40 bg-secondary/10 text-secondary" : "border-primary/15 bg-card text-slate-600 hover:bg-canvas"}`}
          >
            {item.label} <ChevronsUpDown className="h-3 w-3" />
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-canvas p-10 text-center text-sm text-slate-400">No bookings match your filters.</div>
        ) : paginated.map((b) => (
          <div key={b.id} className="rounded-3xl border border-primary/15 bg-card p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h3 className="font-semibold text-slate-900">Booking #{b.id}</h3>
              <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusTone[b.status]}`}>{b.status}</span>
            </div>
            <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2 xl:grid-cols-4">
              <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" />Student: {b.student.name}</div>
              <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" />Tutor: {b.tutorProfile.user.name}</div>
              <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-secondary" />{new Date(b.scheduledAt).toLocaleString()}</div>
              <div className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-secondary" />{b.duration} min</div>
              <div className="flex items-center gap-2"><Wallet className="h-4 w-4 text-primary" />${b.totalPrice.toFixed(2)}</div>
            </div>
            {b.note && <p className="mt-3 rounded-2xl border border-primary/10 bg-canvas px-4 py-2 text-sm text-slate-500">{b.note}</p>}
            <div className="mt-4 flex flex-wrap gap-2 border-t border-primary/10 pt-4">
              <Button onClick={() => handleView(b)} className="h-8 rounded-xl bg-slate-700 px-3 text-xs font-semibold text-white hover:bg-slate-800">
                <Eye className="h-3 w-3" /> View
              </Button>
              {(["CONFIRMED", "COMPLETED", "CANCELLED"] as const).map((status) => (
                <Button
                  key={status}
                  onClick={() => handleStatusUpdate(b, status)}
                  disabled={updatingId === b.id || b.status === status}
                  className="h-8 rounded-xl bg-secondary px-3 text-xs font-semibold text-white hover:bg-secondary/90 disabled:opacity-50"
                >
                  {updatingId === b.id ? <LoaderCircle className="h-3 w-3 animate-spin" /> : status}
                </Button>
              ))}
              <Button onClick={() => handleDelete(b)} disabled={updatingId === b.id} className="h-8 rounded-xl bg-red-600 px-3 text-xs font-semibold text-white hover:bg-red-700">
                <Trash2 className="h-3 w-3" /> Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-2xl border border-primary/15 bg-card px-4 py-3 text-sm text-slate-600">
        <span>Page {currentPage} of {totalPages}</span>
        <div className="flex gap-2">
          <Button onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={currentPage === 1} className="h-8 rounded-xl bg-slate-100 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-200">
            Previous
          </Button>
          <Button onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={currentPage === totalPages} className="h-8 rounded-xl bg-secondary px-3 text-xs font-semibold text-white hover:bg-secondary/90">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingsPage;
