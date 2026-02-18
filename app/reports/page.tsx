"use client";

import { useEffect, useState } from "react";
import { getUploadedReports, deleteReport } from "@/actions/task-actions";
import { FileText, Download, ArrowLeft, Tag, Trash2, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ReportsLogPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function loadReports() {
    const data = await getUploadedReports();
    setReports(data);
    setLoading(false);
  }

  useEffect(() => {
    loadReports();
  }, []);

  // --- ROBUST DOWNLOAD HANDLER ---
  const handleDownload = (fileUrl: string, fileName: string) => {
    try {
      // 1. Safety Check: If it's a placeholder (like old test data), don't decode it
      if (!fileUrl || !fileUrl.startsWith("data:")) {
        console.warn("File is a placeholder. Opening in new tab.");
        window.open(fileUrl, "_blank");
        return;
      }

      // 2. Extract Base64 parts
      const parts = fileUrl.split(';base64,');
      if (parts.length < 2) throw new Error("Invalid Format");

      const contentType = parts[0].split(':')[1];
      const base64Data = parts[1];

      // 3. Decode Base64 to Blob
      const raw = window.atob(base64Data);
      const rawLength = raw.length;
      const uInt8Array = new Uint8Array(rawLength);

      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }

      const blob = new Blob([uInt8Array], { type: contentType });
      const url = window.URL.createObjectURL(blob);

      // 4. Create trigger
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      // 5. Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("This file record is corrupted or was an old placeholder. Please upload a fresh file to test.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Permanently delete this report?")) {
      await deleteReport(id);
      loadReports();
      router.refresh();
    }
  };

  const filteredReports = reports.filter((report) =>
    report.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.task?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-sm font-bold text-slate-500 mb-8 hover:text-blue-600 transition-colors w-fit">
           <ArrowLeft className="h-4 w-4" />
           Back to Project Board
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Global Reports Log</h1>
            <p className="text-slate-500 mt-2 text-lg">A master history of every file uploaded.</p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search files or tasks..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">File Name</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Attached To</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={3} className="p-10 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-300" /></td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-10 text-center text-slate-400 italic">
                    {searchTerm ? "No matches found." : "No reports yet."}
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-bold text-slate-700">{report.fileName}</p>
                          <p className="text-[10px] text-slate-400">
                            {(report.fileSize / 1024 / 1024).toFixed(2)} MB • {new Date(report.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Tag className="h-3 w-3" />
                        <span className="text-sm font-medium">{report.task?.title || "Unassigned"}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button 
                          onClick={() => handleDownload(report.fileUrl, report.fileName)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(report.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}