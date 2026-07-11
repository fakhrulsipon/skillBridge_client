"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FolderOpen, LoaderCircle, Plus, Sparkles, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

type Category = { id: number; name: string; icon?: string | null; _count?: { tutors: number } };

const AdminCategoriesPage = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!token) { setIsLoading(false); return; }
      try {
        const res = await fetch(`${baseUrl}/admin/categories`, {
          headers: { Authorization: `Bearer ${token}` }, cache: "no-store",
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Failed");
        setCategories(Array.isArray(result.data) ? result.data : []);
      } catch {
        await Swal.fire({ icon: "error", title: "Failed to load categories", confirmButtonColor: "#B45309" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, [baseUrl, token]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setIsCreating(true);
    try {
      const res = await fetch(`${baseUrl}/admin/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newName.trim(), icon: newIcon.trim() || null }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed");
      setCategories((prev) => [...prev, result.data]);
      setNewName("");
      setNewIcon("");
      await Swal.fire({ icon: "success", title: "Category created", timer: 1500, showConfirmButton: false });
    } catch (error: any) {
      await Swal.fire({ icon: "error", title: "Failed", text: error.message, confirmButtonColor: "#B45309" });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: `Delete "${name}"?`,
      text: "This cannot be undone.",
      showCancelButton: true,
      confirmButtonColor: "#B45309",
      confirmButtonText: "Delete",
    });
    if (!confirm.isConfirmed) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${baseUrl}/admin/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed");
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (error: any) {
      await Swal.fire({ icon: "error", title: "Failed", text: error.message, confirmButtonColor: "#B45309" });
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex items-center gap-3 rounded-2xl border border-primary/15 bg-card px-5 py-4 shadow-sm">
        <LoaderCircle className="h-5 w-5 animate-spin text-secondary" />
        <span className="text-sm text-slate-600">Loading categories...</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-br from-primary via-primary to-secondary p-6 text-white shadow-lg">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] mb-3">
          <Sparkles className="h-3.5 w-3.5" /> Category Management
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="mt-2 text-sm text-white/90">Create and delete tutoring subject categories.</p>
      </section>

      {/* Create form */}
      <div className="rounded-3xl border border-primary/15 bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Add New Category</h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Category name (e.g. Mathematics)"
            className="flex-1 rounded-2xl border border-primary/15 bg-canvas px-4 py-2.5 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
          />
          <input
            type="text"
            value={newIcon}
            onChange={(e) => setNewIcon(e.target.value)}
            placeholder="Icon (emoji or URL, optional)"
            className="w-48 rounded-2xl border border-primary/15 bg-canvas px-4 py-2.5 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
          />
          <Button
            onClick={handleCreate}
            disabled={isCreating || !newName.trim()}
            className="rounded-2xl bg-secondary text-white hover:bg-secondary/90"
          >
            {isCreating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Create
          </Button>
        </div>
      </div>

      {/* Categories grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-canvas p-10 text-center text-sm text-slate-400">
            No categories yet. Create one above.
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between rounded-2xl border border-primary/15 bg-card p-4 shadow-sm hover:border-secondary/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-xl">
                  {cat.icon || <FolderOpen className="h-5 w-5 text-secondary" />}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{cat.name}</p>
                  {cat._count && (
                    <p className="text-xs text-slate-400">{cat._count.tutors} tutor{cat._count.tutors !== 1 ? "s" : ""}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDelete(cat.id, cat.name)}
                disabled={deletingId === cat.id}
                className="rounded-xl border border-red-200 bg-red-50 p-2 text-red-600 transition hover:bg-red-100 disabled:opacity-50"
              >
                {deletingId === cat.id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
