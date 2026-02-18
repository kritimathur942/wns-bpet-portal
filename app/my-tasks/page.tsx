"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { 
  FileUp, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  FileText, 
  AlertCircle,
  ChevronRight
} from "lucide-react";

export default function AnalystTasksPage() {
  const { data: session } = useSession();
  const [uploading, setUploading] = useState<number | null>(null);
  const [completed, setCompleted] = useState<number[]>([]);

  const handleUpload = (id: number) => {
    setUploading(id);
    // Simulate processing for the demo
    setTimeout(() => {
      setUploading(null);
      setCompleted([...completed, id]);
    }, 1500);
  };

  const tasks = [
    { id: 1, title: "Q4 Internal Compliance Audit", priority: "URGENT", deadline: "Today, 5:00 PM", desc: "Verify all IV&V logs against the master sheet for October-December." },
    { id: 2, title: "Weekly Resource Utilization Log", priority: "NORMAL", deadline: "Friday", desc: "Submit the BPET team hours allocation report." },
    { id: 3, title: "Risk Assessment Document", priority: "NORMAL", deadline: "Next Monday", desc: "Update the risk register for the upcoming WNS client audit." }
  ];

  return (
    <div className="p-10 w-full bg-slate-50 min-h-screen">
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-2">
           <ShieldAlert className="text-blue-600" size={16} />
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Personnel Portal</span>
        </div>
        <h1 className="text-4xl font-black tracking-tighter uppercase text-[#003366]">My Active Directives</h1>
        <p className="text-slate-500 font-bold text-xs uppercase mt-1 tracking-widest italic">
          Logged in as: <span className="text-blue-600 font-black underline decoration-2">{session?.user?.name || "Analyst"}</span>
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Task List */}
        <div className="lg:col-span-2 space-y-4">
          {tasks.map((task) => {
            const isDone = completed.includes(task.id);
            return (
              <div key={task.id} className={`bg-white rounded-[2.5rem] border transition-all p-8 ${isDone ? 'border-emerald-200 opacity-60' : 'border-slate-200 hover:border-blue-300 shadow-sm'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${task.priority === 'URGENT' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                      {task.priority}
                    </span>
                    <span className="text-[9px] font-black uppercase text-slate-400 flex items-center gap-1 italic">
                      <Clock size={10} /> {task.deadline}
                    </span>
                  </div>
                  {isDone && <CheckCircle2 className="text-emerald-500" size={24} />}
                </div>

                <h3 className={`text-xl font-bold mb-2 ${isDone ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{task.title}</h3>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">{task.desc}</p>

                {!isDone ? (
                  <button 
                    onClick={() => handleUpload(task.id)}
                    disabled={uploading === task.id}
                    className="w-full py-4 bg-[#003366] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/10"
                  >
                    {uploading === task.id ? (
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <> <FileUp size={16} /> Upload Report & Mark Done </>
                    )}
                  </button>
                ) : (
                  <div className="w-full py-4 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                    Evidence Submitted
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
            <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
              <FileText className="text-blue-400" size={16} /> Evidence Protocol
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                 <div className="h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                    <ChevronRight size={12} className="text-blue-400" />
                 </div>
                 <p className="text-[11px] text-slate-400 font-bold uppercase leading-tight">Reports must be in PDF/XLSX format.</p>
              </div>
              <div className="flex gap-3">
                 <div className="h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                    <ChevronRight size={12} className="text-blue-400" />
                 </div>
                 <p className="text-[11px] text-slate-400 font-bold uppercase leading-tight">All uploads are timestamped for compliance.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200">
             <div className="flex items-center gap-2 mb-4 text-orange-500">
                <AlertCircle size={16} />
                <span className="text-[10px] font-black uppercase">Support</span>
             </div>
             <p className="text-xs font-bold text-slate-500 leading-relaxed">
                Contact the BPET Manager if you encounter issues with the verification logs.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}