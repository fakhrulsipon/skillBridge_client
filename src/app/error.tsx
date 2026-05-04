"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Captured:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-50 text-rose-500 shadow-sm border border-rose-100">
        <AlertCircle size={40} />
      </div>
      <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-3">
        Something went wrong
      </h1>
      <p className="max-w-md text-slate-500 mb-8 leading-relaxed">
        We encountered an unexpected error. Don't worry, your data is safe. 
        Please try refreshing the page or contact support if the issue persists.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => reset()}
          className="rounded-2xl bg-indigo-600 px-8 py-6 text-base font-bold text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all"
        >
          <RefreshCcw size={18} className="mr-2" /> Try Again
        </Button>
        <Button
          asChild
          variant="outline"
          className="rounded-2xl border-slate-200 px-8 py-6 text-base font-bold text-slate-600 hover:bg-white"
        >
          <a href="/">Back to Homepage</a>
        </Button>
      </div>
      {error.digest && (
        <p className="mt-10 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
          Error ID: {error.digest}
        </p>
      )}
    </div>
  );
}
