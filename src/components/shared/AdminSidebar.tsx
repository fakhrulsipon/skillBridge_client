"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import Logo from "./Logo";

const adminNavItems = [
  {
    title: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Manage Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Manage Items",
    href: "/admin/bookings",
    icon: BookOpen,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: FolderOpen,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    router.push("/");
  };

  return (
    <aside className="sticky top-0 z-40 w-full border-b border-primary/15 bg-card/95 backdrop-blur-xl lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r lg:bg-card">
      <div className="flex flex-col px-4 py-3 lg:sticky lg:top-0 lg:min-h-screen lg:gap-6 lg:px-6 lg:py-6">
        <div className="flex items-center justify-between gap-3">
          <Logo />
          <button
            type="button"
            onClick={() => setIsMenuOpen((value) => !value)}
            aria-label="Toggle dashboard menu"
            aria-expanded={isMenuOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/15 bg-canvas text-slate-700 shadow-sm transition-colors hover:border-secondary/30 hover:text-secondary lg:hidden"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <div
          className={cn(
            "overflow-hidden transition-all duration-300 lg:flex lg:flex-1 lg:flex-col lg:overflow-visible",
            isMenuOpen
              ? "mt-4 max-h-[80vh] opacity-100"
              : "max-h-0 opacity-0 lg:max-h-none lg:opacity-100",
          )}
        >
          <div className="rounded-xl bg-secondary/10 border border-secondary/30 px-3 py-2">
          <p className="text-xs font-semibold text-secondary uppercase tracking-wider">Admin Panel</p>
          </div>

          <nav className="mt-4 flex flex-col gap-2 pb-1 lg:mt-6">
            {adminNavItems.map(({ title, href, icon: Icon }) => {
              const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "border-secondary/30 bg-secondary/10 text-secondary"
                      : "border-primary/15 text-slate-600 hover:border-secondary/20 hover:bg-canvas hover:text-slate-900",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{title}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 lg:mt-auto">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-red-200 px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 lg:justify-start"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
