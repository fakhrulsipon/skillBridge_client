"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const stats = [
  { value: "5,000+", label: "Active Students" },
  { value: "1,200+", label: "Expert Tutors" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "4.9★", label: "Average Rating" },
];

const HeroSection = () => {
  return (
    <section className="relative flex min-h-[680px] items-center overflow-x-hidden overflow-y-hidden bg-gradient-to-br from-primary via-primary to-secondary pb-20 pt-36 text-white sm:min-h-[720px] sm:pt-40 md:pt-44 lg:h-[68vh] lg:min-h-[640px] lg:max-h-[760px]">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-card blur-3xl animate-pulse sm:left-10" />
        <div className="absolute bottom-20 right-0 h-80 w-80 rounded-full bg-secondary blur-3xl animate-pulse delay-1000 sm:right-10 sm:h-96 sm:w-96" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.16),transparent_30%)]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/10 to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:56px_56px] opacity-20" />
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto max-w-4xl text-center"
        >
          <h1 className="mb-6 bg-gradient-to-r from-card via-card to-secondary bg-clip-text text-5xl font-bold text-transparent md:text-7xl">
            Connect. Learn.
            <br className="hidden md:block" />
            Grow Together.
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/90 md:text-xl">
            SkillBridge connects passionate learners with expert tutors.
            Browse profiles, check availability, and book sessions instantly.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/tutors"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-card px-8 py-3 font-semibold text-primary shadow-2xl shadow-primary/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-white/20"
            >
              Browse Tutors <ArrowRight size={16} />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/80 px-8 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:border-secondary hover:bg-white/10 hover:shadow-xl hover:shadow-white/10"
            >
              Become a Tutor
            </Link>
          </div>
          <div className="mt-14 grid grid-cols-2 justify-center gap-4 text-sm text-white/90 sm:grid-cols-4 sm:gap-8">
            {stats.map((s) => (
              <motion.div
                key={s.label}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-white/10 bg-white/10 p-4 text-center shadow-lg shadow-primary/20 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-secondary/70 hover:shadow-xl"
              >
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
