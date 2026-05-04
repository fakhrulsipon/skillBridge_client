"use client";

import { useAuth } from "@/hooks/useAuth";
import { ChevronRight, GraduationCap, HelpCircle, Link, LoaderCircle, Mail, ShieldCheck, Sparkles, UserCircle } from "lucide-react";

const StudentProfilePage = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <LoaderCircle className="h-5 w-5 animate-spin text-indigo-600" />
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
  <section className="relative overflow-hidden rounded-[40px] border border-indigo-100 bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 p-10 text-white shadow-2xl shadow-indigo-200">
    {/* Decorative Elements */}
    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse" />
    <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-cyan-400/20 blur-2xl" />
    
    <div className="relative z-10">
      <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-white/10">
        <Sparkles size={14} className="text-yellow-300 fill-yellow-300" /> My Profile
      </div>
      <h1 className="text-5xl font-black tracking-tight leading-tight">
        {user?.name ? (
          <>
            <span className="text-indigo-200">{user.name.split(" ")[0]}</span>s Space
          </>
        ) : "Student Profile"}
      </h1>
      <p className="mt-4 max-w-2xl text-lg font-medium text-indigo-50/80 leading-relaxed">
        Manage your personal identity and track your growth within the <span className="text-white font-bold">SkillBridge</span> ecosystem.
      </p>
    </div>
  </section>

  <div className="grid gap-8 lg:grid-cols-5">
    {/* ─── ACCOUNT INFO CARD ─── */}
    <div className="lg:col-span-3 rounded-[40px] border border-slate-100 bg-white p-10 shadow-sm transition-all hover:shadow-xl hover:shadow-indigo-500/5">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Account <span className="text-indigo-600">Details</span>
        </h2>
        <div className="h-1 w-20 bg-indigo-50 rounded-full" />
      </div>
      
      <div className="grid gap-6">
        {[
          { label: "Full Name", value: user?.name, icon: UserCircle, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Email Address", value: user?.email, icon: Mail, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Account Role", value: user?.role, icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((item, idx) => (
          <div key={idx} className="group flex items-center gap-6 rounded-3xl border border-transparent bg-slate-50/50 p-6 transition-all hover:bg-white hover:border-slate-100 hover:shadow-md">
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
    </div>

    {/* ─── JOURNEY CARD ─── */}
    <div className="lg:col-span-2 space-y-8">
      <div className="rounded-[40px] bg-indigo-900 p-10 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
          <GraduationCap size={120} />
        </div>
        
        <h2 className="relative z-10 mb-8 text-xl font-black tracking-tight flex items-center gap-2">
          Your <span className="text-indigo-400 underline decoration-indigo-400/30 underline-offset-4 decoration-4">Journey</span>
        </h2>
        
        <ul className="relative z-10 space-y-6">
          {[
            "Find top-tier mentors across various subjects.",
            "Schedule sessions that fit your timeline.",
            "Track progress and mastery in your dashboard.",
            "Contribute to the community with reviews."
          ].map((text, i) => (
            <li key={i} className="flex items-start gap-4 group/item">
              <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-indigo-400 group-hover/item:scale-150 transition-transform" />
              <p className="text-sm font-bold text-indigo-100/90 leading-relaxed group-hover/item:text-white transition-colors">
                {text}
              </p>
            </li>
          ))}
        </ul>

        <div className="relative z-10 mt-10 rounded-3xl bg-white/10 backdrop-blur-md p-6 border border-white/10">
          <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">
            Current Status
          </p>
          <div className="mt-3 flex items-center justify-between">
             <p className="text-sm font-bold">Ready to explore?</p>
             <Link
              href="/tutors"
              className="px-4 py-2 bg-indigo-500 rounded-xl text-xs font-black hover:bg-white hover:text-indigo-900 transition-all active:scale-95"
            >
              Browse Now
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Support Card */}
      <div className="rounded-[32px] border border-slate-100 bg-white p-6 flex items-center justify-between group cursor-pointer hover:border-indigo-600 transition-all">
         <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
               <HelpCircle size={24} />
            </div>
            <div>
               <p className="font-black text-slate-900 text-sm">Need Help?</p>
               <p className="text-xs font-bold text-slate-400">Contact our support team</p>
            </div>
         </div>
         <ChevronRight size={20} className="text-slate-300 group-hover:text-indigo-600" />
      </div>
    </div>
  </div>
</div>
  );
};

export default StudentProfilePage;
