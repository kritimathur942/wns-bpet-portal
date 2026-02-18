"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadReport } from "@/actions/task-actions";
import { Upload, X, FileText, Loader2 } from "lucide-react";

export function UploadReportModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    
    try {
      const result = await uploadReport(formData);
      if (result.success) {
        setIsOpen(false);
        router.refresh(); // Refresh the page to show the new file
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-all font-medium text-sm shadow-sm"
      >
        <Upload className="h-4 w-4" />
        Upload Report
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800">Upload Report</h2>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6">
          <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-blue-400 transition-all group bg-slate-50/30">
            <input 
              type="file" 
              name="file" 
              required 
              id="file-input"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              accept=".pdf,.csv,.xlsx,.docx,.txt"
            />
            <div className="flex flex-col items-center pointer-events-none">
              <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform border border-slate-100">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm font-bold text-slate-700">Select report file</p>
              <p className="text-xs text-slate-400 mt-1">PDF, CSV, or Text (Max 4MB)</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</>
            ) : (
              "Confirm Upload"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}