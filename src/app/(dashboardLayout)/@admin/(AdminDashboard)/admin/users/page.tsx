"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Ban,
  CheckCircle2,
  LoaderCircle,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  isBanned: boolean;
  createdAt: string;
  tutorProfile?: {
    id: number;
    hourlyRate: number;
    avgRating: number;
    totalReviews: number;
    isApproved: boolean;
  } | null;
};

const roleBadge: Record<string, string> = {
  STUDENT: "bg-indigo-50 text-indigo-700 border-indigo-200",
  TUTOR: "bg-sky-50 text-sky-700 border-sky-200",
  ADMIN: "bg-rose-50 text-rose-700 border-rose-200",
};

const AdminUsersPage = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  const { token } = useAuth();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) { setIsLoading(false); return; }
      try {
        const res = await fetch(`${baseUrl}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Failed to load users");
        setUsers(Array.isArray(result.data) ? result.data : []);
      } catch (error) {
        await Swal.fire({ icon: "error", title: "Failed to load users", confirmButtonColor: "#e11d48" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [baseUrl, token]);

  const handleToggleBan = async (user: AdminUser) => {
    setUpdatingId(user.id);
    try {
      const res = await fetch(`${baseUrl}/admin/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isBanned: !user.isBanned }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to update user");
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isBanned: !u.isBanned } : u))
      );
      await Swal.fire({
        icon: "success",
        title: user.isBanned ? "User unbanned" : "User banned",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error: any) {
      await Swal.fire({ icon: "error", title: "Update failed", text: error.message, confirmButtonColor: "#e11d48" });
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = users.filter((u) =>
    [u.name, u.email, u.role].join(" ").toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <LoaderCircle className="h-5 w-5 animate-spin text-rose-600" />
          <span className="text-sm font-medium text-slate-600">Loading users...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="rounded-3xl bg-gradient-to-br from-rose-600 via-pink-600 to-orange-500 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]">
              <Sparkles className="h-3.5 w-3.5" />
              User Management
            </div>
            <h1 className="text-3xl font-bold tracking-tight">All Users</h1>
            <p className="text-sm text-rose-50/90">View, search, and manage all registered users. Ban or unban accounts.</p>
          </div>
          <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold">
            {filtered.length} of {users.length} users
          </div>
        </div>
      </section>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or role..."
          className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
        />
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-5 py-3 text-left font-semibold text-slate-600">User</th>
                <th className="px-5 py-3 text-left font-semibold text-slate-600">Role</th>
                <th className="px-5 py-3 text-left font-semibold text-slate-600">Status</th>
                <th className="px-5 py-3 text-left font-semibold text-slate-600">Joined</th>
                <th className="px-5 py-3 text-left font-semibold text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-slate-400">No users found.</td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${roleBadge[user.role] ?? "bg-slate-50 text-slate-600 border-slate-200"}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {user.isBanned ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-700">
                          <Ban className="h-3 w-3" /> Banned
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" /> Active
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      {user.role !== "ADMIN" && (
                        <Button
                          onClick={() => handleToggleBan(user)}
                          disabled={updatingId === user.id}
                          className={`h-8 rounded-xl px-3 text-xs font-semibold ${
                            user.isBanned
                              ? "bg-emerald-600 text-white hover:bg-emerald-700"
                              : "bg-red-600 text-white hover:bg-red-700"
                          }`}
                        >
                          {updatingId === user.id ? (
                            <LoaderCircle className="h-3 w-3 animate-spin" />
                          ) : user.isBanned ? (
                            "Unban"
                          ) : (
                            "Ban"
                          )}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;