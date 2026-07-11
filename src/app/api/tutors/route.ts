import { NextRequest, NextResponse } from "next/server";

type Category = { id: number; name: string };

type TutorProfile = {
  id: number;
  bio?: string;
  hourlyRate?: number;
  experience?: number;
  location?: string;
  avgRating?: number;
  totalReviews?: number;
  user?: { name?: string; email?: string };
  categories?: { categoryId: number; category: Category }[];
};

const getBaseUrl = () => process.env.NEXT_PUBLIC_API_URL || "";

const extractTutorArray = (payload: unknown): TutorProfile[] => {
  if (!payload || typeof payload !== "object") return [];

  const record = payload as {
    data?: unknown;
    tutors?: unknown;
    items?: unknown;
    results?: unknown;
  };

  if (Array.isArray(record.data)) return record.data as TutorProfile[];
  if (Array.isArray(record.tutors)) return record.tutors as TutorProfile[];
  if (Array.isArray(record.items)) return record.items as TutorProfile[];
  if (Array.isArray(record.results)) return record.results as TutorProfile[];

  if (record.data && typeof record.data === "object") {
    return extractTutorArray(record.data);
  }

  return [];
};

const toNumber = (value: string | null, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export async function GET(request: NextRequest) {
  const baseUrl = getBaseUrl();

  if (!baseUrl) {
    return NextResponse.json(
      { success: false, message: "NEXT_PUBLIC_API_URL is not configured" },
      { status: 500 },
    );
  }

  const { searchParams } = request.nextUrl;
  const search = (searchParams.get("search") || searchParams.get("q") || "")
    .trim()
    .toLowerCase();
  const category = searchParams.get("category") || searchParams.get("categoryId");
  const minPrice = toNumber(searchParams.get("minPrice"), 0);
  const maxPrice = toNumber(searchParams.get("maxPrice"), Number.MAX_SAFE_INTEGER);
  const minRating = toNumber(searchParams.get("minRating"), 0);
  const sort = searchParams.get("sort") || "rating-desc";
  const page = Math.max(1, toNumber(searchParams.get("page"), 1));
  const limit = Math.min(48, Math.max(1, toNumber(searchParams.get("limit"), 12)));

  try {
    const response = await fetch(`${baseUrl}/tutors`, { cache: "no-store" });
    const result = await response.json();
    const tutors = extractTutorArray(result);

    const filtered = tutors
      .filter((tutor) => {
        const searchable = [
          tutor.user?.name,
          tutor.user?.email,
          tutor.bio,
          tutor.location,
          ...(tutor.categories?.map(({ category }) => category.name) || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesSearch = !search || searchable.includes(search);
        const matchesCategory =
          !category ||
          tutor.categories?.some(
            ({ categoryId, category: tutorCategory }) =>
              String(categoryId) === category ||
              tutorCategory.name.toLowerCase() === category.toLowerCase(),
          );
        const price = tutor.hourlyRate ?? 0;
        const matchesPrice = price >= minPrice && price <= maxPrice;
        const matchesRating = (tutor.avgRating ?? 0) >= minRating;

        return matchesSearch && matchesCategory && matchesPrice && matchesRating;
      })
      .sort((a, b) => {
        if (sort === "price-asc") return (a.hourlyRate ?? 0) - (b.hourlyRate ?? 0);
        if (sort === "price-desc") return (b.hourlyRate ?? 0) - (a.hourlyRate ?? 0);
        if (sort === "experience-desc") return (b.experience ?? 0) - (a.experience ?? 0);
        if (sort === "name-asc") {
          return (a.user?.name || "").localeCompare(b.user?.name || "");
        }
        return (b.avgRating ?? 0) - (a.avgRating ?? 0);
      });

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page: safePage,
        limit,
        total,
        totalPages,
        hasNextPage: safePage < totalPages,
        hasPrevPage: safePage > 1,
      },
      filters: { search, category, minPrice, maxPrice, minRating, sort },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch tutors",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
