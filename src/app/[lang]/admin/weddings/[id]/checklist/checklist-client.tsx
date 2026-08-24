"use client";

import { useTranslation } from "@/components/i18n-provider";

import { useState } from "react";
import { CHECKLIST_PHASES } from "@/types";

interface ChecklistItem {
  id: string;
  weddingId: string;
  title: string;
  category: string | null;
  phase: string | null;
  isCompleted: boolean;
  priority: string | null;
}

export default function ChecklistClient({
  items: initial,
  weddingId,
}: {
  items: ChecklistItem[];
  weddingId: string;
}) {
  const dict = useTranslation();
  const [items, setItems] = useState(initial);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ weddingId, title: "", phase: CHECKLIST_PHASES[0] as string, priority: "medium" });

  const toggleItem = async (id: string, isCompleted: boolean) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, isCompleted } : i)));
    await fetch(`/api/checklist/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isCompleted }),
    });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const { data } = await res.json();
        setItems((prev) => [...prev, data]);
        setShowAdd(false);
        setForm({ weddingId, title: "", phase: CHECKLIST_PHASES[0], priority: "medium" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/checklist/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const total = items.length;
  const completed = items.filter((i) => i.isCompleted).length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const PRIORITY_COLORS: Record<string, string> = { high: "text-red-600", medium: "text-yellow-600", low: "text-gray-400" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{dict.admin.checklist.title}</h1>
          <p className="mt-1 text-sm text-gray-500">{dict.admin.checklist.subtitle}</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700">{dict.admin.checklist.addTask}</button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">{dict.admin.checklist.overallProgress}</p>
          <p className="text-sm font-bold text-rose-600">{progress}%</p>
        </div>
        <div className="mt-2 h-2.5 w-full rounded-full bg-gray-200">
          <div className="h-2.5 rounded-full bg-rose-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-1 text-xs text-gray-400">{completed}/{total} {dict.admin.checklist.completedTasks}</p>
      </div>

      {CHECKLIST_PHASES.map((phase) => {
        const phaseItems = items.filter((i) => i.phase === phase);
        if (phaseItems.length === 0) return null;
        return (
          <div key={phase} className="rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-4 py-3">
              <h3 className="font-semibold text-gray-900">{phase}</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {phaseItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                  <input type="checkbox" checked={item.isCompleted}
                    onChange={(e) => toggleItem(item.id, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-rose-600" />
                  <span className={`flex-1 text-sm ${item.isCompleted ? "text-gray-400 line-through" : "text-gray-700"}`}>
                    {item.title}
                  </span>
                  <span className={`text-xs font-medium ${PRIORITY_COLORS[item.priority || "medium"]}`}>
                    {item.priority === "high" ? dict.admin.checklist.priority.high : item.priority === "medium" ? dict.admin.checklist.priority.mediumShort : dict.admin.checklist.priority.low}
                  </span>
                  <button onClick={() => handleDelete(item.id)} className="text-xs text-gray-300 hover:text-red-500">✕</button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="mx-4 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">{dict.admin.checklist.addModal.title}</h2>
            <form onSubmit={handleAdd} className="mt-4 space-y-4">

              <input type="text" required placeholder={dict.admin.checklist.addModal.taskName} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <div className="grid grid-cols-2 gap-4">
                <select value={form.phase} onChange={(e) => setForm({ ...form, phase: e.target.value })}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
                  {CHECKLIST_PHASES.map((p) => <option key={p}>{p}</option>)}
                </select>
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
                  <option value="high">{dict.admin.checklist.priority.high}</option>
                  <option value="medium">{dict.admin.checklist.priority.medium}</option>
                  <option value="low">{dict.admin.checklist.priority.low}</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowAdd(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">{dict.common.cancel}</button>
                <button type="submit" disabled={loading} className="rounded-lg bg-rose-600 px-4 py-2 text-sm text-white hover:bg-rose-700">{dict.admin.checklist.addModal.addButton}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}