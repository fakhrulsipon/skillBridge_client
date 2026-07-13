"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  UserRound,
  X,
  Sparkles,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import Logo from "./Logo";

const getUserMenuItems = (role?: string) => {
  if (role === "TUTOR") {
    return [
      { label: "Tutor Dashboard", href: "/tutor/dashboard", icon: LayoutDashboard },
      { label: "Profile", href: "/tutor/profile", icon: UserRound },
      { label: "Sessions", href: "/tutor/sessions", icon: CalendarDays },
      { label: "Availability", href: "/tutor/availability", icon: Settings },
    ];
  }
  if (role === "ADMIN") {
    return [
      { label: "Admin Panel", href: "/admin", icon: LayoutDashboard },
      { label: "Users", href: "/admin/users", icon: UserRound },
      { label: "Bookings", href: "/admin/bookings", icon: CalendarDays },
      { label: "Categories", href: "/admin/categories", icon: Settings },
    ];
  }
  return [
    { label: "Student Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { label: "Profile", href: "/student/profile", icon: UserRound },
    { label: "Bookings", href: "/student/bookings", icon: CalendarDays },
  ];
};

const loggedOutLinks = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "About", href: "/about" },
  { label: "How it Works", href: "/how-it-works" },
];

const loggedInBaseLinks = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "About", href: "/about" },
  { label: "How it Works", href: "/how-it-works" },
];

const getRoleNavLink = (role?: string) => {
  if (role === "TUTOR") return { label: "Sessions", href: "/tutor/sessions" };
  if (role === "ADMIN") return { label: "Users", href: "/admin/users" };
  return { label: "Bookings", href: "/student/bookings" };
};

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
    setIsMobileMenuOpen(false);
  };

  const userMenuItems = getUserMenuItems(user?.role);
  const dashboardHref = userMenuItems[0]?.href || "/student/dashboard";
  const navLinks = isAuthenticated
    ? [
        ...loggedInBaseLinks,
        { label: "Dashboard", href: dashboardHref },
        getRoleNavLink(user?.role),
      ]
    : loggedOutLinks;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-6",
        isScrolled ? "py-2 md:py-3" : isHome ? "py-4 md:py-6" : "py-3 md:py-4",
      )}
    >
      <div
        className={cn(
          "mx-auto max-w-7xl rounded-2xl md:rounded-[32px] transition-all duration-300 px-4 md:px-6",
          isScrolled
            ? "bg-white/95 backdrop-blur-xl shadow-lg border border-slate-100 py-2.5 md:py-3"
            : isHome
              ? "bg-transparent py-3 md:py-4 border border-transparent"
              : "bg-white/90 backdrop-blur-xl py-3 md:py-4 border border-slate-200 shadow-sm",
        )}
      >
        <div className="flex items-center justify-between">
          {/* Logo & Desktop Nav Links */}
          <div className="flex items-center gap-8 lg:gap-12">
            <Logo variant={isHome && !isScrolled ? "light" : "default"} />
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-semibold transition-all hover:text-primary tracking-tight",
                    isHome && !isScrolled ? "text-white/80 hover:text-white" : "text-slate-600",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Side Actions (User Details or Auth Links) */}
          <div className="flex items-center gap-2 md:gap-3">
            {isAuthenticated ? (
              <div className="relative">
                {/* User Profile Button in Navbar (Visible on Mobile, Tablet & Desktop) */}
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={cn(
                    "flex items-center gap-2 rounded-full pl-1 pr-2.5 py-1 transition-all border shadow-sm",
                    isHome && !isScrolled
                      ? "bg-white/10 hover:bg-white/20 text-white border-white/10"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200/60",
                  )}
                >
                  <div className="h-7 w-7 sm:h-8 sm:w-8 overflow-hidden rounded-full border border-white/25 shadow-inner">
                    <div className="flex h-full w-full items-center justify-center bg-primary text-[10px] sm:text-xs font-bold uppercase text-white">
                      {user?.name?.[0] || "U"}
                    </div>
                  </div>
                  <span className="text-xs font-bold max-w-[70px] sm:max-w-[100px] truncate">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform opacity-60",
                      isUserMenuOpen && "rotate-180",
                    )}
                  />
                </button>

                {/* User Dropdown Menu (Universal for Mobile & Desktop) */}
                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2.5 w-60 sm:w-64 origin-top-right rounded-2xl border border-slate-100 bg-white p-2 shadow-xl ring-1 ring-black/5 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-3.5 py-2.5 border-b border-slate-100 mb-1">
                        <p className="text-[9px] font-extrabold uppercase tracking-widest text-primary">
                          Logged In As
                        </p>
                        <p className="text-xs font-bold text-slate-800 truncate mt-0.5">
                          {user?.email}
                        </p>
                      </div>
                      {userMenuItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-primary transition-all"
                        >
                          <item.icon size={16} className="text-slate-400" />
                          {item.label}
                        </Link>
                      ))}
                      <div className="h-px bg-slate-100 my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-all"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              // Logged Out State Auth Buttons (Desktop only)
              <div className="hidden lg:flex items-center gap-2">
                <Link
                  href="/login"
                  className={cn(
                    "text-sm font-semibold px-3 py-2 transition-colors",
                    isHome && !isScrolled ? "text-white/80 hover:text-white" : "text-slate-600 hover:text-primary",
                  )}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]",
                    isHome && !isScrolled ? "bg-white text-primary" : "bg-primary text-white",
                  )}
                >
                  Get Started <Sparkles size={12} />
                </Link>
              </div>
            )}

            {/* Mobile/Tablet Hamburger Menu (Always accessible) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className={cn(
                "rounded-full p-2 transition-colors lg:hidden relative z-50",
                isMobileMenuOpen
                  ? "text-slate-900"
                  : isHome && !isScrolled
                    ? "text-white hover:bg-white/10"
                    : "text-slate-600 hover:bg-slate-100",
              )}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile/Tablet General Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 top-0 left-0 w-full h-screen bg-white z-40 lg:hidden flex flex-col pt-24 px-6 pb-6 overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col gap-1.5">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-3.5 mb-1">
                Menu Links
              </p>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "block rounded-xl px-4 py-3 text-base font-semibold transition-all",
                    pathname === link.href ? "bg-primary/10 text-primary" : "text-slate-700 hover:bg-slate-50",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* If Logged out, show Auth CTA inside Mobile Menu */}
            {!isAuthenticated && (
              <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-md shadow-primary/10"
                >
                  Join SkillBridge <Sparkles size={14} />
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