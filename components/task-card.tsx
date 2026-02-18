"use client";

import { Draggable } from "@hello-pangea/dnd";
import { Paperclip, Trash2, Upload, Loader2, FileText, Download, Check, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function TaskCard({ title: initialTitle, id, index, priority, reports = [] }: any) {
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const router = useRouter();

  // --- DELETE TASK ---
  const handleDelete = async () => {
    if (!confirm("Delete this project and all attachments?")) return;
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (res.ok) router.refresh();
    } catch (error) {
      alert("Failed to delete");
    }
  };

  // --- UPDATE TITLE ---
  const handleUpdateTitle = async () => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (res.ok) {
        setIsEditing(false);
        router.refresh();
      }
    } catch (error) {
      alert("Failed to update");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("taskId", id);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-4 group hover:border-blue-300 transition-all"
        >
          <div className="flex justify-between items-start mb-3">
            <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase border ${
              priority === "HIGH" ? "bg-red-50 text-red-600 border-red-100" : 
              priority === "MEDIUM" ? "bg-amber-50 text-amber-600 border-amber-100" : 
              "bg-blue-50 text-blue-600 border-blue-100"
            }`}>
              {priority}
            </span>
            <button 
              onClick={handleDelete}
              className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500 transition-all"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* EDITABLE TITLE */}
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input 
                autoFocus
                className="text-sm font-bold text-slate-800 bg-slate-50 border border-blue-200 rounded px-2 py-1 w-full outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUpdateTitle()}
              />
              <button onClick={handleUpdateTitle} className="text-green-500"><Check className="h-4 w-4"/></button>
              <button onClick={() => {setIsEditing(false); setTitle(initialTitle);}} className="text-slate-400"><X className="h-4 w-4"/></button>
            </div>
          ) : (
            <h4 
              onDoubleClick={() => setIsEditing(true)}
              className="text-sm font-bold text-slate-800 leading-tight cursor-text hover:text-blue-600"
              title="Double click to edit"
            >
              {title}
            </h4>
          )}

          {/* ATTACHMENTS LIST */}
          {reports.length > 0 && (
            <div className="mt-4 space-y-1.5 border-t border-slate-50 pt-3">
              {reports.map((file: any) => (
                <div key={file.id} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg group/file">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileText className="h-3 w-3 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-600 truncate max-w-[140px]">{file.fileName}</span>
                  </div>
                  <a href={file.fileUrl} target="_blank" className="opacity-0 group-hover/file:opacity-100 transition-opacity">
                    <Download className="h-3 w-3 text-blue-500" />
                  </a>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Paperclip className="h-3.5 w-3.5" />
              <span className="text-[10px] font-black">{reports.length}</span>
            </div>
            
            <label className="cursor-pointer h-7 w-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
              {isUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
              <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
            </label>
          </div>
        </div>
      )}
    </Draggable>
  );
}