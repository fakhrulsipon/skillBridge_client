"use client";

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  Ban,
  CheckCircle2,
  ChevronsUpDown,
  Eye,
  Pencil,
  LoaderCircle,
  Search,
  Sparkles,
  Trash2,
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
  STUDENT: "bg-primary text-white border-primary",
  TUTOR: "bg-primary text-white border-primary",
  ADMIN: "bg-secondary/10 text-secondary border-secondary/30",
};

type EditableUserFields = {
  name: string;
  role?: string;
};

const readApiMessage = (value: unknown, fallback: string) => {
  if (value && typeof value === "object" && "message" in value) {
    const message = (value as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }

  return fallback;
};

const errorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

const deleteUserPaths = (userId: number) => [
  `/admin/users/${userId}`,
  `/admin/user/${userId}`,
  `/users/${userId}`,
  `/user/${userId}`,
  `/admin/users/${userId}/delete`,
];

const AdminUsersPage = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const { token } = useAuth();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortKey, setSortKey] = useState<keyof AdminUser>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const pageSize = 8;

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
      } catch {
        await Swal.fire({ icon: "error", title: "Failed to load users", confirmButtonColor: "#B45309" });
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
    } catch (error: unknown) {
      await Swal.fire({ icon: "error", title: "Update failed", text: errorMessage(error, "Failed to update user"), confirmButtonColor: "#B45309" });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSort = (key: keyof AdminUser) => {
    setSortKey(key);
    setSortDirection((current) =>
      sortKey === key && current === "asc" ? "desc" : "asc",
    );
  };

  const handleViewUser = async (user: AdminUser) => {
    await Swal.fire({
      icon: "info",
      title: user.name,
      html: `<div style="text-align:left"><p><b>Email:</b> ${user.email}</p><p><b>Role:</b> ${user.role}</p><p><b>Status:</b> ${user.isBanned ? "Banned" : "Active"}</p></div>`,
      confirmButtonColor: "#B45309",
    });
  };

  const handleEditUser = async (user: AdminUser) => {
    const result = await Swal.fire({
      title: "Edit user",
      html:
        `<input id="admin-user-name" class="swal2-input" value="${user.name}" placeholder="Full name" />` +
        `<select id="admin-user-role" class="swal2-select"><option value="STUDENT">STUDENT</option><option value="TUTOR">TUTOR</option><option value="ADMIN">ADMIN</option></select>`,
      didOpen: () => {
        const roleSelect = document.getElementById("admin-user-role") as HTMLSelectElement | null;
        if (roleSelect) roleSelect.value = user.role;
      },
      preConfirm: () => {
        const name = (document.getElementById("admin-user-name") as HTMLInputElement | null)?.value.trim();
        const role = (document.getElementById("admin-user-role") as HTMLSelectElement | null)?.value;
        if (!name) {
          Swal.showValidationMessage("Name is required");
          return false;
        }
        return { name, role } satisfies EditableUserFields;
      },
      showCancelButton: true,
      confirmButtonColor: "#B45309",
      confirmButtonText: "Save",
    });

    if (!result.isConfirmed || !result.value) return;
    setUpdatingId(user.id);
    try {
      const res = await fetch(`${baseUrl}/admin/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(result.value),
      });
      const apiResult = await res.json();
      if (!res.ok) throw new Error(apiResult.message || "Failed to update user");
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, ...result.value } : u)),
      );
    } catch (error: unknown) {
      await Swal.fire({ icon: "error", title: "Update failed", text: errorMessage(error, "Failed to update user"), confirmButtonColor: "#B45309" });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async (user: AdminUser) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: `Delete ${user.name}?`,
      text: "This action is permanent.",
      showCancelButton: true,
      confirmButtonColor: "#B45309",
      confirmButtonText: "Delete",
    });
    if (!confirm.isConfirmed) return;
    setUpdatingId(user.id);
    try {
      let lastMessage = "Failed to delete user";
      let deleted = false;

      for (const path of deleteUserPaths(user.id)) {
        const res = await fetch(`${baseUrl}${path}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          deleted = true;
          break;
        }

        const apiResult = await res.json().catch(() => ({}));
        lastMessage = readApiMessage(apiResult, lastMessage);

        if (res.status !== 404) break;
      }

      if (!deleted) throw new Error(lastMessage);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (error: unknown) {
      await Swal.fire({ icon: "error", title: "Delete failed", text: errorMessage(error, "Failed to delete user"), confirmButtonColor: "#B45309" });
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = useMemo(() => {
    return users
      .filter((u) =>
        [u.name, u.email, u.role].join(" ").toLowerCase().includes(search.toLowerCase()),
      )
      .filter((u) => roleFilter === "ALL" || u.role === roleFilter)
      .filter((u) =>
        statusFilter === "ALL" ||
        (statusFilter === "BANNED" ? u.isBanned : !u.isBanned),
      )
      .sort((a, b) => {
        const first = a[sortKey];
        const second = b[sortKey];
        const modifier = sortDirection === "asc" ? 1 : -1;
        return String(first ?? "").localeCompare(String(second ?? "")) * modifier;
      });
  }, [users, search, roleFilter, statusFilter, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-primary/15 bg-card px-5 py-4 shadow-sm">
          <LoaderCircle className="h-5 w-5 animate-spin text-secondary" />
          <span className="text-sm font-medium text-slate-600">Loading users...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="rounded-3xl bg-gradient-to-br from-primary via-primary to-secondary p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]">
              <Sparkles className="h-3.5 w-3.5" />
              User Management
            </div>
            <h1 className="text-3xl font-bold tracking-tight">All Users</h1>
            <p className="text-sm text-white/90">View, search, and manage all registered users. Ban or unban accounts.</p>
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
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name, email, or role..."
          className="w-full rounded-2xl border border-primary/15 bg-card py-3 pl-11 pr-4 text-sm text-slate-700 outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="rounded-2xl border border-primary/15 bg-card px-4 py-3 text-sm text-slate-700 outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
        >
          <option value="ALL">All roles</option>
          <option value="STUDENT">Students</option>
          <option value="TUTOR">Tutors</option>
          <option value="ADMIN">Admins</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-2xl border border-primary/15 bg-card px-4 py-3 text-sm text-slate-700 outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
        >
          <option value="ALL">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="BANNED">Banned</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-primary/15 bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-primary/10 bg-canvas">
                <th className="px-5 py-3 text-left font-semibold text-slate-600">
                  <button onClick={() => handleSort("name")} className="inline-flex items-center gap-1">User <ChevronsUpDown className="h-3 w-3" /></button>
                </th>
                <th className="px-5 py-3 text-left font-semibold text-slate-600">
                  <button onClick={() => handleSort("role")} className="inline-flex items-center gap-1">Role <ChevronsUpDown className="h-3 w-3" /></button>
                </th>
                <th className="px-5 py-3 text-left font-semibold text-slate-600">
                  <button onClick={() => handleSort("isBanned")} className="inline-flex items-center gap-1">Status <ChevronsUpDown className="h-3 w-3" /></button>
                </th>
                <th className="px-5 py-3 text-left font-semibold text-slate-600">
                  <button onClick={() => handleSort("createdAt")} className="inline-flex items-center gap-1">Joined <ChevronsUpDown className="h-3 w-3" /></button>
                </th>
                <th className="px-5 py-3 text-left font-semibold text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-slate-400">No users found.</td>
                </tr>
              ) : (
                paginated.map((user) => (
                  <tr key={user.id} className="border-b border-slate-50 hover:bg-canvas/50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${roleBadge[user.role] ?? "bg-canvas text-slate-600 border-primary/15"}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {user.isBanned ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-700">
                          <Ban className="h-3 w-3" /> Banned
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary border border-primary px-2.5 py-1 text-xs font-semibold text-white">
                          <CheckCircle2 className="h-3 w-3" /> Active
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Button onClick={() => handleViewUser(user)} className="h-8 rounded-xl bg-slate-700 px-3 text-xs font-semibold text-white hover:bg-slate-800">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button onClick={() => handleEditUser(user)} disabled={updatingId === user.id} className="h-8 rounded-xl bg-primary px-3 text-xs font-semibold text-white hover:bg-primary">
                          <Pencil className="h-3 w-3" />
                        </Button>
                        {user.role !== "ADMIN" && (
                        <Button
                          onClick={() => handleToggleBan(user)}
                          disabled={updatingId === user.id}
                          className={`h-8 rounded-xl px-3 text-xs font-semibold ${
                            user.isBanned
                              ? "bg-primary text-white hover:bg-primary"
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
                        {user.role !== "ADMIN" && (
                          <Button onClick={() => handleDeleteUser(user)} disabled={updatingId === user.id} className="h-8 rounded-xl bg-red-600 px-3 text-xs font-semibold text-white hover:bg-red-700">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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

export default AdminUsersPage;
