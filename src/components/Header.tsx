"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, Heart, GitCompare } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home", icon: Car },
    { href: "/find", label: "Find Cars", icon: Car },
    { href: "/shortlist", label: "Shortlist", icon: Heart },
    { href: "/compare", label: "Compare", icon: GitCompare },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-brand-700">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-lg text-white">
            C
          </span>
          <span>
            Car<span className="text-brand-600">Match</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {links.slice(1).map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === href
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
