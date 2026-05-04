"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const stats = [
  { value: "5,000+", label: "Active Students" },
  { value: "1,200+", label: "Expert Tutors" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "4.9★", label: "Average Rating" },
];

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 text-white">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-white blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-yellow-300 blur-3xl animate-pulse delay-1000" />
      </div>
      <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
            <Sparkles size={14} />
            <span className="text-sm font-semibold">
              SkillBridge — Learn from Experts
            </span>
          </div>
          <h1 className="mb-6 bg-gradient-to-r from-white via-indigo-100 to-pink-100 bg-clip-text text-5xl font-bold text-transparent md:text-7xl">
            Connect. Learn.
            <br className="hidden md:block" />
            Grow Together.
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-indigo-100 md:text-xl">
            SkillBridge connects passionate learners with expert tutors.
            Browse profiles, check availability, and book sessions instantly.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/tutors"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 font-semibold text-indigo-700 transition hover:scale-105 hover:shadow-xl"
            >
              Browse Tutors <ArrowRight size={16} />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/80 px-8 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Become a Tutor
            </Link>
          </div>
          <div className="mt-14 flex flex-wrap justify-center gap-8 text-sm text-indigo-200">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
