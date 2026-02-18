"use client";

import React, { useEffect, useState } from "react";
import { 
  LayoutDashboard, Users, ChevronRight, Clock, AlertCircle, 
  CheckCircle2, FileStack, ArrowUpRight, X, Mail, Briefcase,
  TrendingUp, ListChecks
} from "lucide-react";

export default function ManagerDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTeam, setActiveTeam] = useState<string>("");
  
  // Modal states
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userTasks, setUserTasks] = useState<any[]>([]);
  const [userStats, setUserStats] = useState({ completed: 0, pending: 0, total: 0 });

  const fetchData = async (teamName?: string) => {
    setLoading(true);
    try {
      const url = teamName ? `/api/dashboard/manager?team=${teamName}` : "/api/dashboard/manager";
      const res = await fetch(url);
      const json = await res.json();
      setData(json);
      
      // Set active team on initial load if not set
      if (!activeTeam && json.availableTeams?.length > 0) {
        setActiveTeam(json.activeTeam || json.availableTeams[0]);
      }
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, []);

  const handleTeamSwitch = (team: string) => {
    setActiveTeam(team);
    fetchData(team);
  };

  const handleViewUserReport = (user: any) => {
    setSelectedUser(user);
    
    // We filter the same data pool used for the main BPET/Finance dashboard
    // This ensures the numbers match the "Intelligence" cards at the top
    const tasksForTeam = data?.tasks?.filter((t: any) => {
      return t.team?.toLowerCase() === activeTeam?.toLowerCase();
    }) || [];

    setUserTasks(tasksForTeam);

    // Calculate stats for the team-based individual report
    const completed = tasksForTeam.filter((t: any) => t.status === "DONE").length;
    setUserStats({
      total: tasksForTeam.length,
      completed: completed,
      pending: tasksForTeam.length - completed
    });
  };

  if (loading && !data) return <div className="p-10 font-black text-slate-400 uppercase animate-pulse">Syncing Intelligence...</div>;

  const stats = data?.stats || { totalTasks: 0, urgent: 0, completedTasks: 0, totalReports: 0 };
  const members = (data?.members || []).filter(
    (m: any) => m.name !== "Randeep" && m.email !== "randeep@example.com" 
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-white border-r border-slate-200 p-8 flex flex-col gap-10">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <LayoutDashboard size={20} className="text-white" />
          </div>
          <span className="font-black text-xl tracking-tighter uppercase">Manager</span>
        </div>
        <nav className="space-y-2">
          {data?.availableTeams?.map((team: string) => (
            <button
              key={team}
              onClick={() => handleTeamSwitch(team)}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                activeTeam?.toLowerCase() === team?.toLowerCase() 
                ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              {team.toUpperCase()}
              {activeTeam?.toLowerCase() === team?.toLowerCase() && <ChevronRight size={14} className="text-blue-400" />}
            </button>
          ))}
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-12 overflow-y-auto">
        <h1 className="text-4xl font-black tracking-tighter uppercase mb-12">
          {activeTeam} <span className="text-slate-300 font-light underline decoration-blue-500/30">Intelligence</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard label="Workload" value={stats.totalTasks} icon={<Clock size={20} className="text-blue-600" />} />
          <StatCard label="High Priority" value={stats.urgent} icon={<AlertCircle size={20} className="text-red-500" />} isAlert={stats.urgent > 0} />
          <StatCard label="Completed" value={stats.completedTasks} icon={<CheckCircle2 size={20} className="text-emerald-500" />} />
          <StatCard label="Reports" value={stats.totalReports} icon={<FileStack size={20} className="text-slate-500" />} />
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex justify-between bg-white/50 text-xs font-black uppercase tracking-widest text-slate-400">
            <span className="flex items-center gap-2"><Users size={16} className="text-blue-600" /> Resource Allocation</span>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-10 py-5">Teammate</th>
                <th className="px-10 py-5">Role</th>
                <th className="px-10 py-5 text-right">Individual Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {members.map((member: any) => (
                <tr key={member.id} className="group hover:bg-slate-50/80 transition-all">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">{member.name[0]}</div>
                      <span className="font-bold text-sm">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-[11px] font-bold text-slate-500 uppercase">{member.role}</td>
                  <td className="px-10 py-6 text-right">
                    <button 
                      onClick={() => handleViewUserReport(member)}
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-slate-900 transition-all shadow-lg shadow-blue-100"
                    >
                      VIEW DASHBOARD <ArrowUpRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* --- MODAL --- */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-md p-6">
          <div className="bg-slate-50 w-full max-w-2xl h-full rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-500">
            <div className="p-10 bg-white border-b border-slate-200 flex justify-between items-start">
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 rounded-3xl bg-slate-900 text-white flex items-center justify-center text-3xl font-black">{selectedUser.name[0]}</div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{selectedUser.name}</h2>
                  <div className="flex gap-4 mt-2 font-bold text-[10px] uppercase">
                    <span className="text-slate-400 flex items-center gap-1"><Mail size={12}/> {selectedUser.email}</span>
                    <span className="text-blue-600 flex items-center gap-1"><Briefcase size={12}/> {selectedUser.role}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-3 bg-slate-100 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 p-10 overflow-y-auto space-y-8">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-3xl border border-slate-200">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Team Total</p>
                  <p className="text-2xl font-black">{userStats.total}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Team Done</p>
                  <p className="text-2xl font-black text-emerald-500">{userStats.completed}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Efficiency</p>
                  <p className="text-2xl font-black text-blue-600">{userStats.total > 0 ? Math.round((userStats.completed / userStats.total) * 100) : 0}%</p>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-slate-400">
                  <ListChecks size={16} className="text-blue-600" /> Current {activeTeam} Data
                </h4>
                <div className="space-y-3">
                  {userTasks.length > 0 ? userTasks.map((task: any) => (
                    <div key={task.id} className="p-5 bg-white border border-slate-200 rounded-2xl flex justify-between items-center group hover:border-blue-300 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`h-2 w-2 rounded-full ${task.status === 'DONE' ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
                        <div>
                          <p className="text-sm font-bold text-slate-800">{task.title}</p>
                          <span className="text-[9px] font-black text-slate-400 uppercase">{task.status}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase ${task.priority === 'HIGH' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-500'}`}>
                        {task.priority}
                      </span>
                    </div>
                  )) : (
                    <div className="text-center py-12 bg-slate-100 rounded-[2rem] border-2 border-dashed border-slate-200 text-slate-400 font-bold text-xs uppercase">No active assignments</div>
                  )}
                </div>
              </div>

              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
                 <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2"><TrendingUp size={16} /> Performance Insight</h4>
                 <p className="text-xs text-slate-300 leading-relaxed italic">
                    "Viewing the live queue for {activeTeam}. This report mirrors the department's active workload intelligence."
                 </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, isAlert }: any) {
  return (
    <div className={`bg-white p-8 rounded-[2rem] border transition-all ${isAlert ? 'border-red-200 bg-red-50/30' : 'border-slate-200 shadow-sm'}`}>
      <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 mb-6">{icon}</div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-4xl font-black tracking-tighter">{value}</p>
    </div>
  );
}