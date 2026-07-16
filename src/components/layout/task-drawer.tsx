"use client";

import { useEffect, useState, useTransition } from "react";
import { Check, Trash2, X, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTasks, createTask, toggleTask, deleteTask } from "@/actions/task";

type TaskType = {
  id: string;
  title: string;
  completed: boolean;
};

export function TaskDrawer() {
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isPending, startTransition] = useTransition();

  // Load tasks when drawer opens
  useEffect(() => {
    if (open) {
      startTransition(async () => {
        const fetchedTasks = await getTasks();
        setTasks(fetchedTasks);
      });
    }
  }, [open]);

  // Global event listener to open drawer
  useEffect(() => {
    const openEvent = () => setOpen(true);
    window.addEventListener("open-task-drawer", openEvent);
    return () => window.removeEventListener("open-task-drawer", openEvent);
  }, []);

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    if (!title.trim()) return;

    const form = e.currentTarget;
    startTransition(async () => {
      const res = await createTask(formData);
      if (res.success) {
        form.reset();
        const fetchedTasks = await getTasks();
        setTasks(fetchedTasks);
      }
    });
  };

  const handleToggleTask = (taskId: string, currentStatus: boolean) => {
    // Optimistic update
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !currentStatus } : t));
    
    startTransition(async () => {
      await toggleTask(taskId, !currentStatus);
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
    });
  };

  const handleDeleteTask = (taskId: string) => {
    // Optimistic update
    setTasks(tasks.filter(t => t.id !== taskId));

    startTransition(async () => {
      await deleteTask(taskId);
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
    });
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <div 
        className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-black/80 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
      >
        <div className="flex items-center justify-between p-4 px-6 border-b border-white/10 shrink-0">
          <h2 className="text-lg font-semibold text-white">My Tasks</h2>
          <button 
            onClick={() => setOpen(false)}
            className="p-2 -mr-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 px-6 border-b border-white/10 shrink-0 bg-white/5">
          <form onSubmit={handleCreateTask} className="relative">
            <input
              type="text"
              name="title"
              placeholder="Add a new task..."
              className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              disabled={isPending}
            />
            <button
              type="submit"
              disabled={isPending}
              className="absolute right-2 top-2 p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            </button>
          </form>
        </div>

        <div className="flex-1 overflow-y-auto p-4 px-6">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-70">
              <Check className="w-12 h-12 mb-4" />
              <p>You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className={cn(
                    "group flex items-center justify-between p-3 rounded-xl border transition-all duration-300",
                    task.completed 
                      ? "bg-white/5 border-transparent opacity-60" 
                      : "bg-white/10 border-white/10 hover:border-white/20 shadow-sm"
                  )}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <button
                      onClick={() => handleToggleTask(task.id, task.completed)}
                      className={cn(
                        "flex items-center justify-center w-5 h-5 rounded-full border flex-shrink-0 transition-colors",
                        task.completed 
                          ? "bg-emerald-500 border-emerald-500 text-white" 
                          : "border-slate-500 hover:border-emerald-400 text-transparent hover:text-emerald-400"
                      )}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <span 
                      className={cn(
                        "text-sm truncate transition-all",
                        task.completed ? "text-slate-500 line-through" : "text-white"
                      )}
                    >
                      {task.title}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all flex-shrink-0 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
