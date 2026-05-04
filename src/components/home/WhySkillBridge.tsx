"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageSquareQuote, Users, ShieldCheck, Star, CalendarDays } from "lucide-react";

const WhySkillBridge = () => {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-xs font-semibold text-indigo-700">
              <MessageSquareQuote size={12} /> Why SkillBridge
            </div>
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
              The smarter way to learn
            </h2>
            <p className="mt-4 text-slate-500">
              We believe every learner deserves personalized guidance.
              SkillBridge makes it easy to find the right tutor, set a
              schedule, and track your progress.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Browse hundreds of verified tutors across dozens of subjects",
                "Flexible scheduling — book sessions at times that work for you",
                "Transparent reviews so you can choose with confidence",
                "Direct booking — no middleman, no hidden fees",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-600">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-600" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 font-semibold text-white hover:bg-indigo-700 transition hover:shadow-lg hover:shadow-indigo-200"
              >
                Get started free <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: Users,
                title: "For Students",
                desc: "Book 1-on-1 sessions with experts, track learning progress, leave reviews.",
                color: "bg-indigo-50 text-indigo-600",
              },
              {
                icon: ShieldCheck,
                title: "Verified Tutors",
                desc: "Every tutor goes through a profile review before going public.",
                color: "bg-emerald-50 text-emerald-600",
              },
              {
                icon: Star,
                title: "Star Ratings",
                desc: "Real reviews from real students to help you choose the best match.",
                color: "bg-amber-50 text-amber-600",
              },
              {
                icon: CalendarDays,
                title: "Easy Scheduling",
                desc: "Tutors set weekly availability, students pick their slot.",
                color: "bg-sky-50 text-sky-600",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-3xl border border-slate-100 p-6 hover:border-indigo-100 hover:shadow-sm transition"
              >
                <div className={`mb-4 inline-flex rounded-2xl p-3 ${card.color}`}>
                  <card.icon size={20} />
                </div>
                <h3 className="mb-2 font-semibold text-slate-900">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-500">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySkillBridge;
