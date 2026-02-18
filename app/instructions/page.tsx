"use client";

import React, { useState } from "react";
import { 
  Send, BarChart3, CheckCircle2, 
  Clock, Users2, PlusCircle, 
  User, Activity, Search, ShieldCheck
} from "lucide-react";

export default function InstructionsPage() {
  const [activeTab, setActiveTab] = useState<'give' | 'progress'>('give');
  const [selectedStaff, setSelectedStaff] = useState<'Shailja' | 'Kriti'>('Shailja');
  const [loading, setLoading] = useState(false);

  // Dummy Data for Individual Progress
  const stats = {
    Shailja: { pending: 3, completed: 8, efficiency: "92%", lastActive: "10m ago" },
    Kriti: { pending: 5, completed: 4, efficiency: "78%", lastActive: "1h ago" }
  };

  return (
    <div className="p-10 w-full bg-slate-50 min-h-screen">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase text-[#003366]">Directive Command</h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-1 italic">BPET Personnel Management</p>
        </div>

        <div className="flex bg-slate-200 p-1 rounded-2xl w-fit border border-slate-300">
          <button 
            onClick={() => setActiveTab('give')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'give' ? 'bg-[#003366] text-white shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <PlusCircle size={14} /> 1. Give Task
          </button>
          <button 
            onClick={() => setActiveTab('progress')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'progress' ? 'bg-[#003366] text-white shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <BarChart3 size={14} /> 2. Team Progress
          </button>
        </div>
      </header>

      {activeTab === 'give' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-400 max-w-4xl mx-auto">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <ShieldCheck size={120} />
             </div>
             <h2 className="text-xl font-black text-slate-800 mb-8 uppercase flex items-center gap-2">
                <Send size={20} className="text-blue-600" /> New Team Mandate
             </h2>
             <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Assignee</label>
                    <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-600 outline-none">
                      <option>Shailja</option>
                      <option>Kriti</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Deadline</label>
                    <input type="date" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-600 outline-none" />
                  </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Instruction</label>
                    <textarea rows={4} placeholder="Detailed SOP requirements..." className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-medium"></textarea>
                </div>
                <button className="w-full py-5 bg-[#003366] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-900 transition-all shadow-xl">
                  Broadcast to Personnel
                </button>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'progress' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
          {/* Member Selector */}
          <div className="flex gap-4 mb-8">
            {['Shailja', 'Kriti'].map((name) => (
              <button
                key={name}
                onClick={() => setSelectedStaff(name as any)}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl border transition-all ${selectedStaff === name ? 'bg-white border-[#003366] shadow-md ring-2 ring-[#003366]/5' : 'bg-transparent border-slate-200 text-slate-400 grayscale hover:grayscale-0'}`}
              >
                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-black text-white ${selectedStaff === name ? 'bg-[#003366]' : 'bg-slate-300'}`}>
                  {name[0]}
                </div>
                <div className="text-left">
                  <p className="text-xs font-black uppercase text-slate-900">{name}</p>
                  <p className="text-[9px] font-bold text-slate-400">View Metrics</p>
                </div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stats Sidebar */}
            <div className="space-y-6">
              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
                <p className="text-[10px] font-black uppercase text-blue-400 mb-6">Efficiency Rating</p>
                <p className="text-6xl font-black mb-2 tracking-tighter">{stats[selectedStaff].efficiency}</p>
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  <Activity size={12} /> Live Tracking Active
                </div>
              </div>
              <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                   <p className="text-[10px] font-black uppercase text-slate-400 italic">Last Activity</p>
                   <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="font-black text-slate-900">{stats[selectedStaff].lastActive}</p>
              </div>
            </div>

            {/* Individual Task List */}
            <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 p-10">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 italic underline decoration-blue-500 decoration-4">
                    {selectedStaff}'s Mandate Log
                  </h3>
                  <div className="flex gap-2">
                    <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase">Pending: {stats[selectedStaff].pending}</div>
                    <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase">Done: {stats[selectedStaff].completed}</div>
                  </div>
               </div>

               <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors group">
                       <div className="flex items-center gap-4">
                          <div className="h-2 w-2 rounded-full bg-blue-400" />
                          <p className="font-bold text-slate-700 text-sm italic group-hover:text-blue-600 transition-colors">Pending Operational Report v{i}.0</p>
                       </div>
                       <Clock className="text-slate-300" size={16} />
                    </div>
                  ))}
                  <p className="text-center text-[10px] font-black text-slate-300 uppercase mt-6 tracking-widest">End of visible log</p>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}