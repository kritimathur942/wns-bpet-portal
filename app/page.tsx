import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import KanbanBoard from "@/components/KanbanBoard";
import ManagerDashboard from "./manager/page";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  // 1. Manager Logic
  if (session.user.role === "MANAGER") {
    return <ManagerDashboard />;
  }

  // 2. Fetch Tasks FILTERED by the logged-in user's team
  const tasks = await db.task.findMany({
    where: {
      team: session.user.team, // <--- This ensures Shailja only sees FINANCE tasks
    },
    include: {
      reports: true, 
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <main className="flex-1 bg-white min-h-screen">
      <div className="p-8 border-b border-slate-100 flex justify-between items-center">
        <div>
          {/* Dynamic Header based on Team */}
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
            {session.user.team} Project Board
          </h1>
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-1">
            WNS {session.user.team} Operations
          </p>
        </div>
      </div>

      <KanbanBoard initialTasks={tasks} />
    </main>
  );
}