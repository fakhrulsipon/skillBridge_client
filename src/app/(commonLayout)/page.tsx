"use client";

import { useEffect, useState } from "react";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import FeaturedTutors, { TutorProfile } from "@/components/home/FeaturedTutors";
import WhySkillBridge from "@/components/home/WhySkillBridge";
import CTASection from "@/components/home/CTASection";
import { BookOpen, HelpCircle, Mail, ShieldCheck, Star, Users } from "lucide-react";

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

const ServicesSection = () => (
  <section className="bg-white py-20">
    <div className="mx-auto max-w-7xl px-6">
      <div className="mb-12 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-xs font-semibold text-indigo-700">
          <BookOpen size={12} /> Services
        </div>
        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
          Learning support built around you
        </h2>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {services.map((service) => (
          <div
            key={service.title}
            className="rounded-3xl border border-slate-100 bg-slate-50 p-8 hover:border-indigo-200 hover:shadow-md transition-all"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white">
              <service.icon size={22} />
            </div>
            <h3 className="mb-3 text-xl font-bold text-slate-900">
              {service.title}
            </h3>
            <p className="text-slate-500">{service.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const TestimonialsSection = () => (
  <section className="bg-gradient-to-br from-slate-50 to-indigo-50/30 py-20">
    <div className="mx-auto max-w-7xl px-6">
      <div className="mb-12 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-xs font-semibold text-indigo-700">
          <Star size={12} /> Testimonials
        </div>
        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
          Students are growing with SkillBridge
        </h2>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.name}
            className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm"
          >
            <div className="mb-4 flex gap-0.5 text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={14} className="fill-amber-400" />
              ))}
            </div>
            <p className="text-slate-500">{testimonial.quote}</p>
            <h3 className="mt-6 font-semibold text-slate-900">
              {testimonial.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FAQNewsletterSection = () => (
  <section className="bg-white py-20">
    <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">
      <div>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-xs font-semibold text-indigo-700">
          <HelpCircle size={12} /> FAQ
        </div>
        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
          Answers before you book
        </h2>
        <div className="mt-8 space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-3xl border border-slate-100 bg-slate-50 p-6"
            >
              <h3 className="font-semibold text-slate-900">{faq.question}</h3>
              <p className="mt-2 text-sm text-slate-500">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-3xl border border-slate-100 bg-gradient-to-br from-slate-50 to-indigo-50/30 p-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-xs font-semibold text-indigo-700">
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
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          />
          <button className="rounded-xl bg-indigo-600 px-8 py-3 font-semibold text-white hover:bg-indigo-700 transition">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  </section>
);

export default function HomePage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const [featuredTutors, setFeaturedTutors] = useState<TutorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tutors?limit=8&sort=rating-desc", { cache: "no-store" })
      .then((r) => r.json())
      .then((result) => {
        if (result.data && Array.isArray(result.data)) {
          setFeaturedTutors(result.data.slice(0, 8));
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [baseUrl]);

  return (
    <div className="min-h-screen">
      <HeroSection />
      <HowItWorks />
      <ServicesSection />
      <FeaturedTutors tutors={featuredTutors} isLoading={isLoading} />
      <WhySkillBridge />
      <TestimonialsSection />
      <FAQNewsletterSection />
      <CTASection />
    </div>
  );
}
