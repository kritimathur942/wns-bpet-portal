import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth"; // Add this
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Add this

export async function POST(req: Request) {
  try {
    // 1. Get the session to identify the user
    const session = await getServerSession(authOptions);
    const userName = session?.user?.name || session?.user?.email || "Anonymous";

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const taskId = formData.get("taskId") as string;

    if (!file || !taskId) return new NextResponse("Missing data", { status: 400 });

    // Simulate URL (or actual path)
    const fileUrl = `/uploads/${file.name}`; 

    // 2. Create the report with the 'uploadedBy' field defined
    const report = await db.report.create({
      data: {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileUrl: fileUrl,
        taskId: taskId,
        uploadedBy: userName, // <--- This now has a value!
      },
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error("UPLOAD_API_ERROR:", error); 
    return new NextResponse("Internal Error", { status: 500 });
  }
}