"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import FeaturedTutors, { TutorProfile } from "@/components/home/FeaturedTutors";
import WhySkillBridge from "@/components/home/WhySkillBridge";
import CTASection from "@/components/home/CTASection";
import { BookOpen, Building2, HelpCircle, Mail, ShieldCheck, Star, TrendingUp, Users } from "lucide-react";

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

const services = [
  {
    icon: BookOpen,
    title: "Subject tutoring",
    desc: "Get focused help in academic and professional subjects from verified tutors.",
  },
  {
    icon: Users,
    title: "One-on-one sessions",
    desc: "Book personal sessions that match your goals, pace, and schedule.",
  },
  {
    icon: ShieldCheck,
    title: "Verified profiles",
    desc: "Compare experience, ratings, and categories before choosing a tutor.",
  },
];

const testimonials = [
  {
    name: "Ariyan H.",
    quote:
      "I found a math tutor in minutes and booked a session for the same week.",
  },
  {
    name: "Samira K.",
    quote:
      "The reviews and hourly rates made it easy to choose with confidence.",
  },
  {
    name: "Nabil R.",
    quote:
      "SkillBridge helped me keep learning consistent around my schedule.",
  },
];

const faqs = [
  {
    question: "How do I choose the right tutor?",
    answer:
      "Review each tutor's bio, categories, hourly rate, ratings, and profile details before booking.",
  },
  {
    question: "Can tutors set their own availability?",
    answer:
      "Yes. Tutors manage availability so students can book open time slots directly.",
  },
  {
    question: "Are reviews visible before booking?",
    answer:
      "Tutor ratings and review counts are visible on listings to help students compare options.",
  },
];

const platformStats = [
  { value: "15,000+", label: "Active Students" },
  { value: "500+", label: "Certified Tutors" },
  { value: "98%", label: "Success Rate" },
  { value: "4.9/5", label: "Average Rating" },
];

const trustedPartners = [
  "Northbridge University",
  "BrightPath Academy",
  "EduCore Institute",
  "FutureWorks Labs",
  "Meridian Learning",
];

const ServicesSection = () => (
  <motion.section
    variants={sectionVariants}
    initial="hidden"
    whileInView="visible"
    viewport={viewport}
    className="relative overflow-x-hidden bg-card py-20"
  >
    <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/10 to-transparent" />
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5 text-xs font-semibold text-secondary">
          <BookOpen size={12} /> Services
        </div>
        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
          Learning support built around you
        </h2>
      </div>
      <motion.div
        variants={gridVariants}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {services.map((service) => (
          <motion.div
            variants={cardVariants}
            key={service.title}
            className="group min-w-0 rounded-3xl border border-primary/10 bg-card p-8 shadow-sm shadow-primary/0 transition-all duration-300 hover:scale-[1.02] hover:border-secondary/40 hover:shadow-xl hover:shadow-primary/10"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:scale-105">
              <service.icon size={22} />
            </div>
            <h3 className="mb-3 text-xl font-bold text-slate-900">
              {service.title}
            </h3>
            <p className="text-slate-500">{service.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </motion.section>
);

const PlatformStatsSection = () => (
  <motion.section
    variants={sectionVariants}
    initial="hidden"
    whileInView="visible"
    viewport={viewport}
    className="relative overflow-x-hidden bg-canvas py-20"
  >
    <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-secondary/10 to-transparent" />
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5 text-xs font-semibold text-secondary">
          <TrendingUp size={12} /> Platform Impact
        </div>
        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
          Learning momentum at scale
        </h2>
      </div>
      <motion.div
        variants={gridVariants}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {platformStats.map((stat) => (
          <motion.div
            variants={cardVariants}
            key={stat.label}
            className="min-w-0 rounded-3xl border border-primary/10 bg-card p-8 text-center shadow-sm shadow-primary/0 transition-all duration-300 hover:scale-[1.02] hover:border-secondary/40 hover:shadow-xl hover:shadow-primary/10"
          >
            <div className="text-3xl font-bold text-primary md:text-4xl">
              {stat.value}
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-600">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </motion.section>
);

const TrustedBySection = () => (
  <motion.section
    variants={sectionVariants}
    initial="hidden"
    whileInView="visible"
    viewport={viewport}
    className="relative overflow-x-hidden bg-card py-16"
  >
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5 text-xs font-semibold text-secondary">
          <Building2 size={12} /> Trusted By
        </div>
        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
          Credibility built with leading learning teams
        </h2>
      </div>
      <motion.div
        variants={gridVariants}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        {trustedPartners.map((partner) => (
          <motion.div
            variants={cardVariants}
            key={partner}
            className="flex min-h-24 min-w-0 items-center justify-center rounded-3xl border border-slate-200 bg-card px-5 py-6 text-center text-sm font-bold uppercase tracking-widest text-slate-400 grayscale transition-all duration-300 hover:scale-[1.02] hover:border-secondary/40 hover:text-primary hover:shadow-xl hover:shadow-primary/10"
          >
            {partner}
          </motion.div>
        ))}
      </motion.div>
    </div>
  </motion.section>
);

const TestimonialsSection = () => (
  <motion.section
    variants={sectionVariants}
    initial="hidden"
    whileInView="visible"
    viewport={viewport}
    className="relative overflow-x-hidden bg-canvas py-20"
  >
    <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
    <div className="absolute -right-24 bottom-10 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5 text-xs font-semibold text-secondary">
          <Star size={12} /> Testimonials
        </div>
        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
          Students are growing with SkillBridge
        </h2>
      </div>
      <motion.div
        variants={gridVariants}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {testimonials.map((testimonial) => (
          <motion.div
            variants={cardVariants}
            key={testimonial.name}
            className="min-w-0 rounded-3xl border border-primary/10 bg-card p-8 shadow-sm shadow-primary/0 transition-all duration-300 hover:scale-[1.02] hover:border-secondary/40 hover:shadow-xl hover:shadow-primary/10"
          >
            <div className="mb-4 flex gap-0.5 text-secondary">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={14} className="fill-secondary" />
              ))}
            </div>
            <p className="text-slate-500">{testimonial.quote}</p>
            <h3 className="mt-6 font-semibold text-slate-900">
              {testimonial.name}
            </h3>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </motion.section>
);

const FAQNewsletterSection = () => (
  <motion.section
    variants={sectionVariants}
    initial="hidden"
    whileInView="visible"
    viewport={viewport}
    className="relative overflow-x-hidden bg-card py-20"
  >
    <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-primary/10 to-transparent" />
    <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5 text-xs font-semibold text-secondary">
          <HelpCircle size={12} /> FAQ
        </div>
        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
          Answers before you book
        </h2>
        <div className="mt-8 space-y-4">
          {faqs.map((faq) => (
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              key={faq.question}
              className="min-w-0 rounded-3xl border border-primary/10 bg-card p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-secondary/40 hover:shadow-xl hover:shadow-primary/10"
            >
              <h3 className="font-semibold text-slate-900">{faq.question}</h3>
              <p className="mt-2 text-sm text-slate-500">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        className="min-w-0 rounded-3xl border border-primary/10 bg-card p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-secondary/40 hover:shadow-xl hover:shadow-primary/10 sm:p-8"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5 text-xs font-semibold text-secondary">
          <Mail size={12} /> Newsletter
        </div>
        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
          Get learning updates
        </h2>
        <p className="mt-4 text-slate-500">
          Receive tutor highlights, new categories, and booking updates from
          SkillBridge.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            placeholder="Email address"
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-card px-4 py-3 text-sm outline-none transition-all focus:border-secondary focus:ring-4 focus:ring-secondary/10"
          />
          <button className="rounded-xl bg-primary px-8 py-3 font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25">
            Subscribe
          </button>
        </div>
      </motion.div>
    </div>
  </motion.section>
);

export default function HomePage() {
  const [featuredTutors, setFeaturedTutors] = useState<TutorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedTutors = async () => {
      try {
        const response = await fetch("/api/tutors?limit=8&sort=rating-desc", {
          cache: "no-store",
        });
        const result = await response.json();
        const tutors = Array.isArray(result.data) ? result.data : [];
        setFeaturedTutors(tutors.slice(0, 8));
      } catch {
        setFeaturedTutors([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedTutors();
  }, []);

  return (
    <div className="min-h-screen w-full scroll-smooth overflow-x-hidden bg-canvas">
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <HeroSection />
      </motion.div>
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        <HowItWorks />
      </motion.div>
      <ServicesSection />
      <PlatformStatsSection />
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        <FeaturedTutors tutors={featuredTutors} isLoading={isLoading} />
      </motion.div>
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        <WhySkillBridge />
      </motion.div>
      <TrustedBySection />
      <TestimonialsSection />
      <FAQNewsletterSection />
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        <CTASection />
      </motion.div>
    </div>
  );
}
