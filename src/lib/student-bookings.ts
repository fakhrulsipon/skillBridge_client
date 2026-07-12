export type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export type StudentBooking = {
  id: number;
  scheduledAt: string;
  duration: number;
  totalPrice: number;
  note: string | null;
  status: BookingStatus;
  tutorProfile: {
    id: number;
    bio?: string;
    user: { id?: number; name: string; email?: string };
  };
};

type ApiObject = Record<string, unknown>;

const isObject = (value: unknown): value is ApiObject =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const firstArray = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) return payload;
  if (!isObject(payload)) return [];

  const candidates = [
    payload.data,
    payload.bookings,
    payload.booking,
    isObject(payload.data) ? payload.data.data : undefined,
    isObject(payload.data) ? payload.data.bookings : undefined,
    isObject(payload.meta) ? payload.meta.data : undefined,
  ];

  return candidates.find(Array.isArray) ?? [];
};

const readNumber = (value: unknown, fallback = 0) => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const readOptionalNumber = (value: unknown) => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const readString = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback;

const normalizeBooking = (value: unknown): StudentBooking | null => {
  if (!isObject(value)) return null;

  const tutorProfile = isObject(value.tutorProfile) ? value.tutorProfile : {};
  const tutorUser = isObject(tutorProfile.user)
    ? tutorProfile.user
    : isObject(value.tutor)
      ? value.tutor
      : isObject(value.tutorUser)
        ? value.tutorUser
        : {};

  const id = readNumber(value.id, NaN);
  const scheduledAt = readString(value.scheduledAt, readString(value.date));
  const status = readString(value.status, "CONFIRMED") as BookingStatus;

  if (!Number.isFinite(id) || !scheduledAt) return null;

  return {
    id,
    scheduledAt,
    duration: readNumber(value.duration, 60),
    totalPrice: readNumber(value.totalPrice ?? value.price ?? value.amount, 0),
    note: typeof value.note === "string" ? value.note : null,
    status,
    tutorProfile: {
      id: readNumber(tutorProfile.id ?? value.tutorProfileId),
      bio: readString(tutorProfile.bio),
      user: {
        id: readOptionalNumber(tutorUser.id),
        name: readString(tutorUser.name, "Tutor"),
        email: readString(tutorUser.email),
      },
    },
  };
};

const buildStudentBookingPaths = (userId?: number) => [
  ...(userId ? [`/booking/student/${userId}`] : []),
  "/booking/student",
  "/booking/student/me",
  "/booking/my-bookings",
  "/booking/me",
  "/booking",
];

const readApiMessage = (payload: unknown, fallback: string) => {
  if (isObject(payload) && typeof payload.message === "string") {
    return payload.message;
  }

  return fallback;
};

export const extractStudentBookings = (payload: unknown) =>
  firstArray(payload)
    .map(normalizeBooking)
    .filter((booking): booking is StudentBooking => Boolean(booking));

export const fetchStudentBookings = async (
  baseUrl: string,
  token: string,
  userId?: number,
) => {
  let lastMessage = "Failed to load bookings";

  for (const path of buildStudentBookingPaths(userId)) {
    const response = await fetch(`${baseUrl}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const result = await response.json().catch(() => ({}));

    if (response.ok) {
      return extractStudentBookings(result);
    }

    lastMessage = readApiMessage(result, lastMessage);
    if (response.status !== 404) break;
  }

  throw new Error(lastMessage);
};
