import Link from "next/link";
import { BookOpen, CalendarDays, ShieldCheck, Star } from "lucide-react";

const highlights = [
  {
    icon: ShieldCheck,
    title: "Verified tutors",
    desc: "SkillBridge helps students compare tutor profiles, experience, subjects, and reviews before booking.",
  },
  {
    icon: CalendarDays,
    title: "Simple booking",
    desc: "Students can browse availability and book learning sessions without extra back-and-forth.",
  },
  {
    icon: Star,
    title: "Transparent reviews",
    desc: "Ratings and review counts make it easier to choose the right expert for each learning goal.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <section className="bg-white border-b border-slate-200 py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-semibold text-indigo-600">
              <BookOpen size={14} /> About SkillBridge
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight">
              Connecting learners with tutors who fit their goals.
            </h1>
            <p className="mt-4 text-lg text-slate-500 leading-relaxed">
              SkillBridge brings tutor discovery, profile comparison,
              availability, booking, and reviews into one focused learning
              platform.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                  <item.icon size={22} />
                </div>
                <h2 className="mb-3 text-xl font-bold text-slate-900">
                  {item.title}
                </h2>
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
