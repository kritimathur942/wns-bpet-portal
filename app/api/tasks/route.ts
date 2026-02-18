import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// GET ALL TASKS
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const tasks = await db.task.findMany({
      where: { team: session.user.team },
      include: { reports: true },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(tasks);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// CREATE NEW TASK
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { title, priority } = await req.json();

    const newTask = await db.task.create({
      data: {
        title,
        priority,
        status: "TODO",
        team: session.user.team,
      },
    });

    return NextResponse.json(newTask);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}