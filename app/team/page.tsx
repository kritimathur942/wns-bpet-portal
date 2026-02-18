"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Users2, ShieldCheck, Mail, MapPin, TrendingUp, Briefcase, Loader2 } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  team: string;
}

export default function TeamPage() {
  const { data: session } = useSession();
  const [teammates, setTeammates] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch real team data from our API
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch("/api/team");
        if (response.ok) {
          const data = await response.json();
          // Filter out the logged-in user from the "Peers" list
          setTeammates(data.filter((m: TeamMember) => m.email !== session?.user?.email));
        }
      } catch (error) {
        console.error("Failed to load team:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) fetchTeam();
  }, [session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  // Get current user details from session
  const currentUser = session?.user;
  const userInitial = currentUser?.name?.[0] || "?";

  return (
    <div className="p-10 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        {/* Profile Header: DYNAMIC */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row gap-8 items-center">
          <div className="h-32 w-32 rounded-3xl bg-blue-600 flex items-center justify-center text-white text-4xl font-black shadow-xl">
            {userInitial}
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <h1 className="text-3xl font-black text-slate-900">{currentUser?.name}</h1>
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black uppercase w-fit mx-auto md:mx-0 border border-slate-200">
                {currentUser?.team || "Core Execution"}
              </span>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-slate-500 font-medium text-sm">
              <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" /> {currentUser?.email}</span>
              <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> {currentUser?.role || "Team Member"}</span>
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Operations Hub</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Hierarchy Column */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Line of Reporting
              </h3>
              <div className="bg-white border border-slate-200 rounded-3xl p-8 relative">
                <div className="space-y-6">
                  {/* Static Manager (You can make this dynamic later) */}
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black">R</div>
                    <div>
                      <p className="text-sm font-black text-slate-800">Randeep</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operations Manager</p>
                    </div>
                  </div>

                  <div className="ml-5 h-8 w-0.5 bg-slate-100" />

                  {/* Dynamic User */}
                  <div className="flex items-center gap-4 ml-10">
                    <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black ring-4 ring-blue-50">
                      {userInitial}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800">{currentUser?.name} <span className="text-blue-500 ml-1 text-[10px]">(You)</span></p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{currentUser?.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Teammates Sidebar: DYNAMIC */}
          <div className="space-y-6">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Users2 className="h-5 w-5 text-blue-600" />
              {currentUser?.team} Peers
            </h3>
            <div className="grid gap-3">
              {teammates.length > 0 ? (
                teammates.map((member) => (
                  <div key={member.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center font-bold text-slate-400 text-xs text-uppercase">
                        {member.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 leading-tight">{member.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{member.role}</p>
                      </div>
                    </div>
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">No peers found in {currentUser?.team}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}