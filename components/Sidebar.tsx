"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { LayoutDashboard, FileStack, Users2, Building2, LogOut, ShieldCheck } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  if (status === "unauthenticated" || !session) {
   return null;
  }

  // Check if the logged-in user is the Manager
  // This makes it case-insensitive and checks for 'manager' anywhere in the name or email

  // TEMPORARY FOR DEMO: If name is NOT Kriti or Shailja, show the Directives
// 1. Identify the user
  const isManager = session?.user?.name?.toLowerCase().includes("manager") || 
                    session?.user?.email?.toLowerCase().includes("manager");

  // 2. Build the list based on who is logged in
  const navItems = [
    { name: "Project Board", href: "/", icon: LayoutDashboard },
    { name: "Team Directory", href: "/team", icon: Users2 },
  ];

  if (isManager) {
    // What the Manager sees
    navItems.push({ name: "Directives", href: "/instructions", icon: ShieldCheck });
  } else {
    // What Shailja / Kriti see
    navItems.push({ name: "My Tasks", href: "/my-tasks", icon: FileStack });
  }

  navItems.push({ name: "Reports Log", href: "/reports", icon: FileStack });

  return (
    <aside className="w-72 border-r border-slate-200 bg-white h-screen sticky top-0 flex flex-col shrink-0 z-50">
      <div className="p-6 border-b border-slate-50 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="bg-[#003366] h-10 w-10 rounded-xl flex items-center justify-center shadow-lg">
            <Building2 className="text-white h-5 w-5" />
          </div>
          <div className="overflow-hidden">
            <h2 className="font-black text-slate-900 leading-none truncate uppercase tracking-tighter text-lg">WNS Global</h2>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1 italic">Team BPET</p>
          </div>
        </div>
      </div>

      <div className="p-6 flex-1">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive ? "bg-slate-900 text-white shadow-lg shadow-slate-200" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon className={`h-4 w-4 ${isActive ? "text-blue-400" : ""}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 bg-slate-50/50 border-t border-slate-100">
        <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs border-2 border-white uppercase">
              {session?.user?.name?.[0] || "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-[11px] font-black text-slate-900 truncate">{session?.user?.name}</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                {isManager ? "Manager Access" : "Analyst Access"}
              </p>
            </div>
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })} 
            className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}