export type TutorBookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

export type TutorBooking = {
  id: number;
  scheduledAt: string;
  duration: number;
  totalPrice: number;
  note: string | null;
  status: TutorBookingStatus;
  student: {
    id?: number;
    name: string;
    email?: string;
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

const normalizeTutorBooking = (value: unknown): TutorBooking | null => {
  if (!isObject(value)) return null;

  const student = isObject(value.student)
    ? value.student
    : isObject(value.studentUser)
      ? value.studentUser
      : isObject(value.user)
        ? value.user
        : {};

  const id = readNumber(value.id, NaN);
  const scheduledAt = readString(value.scheduledAt, readString(value.date));
  const status = readString(value.status, "PENDING") as TutorBookingStatus;

  if (!Number.isFinite(id) || !scheduledAt) return null;

  return {
    id,
    scheduledAt,
    duration: readNumber(value.duration, 60),
    totalPrice: readNumber(value.totalPrice ?? value.price ?? value.amount, 0),
    note: typeof value.note === "string" ? value.note : null,
    status,
    student: {
      id: readOptionalNumber(student.id),
      name: readString(student.name, "Student"),
      email: readString(student.email),
    },
  };
};

const buildTutorBookingPaths = (userId?: number) => [
  "/booking",
  "/booking/me",
  "/booking/tutor/me",
  "/booking/my-sessions",
  "/booking/tutor",
  ...(userId ? [`/booking/tutor/${userId}`] : []),
];

const readApiMessage = (payload: unknown, fallback: string) => {
  if (isObject(payload) && typeof payload.message === "string") {
    return payload.message;
  }

  return fallback;
};

const shouldTryNextPath = (response: Response, message: string) =>
  response.status === 404 ||
  (response.status === 400 && message.toLowerCase().includes("invalid booking id"));

export const extractTutorBookings = (payload: unknown) =>
  firstArray(payload)
    .map(normalizeTutorBooking)
    .filter((booking): booking is TutorBooking => Boolean(booking));

export const fetchTutorBookings = async (
  baseUrl: string,
  token: string,
  userId?: number,
) => {
  let lastMessage = "Failed to load sessions";
  let foundEmptyResponse = false;

  for (const path of buildTutorBookingPaths(userId)) {
    const response = await fetch(`${baseUrl}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const result = await response.json().catch(() => ({}));

    if (response.ok) {
      const bookings = extractTutorBookings(result);
      if (bookings.length > 0) return bookings;
      foundEmptyResponse = true;
      continue;
    }

    lastMessage = readApiMessage(result, lastMessage);
    if (!shouldTryNextPath(response, lastMessage)) break;
  }

  if (foundEmptyResponse) return [];

  throw new Error(lastMessage);
};
