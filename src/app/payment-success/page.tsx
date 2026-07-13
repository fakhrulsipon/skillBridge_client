"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { LoaderCircle } from "lucide-react";

import { getStoredToken } from "@/lib/auth";

const PENDING_BOOKING_STORAGE_KEY = "skillbridge:pendingBooking";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

  useEffect(() => {
    const finalizeBooking = async () => {
      const token = getStoredToken();
      const pendingBooking = sessionStorage.getItem(PENDING_BOOKING_STORAGE_KEY);

      try {
        if (token && pendingBooking) {
          const response = await fetch(`${baseUrl}/booking`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: pendingBooking,
          });

          const result = await response.json().catch(() => ({}));

          if (!response.ok) {
            throw new Error(
              result.message ||
                "Payment succeeded, but booking could not be saved.",
            );
          }

          sessionStorage.removeItem(PENDING_BOOKING_STORAGE_KEY);
        }

        await Swal.fire({
          icon: "success",
          title: "Payment Successful!",
          text: "Your session has been booked successfully.",
          confirmButtonColor: "#047857",
        });
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "Booking save failed",
          text:
            error instanceof Error
              ? error.message
              : "Payment succeeded, but booking could not be saved.",
          confirmButtonColor: "#047857",
        });
      } finally {
        router.push("/student/bookings");
      }
    };

    finalizeBooking();
  }, [baseUrl, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas">
      <LoaderCircle className="h-10 w-10 animate-spin text-primary" />
      <p className="mt-4 text-sm font-medium text-slate-500">
        Verifying payment and saving your booking...
      </p>
    </div>
  );
}
