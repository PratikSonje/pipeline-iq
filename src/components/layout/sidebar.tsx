"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layout, Users, Building2, LayoutDashboard, Orbit, Search, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Pipeline", href: "/pipeline", icon: Layout },
  { name: "Companies", href: "/companies", icon: Building2 },
  { name: "Contacts", href: "/contacts", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex w-64 bg-black/60 backdrop-blur-2xl h-full flex-col border-r border-white/10 relative z-20">
      <div className="h-16 flex items-center px-6 shrink-0 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden border border-white/20 bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            <Orbit className="w-4 h-4 text-white" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-[spin-slow_4s_linear_infinite]" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">PipelineIQ</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="px-3 space-y-2">
          {/* Global Search Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <button
              onClick={() => window.dispatchEvent(new Event("open-command-palette"))}
              className="w-full group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 relative overflow-hidden text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
            >
              <div className="flex items-center">
                <Search className="mr-3 flex-shrink-0 h-5 w-5 text-slate-500 group-hover:text-slate-300 transition-all duration-300" aria-hidden="true" />
                Search
              </div>
              <div className="flex items-center gap-1 shrink-0 bg-white/5 px-1.5 py-0.5 rounded text-xs text-slate-500 font-medium border border-white/10 group-hover:border-white/20 group-hover:text-slate-300 transition-colors">
                ⌘K
              </div>
            </button>
          </motion.div>

          {/* Global Tasks Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <button
              onClick={() => window.dispatchEvent(new Event("open-task-drawer"))}
              className="w-full group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 relative overflow-hidden text-slate-400 hover:text-white hover:bg-white/5 border border-transparent mt-1"
            >
              <div className="flex items-center">
                <CheckSquare className="mr-3 flex-shrink-0 h-5 w-5 text-slate-500 group-hover:text-slate-300 transition-all duration-300" aria-hidden="true" />
                Tasks
              </div>
            </button>
          </motion.div>

          <div className="h-px bg-white/10 my-2 mx-2" />

          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 relative overflow-hidden",
                    isActive
                      ? "text-white bg-white/10 border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                      : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 flex-shrink-0 h-5 w-5 transition-all duration-300",
                      isActive ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "text-slate-500 group-hover:text-slate-300"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                  {isActive && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute left-0 w-1 h-full bg-white rounded-r-full opacity-70"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
