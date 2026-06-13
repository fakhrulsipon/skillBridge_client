"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { LoaderCircle } from "lucide-react";

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // ১. পপআপ দিয়ে ইউজারকে সাকসেস মেসেজ দেখানো
    Swal.fire({
      icon: "success",
      title: "Payment Successful!",
      text: "Your session has been booked successfully.",
      confirmButtonColor: "#6366f1",
    }).then(() => {
      // ২. পপআপ বন্ধ হলে কোনো ঝামেলা ছাড়াই ক্লিন ড্যাশবোর্ড পাথে রিডাইরেক্ট করা
      router.push("/student/dashboard");
    });
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
      <LoaderCircle className="h-10 w-10 animate-spin text-indigo-600" />
      <p className="mt-4 text-sm font-medium text-slate-500">
        Verifying payment and redirecting to dashboard...
      </p>
    </div>
  );
}