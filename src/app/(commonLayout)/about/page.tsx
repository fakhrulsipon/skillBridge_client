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
    <div className="min-h-screen bg-canvas/40 selection:bg-primary/20">
      {/* Hero Section */}
      <section className="bg-card border-b border-primary/10 py-16 md:py-28 relative overflow-hidden">
        {/* Subtle abstract blurs for high-end aesthetic */}
        <div className="absolute top-0 right-0 -z-10 h-96 w-96 rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute -bottom-10 left-10 -z-10 h-72 w-72 rounded-full bg-primary/5 blur-[80px]" />

        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-xs font-semibold text-primary">
              <BookOpen size={13} /> About SkillBridge
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Connecting learners with tutors who{" "}
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                fit their goals.
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-slate-500 leading-relaxed font-medium">
              SkillBridge brings tutor discovery, profile comparison,
              availability, booking, and reviews into one focused learning
              platform.
            </p>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-24 bg-gradient-to-b from-canvas/20 via-canvas to-canvas/40">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {highlights.map((item, index) => (
              <div
                key={item.title}
                className="group relative rounded-3xl border border-primary/10 bg-card p-8 shadow-sm hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Visual anchor background numbers */}
                <span className="absolute right-6 top-6 text-5xl font-black text-slate-100/70 group-hover:text-primary/10 transition-colors duration-300 select-none">
                  0{index + 1}
                </span>

                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-md shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                  <item.icon size={22} />
                </div>
                
                <h2 className="mb-3 text-2xl font-bold text-slate-900 tracking-tight group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </h2>
                
                <p className="text-slate-500 text-sm leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Optimized Call to Action Container */}
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