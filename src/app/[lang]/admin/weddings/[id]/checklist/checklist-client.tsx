"use client";

import { useState } from "react";
import { useTranslation } from "@/components/i18n-provider";
import { CHECKLIST_PHASES } from "@/types";
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragStartEvent, DragEndEvent, DragOverEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, GripVertical, Trash2, CheckCircle2, Circle } from "lucide-react";

interface ChecklistItem {
  id: string;
  weddingId: string;
  title: string;
  category: string | null;
  phase: string | null;
  isCompleted: boolean;
  priority: string | null;
}

function SortableTaskItem({ item, toggleItem, handleDelete, dict }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id, data: { type: 'Task', item } });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const PRIORITY_COLORS: Record<string, string> = { high: "text-red-600 bg-red-50 border-red-200", medium: "text-yellow-600 bg-yellow-50 border-yellow-200", low: "text-gray-500 bg-gray-50 border-gray-200" };
  const pColor = PRIORITY_COLORS[item.priority || "medium"];
  
  return (
    <div ref={setNodeRef} style={style} className={`group relative flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md ${isDragging ? "z-50" : ""}`}>
      <button {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600 active:cursor-grabbing">
        <GripVertical className="h-4 w-4" />
      </button>
      
      <button onClick={() => toggleItem(item.id, !item.isCompleted)} className="flex-shrink-0">
        {item.isCompleted ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <Circle className="h-5 w-5 text-gray-300 hover:text-green-500" />}
      </button>

      <span className={`flex-1 text-sm ${item.isCompleted ? "text-gray-400 line-through" : "text-gray-700"}`}>
        {item.title}
      </span>
      
      <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${pColor}`}>
        {item.priority === 'high' ? dict.admin.checklist.priority.high : item.priority === 'medium' ? dict.admin.checklist.priority.mediumShort : dict.admin.checklist.priority.low}
      </span>

      <button onClick={() => handleDelete(item.id)} className="opacity-0 transition-opacity group-hover:opacity-100 text-gray-400 hover:text-red-500">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function KanbanColumn({ phase, items, toggleItem, handleDelete, setShowAdd, dict }: any) {
  return (
    <div className="flex w-80 flex-shrink-0 flex-col rounded-xl bg-gray-100 p-4 border border-gray-200">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">{phase}</h3>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-medium text-gray-600 shadow-sm">{items.length}</span>
      </div>
      
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto pr-1">
        <SortableContext items={items.map((i: any) => i.id)} strategy={verticalListSortingStrategy}>
          {items.map((item: any) => (
            <SortableTaskItem key={item.id} item={item} toggleItem={toggleItem} handleDelete={handleDelete} dict={dict} />
          ))}
        </SortableContext>
        
        <button onClick={() => setShowAdd(phase)} className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-3 text-sm font-medium text-gray-500 hover:border-rose-400 hover:bg-white hover:text-rose-600 transition-colors">
          <Plus className="h-4 w-4" /> {dict.admin.checklist.addTask}
        </button>
      </div>
    </div>
  );
}

export default function ChecklistClient({ items: initial, weddingId }: { items: ChecklistItem[]; weddingId: string; }) {
  const dict = useTranslation();
  const [items, setItems] = useState(initial);
  const [showAdd, setShowAdd] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", priority: "medium" });
  
  const [activeItem, setActiveItem] = useState<ChecklistItem | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const toggleItem = async (id: string, isCompleted: boolean) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, isCompleted } : i)));
    await fetch(`/api/checklist/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isCompleted }) });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAdd) return;
    setLoading(true);
    try {
      const res = await fetch("/api/checklist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ weddingId, phase: showAdd, ...form }) });
      if (res.ok) {
        const { data } = await res.json();
        setItems((prev) => [...prev, data]);
        setShowAdd(null);
        setForm({ title: "", priority: "medium" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/checklist/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const item = items.find(i => i.id === active.id);
    if (item) setActiveItem(item);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveItem(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const oldIndex = items.findIndex((i) => i.id === activeId);
    const newIndex = items.findIndex((i) => i.id === overId);
    
    const oldItem = items[oldIndex];
    const newItem = items[newIndex];
    
    let updatedPhase = oldItem.phase;
    if (newItem && oldItem.phase !== newItem.phase) {
      updatedPhase = newItem.phase;
    }

    const newItems = arrayMove(items, oldIndex, newIndex).map(i => i.id === activeId ? { ...i, phase: updatedPhase } : i);
    setItems(newItems);

    if (oldItem.phase !== updatedPhase) {
      await fetch(`/api/checklist/${activeId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phase: updatedPhase }) });
    }
  };

  const total = items.length;
  const completed = items.filter((i) => i.isCompleted).length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex-shrink-0">
        <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{dict.admin.checklist.title}</h1>
              <p className="mt-1 text-sm text-gray-500">{dict.admin.checklist.subtitle}</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">{dict.admin.checklist.overallProgress}</p>
                    <p className="text-xl font-bold text-rose-600">{progress}%</p>
                </div>
            </div>
        </div>
        
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="h-2.5 w-full rounded-full bg-gray-100">
            <div className="h-2.5 rounded-full bg-rose-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex h-full gap-6 items-start">
          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
            {CHECKLIST_PHASES.map((phase) => (
              <KanbanColumn key={phase} phase={phase} items={items.filter(i => i.phase === phase)} toggleItem={toggleItem} handleDelete={handleDelete} setShowAdd={setShowAdd} dict={dict} />
            ))}
            <DragOverlay>
              {activeItem ? <SortableTaskItem item={activeItem} toggleItem={()=>{}} handleDelete={()=>{}} dict={dict} /> : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-gray-900">{dict.admin.checklist.addModal.title} - {showAdd}</h2>
            <form onSubmit={handleAdd} className="mt-4 space-y-4">
              <input type="text" required placeholder={dict.admin.checklist.addModal.taskName} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500" />
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500">
                <option value="high">{dict.admin.checklist.priority.high}</option>
                <option value="medium">{dict.admin.checklist.priority.medium}</option>
                <option value="low">{dict.admin.checklist.priority.low}</option>
              </select>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowAdd(null)} className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">{dict.common.cancel}</button>
                <button type="submit" disabled={loading} className="rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-rose-700 transition-colors disabled:opacity-50">{dict.admin.checklist.addModal.addButton}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}