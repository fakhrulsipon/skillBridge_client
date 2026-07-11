import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Search,
  ShieldCheck,
  Star,
  Users,
  Zap,
} from "lucide-react";

import HowItWorks from "@/components/home/HowItWorks";

const studentFlow = [
  {
    icon: Search,
    title: "Find the right tutor",
    desc: "Browse verified tutor profiles by subject, location, hourly rate, rating, and experience.",
  },
  {
    icon: CalendarDays,
    title: "Choose an open slot",
    desc: "Review tutor availability and select the session time that fits your schedule.",
  },
  {
    icon: CreditCard,
    title: "Book securely",
    desc: "Confirm your session with a secure payment flow and keep your booking in your dashboard.",
  },
  {
    icon: Star,
    title: "Review your session",
    desc: "After learning, share feedback so future students can choose with confidence.",
  },
];

const platformFlow = [
  {
    icon: Users,
    title: "Students",
    desc: "Students manage bookings, track completed sessions, and review tutors from one dashboard.",
  },
  {
    icon: BookOpen,
    title: "Tutors",
    desc: "Tutors maintain profiles, subjects, rates, availability, and session requests.",
  },
  {
    icon: ShieldCheck,
    title: "Admins",
    desc: "Admins monitor users, bookings, categories, reports, and platform activity.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-canvas/40 selection:bg-primary/20">
      {/* Hero Section */}
      <section className="bg-card border-b border-primary/10 py-16 md:py-24 relative overflow-hidden">
        {/* Subtle Decorative Background Element */}
        <div className="absolute right-0 top-0 -z-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute left-1/3 bottom-0 -z-10 h-56 w-56 rounded-full bg-primary/5 blur-3xl" />
        
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-xs font-semibold text-primary">
              <Zap size={13} className="animate-pulse" /> How SkillBridge Works
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              From tutor discovery to{" "}
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                completed learning
              </span>{" "}
              sessions.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-slate-500 leading-relaxed font-medium">
              SkillBridge connects students with verified tutors, supports
              secure bookings, and gives every role a focused dashboard for the
              work they need to complete.
            </p>
          </div>
        </div>
      </section>

      {/* Embedded Inner Component */}
      <HowItWorks />

      {/* Student Booking Flow Section */}
      <section className="bg-gradient-to-b from-canvas via-primary/5 to-canvas py-24 border-y border-primary/5">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-xs font-semibold text-primary">
              <CheckCircle2 size={12} /> Student booking flow
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 md:text-5xl tracking-tight">
              Every session follows a clear path
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {studentFlow.map((item, index) => (
              <div
                key={item.title}
                className="group relative rounded-3xl border border-primary/10 bg-card p-8 shadow-sm hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Step Indicator Number */}
                <span className="absolute right-6 top-6 text-4xl font-black text-slate-200/50 group-hover:text-primary/10 transition-colors select-none">
                  0{index + 1}
                </span>

                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-md shadow-primary/20 group-hover:scale-110 transition-transform">
                  <item.icon size={22} />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900 tracking-tight group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role-Based Platform Section */}
      <section className="bg-card py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-xs font-semibold text-primary">
              <ShieldCheck size={12} /> Role-based platform
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 md:text-5xl tracking-tight">
              Built around each user role
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {platformFlow.map((item) => (
              <div
                key={item.title}
                className="group rounded-3xl border border-primary/10 bg-canvas/30 p-8 hover:bg-canvas hover:border-primary/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-md shadow-primary/10">
                    <item.icon size={22} />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-slate-900 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/explore"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-10 py-4 font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary/95 transition-all hover:shadow-xl hover:shadow-primary/35 hover:-translate-y-0.5 active:translate-y-0"
            >
              Explore tutors
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}