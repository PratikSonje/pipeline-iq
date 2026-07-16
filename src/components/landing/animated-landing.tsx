"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BarChart3, Layout, Users, Activity, Orbit } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export function AnimatedLanding({ userId }: { userId: string | null }) {
  // Mouse tracking for the glowing background orb
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the mouse movement
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate position relative to center
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden selection:bg-white/30 font-sans">
      
      {/* Dynamic Mouse Follower Orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full bg-white/5 blur-[120px] pointer-events-none -z-10"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      
      {/* Ambient background orbs */}
      <div className="ambient-orb ambient-orb-blue w-[500px] h-[500px] top-[-100px] right-[-100px]" />
      <div className="ambient-orb ambient-orb-purple w-[600px] h-[600px] bottom-[-200px] left-[-100px]" style={{ animationDelay: "-12s" }} />

      {/* Navigation */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex items-center justify-between px-8 py-6 relative z-10"
      >
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-2xl flex items-center justify-center overflow-hidden border border-white/20 bg-white/5 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <Orbit className="w-5 h-5 text-white" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-[spin-slow_4s_linear_infinite]" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-white">
            PipelineIQ
          </span>
        </div>
        <nav className="flex items-center gap-6">
          {userId ? (
            <div className="flex items-center gap-6 bg-white/5 border border-white/10 rounded-full px-4 py-2 backdrop-blur-md">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <div className="h-4 w-px bg-white/20" />
              <UserButton appearance={{ elements: { avatarBox: "w-8 h-8 rounded-full border border-white/20" } }} />
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/sign-in"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Log In
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/sign-up"
                  className="text-sm font-medium bg-white text-black px-5 py-2.5 rounded-full hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  Get Started
                </Link>
              </motion.div>
            </div>
          )}
        </nav>
      </motion.header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col relative z-10">
        <section className="flex flex-col items-center justify-center pt-28 pb-20 px-4 text-center max-w-5xl mx-auto">
          
          {/* Animated v2.0 Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative inline-flex items-center justify-center p-[1px] mb-12 rounded-full overflow-hidden group"
          >
            {/* Spinning Dotted Border Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_25%,rgba(255,255,255,0.8)_50%,transparent_75%)] animate-[spin-slow_3s_linear_infinite]" />
            <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black border border-white/10 backdrop-blur-md">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-white">
                PipelineIQ v2.0 is now live
              </span>
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[1.05]"
          >
            <span className="text-white">Close more deals with</span> <br />
            <span className="text-sweep">
              absolute clarity.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed font-light"
          >
            A completely re-engineered, Kanban-first CRM built for high-performing B2B sales teams. Track your deals, forecast revenue, and never let an opportunity rot.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.7, type: "spring" }}
            className="flex items-center gap-6"
          >
            {userId ? (
              <Link href="/dashboard" className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-black transition-all duration-300 bg-white rounded-full hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]">
                <span className="mr-2">Enter Dashboard</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <Link href="/sign-up" className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-black transition-all duration-300 bg-white rounded-full hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]">
                <span className="mr-2">Start for free</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="grid md:grid-cols-3 gap-6"
            >
              {[
                {
                  icon: Layout,
                  title: "Kanban Deal Board",
                  desc: "Visually drag and drop your deals through customizable stages. Instantly see where every dollar sits.",
                },
                {
                  icon: BarChart3,
                  title: "Weighted Forecasting",
                  desc: "Calculate expected revenue automatically based on stage probabilities. Know exactly what you'll close.",
                },
                {
                  icon: Users,
                  title: "Company & Contact CRM",
                  desc: "Manage all your accounts and key stakeholders in one place. Link contacts to deals seamlessly.",
                }
              ].map((feature, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -8 }}
                  className="group relative p-[1px] rounded-3xl overflow-hidden"
                >
                  {/* Spinning Gradient Border on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-[spin-slow_4s_linear_infinite]" />
                  <div className="relative h-full bg-black/80 backdrop-blur-xl border border-white/10 p-8 rounded-[23px] flex flex-col gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                      <feature.icon className="w-6 h-6 text-white/80" />
                    </div>
                    <h3 className="text-xl font-semibold text-white tracking-tight">{feature.title}</h3>
                    <p className="text-slate-400 leading-relaxed text-sm">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-500 text-sm relative z-10 border-t border-white/10 mt-auto">
        <p>&copy; {new Date().getFullYear()} PipelineIQ. Built for modern sales teams.</p>
      </footer>
    </div>
  );
}
