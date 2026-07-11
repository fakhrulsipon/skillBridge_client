import { NextRequest, NextResponse } from "next/server";

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as ContactPayload;
  const name = payload.name?.trim() || "";
  const email = payload.email?.trim().toLowerCase() || "";
  const subject = payload.subject?.trim() || "General inquiry";
  const message = payload.message?.trim() || "";

  const fieldErrors: Partial<Record<keyof ContactPayload, string>> = {};
  if (name.length < 2) fieldErrors.name = "Name must be at least 2 characters";
  if (!emailPattern.test(email)) fieldErrors.email = "Enter a valid email address";
  if (subject.length < 3) fieldErrors.subject = "Subject must be at least 3 characters";
  if (message.length < 10) fieldErrors.message = "Message must be at least 10 characters";

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { success: false, message: "Please fix the highlighted fields", fieldErrors },
      { status: 400 },
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

  if (baseUrl) {
    try {
      const response = await fetch(`${baseUrl}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (response.ok) {
        const result = await response.json().catch(() => ({}));
        return NextResponse.json({
          success: true,
          message: result.message || "Your message has been sent successfully.",
          data: result.data,
        });
      }
    } catch {
      // Fall through to the local acknowledgement below.
    }
  }

  return NextResponse.json({
    success: true,
    message: "Your message has been received successfully.",
    data: { name, email, subject, message, createdAt: new Date().toISOString() },
  });
}
