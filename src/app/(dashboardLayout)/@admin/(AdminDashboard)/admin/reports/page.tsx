"use client";

import Link from "next/link";
import { BarChart3, Sparkles } from "lucide-react";

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-br from-primary via-primary to-secondary p-6 text-white shadow-lg">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] mb-3">
          <Sparkles className="h-3.5 w-3.5" /> Reports
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Reports</h1>
        <p className="mt-2 text-sm text-white/90">
          Review live platform charts and system summaries from the overview.
        </p>
      </section>

      <Link
        href="/admin"
        className="flex items-center gap-3 rounded-3xl border border-primary/15 bg-card p-6 text-slate-700 shadow-sm hover:border-secondary/30"
      >
        <BarChart3 className="h-5 w-5 text-secondary" />
        <span className="text-sm font-semibold">Open dashboard overview</span>
      </Link>
    </div>
  );
}
