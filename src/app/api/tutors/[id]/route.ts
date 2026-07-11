import { NextRequest, NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };
type TutorProfile = {
  id: number;
  categories?: { categoryId: number }[];
};

const getBaseUrl = () => process.env.NEXT_PUBLIC_BASE_URL || "";

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const baseUrl = getBaseUrl();

  if (!baseUrl) {
    return NextResponse.json(
      { success: false, message: "NEXT_PUBLIC_BASE_URL is not configured" },
      { status: 500 },
    );
  }

  try {
    const tutorResponse = await fetch(`${baseUrl}/tutors/${id}`, {
      cache: "no-store",
    });
    const tutorResult = await tutorResponse.json();

    if (!tutorResponse.ok) {
      return NextResponse.json(tutorResult, { status: tutorResponse.status });
    }

    const tutor = tutorResult.data;
    const firstCategoryId = tutor?.categories?.[0]?.categoryId;
    let related: TutorProfile[] = [];

    if (firstCategoryId) {
      const allResponse = await fetch(`${baseUrl}/tutors`, { cache: "no-store" });
      const allResult = await allResponse.json();
      const allTutors: TutorProfile[] = Array.isArray(allResult.data)
        ? allResult.data
        : [];

      related = allTutors
        .filter(
          (item) =>
            item.id !== tutor.id &&
            item.categories?.some(({ categoryId }: { categoryId: number }) => categoryId === firstCategoryId),
        )
        .slice(0, 4);
    }

    return NextResponse.json({
      success: true,
      data: tutor,
      related,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch tutor details",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
