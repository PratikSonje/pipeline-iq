import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { UserButton } from "@clerk/nextjs";
import { CommandPalette } from "@/components/layout/command-palette";
import { TaskDrawer } from "@/components/layout/task-drawer";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="flex h-screen bg-black overflow-hidden selection:bg-white/30 font-sans relative text-white">
      {/* Global Command Palette */}
      <CommandPalette />
      <TaskDrawer />

      {/* Global Ambient Background Orbs for the Dashboard */}
      <div className="ambient-orb ambient-orb-blue w-[800px] h-[800px] top-[-200px] right-[-200px] opacity-20" />
      <div className="ambient-orb ambient-orb-purple w-[800px] h-[800px] bottom-[-200px] left-[-200px] opacity-20" style={{ animationDelay: "-12s" }} />

      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <header className="h-16 flex items-center justify-between px-8 bg-black/40 border-b border-white/10 shrink-0 backdrop-blur-md">
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <UserButton appearance={{ elements: { avatarBox: "w-8 h-8 rounded-full border border-white/20 hover:scale-105 transition-transform" } }} />
          </div>
        </header>
        <main className="flex-1 flex flex-col overflow-auto p-8 min-h-0 bg-white/[0.01]">
          {children}
        </main>
      </div>
    </div>
  );
}
