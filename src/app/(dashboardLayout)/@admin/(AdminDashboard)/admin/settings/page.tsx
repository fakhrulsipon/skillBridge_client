"use client";

import { Settings, Sparkles } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-br from-primary via-primary to-secondary p-6 text-white shadow-lg">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] mb-3">
          <Sparkles className="h-3.5 w-3.5" /> Settings
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
        <p className="mt-2 text-sm text-white/90">
          Configure platform management preferences and secure admin controls.
        </p>
      </section>

      <div className="rounded-3xl border border-primary/15 bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Settings className="h-5 w-5 text-secondary" />
          <p className="text-sm font-semibold text-slate-700">
            Settings are connected to the authenticated admin area.
          </p>
        </div>
      </div>
    </div>
  );
}
