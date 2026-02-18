"use client";

import { Droppable } from "@hello-pangea/dnd";
import { TaskCard } from "./task-card";
import { Plus, Trash2 } from "lucide-react";
import { CreateTaskModal } from "./CreateTaskModal";
import { clearDoneTasks } from "@/actions/task-actions";
import { useRouter } from "next/navigation";

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: any[];
}

export function KanbanColumn({ id, title, tasks }: KanbanColumnProps) {
  const router = useRouter();

  const handleClearDone = async () => {
    if (confirm("Clear all completed tasks?")) {
      await clearDoneTasks();
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col w-full bg-slate-50/50 rounded-xl p-4 border border-slate-100 min-w-[300px]">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
            {title}
          </h2>
          <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          {/* Only show trash icon if it's the DONE column and has tasks */}
          {id === "DONE" && tasks.length > 0 && (
            <button 
              onClick={handleClearDone}
              className="text-slate-400 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded"
              title="Clear all done"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}

          <CreateTaskModal 
            defaultStatus={id} 
            trigger={
              <button className="text-slate-400 hover:text-blue-600 transition-colors p-1 hover:bg-blue-50 rounded cursor-pointer">
                <Plus className="h-4 w-4" />
              </button>
            }
          />
        </div>
      </div>

      <Droppable droppableId={id}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex-grow min-h-[500px] flex flex-col gap-3"
          >
            {tasks.map((task, index) => (
              <TaskCard 
                key={task.id} 
                id={task.id} 
                title={task.title} 
                index={index} 
                priority={task.priority}
                reports={task.reports}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}