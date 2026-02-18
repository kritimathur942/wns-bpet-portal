import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// 1. UPDATE TASK (Move columns)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updatedTask = await db.task.update({
      where: { id },
      data: { ...body }
    });
    return NextResponse.json(updatedTask);
  } catch (error) {
    return new NextResponse("Update Error", { status: 500 });
  }
}

// 2. COMBINED DELETE (Handles Task OR Report)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); 

    if (type === "report") {
      // DELETE JUST THE FILE (id refers to Report ID here)
      await db.report.delete({ where: { id } });
      return NextResponse.json({ success: true });
    } else {
      // DELETE THE WHOLE TASK (id refers to Task ID here)
      await db.task.delete({ where: { id } });
      return new NextResponse("Task Deleted", { status: 200 });
    }
  } catch (error) {
    console.error("DELETE_ERROR", error);
    return new NextResponse("Delete Error", { status: 500 });
  }
}

// 3. ADD REPORT
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { fileName, fileUrl } = await req.json();

    const session = await getServerSession(authOptions);
    const userName = session?.user?.name || session?.user?.email || "Anonymous";

    const newReport = await db.report.create({
      data: {
        fileName,
        fileUrl,
        taskId: id,
        fileType: "application/octet-stream", // Default fallback
        fileSize: 0, // Default fallback
        uploadedBy: userName,
      },
    });

    return NextResponse.json(newReport);
  } catch (error) {
    return new NextResponse("Upload Error", { status: 500 });
  }
}