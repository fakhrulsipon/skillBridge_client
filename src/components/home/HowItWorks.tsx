"use client";

import { CalendarDays, Search, BookOpen, Zap } from "lucide-react";
import { motion, type Variants } from "framer-motion";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" },
  },
};

const gridVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.08 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const viewport = { once: true, amount: 0.18 };

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
    <motion.section
      id="how-it-works"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      className="relative overflow-x-hidden bg-card py-20"
    >
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/10 to-transparent" />
      <div className="absolute -right-24 top-20 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5 text-xs font-semibold text-secondary">
            <Zap size={12} /> How it works
          </div>
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Start learning in 3 easy steps
          </h2>
        </div>
        <motion.div
          variants={gridVariants}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step, i) => (
            <motion.div
              variants={cardVariants}
              key={step.title}
              className="group rounded-3xl border border-primary/10 bg-card p-8 text-center shadow-sm shadow-primary/0 transition-all duration-300 hover:scale-[1.02] hover:border-secondary/40 hover:shadow-xl hover:shadow-primary/10"
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:scale-105">
                <step.icon size={22} />
              </div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-secondary">
                Step {i + 1}
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900">
                {step.title}
              </h3>
              <p className="text-slate-500">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HowItWorks;
