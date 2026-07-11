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
    <div className="min-h-screen bg-slate-50/50">
      <section className="bg-white border-b border-slate-200 py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-semibold text-indigo-600">
              <Zap size={14} /> How SkillBridge Works
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight">
              From tutor discovery to completed learning sessions.
            </h1>
            <p className="mt-4 text-lg text-slate-500 leading-relaxed">
              SkillBridge connects students with verified tutors, supports
              secure bookings, and gives every role a focused dashboard for the
              work they need to complete.
            </p>
          </div>
        </div>
      </section>

      <HowItWorks />

      <section className="bg-gradient-to-br from-slate-50 to-indigo-50/30 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-xs font-semibold text-indigo-700">
              <CheckCircle2 size={12} /> Student booking flow
            </div>
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
              Every session follows a clear path
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {studentFlow.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                  <item.icon size={22} />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-xs font-semibold text-indigo-700">
              <ShieldCheck size={12} /> Role-based platform
            </div>
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
              Built around each user role
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {platformFlow.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-100 bg-slate-50 p-8 hover:border-indigo-200 hover:shadow-md transition-all"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                  <item.icon size={22} />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/explore"
              className="inline-flex rounded-xl bg-indigo-600 px-8 py-3 font-semibold text-white hover:bg-indigo-700 transition hover:shadow-lg hover:shadow-indigo-200"
            >
              Explore tutors
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
