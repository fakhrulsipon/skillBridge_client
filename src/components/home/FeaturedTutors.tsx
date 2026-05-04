"use client";

import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  CalendarDays,
  ChevronRight,
  Loader,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react";

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
            ? "fill-amber-400 text-amber-400"
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
    "from-violet-400 to-fuchsia-500",
    "from-cyan-400 to-blue-500",
    "from-emerald-400 to-teal-500",
    "from-orange-400 to-rose-500",
    "from-indigo-400 to-purple-500",
  ];
  const gradient = gradients[tutor.id % gradients.length];
  return tutor.imageUrl ? (
    <Image
      src={tutor.imageUrl}
      alt={tutor.user.name}
      width={150}
      height={150}
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

const FeaturedTutors = ({ tutors, isLoading }: FeaturedTutorsProps) => {
  return (
    <section className="bg-gradient-to-br from-slate-50 to-indigo-50/30 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-xs font-semibold text-indigo-700">
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
            className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 transition"
          >
            View all tutors <ChevronRight size={16} />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="animate-spin h-12 w-12 text-indigo-600" />
            <p className="mt-4 text-lg text-slate-500">
              Loading featured tutors...
            </p>
          </div>
        ) : tutors.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-indigo-200 bg-white p-16 text-center">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-lg font-semibold text-slate-700">
              No tutors yet
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Tutors will appear here once they create profiles.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tutors.map((tutor) => (
              <div
                key={tutor.id}
                className="group rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-indigo-300 hover:shadow-xl"
              >
                <div className="flex gap-4">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl shadow-sm">
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
                    <div className="text-xl font-bold text-indigo-600">
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
                        className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600"
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
                    className="flex items-center justify-center gap-1.5 rounded-2xl border border-indigo-200 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 transition"
                  >
                    <BookOpen size={14} /> Profile
                  </Link>
                  <Link
                    href={`/tutors/${tutor.id}`}
                    className="flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2 text-sm font-semibold text-white hover:shadow-md hover:shadow-indigo-200 transition"
                  >
                    <CalendarDays size={14} /> Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedTutors;
