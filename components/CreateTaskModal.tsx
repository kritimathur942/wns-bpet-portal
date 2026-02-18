"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Added this
import { createTask } from "@/actions/task-actions";
import { Plus, X, AlertCircle, ArrowUpCircle, ArrowDownCircle, Layout } from "lucide-react";

interface CreateTaskModalProps {
  defaultStatus?: string;
  trigger?: React.ReactNode;
}

export function CreateTaskModal({ defaultStatus, trigger }: CreateTaskModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Initialize router

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    const priority = formData.get("priority") as "LOW" | "MEDIUM" | "HIGH";
    const status = defaultStatus || (formData.get("status") as string);
    
    try {
      await createTask(title, status, priority);
      
      // Close the modal
      setIsOpen(false);
      
      // THIS IS THE KEY: Force the board to fetch new data immediately
      router.refresh(); 
      
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {trigger ? (
        <div onClick={() => setIsOpen(true)} className="cursor-pointer">{trigger}</div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="h-4 w-4" />
          Create Issue
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Create New Issue</h2>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-tight">
                  {defaultStatus ? `Adding to ${defaultStatus.replace("_", " ")}` : "New Project Task"}
                </p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Title</label>
                <input
                  name="title"
                  required
                  autoFocus
                  autoComplete="off"
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 bg-white shadow-sm"
                />
              </div>

              {!defaultStatus && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Status</label>
                  <div className="relative">
                    <select 
                      name="status" 
                      className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 bg-white appearance-none shadow-sm cursor-pointer"
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="DONE">Done</option>
                    </select>
                    <Layout className="absolute right-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Priority</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { val: "LOW", icon: ArrowDownCircle, color: "text-blue-600" },
                    { val: "MEDIUM", icon: AlertCircle, color: "text-amber-600" },
                    { val: "HIGH", icon: ArrowUpCircle, color: "text-rose-600" },
                  ].map((p) => (
                    <label key={p.val} className="cursor-pointer group">
                      <input type="radio" name="priority" value={p.val} className="peer hidden" defaultChecked={p.val === "MEDIUM"} />
                      <div className="flex flex-col items-center justify-center p-3 rounded-xl border-2 border-slate-100 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all group-hover:border-slate-200">
                        <p.icon className={`h-5 w-5 ${p.color} mb-1`} />
                        <span className="text-[10px] font-bold text-slate-600">{p.val}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-200 active:scale-[0.98]"
              >
                {loading ? "Creating..." : "Create Issue"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}