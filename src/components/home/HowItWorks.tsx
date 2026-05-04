"use client";

import { CalendarDays, Search, BookOpen, Zap } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse Tutors",
    desc: "Search by subject, rating, and price to find the perfect match.",
  },
  {
    icon: CalendarDays,
    title: "Book a Session",
    desc: "Pick a time slot and book instantly — no back-and-forth needed.",
  },
  {
    icon: BookOpen,
    title: "Learn & Grow",
    desc: "Attend your session, then leave a review to help future learners.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-xs font-semibold text-indigo-700">
            <Zap size={12} /> How it works
          </div>
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Start learning in 3 easy steps
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="rounded-3xl border border-slate-100 bg-slate-50 p-8 text-center hover:border-indigo-200 hover:shadow-md transition-all"
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                <step.icon size={22} />
              </div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-indigo-500">
                Step {i + 1}
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900">
                {step.title}
              </h3>
              <p className="text-slate-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
