import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // 1. Guard: If not logged in, they see nothing
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. Fetch only users belonging to the same team as the logged-in person
    const teamMembers = await db.user.findMany({
      where: {
        team: session.user.team, 
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        team: true,
        // Add other fields you display in the directory
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error("TEAM_FETCH_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}