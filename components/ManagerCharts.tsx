"use client";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from "recharts";

export default function ManagerCharts({ statusData, priorityData }: any) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm min-h-[400px]">
      <h3 className="text-xs font-black uppercase text-slate-400 mb-6 tracking-widest">Workflow Distribution</h3>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={statusData}>
            <XAxis 
              dataKey="name" 
              fontSize={10} 
              fontWeight="900" 
              axisLine={false} 
              tickLine={false} 
            />
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}