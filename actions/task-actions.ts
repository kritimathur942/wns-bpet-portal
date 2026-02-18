"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * FETCH ALL TASKS
 */
export async function getTasks() {
  try {
    const tasks = await db.task.findMany({
      include: {
        reports: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}

/**
 * CREATE A TASK
 */
export async function createTask(
  title: string, 
  status: string, 
  priority: "LOW" | "MEDIUM" | "HIGH"
) {
  try {
    const task = await db.task.create({
      data: {
        title,
        status,
        priority,
      },
    });
    
    revalidatePath("/");
    return task;
  } catch (error) {
    console.error("Failed to create task:", error);
    return { error: "Could not create task" };
  }
}

/**
 * UPDATE STATUS (DRAG & DROP)
 */
export async function updateTaskStatus(taskId: string, newStatus: string) {
  try {
    const updatedTask = await db.task.update({
      where: { id: taskId },
      data: { status: newStatus },
    });
    revalidatePath("/");
    return updatedTask;
  } catch (error) {
    console.error("Failed to update task:", error);
    return { error: "Could not update task status" };
  }
}

/**
 * DELETE A TASK
 */
export async function deleteTask(taskId: string) {
  try {
    await db.task.delete({
      where: { id: taskId },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete task:", error);
    return { error: "Could not delete task" };
  }
}

/**
 * CLEAR ALL COMPLETED TASKS
 */
export async function clearDoneTasks() {
  try {
    await db.task.deleteMany({
      where: {
        status: "DONE",
      },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to clear tasks:", error);
    return { error: "Could not clear tasks" };
  }
}

/**
 * UPLOAD A REPORT
 * This satisfies the 'uploadedBy' requirement in your Prisma Schema
 */
export async function uploadReport(formData: FormData, taskId?: string) {
  try {
    // 1. Get Session for the uploader's name
    const session = await getServerSession(authOptions);
    const userName = session?.user?.name || session?.user?.email || "Anonymous User";

    const file = formData.get("file") as File;
    
    if (!file || file.size === 0) {
      return { error: "No file selected" };
    }

    if (!taskId) {
      return { error: "Task ID is required for upload" };
    }

    // Convert file to Base64 for database storage
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64File = `data:${file.type};base64,${buffer.toString("base64")}`;

    // 2. Create the report in the 'report' table
    const report = await db.report.create({
      data: {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileUrl: base64File,
        taskId: taskId, 
        uploadedBy: userName, // This fixes the "Cannot find name 'userName'" error
      },
    });

    revalidatePath("/");
    revalidatePath("/reports");
    return { success: true, report };
  } catch (error) {
    console.error("Upload Error:", error);
    return { error: "Failed to upload to database" };
  }
}

/**
 * FETCH ALL UPLOADED REPORTS
 */
export async function getUploadedReports() {
  try {
    return await db.report.findMany({
      include: {
        task: true,
      },
      orderBy: { 
        createdAt: "desc" 
      },
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
}

/**
 * DELETE A REPORT
 */
export async function deleteReport(reportId: string) {
  try {
    await db.report.delete({
      where: {
        id: reportId,
      },
    });

    revalidatePath("/");
    revalidatePath("/reports");
    return { success: true };
  } catch (error) {
    console.error("Delete Error:", error);
    return { error: "Failed to delete the report" };
  }
}