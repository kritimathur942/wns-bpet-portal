import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";

// 1. GET: Fetch stats, members, and tasks with report tracking
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const userTeam = (session.user as any).team;
    const selectedTeam = searchParams.get("team") || userTeam;

    const teamsData = await db.task.findMany({
      select: { team: true },
      distinct: ['team'],
    });

    const tasks = await db.task.findMany({
      where: { team: { equals: selectedTeam, mode: 'insensitive' } },
      include: { reports: true },
      orderBy: { createdAt: 'desc' }
    });

    const members = await db.user.findMany({
      where: { team: { equals: selectedTeam, mode: 'insensitive' } },
    });

    const stats = {
      totalTasks: tasks.length,
      // Task counts as done if status is DONE OR if it has at least one report
      completedTasks: tasks.filter((t: any) => t.status === "DONE" || t.reports.length > 0).length,
      urgent: tasks.filter((t: any) => t.priority === "HIGH").length,
      totalReports: (tasks as any[]).reduce((acc, t) => acc + (t.reports?.length || 0), 0),
    };

    return NextResponse.json({ 
      stats, 
      members, 
      tasks: tasks as any[], 
      availableTeams: Array.from(new Set(teamsData.map(t => t.team))),
      activeTeam: selectedTeam 
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

// 2. POST: Create a new Task (Manager Oversight)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    // We use 'as any' to bypass the TypeScript property error while the schema syncs
    const newTask = await db.task.create({
      data: {
        title: body.title,
        team: body.team,
        assignedTo: body.assignedTo,
        assignedToId: body.assignedToId,
        priority: body.priority || "MEDIUM",
        status: "TODO"
      } as any 
    });

    return NextResponse.json(newTask);
  } catch (error) {
    console.error("Task creation failed:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}

// 3. DELETE: Remove a task (Manager Oversight)
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("id");

    if (!taskId) return NextResponse.json({ error: "Task ID is required" }, { status: 400 });

    await db.task.delete({
      where: { id: taskId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Task deletion failed:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}