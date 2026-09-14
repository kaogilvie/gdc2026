"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteUrlToggle } from "@/components/SiteUrlToggle";

const sections = [
  { href: "/", label: "Poll", description: "" },
  {
    href: "/presentations",
    label: "Topics",
    description: "",
  },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-ko-border bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ko-accent">
            &KO · GDC 2026
          </p>
          <h1 className="text-xl font-bold text-ko-dark">Interactive Session</h1>
        </div>

        <nav className="flex flex-wrap gap-2">
          <SiteUrlToggle />
          {sections.map((section) => {
            const isActive =
              section.href === "/"
                ? pathname === "/"
                : pathname.startsWith(section.href);

            return (
              <Link
                key={section.href}
                href={section.href}
                className={`rounded-lg px-4 py-2 transition-colors ${
                  isActive
                    ? "bg-ko-accent text-white shadow-sm"
                    : "bg-ko-light-muted text-ko-dark hover:bg-ko-light"
                }`}
              >
                <span className="block text-sm font-semibold">
                  {section.label}
                </span>
                <span
                  className={`block text-xs ${
                    isActive ? "text-white/80" : "text-ko-muted"
                  }`}
                >
                  {section.description}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
