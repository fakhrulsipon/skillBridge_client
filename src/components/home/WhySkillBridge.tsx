"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, CheckCircle2, MessageSquareQuote, Users, ShieldCheck, Star, CalendarDays } from "lucide-react";

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

const WhySkillBridge = () => {
  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      className="relative overflow-x-hidden bg-card py-20"
    >
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/10 to-transparent" />
      <div className="absolute -left-24 bottom-8 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5 text-xs font-semibold text-secondary">
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
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02] hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25"
              >
                Get started free <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <motion.div
            variants={gridVariants}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {[
              {
                icon: Users,
                title: "For Students",
                desc: "Book 1-on-1 sessions with experts, track learning progress, leave reviews.",
                color: "bg-primary/10 text-primary",
              },
              {
                icon: ShieldCheck,
                title: "Verified Tutors",
                desc: "Every tutor goes through a profile review before going public.",
                color: "bg-primary/10 text-primary",
              },
              {
                icon: Star,
                title: "Star Ratings",
                desc: "Real reviews from real students to help you choose the best match.",
                color: "bg-secondary/10 text-secondary",
              },
              {
                icon: CalendarDays,
                title: "Easy Scheduling",
                desc: "Tutors set weekly availability, students pick their slot.",
                color: "bg-secondary/10 text-secondary",
              },
            ].map((card) => (
              <motion.div
                variants={cardVariants}
                key={card.title}
                className="group rounded-3xl border border-primary/10 bg-card p-6 shadow-sm shadow-primary/0 transition-all duration-300 hover:scale-[1.02] hover:border-secondary/40 hover:shadow-xl hover:shadow-primary/10"
              >
                <div className={`mb-4 inline-flex rounded-2xl p-3 transition-transform duration-300 group-hover:scale-105 ${card.color}`}>
                  <card.icon size={20} />
                </div>
                <h3 className="mb-2 font-semibold text-slate-900">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-500">{card.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default WhySkillBridge;
