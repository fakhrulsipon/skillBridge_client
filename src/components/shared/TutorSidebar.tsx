"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  LayoutDashboard,
  LogOut,
  UserCircle,
  Video,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import Logo from "./Logo";

const tutorNavItems = [
  {
    title: "Dashboard",
    href: "/tutor/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Profile",
    href: "/tutor/profile",
    icon: UserCircle,
  },
  {
    title: "Availability",
    href: "/tutor/availability",
    icon: CalendarDays,
  },
  {
    title: "Sessions",
    href: "/tutor/sessions",
    icon: Video,
  },
];

const TutorSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <aside className="w-full border-b border-slate-200 bg-white lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div className="sticky top-0 flex flex-col gap-6 px-4 py-6 lg:min-h-screen lg:px-6">
        <div className="space-y-2">
          <Logo />
        </div>

        <nav className="flex gap-3 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
          {tutorNavItems.map(({ title, href, icon: Icon }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex min-w-fit items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "border-sky-200 bg-sky-50 text-sky-700"
                    : "border-slate-200 text-slate-600 hover:border-sky-100 hover:bg-slate-50 hover:text-slate-900",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{title}</span>
              </Link>
            );
          })}
        </nav>

        <div className="lg:mt-auto">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full min-w-fit items-center justify-center gap-3 rounded-xl border border-red-200 px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 lg:justify-start"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default TutorSidebar;
