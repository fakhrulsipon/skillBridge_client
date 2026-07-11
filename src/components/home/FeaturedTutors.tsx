"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  BookOpen,
  CalendarDays,
  ChevronRight,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react";

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
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const viewport = { once: true, amount: 0.14 };

export type TutorProfile = {
  id: number;
  bio: string;
  hourlyRate: number;
  experience: number;
  location: string;
  imageUrl: string | null;
  avgRating: number;
  totalReviews: number;
  user: { id: number; name: string; email: string };
  categories?: { categoryId: number; category: { id: number; name: string } }[];
};

export const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        size={12}
        className={
          i <= Math.round(rating)
            ? "fill-secondary text-secondary"
            : "text-slate-200"
        }
      />
    ))}
  </div>
);

export const TutorAvatar = ({ tutor }: { tutor: TutorProfile }) => {
  const initials = tutor.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const gradients = [
    "from-primary to-secondary",
    "from-primary to-primary",
    "from-secondary to-primary",
    "from-primary to-secondary",
    "from-secondary to-secondary",
  ];
  const gradient = gradients[tutor.id % gradients.length];
  return tutor.imageUrl ? (
    <img
      src={tutor.imageUrl}
      alt={tutor.user.name}
      className="h-full w-full object-cover"
    />
  ) : (
    <div
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient}`}
    >
      <span className="text-lg font-bold text-white">{initials}</span>
    </div>
  );
};

interface FeaturedTutorsProps {
  tutors: TutorProfile[];
  isLoading: boolean;
}

const TutorCardSkeleton = () => (
  <div className="rounded-3xl border border-primary/10 bg-card p-5 shadow-sm shadow-primary/5">
    <div className="flex gap-4">
      <div className="h-16 w-16 flex-shrink-0 animate-pulse rounded-2xl bg-slate-100" />
      <div className="flex-1 space-y-3">
        <div className="h-5 w-2/3 animate-pulse rounded-full bg-slate-100" />
        <div className="h-3 w-1/2 animate-pulse rounded-full bg-slate-100" />
        <div className="h-3 w-3/4 animate-pulse rounded-full bg-slate-100" />
      </div>
    </div>
    <div className="mt-4 flex gap-2">
      <div className="h-5 w-16 animate-pulse rounded-full bg-slate-100" />
      <div className="h-5 w-20 animate-pulse rounded-full bg-slate-100" />
    </div>
    <div className="mt-4 space-y-2">
      <div className="h-3 w-full animate-pulse rounded-full bg-slate-100" />
      <div className="h-3 w-5/6 animate-pulse rounded-full bg-slate-100" />
    </div>
    <div className="mt-4 grid grid-cols-2 gap-2">
      <div className="h-10 animate-pulse rounded-2xl bg-slate-100" />
      <div className="h-10 animate-pulse rounded-2xl bg-slate-100" />
    </div>
  </div>
);

const FeaturedTutors = ({ tutors, isLoading }: FeaturedTutorsProps) => {
  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      className="relative overflow-x-hidden bg-canvas py-20"
    >
      <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -right-28 bottom-10 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5 text-xs font-semibold text-secondary">
              <ShieldCheck size={12} /> Verified Experts
            </div>
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
              Featured tutors
            </h2>
            <p className="mt-2 text-slate-500">
              Top-rated tutors ready to help you succeed.
            </p>
          </div>
          <Link
            href="/tutors"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-card px-5 py-2.5 text-sm font-semibold text-primary shadow-sm shadow-primary/5 transition-all duration-300 hover:scale-[1.02] hover:border-secondary/40 hover:bg-primary/5 hover:shadow-xl hover:shadow-primary/10"
          >
            View all tutors <ChevronRight size={16} />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <TutorCardSkeleton key={index} />
            ))}
          </div>
        ) : tutors.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-secondary/40 bg-card p-8 text-center shadow-xl shadow-primary/10 sm:p-16">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-lg font-semibold text-slate-700">
              No tutors yet
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Tutors will appear here once they create profiles.
            </p>
          </div>
        ) : (
          <motion.div
            variants={gridVariants}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {tutors.map((tutor) => (
              <motion.div
                variants={cardVariants}
                key={tutor.id}
                className="group rounded-3xl border border-primary/10 bg-card p-5 shadow-sm shadow-primary/0 transition-all duration-300 hover:scale-[1.02] hover:border-secondary/40 hover:shadow-xl hover:shadow-primary/10"
              >
                <div className="flex gap-4">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-105">
                    <TutorAvatar tutor={tutor} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="truncate text-lg font-bold text-slate-900">
                      {tutor.user.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                      <MapPin size={11} />
                      <span className="truncate">{tutor.location || "—"}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <StarRating rating={tutor.avgRating} />
                      <span className="text-xs text-slate-400">
                        {tutor.avgRating.toFixed(1)} ({tutor.totalReviews})
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xl font-bold text-primary">
                      ${tutor.hourlyRate}
                    </div>
                    <div className="text-xs text-slate-400">/hour</div>
                  </div>
                </div>

                {tutor.categories && tutor.categories.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {tutor.categories.slice(0, 3).map(({ category }) => (
                      <span
                        key={category.id}
                        className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                )}

                <p className="mt-3 line-clamp-2 text-sm text-slate-500">
                  {tutor.bio}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Link
                    href={`/tutors/${tutor.id}`}
                    className="flex min-w-0 items-center justify-center gap-1.5 rounded-2xl border border-primary/20 px-2 py-2 text-sm font-semibold text-primary transition-all duration-300 hover:border-secondary/40 hover:bg-primary/5"
                  >
                    <BookOpen size={14} /> Profile
                  </Link>
                  <Link
                    href={`/tutors/${tutor.id}`}
                    className="flex min-w-0 items-center justify-center gap-1.5 rounded-2xl bg-primary px-2 py-2 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
                  >
                    <CalendarDays size={14} /> Book
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default FeaturedTutors;
