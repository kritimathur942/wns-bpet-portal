"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Trash2, FileText, Plus, Paperclip, Loader2, X } from "lucide-react";

// --- Types ---
interface Report {
  id: string;
  fileName: string;
  fileUrl: string;
}

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  team: string;
  reports?: Report[]; 
}

interface KanbanBoardProps {
  initialTasks: Task[];
}

// --- Constants ---
const COLUMNS = [
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "DONE", title: "Completed" },
];

export default function KanbanBoard({ initialTasks }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [hasMounted, setHasMounted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("MEDIUM");

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // --- 1. Handle File Upload ---
  const handleFileUpload = async (taskId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(taskId);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;

        const response = await fetch(`/api/tasks/${taskId}`, {
          method: "POST",
          body: JSON.stringify({ 
            fileName: file.name, 
            fileUrl: base64Data 
          }),
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          const newReport = await response.json();
          setTasks(prev => prev.map(t => 
            t.id === taskId 
              ? { ...t, reports: [...(t.reports || []), newReport] } 
              : t
          ));
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(null);
      e.target.value = ""; 
    }
  };

  // --- 2. DELETE REPORT (Combined Logic) ---
  const handleDeleteReport = async (taskId: string, reportId: string) => {
    if (!confirm("Remove this report?")) return;

    try {
      // We send the request to the task route but add ?type=report 
      // This tells your combined DELETE function to only remove the file
      const response = await fetch(`/api/tasks/${reportId}?type=report`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTasks(prev => prev.map(t => 
          t.id === taskId 
            ? { ...t, reports: t.reports?.filter(r => r.id !== reportId) } 
            : t
        ));
      }
    } catch (error) {
      console.error("Delete report error:", error);
    }
  };

  // --- 3. Drag & Drop Logic ---
  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const updatedTasks = Array.from(tasks);
    const movedTaskIndex = updatedTasks.findIndex(t => t.id === draggableId);
    const [movedTask] = updatedTasks.splice(movedTaskIndex, 1);
    
    movedTask.status = destination.droppableId;
    updatedTasks.splice(destination.index, 0, movedTask);
    setTasks(updatedTasks);

    await fetch(`/api/tasks/${draggableId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: destination.droppableId }),
      headers: { "Content-Type": "application/json" },
    });
  };

  // --- 4. Create Task ---
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const response = await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify({ title: newTaskTitle, priority: newTaskPriority }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const newTask = await response.json();
      setTasks([{ ...newTask, reports: [] }, ...tasks]);
      setNewTaskTitle("");
      setIsAdding(false);
    }
  };

  // --- 5. Delete Task ---
  const handleDeleteTask = async (id: string) => {
    if (!confirm("Delete this task?")) return;
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (res.ok) setTasks(tasks.filter(t => t.id !== id));
  };

  if (!hasMounted) return null;

  return (
    <div className="p-8">
      {/* Quick Add Form */}
      {/* Quick Add Form */}
<div className="mb-8">
  {isAdding ? (
    <form onSubmit={handleAddTask} className="flex flex-col gap-3 bg-white p-6 rounded-2xl border-2 border-blue-100 w-full max-w-md shadow-xl">
      <input
        autoFocus
        className="border p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="What's the task?"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
      />
      
      {/* Priority Selector */}
      <div className="flex items-center gap-2">
        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Priority:</label>
        <select 
          value={newTaskPriority}
          onChange={(e) => setNewTaskPriority(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-[10px] font-bold rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
        </select>
      </div>

      <div className="flex gap-2 ml-auto mt-2">
        <button 
          type="button" 
          onClick={() => setIsAdding(false)} 
          className="text-xs font-bold text-slate-400 px-3 uppercase tracking-tighter"
        >
          CANCEL
        </button>
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
        >
          SAVE TASK
        </button>
      </div>
    </form>
  ) : (
    <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-full text-xs font-black hover:bg-blue-600 transition-all shadow-lg">
      <Plus size={16} strokeWidth={3} /> CREATE NEW TASK
    </button>
  )}
</div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {COLUMNS.map((column) => (
            <div key={column.id} className="bg-slate-50/50 rounded-[2rem] p-5 border border-slate-100 min-h-[700px]">
              <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 px-4">{column.title}</h2>

              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4 min-h-[100px]">
                    {tasks.filter(t => t.status === column.id).map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-200 transition-all group">
                            <div className="flex justify-between mb-4">
                              <span className={`text-[9px] font-black px-2 py-1 rounded uppercase ${
                                task.priority === 'HIGH' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-600'
                              }`}>{task.priority}</span>
                              <button onClick={() => handleDeleteTask(task.id)} className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                            </div>
                            
                            <p className="text-sm font-bold text-slate-800 mb-6">{task.title}</p>
                            
                            <div className="pt-4 border-t border-slate-100">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-1.5 text-slate-400">
                                  <FileText size={12} />
                                  <span className="text-[10px] font-black uppercase tracking-tighter">
                                    {task.reports?.length || 0} Reports
                                  </span>
                                </div>
                                
                                <label className="cursor-pointer">
                                  <input 
                                    type="file" 
                                    className="hidden" 
                                    onChange={(e) => handleFileUpload(task.id, e)} 
                                  />
                                  <div className="flex items-center gap-1 text-[10px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest">
                                    {isUploading === task.id ? <Loader2 size={12} className="animate-spin" /> : <Paperclip size={12} />}
                                    {isUploading === task.id ? "WAIT" : "ATTACH"}
                                  </div>
                                </label>
                              </div>

                              {task.reports && task.reports.length > 0 && (
                                <div className="space-y-1.5">
                                  {task.reports.map((report) => (
                                    <div key={report.id} className="group/report text-[10px] bg-slate-50 p-2 rounded border border-slate-100 text-slate-600 font-bold flex items-center justify-between gap-2">
                                      <div className="flex items-center gap-2 truncate">
                                        <Paperclip size={10} className="text-slate-400 shrink-0" />
                                        <span className="truncate">{report.fileName}</span>
                                      </div>
                                      <button 
                                        onClick={() => handleDeleteReport(task.id, report.id)}
                                        className="text-slate-300 hover:text-red-500 transition-colors"
                                      >
                                        <X size={10} strokeWidth={3} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}