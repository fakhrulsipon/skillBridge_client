"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  CalendarDays,
  Clock3,
  LoaderCircle,
  MapPin,
  Search,
  ShieldCheck,
  Star,
  Wallet,
  X,
  ChevronRight,
  Filter,
  BookOpen,
  LayoutGrid,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
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
            ? "fill-amber-400 text-amber-400"
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
    "from-indigo-400 to-cyan-400",
    "from-emerald-400 to-teal-400",
    "from-rose-400 to-orange-400",
    "from-purple-400 to-pink-400",
    "from-blue-400 to-indigo-400",
  ];
  const gradient = gradients[tutor.id % gradients.length];

  return tutor.imageUrl ? (
    <img
      src={tutor.imageUrl}
      alt={tutor.user.name}
      className="h-full w-full object-cover rounded-2xl"
    />
  ) : (
    <div
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient} rounded-2xl shadow-inner`}
    >
      <span className="text-xl font-bold text-white tracking-tighter">
        {initials}
      </span>
    </div>
  );
};

export default function BrowseTutorPage() {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  const { user, token } = useAuth();

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
          fetch(`${baseUrl}/tutors`, { cache: "no-store" }),
          fetch(`${baseUrl}/tutors/categories`, { cache: "no-store" }),
        ]);

        const tutorsResult = await tutorsRes.json();
        const categoriesResult = await categoriesRes.json();

        setTutors(Array.isArray(tutorsResult.data) ? tutorsResult.data : []);
        setCategories(
          Array.isArray(categoriesResult.data) ? categoriesResult.data : [],
        );
      } catch (error) {
        console.error("Failed to fetch data", error);
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
    <div className="min-h-screen bg-slate-50/50">
      {/* ─── HERO ─── */}
      <section className="bg-white border-b border-slate-200 py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-semibold text-indigo-600 mb-6">
                <ShieldCheck size={14} /> Verified Expert Tutors
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight">
                Find the perfect <span className="text-indigo-600">tutor</span>{" "}
                for your goals.
              </h1>
              <p className="mt-4 text-lg text-slate-500 leading-relaxed">
                Connect with 1,200+ expert educators across {categories.length}{" "}
                categories. Filter by subject, price, and rating to find your
                match.
              </p>
            </div>
            <div className="flex-shrink-0 grid grid-cols-2 gap-4">
              <div className="rounded-3xl bg-indigo-600 p-6 text-white shadow-xl shadow-indigo-100">
                <div className="text-3xl font-bold">{tutors.length}</div>
                <div className="text-sm opacity-80">Active Tutors</div>
              </div>
              <div className="rounded-3xl bg-white border border-slate-200 p-6 text-slate-900 shadow-sm">
                <div className="text-3xl font-bold">{categories.length}</div>
                <div className="text-sm text-slate-500">Categories</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BROWSER ─── */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* SIDEBAR FILTERS */}
          <aside className="lg:w-80 flex-shrink-0 space-y-6">
            <div className="sticky top-24 space-y-6">
              {/* Search */}
              <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Search size={16} className="text-indigo-600" /> Search
                </h3>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search name or bio..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <LayoutGrid size={16} className="text-indigo-600" />{" "}
                  Categories
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategoryId(null)}
                    className={`w-full text-left px-4 py-2 text-sm rounded-xl transition-all ${!selectedCategoryId ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategoryId(cat.id)}
                      className={`w-full text-left px-4 py-2 text-sm rounded-xl transition-all ${selectedCategoryId === cat.id ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "text-slate-600 hover:bg-slate-50"}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Wallet size={16} className="text-indigo-600" /> Price Range
                </h3>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between mt-2 text-xs font-bold text-slate-500">
                  <span>$0</span>
                  <span>Up to ${maxPrice}</span>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Star size={16} className="text-amber-400" /> Minimum Rating
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[0, 3, 4, 4.5].map((r) => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all ${minRating === r ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-500 hover:border-indigo-200"}`}
                    >
                      {r === 0 ? "Any" : `${r}★ & Up`}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategoryId(null);
                  setMaxPrice(5000);
                  setMinRating(0);
                }}
                className="w-full py-3 text-sm font-bold text-slate-400 hover:text-rose-500 transition-colors"
              >
                Reset all filters
              </button>
            </div>
          </aside>

          {/* TUTORS GRID */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold text-slate-900">
                {filteredTutors.length} Tutors found
              </h2>
              <div className="text-xs text-slate-400">
                Showing results based on your current filters
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <LoaderCircle className="animate-spin h-12 w-12 text-indigo-600" />
                <p className="mt-4 text-lg text-slate-500">Loading tutors...</p>
              </div>
            ) : filteredTutors.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-[32px] p-20 text-center">
                <div className="text-5xl mb-6">🔍</div>
                <h3 className="text-xl font-bold text-slate-900">
                  No tutors match your search
                </h3>
                <p className="mt-2 text-slate-500">
                  Try adjusting your filters or clearing the search box.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {filteredTutors.map((tutor) => (
                  <div
                    key={tutor.id}
                    className="group bg-white border border-slate-200 rounded-[32px] p-5 transition-all hover:shadow-2xl hover:shadow-indigo-100/50 hover:border-indigo-200"
                  >
                    <div className="flex gap-4 mb-4">
                      <div className="h-16 w-16 flex-shrink-0">
                        <TutorAvatar tutor={tutor} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                          {tutor.user.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                          <MapPin size={12} /> {tutor.location}
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <StarRating rating={tutor.avgRating} />
                          <span className="text-xs font-bold text-slate-400">
                            {tutor.avgRating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4 h-12 overflow-hidden">
                      {tutor.categories.map((c) => (
                        <span
                          key={c.categoryId}
                          className="px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-500"
                        >
                          {c.category.name}
                        </span>
                      ))}
                    </div>

                    <p className="text-sm text-slate-500 line-clamp-3 mb-6 h-15">
                      {tutor.bio}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div>
                        <div className="text-xl font-bold text-slate-900">
                          ${tutor.hourlyRate}
                        </div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                          Per Hour
                        </div>
                      </div>
                      <Link
                        href={`/tutors/${tutor.id}`}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95"
                      >
                        Profile <ChevronRight size={14} />
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
