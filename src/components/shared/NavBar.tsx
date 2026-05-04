"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import Logo from "./Logo";

const getUserMenuItems = (role?: string) => {
  if (role === "TUTOR") {
    return [
      {
        label: "Tutor Dashboard",
        href: "/tutor/dashboard",
        icon: LayoutDashboard,
      },
    ];
  }
  if (role === "ADMIN") {
    return [{ label: "Admin Panel", href: "/admin", icon: LayoutDashboard }];
  }
  return [
    {
      label: "Student Dashboard",
      href: "/student/dashboard",
      icon: LayoutDashboard,
    },
  ];
};

const navLinks = [
  { label: "Find Tutors", href: "/tutors" },
  { label: "How it Works", href: "/#how-it-works" },
];

const NavBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
    setIsUserMenuOpen(false);
  };

  const userMenuItems = getUserMenuItems(user?.role);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6",
        isScrolled ? "py-3" : isHome ? "py-8" : "py-4",
      )}
    >
      <div
        className={cn(
          "mx-auto max-w-7xl rounded-[32px] transition-all duration-500 px-6",
          isScrolled
            ? "bg-white/80 backdrop-blur-2xl shadow-2xl shadow-indigo-500/10 py-3 border border-indigo-50/50"
            : isHome
              ? "bg-transparent py-4 border border-transparent"
              : "bg-white/60 backdrop-blur-xl py-4 border border-indigo-50 shadow-lg",
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Logo variant={isHome && !isScrolled ? "light" : "default"} />
            <nav className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-bold transition-all hover:text-indigo-600 tracking-tight",
                    isHome && !isScrolled
                      ? "text-white/80 hover:text-white"
                      : "text-slate-600",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={cn(
                    "flex items-center gap-3 rounded-full pl-1.5 pr-4 py-1.5 transition-all",
                    isHome && !isScrolled
                      ? "bg-white/10 hover:bg-white/20 text-white"
                      : "bg-slate-900 hover:bg-slate-800 text-white",
                  )}
                >
                  <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-white/20">
                    <div className="flex h-full w-full items-center justify-center bg-indigo-500 text-[10px] font-bold uppercase">
                      {user?.name?.[0] || "U"}
                    </div>
                  </div>
                  <span className="hidden md:block text-xs font-bold">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform opacity-60",
                      isUserMenuOpen && "rotate-180",
                    )}
                  />
                </button>

                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-4 w-64 origin-top-right rounded-[32px] border border-indigo-50 bg-white p-3 shadow-2xl ring-1 ring-indigo-500/5 z-20">
                      <div className="px-5 py-4 border-b border-indigo-50 mb-2">
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400">
                          Account
                        </p>
                        <p className="text-sm font-bold text-slate-900 truncate mt-1">
                          {user?.email}
                        </p>
                      </div>
                      {userMenuItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 rounded-2xl px-5 py-3 text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                        >
                          <item.icon size={18} />
                          {item.label}
                        </Link>
                      ))}
                      <div className="h-px bg-indigo-50 my-2 mx-2" />
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-2xl px-5 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all"
                      >
                        <LogOut size={18} />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className={cn(
                    "text-sm font-bold px-4 py-2 transition-colors",
                    isHome && !isScrolled
                      ? "text-white/80 hover:text-white"
                      : "text-slate-600 hover:text-indigo-600",
                  )}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className={cn(
                    "hidden sm:flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold shadow-2xl transition-all hover:scale-105 active:scale-95",
                    isHome && !isScrolled
                      ? "bg-white text-indigo-600 hover:bg-indigo-50 shadow-white/10"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200",
                  )}
                >
                  Get Started <Sparkles size={14} />
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "rounded-full p-2 transition-colors lg:hidden",
                isHome && !isScrolled
                  ? "text-white hover:bg-white/10"
                  : "text-slate-600 hover:bg-slate-100",
              )}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mt-4 border-t border-indigo-50 pt-6 pb-4 lg:hidden space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-2xl px-6 py-4 text-base font-bold text-slate-600 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="pt-4 px-2">
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-2xl bg-indigo-600 py-4 text-base font-bold text-white shadow-xl shadow-indigo-200"
                >
                  Join SkillBridge
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
