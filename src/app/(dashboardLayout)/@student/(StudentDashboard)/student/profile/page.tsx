"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import Swal from "sweetalert2";
import { ChevronRight, GraduationCap, HelpCircle, Link, LoaderCircle, Mail, ShieldCheck, Sparkles, UserCircle } from "lucide-react";

const StudentProfilePage = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const { user, token, isLoading, setAuth } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleProfileUpdate = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    if (trimmedName.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      await Swal.fire({ icon: "error", title: "Check your profile details", confirmButtonColor: "#047857" });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`${baseUrl}/users/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: trimmedName, email: trimmedEmail }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to update profile");
      setAuth({ ...(user || { role: "STUDENT" }), name: trimmedName, email: trimmedEmail }, token);
      await Swal.fire({ icon: "success", title: "Profile updated", timer: 1500, showConfirmButton: false });
    } catch (error: any) {
      await Swal.fire({ icon: "error", title: "Update failed", text: error.message, confirmButtonColor: "#047857" });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (currentPassword.length < 6 || newPassword.length < 8 || !/^(?=.*[A-Za-z])(?=.*\d).+$/.test(newPassword)) {
      await Swal.fire({ icon: "error", title: "Use a stronger password", text: "New password needs 8 characters with letters and numbers.", confirmButtonColor: "#047857" });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const response = await fetch(`${baseUrl}/auth/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to update password");
      setCurrentPassword("");
      setNewPassword("");
      await Swal.fire({ icon: "success", title: "Password updated", timer: 1500, showConfirmButton: false });
    } catch (error: any) {
      await Swal.fire({ icon: "error", title: "Password update failed", text: error.message, confirmButtonColor: "#047857" });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-primary/15 bg-card px-5 py-4 shadow-sm">
          <LoaderCircle className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm font-medium text-slate-600">
            Loading your profile...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-8xl mx-auto">
  {/* ─── PREMIUM HERO SECTION ─── */}
  <section className="relative overflow-hidden rounded-[40px] border border-primary bg-gradient-to-br from-primary via-primary to-primary p-10 text-white shadow-2xl shadow-primary">
    {/* Decorative Elements */}
    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse" />
    <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-primary/20 blur-2xl" />
    
    <div className="relative z-10">
      <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-white/10">
        <Sparkles size={14} className="text-secondary fill-secondary" /> My Profile
      </div>
      <h1 className="text-5xl font-black tracking-tight leading-tight">
        {user?.name ? (
          <>
            <span className="text-primary">{user.name.split(" ")[0]}</span>s Space
          </>
        ) : "Student Profile"}
      </h1>
      <p className="mt-4 max-w-2xl text-lg font-medium text-primary/80 leading-relaxed">
        Manage your personal identity and track your growth within the <span className="text-white font-bold">SkillBridge</span> ecosystem.
      </p>
    </div>
  </section>

  <div className="grid gap-8 lg:grid-cols-5">
    {/* ─── ACCOUNT INFO CARD ─── */}
    <div className="lg:col-span-3 rounded-[40px] border border-primary/10 bg-card p-10 shadow-sm transition-all hover:shadow-xl hover:shadow-primary/5">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Account <span className="text-primary">Details</span>
        </h2>
        <div className="h-1 w-20 bg-primary rounded-full" />
      </div>
      
      <div className="grid gap-6">
        {[
          { label: "Full Name", value: user?.name, icon: UserCircle, color: "text-primary", bg: "bg-primary" },
          { label: "Email Address", value: user?.email, icon: Mail, color: "text-primary", bg: "bg-primary" },
          { label: "Account Role", value: user?.role, icon: ShieldCheck, color: "text-primary", bg: "bg-primary" },
        ].map((item, idx) => (
          <div key={idx} className="group flex items-center gap-6 rounded-3xl border border-transparent bg-canvas/50 p-6 transition-all hover:bg-card hover:border-primary/10 hover:shadow-md">
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.bg} ${item.color} shadow-sm group-hover:scale-110 transition-transform`}>
              <item.icon size={26} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                {item.label}
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900 tracking-tight">
                {item.value ?? "—"}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div id="settings" className="mt-10 grid gap-5">
        <div className="rounded-3xl border border-transparent bg-canvas/50 p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
            Basic Info
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-2xl border border-primary/15 bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary"
              placeholder="Full name"
            />
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-2xl border border-primary/15 bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary"
              placeholder="Email address"
            />
          </div>
          <button
            onClick={handleProfileUpdate}
            disabled={isSaving}
            className="mt-4 rounded-2xl bg-primary px-6 py-3 text-sm font-black text-white transition-all hover:bg-primary disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Update Profile"}
          </button>
        </div>

        <div className="rounded-3xl border border-transparent bg-canvas/50 p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
            Security
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="rounded-2xl border border-primary/15 bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary"
              placeholder="Current password"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="rounded-2xl border border-primary/15 bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary"
              placeholder="New password"
            />
          </div>
          <button
            onClick={handlePasswordUpdate}
            disabled={isUpdatingPassword}
            className="mt-4 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-black text-white transition-all hover:bg-primary disabled:opacity-60"
          >
            {isUpdatingPassword ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>

    {/* ─── JOURNEY CARD ─── */}
    <div className="lg:col-span-2 space-y-8">
      <div className="rounded-[40px] bg-primary p-10 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
          <GraduationCap size={120} />
        </div>
        
        <h2 className="relative z-10 mb-8 text-xl font-black tracking-tight flex items-center gap-2">
          Your <span className="text-primary underline decoration-primary/30 underline-offset-4 decoration-4">Journey</span>
        </h2>
        
        <ul className="relative z-10 space-y-6">
          {[
            "Find top-tier mentors across various subjects.",
            "Schedule sessions that fit your timeline.",
            "Track progress and mastery in your dashboard.",
            "Contribute to the community with reviews."
          ].map((text, i) => (
            <li key={i} className="flex items-start gap-4 group/item">
              <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary group-hover/item:scale-150 transition-transform" />
              <p className="text-sm font-bold text-primary/90 leading-relaxed group-hover/item:text-white transition-colors">
                {text}
              </p>
            </li>
          ))}
        </ul>

        <div className="relative z-10 mt-10 rounded-3xl bg-white/10 backdrop-blur-md p-6 border border-white/10">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary">
            Current Status
          </p>
          <div className="mt-3 flex items-center justify-between">
             <p className="text-sm font-bold">Ready to explore?</p>
             <Link
              href="/tutors"
              className="px-4 py-2 bg-primary rounded-xl text-xs font-black hover:bg-card hover:text-primary transition-all active:scale-95"
            >
              Browse Now
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Support Card */}
      <div className="rounded-[32px] border border-primary/10 bg-card p-6 flex items-center justify-between group cursor-pointer hover:border-primary transition-all">
         <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-canvas flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-primary transition-colors">
               <HelpCircle size={24} />
            </div>
            <div>
               <p className="font-black text-slate-900 text-sm">Need Help?</p>
               <p className="text-xs font-bold text-slate-400">Contact our support team</p>
            </div>
         </div>
         <ChevronRight size={20} className="text-slate-300 group-hover:text-primary" />
      </div>
    </div>
  </div>
</div>
  );
};

export default StudentProfilePage;
