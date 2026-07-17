"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layout, Users, Building2, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Pipeline", href: "/pipeline", icon: Layout },
  { name: "Companies", href: "/companies", icon: Building2 },
  { name: "Contacts", href: "/contacts", icon: Users },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-t border-white/10 z-50 flex items-center justify-around px-2 pb-safe">
      {navigation.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full space-y-1 text-[10px] font-medium transition-colors",
              isActive ? "text-white" : "text-slate-500 hover:text-slate-300"
            )}
          >
            <item.icon className={cn("w-5 h-5", isActive ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "")} />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
