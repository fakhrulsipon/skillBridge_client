"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MapPin,
  Search,
  ShieldCheck,
  Star,
  Wallet,
  ChevronRight,
  LayoutGrid,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";

// Types
type Category = { id: number; name: string; icon?: string | null };

type TutorProfile = {
  id: number;
  bio: string;
  hourlyRate: number;
  experience: number;
  location: string;
  imageUrl: string | null;
  avgRating: number;
  totalReviews: number;
  user: { id: number; name: string; email: string };
  categories: { categoryId: number; category: Category }[];
  availability?: { dayOfWeek: number; startTime: string; endTime: string }[];
};

const StarRating = ({ rating }: { rating: number }) => (
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

const TutorAvatar = ({ tutor }: { tutor: TutorProfile }) => {
  const initials = tutor.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const gradients = [
    "from-primary via-primary to-primary/80",
    "from-primary to-primary/90",
    "from-secondary via-secondary to-secondary/80",
    "from-primary via-primary/90 to-primary",
    "from-primary to-primary/75",
  ];
  const gradient = gradients[tutor.id % gradients.length];

  return tutor.imageUrl ? (
    <div className="h-full w-full overflow-hidden rounded-2xl ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all duration-300">
      <img
        src={tutor.imageUrl}
        alt={tutor.user.name}
        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
    </div>
  ) : (
    <div
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient} rounded-2xl shadow-md ring-2 ring-white/20`}
    >
      <span className="text-xl font-bold text-white tracking-tighter">
        {initials}
      </span>
    </div>
  );
};

const TutorCardSkeleton = () => (
  <div className="rounded-[32px] border border-primary/10 bg-card p-5 space-y-4">
    <div className="flex gap-4">
      <div className="h-16 w-16 flex-shrink-0 animate-pulse rounded-2xl bg-slate-100" />
      <div className="flex-1 space-y-3">
        <div className="h-5 w-2/3 animate-pulse rounded-full bg-slate-100" />
        <div className="h-3 w-1/2 animate-pulse rounded-full bg-slate-100" />
        <div className="h-3 w-3/4 animate-pulse rounded-full bg-slate-100" />
      </div>
    </div>
    <div className="flex flex-wrap gap-1.5 overflow-hidden">
      <div className="h-5 w-16 animate-pulse rounded-full bg-slate-100" />
      <div className="h-5 w-20 animate-pulse rounded-full bg-slate-100" />
    </div>
    <div className="space-y-2">
      <div className="h-3 w-full animate-pulse rounded-full bg-slate-100" />
      <div className="h-3 w-5/6 animate-pulse rounded-full bg-slate-100" />
    </div>
    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
      <div className="space-y-1">
        <div className="h-5 w-16 animate-pulse rounded-full bg-slate-100" />
        <div className="h-2 w-12 animate-pulse rounded-full bg-slate-100" />
      </div>
      <div className="h-10 w-24 animate-pulse rounded-2xl bg-slate-100" />
    </div>
  </div>
);

export default function BrowseTutorPage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tutorsRes, categoriesRes] = await Promise.all([
          fetch("/api/tutors?limit=48&sort=rating-desc", { cache: "no-store" }),
          fetch(`${baseUrl}/tutors/categories`, { cache: "no-store" }),
        ]);

        const tutorsResult = await tutorsRes.json();
        const categoriesResult = await categoriesRes.json();

        setTutors(Array.isArray(tutorsResult.data) ? tutorsResult.data : []);
        setCategories(
          Array.isArray(categoriesResult.data) ? categoriesResult.data : [],
        );
      } catch {
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [baseUrl]);

  const filteredTutors = useMemo(() => {
    return tutors.filter((tutor) => {
      const matchesSearch = [tutor.user.name, tutor.bio, tutor.location]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        !selectedCategoryId ||
        tutor.categories.some((c) => c.categoryId === selectedCategoryId);

      const matchesPrice = tutor.hourlyRate <= maxPrice;
      const matchesRating = tutor.avgRating >= minRating;

      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });
  }, [tutors, searchTerm, selectedCategoryId, maxPrice, minRating]);

  return (
    <div className="min-h-screen bg-canvas/40 selection:bg-primary/20">
      {/* ─── HERO SECTION ─── */}
      <section className="bg-card border-b border-primary/10 py-16 md:py-24 relative overflow-hidden">
        {/* Modern Blur Backdrops */}
        <div className="absolute top-0 right-0 -z-10 h-96 w-96 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -bottom-10 left-10 -z-10 h-72 w-72 rounded-full bg-primary/5 blur-[100px]" />

        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-xs font-semibold text-primary mb-6 shadow-sm">
                <ShieldCheck size={13} className="text-primary" /> Verified Expert Tutors
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Find the perfect{" "}
                <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  tutor
                </span>{" "}
                for your goals.
              </h1>
              <p className="mt-6 text-lg text-slate-500 leading-relaxed font-medium">
                Connect with 1,200+ expert educators across {categories.length}{" "}
                categories. Filter by subject, price, and rating to find your
                match.
              </p>
            </div>
            
            {/* Stats Indicators */}
            <div className="flex-shrink-0 grid grid-cols-2 gap-4 sm:w-80 lg:w-auto">
              <div className="rounded-3xl bg-primary p-6 text-white shadow-xl shadow-primary/25 transition-transform hover:-translate-y-1 duration-300">
                <div className="text-4xl font-black tracking-tight">{tutors.length}</div>
                <div className="text-xs font-medium opacity-80 mt-1 uppercase tracking-wider">Active Tutors</div>
              </div>
              <div className="rounded-3xl bg-card border border-primary/10 p-6 text-slate-900 shadow-sm transition-transform hover:-translate-y-1 duration-300">
                <div className="text-4xl font-black tracking-tight text-slate-900">{categories.length}</div>
                <div className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">Categories</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MAIN BROWSER GRID ─── */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* SIDEBAR FILTERS */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="sticky top-28 space-y-6">
              
              {/* Header inside filters block */}
              <div className="flex items-center gap-2 pb-2 border-b border-primary/10">
                <SlidersHorizontal size={16} className="text-primary" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Filter Settings</h2>
              </div>

              {/* Search Box */}
              <div className="rounded-3xl bg-card border border-primary/10 p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <Search size={14} className="text-primary" /> Search Tutors
                </h3>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={15}
                  />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search name or bio..."
                    className="w-full rounded-xl border border-primary/10 bg-canvas/30 py-2.5 pl-9 pr-4 text-sm outline-none focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-slate-800 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="rounded-3xl bg-card border border-primary/10 p-6 shadow-sm max-h-[360px] flex flex-col">
                <h3 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <LayoutGrid size={14} className="text-primary" /> Categories
                </h3>
                <div className="space-y-1 overflow-y-auto pr-1 custom-scrollbar">
                  <button
                    onClick={() => setSelectedCategoryId(null)}
                    className={`w-full text-left px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                      !selectedCategoryId
                        ? "bg-primary text-white shadow-md shadow-primary/20"
                        : "text-slate-600 hover:bg-canvas/60 hover:text-slate-900"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategoryId(cat.id)}
                      className={`w-full text-left px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                        selectedCategoryId === cat.id
                          ? "bg-primary text-white shadow-md shadow-primary/20"
                          : "text-slate-600 hover:bg-canvas/60 hover:text-slate-900"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="rounded-3xl bg-card border border-primary/10 p-6 shadow-sm">
                <h3 className="text-xs font-bold text-slate-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                  <Wallet size={14} className="text-primary" /> Price Range
                </h3>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-primary h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between mt-3 text-xs font-bold text-slate-600 bg-canvas/50 px-3 py-1.5 rounded-xl border border-primary/5">
                  <span>$0</span>
                  <span className="text-primary">Up to ${maxPrice}</span>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="rounded-3xl bg-card border border-primary/10 p-6 shadow-sm">
                <h3 className="text-xs font-bold text-slate-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                  <Star size={14} className="text-secondary fill-secondary" /> Minimum Rating
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[0, 3, 4, 4.5].map((r) => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      className={`px-3 py-2.5 text-xs font-bold rounded-xl border transition-all ${
                        minRating === r
                          ? "border-primary bg-primary/10 text-primary shadow-sm"
                          : "border-primary/10 text-slate-500 hover:border-primary/40 hover:bg-canvas/40"
                      }`}
                    >
                      {r === 0 ? "Any Rating" : `${r} ★ & Up`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Controller */}
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategoryId(null);
                  setMaxPrice(5000);
                  setMinRating(0);
                }}
                className="w-full py-3 text-xs font-bold text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 rounded-xl border border-dashed border-transparent hover:border-rose-200 transition-all uppercase tracking-wider"
              >
                Reset all filters
              </button>
            </div>
          </aside>

          {/* TUTORS GRID CONTAINER */}
          <main className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-8 bg-card border border-primary/5 px-6 py-4 rounded-2xl shadow-sm">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles size={16} className="text-primary animate-pulse" />
                <span>{filteredTutors.length} Tutors available</span>
              </h2>
              <div className="text-xs font-semibold text-slate-400">
                Filtered results matching criteria
              </div>
            </div>

            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <TutorCardSkeleton key={index} />
                ))}
              </div>
            ) : filteredTutors.length === 0 ? (
              <div className="bg-card border border-primary/10 rounded-[32px] p-16 text-center shadow-sm">
                <div className="text-4xl mb-4 animate-bounce">🔍</div>
                <h3 className="text-lg font-bold text-slate-900">
                  No match found
                </h3>
                <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Try adjusting the parameters, broadening the target categories, or updating terms.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTutors.map((tutor) => (
                  <div
                    key={tutor.id}
                    className="group bg-card border border-primary/10 rounded-[32px] p-5 shadow-sm hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Avatar & Identifiers */}
                      <div className="flex gap-4 mb-4">
                        <div className="h-16 w-16 flex-shrink-0">
                          <TutorAvatar tutor={tutor} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold text-slate-900 truncate group-hover:text-primary transition-colors duration-300">
                            {tutor.user.name}
                          </h3>
                          <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 mt-0.5">
                            <MapPin size={12} className="text-slate-400" /> {tutor.location}
                          </div>
                          <div className="mt-1.5 flex items-center gap-1.5">
                            <StarRating rating={tutor.avgRating} />
                            <span className="text-xs font-bold text-slate-700">
                              {tutor.avgRating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Badges Mapping */}
                      <div className="flex flex-wrap gap-1 mb-4 max-h-[44px] overflow-hidden">
                        {tutor.categories.map((c) => (
                          <span
                            key={c.categoryId}
                            className="px-2.5 py-0.5 rounded-lg bg-canvas/60 border border-primary/5 text-[10px] font-bold text-slate-500 whitespace-nowrap"
                          >
                            {c.category.name}
                          </span>
                        ))}
                      </div>

                      {/* Introduction Description */}
                      <p className="text-sm text-slate-500 line-clamp-3 mb-6 font-normal leading-relaxed">
                        {tutor.bio}
                      </p>
                    </div>

                    {/* Rates & Actions Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100/80">
                      <div>
                        <div className="text-2xl font-black text-slate-900 tracking-tight">
                          ${tutor.hourlyRate}
                        </div>
                        <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mt-0.5">
                          Per Hour
                        </div>
                      </div>
                      <Link
                        href={`/tutors/${tutor.id}`}
                        className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/10 hover:bg-primary/95 transition-all hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0"
                      >
                        Profile <ChevronRight size={13} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}