"use client";

import Link from "next/link";
import { Search, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <div className="relative mb-12">
        <div className="text-[180px] font-black text-slate-50 leading-none select-none">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-[32px] bg-indigo-600 text-white shadow-2xl shadow-indigo-200 animate-bounce-slow">
            <Search size={40} />
          </div>
        </div>
      </div>
      
      <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
        Page not found
      </h1>
      <p className="max-w-md text-slate-500 mb-10 leading-relaxed text-lg font-medium">
        The page you are looking for might have been removed, had its name changed, 
        or is temporarily unavailable.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          asChild
          className="rounded-2xl bg-slate-900 px-8 py-6 text-base font-bold text-white hover:bg-slate-800 transition-all"
        >
          <Link href="/">
            <Home size={18} className="mr-2" /> Go Home
          </Link>
        </Button>
        <Button
          onClick={() => window.history.back()}
          variant="outline"
          className="rounded-2xl border-slate-200 px-8 py-6 text-base font-bold text-slate-600 hover:bg-slate-50"
        >
          <ArrowLeft size={18} className="mr-2" /> Go Back
        </Button>
      </div>
    </div>
  );
}
