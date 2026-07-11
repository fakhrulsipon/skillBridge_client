"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const CTASection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      className="relative overflow-x-hidden bg-gradient-to-br from-primary via-primary to-secondary py-20 text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.16),transparent_30%)]" />
      <div className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
      <div className="absolute -right-24 bottom-8 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <Sparkles className="mx-auto mb-4 h-10 w-10 opacity-80 drop-shadow-lg" />
        <h2 className="text-3xl font-bold md:text-4xl">
          Ready to start your learning journey?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">
          Join thousands of students already mastering new skills with
          SkillBridge tutors.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-xl bg-card px-8 py-3 font-semibold text-primary shadow-2xl shadow-primary/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-white/20"
          >
            Create Free Account
          </Link>
          <Link
            href="/tutors"
            className="inline-flex items-center justify-center rounded-xl border-2 border-white/80 px-8 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:border-secondary hover:bg-white/10 hover:shadow-xl hover:shadow-white/10"
          >
            Browse Tutors
          </Link>
        </div>
      </div>
    </motion.section>
  );
};

export default CTASection;
