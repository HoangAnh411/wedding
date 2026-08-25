"use client";

import { useState } from "react";
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragStartEvent, DragEndEvent, DragOverEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Users, Plus, Trash2 } from "lucide-react";

interface Guest {
  id: string;
  name: string;
}

interface Table {
  id: string;
  weddingId: string;
  tableNumber: number;
  tableName: string | null;
  capacity: number;
  isHeadTable: boolean;
  guests: Guest[];
}

function SortableGuest({ guest }: { guest: Guest }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: guest.id, data: { type: 'Guest', guest } });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };
  
  return (
    <div ref={setNodeRef} style={style} className={`flex items-center gap-2 rounded-md bg-white border border-gray-200 px-2 py-1.5 text-sm shadow-sm transition-shadow hover:shadow-md ${isDragging ? 'z-50' : ''}`}>
      <button {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600 active:cursor-grabbing">
        <GripVertical className="h-3 w-3" />
      </button>
      <span className="truncate font-medium text-gray-700">{guest.name}</span>
    </div>
  );
}

function DroppableTable({ table, handleDelete }: { table: Table, handleDelete: (id: string) => void }) {
  return (
    <div className={`flex flex-col rounded-xl border p-4 shadow-sm ${table.isHeadTable ? "border-rose-300 bg-rose-50/50" : "border-gray-200 bg-white"}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-gray-900">Bàn {table.tableNumber}</h3>
          {table.tableName && <p className="text-xs text-gray-500">{table.tableName}</p>}
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${table.guests.length > table.capacity ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
            {table.guests.length}/{table.capacity}
          </span>
          {table.isHeadTable && <span className="rounded-full bg-rose-200 px-2 py-0.5 text-xs font-medium text-rose-800">VIP</span>}
          <button onClick={() => handleDelete(table.id)} className="text-gray-300 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
        </div>
      </div>
      
      <div className="flex-1 min-h-[100px] rounded-lg bg-gray-50/50 p-2 border border-dashed border-gray-200">
        <SortableContext id={`table-${table.tableNumber}`} items={table.guests.map(g => g.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 gap-2 min-h-[80px]">
            {table.guests.map(g => <SortableGuest key={g.id} guest={g} />)}
            {table.guests.length === 0 && <div className="h-full flex items-center justify-center text-xs text-gray-400 italic py-4">Kéo thả khách vào đây</div>}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}

export default function TablesClient({ tables: initialTables, unassignedGuests: initialUnassigned, weddingId }: { tables: Table[]; unassignedGuests: Guest[]; weddingId: string; }) {
  const [tables, setTables] = useState(initialTables);
  const [unassigned, setUnassigned] = useState(initialUnassigned);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ weddingId: weddingId, tableNumber: "", tableName: "", capacity: "10" });
  
  const [activeGuest, setActiveGuest] = useState<Guest | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/tables", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, tableNumber: parseInt(form.tableNumber), capacity: parseInt(form.capacity) }) });
      if (res.ok) {
        const { data } = await res.json();
        setTables(prev => [...prev, { ...data, guests: [] }]);
        setShowAdd(false);
        setForm({ weddingId, tableNumber: "", tableName: "", capacity: "10" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa bàn này? Các khách mời sẽ bị chuyển về danh sách chưa xếp bàn.")) return;
    const tableToDelete = tables.find(t => t.id === id);
    if (tableToDelete && tableToDelete.guests.length > 0) {
      setUnassigned(prev => [...prev, ...tableToDelete.guests]);
      await Promise.all(tableToDelete.guests.map(g => 
        fetch(`/api/guests/${g.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tableNumber: null }) })
      ));
    }
    await fetch(`/api/tables/${id}`, { method: "DELETE" });
    setTables(prev => prev.filter(t => t.id !== id));
  };

  const findContainer = (id: string) => {
    if (id === 'unassigned') return 'unassigned';
    if (id.startsWith('table-')) return parseInt(id.replace('table-', ''));
    if (unassigned.find(g => g.id === id)) return 'unassigned';
    
    for (const table of tables) {
      if (table.guests.find(g => g.id === id)) return table.tableNumber;
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const id = active.id as string;
    const guest = unassigned.find(g => g.id === id) || tables.flatMap(t => t.guests).find(g => g.id === id);
    if (guest) setActiveGuest(guest);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);
    
    if (!activeContainer || !overContainer || activeContainer === overContainer) return;
    
    setUnassigned(prev => {
      const activeItems = activeContainer === 'unassigned' ? prev : tables.find(t => t.tableNumber === activeContainer)?.guests || [];
      const overItems = overContainer === 'unassigned' ? prev : tables.find(t => t.tableNumber === overContainer)?.guests || [];
      
      const activeIndex = activeItems.findIndex(g => g.id === activeId);
      const overIndex = overId.startsWith('table-') || overId === 'unassigned' ? overItems.length + 1 : overItems.findIndex(g => g.id === overId);
      
      let newUnassigned = [...prev];
      let newTables = [...tables];
      
      const guestToMove = activeItems[activeIndex];
      
      // Remove from active
      if (activeContainer === 'unassigned') {
        newUnassigned = newUnassigned.filter(g => g.id !== activeId);
      } else {
        newTables = newTables.map(t => t.tableNumber === activeContainer ? { ...t, guests: t.guests.filter(g => g.id !== activeId) } : t);
      }
      
      // Add to over
      if (overContainer === 'unassigned') {
        newUnassigned = [...newUnassigned.slice(0, overIndex), guestToMove, ...newUnassigned.slice(overIndex)];
      } else {
        newTables = newTables.map(t => {
          if (t.tableNumber === overContainer) {
            const newGuests = [...t.guests];
            newGuests.splice(overIndex, 0, guestToMove);
            return { ...t, guests: newGuests };
          }
          return t;
        });
      }
      
      setTables(newTables);
      return newUnassigned;
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveGuest(null);
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer) return;

    // API Update
    const newTableNumber = overContainer === 'unassigned' ? null : overContainer;
    
    // Optimistic UI was already updated in handleDragOver if containers differ
    // If containers are the same, we need to sort them
    if (activeContainer === overContainer) {
       if (activeContainer === 'unassigned') {
         const oldIndex = unassigned.findIndex(g => g.id === activeId);
         const newIndex = unassigned.findIndex(g => g.id === overId);
         setUnassigned(arrayMove(unassigned, oldIndex, newIndex));
       } else {
         const tableIndex = tables.findIndex(t => t.tableNumber === activeContainer);
         if (tableIndex !== -1) {
           const oldIndex = tables[tableIndex].guests.findIndex(g => g.id === activeId);
           const newIndex = tables[tableIndex].guests.findIndex(g => g.id === overId);
           
           const newTables = [...tables];
           newTables[tableIndex] = {
             ...newTables[tableIndex],
             guests: arrayMove(newTables[tableIndex].guests, oldIndex, newIndex)
           };
           setTables(newTables);
         }
       }
    } else {
       // Only save to DB if it moved to a different container
       await fetch(`/api/guests/${activeId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tableNumber: newTableNumber }) });
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex-shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sơ đồ bàn (Kéo thả)</h1>
          <p className="mt-1 text-sm text-gray-500">Kéo thả khách mời vào các bàn tiệc</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 shadow-sm"><Plus className="h-4 w-4 inline mr-1" /> Thêm bàn</button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <div className="flex-1 flex gap-6 overflow-hidden">
          
          <div className="w-80 flex-shrink-0 flex flex-col rounded-xl bg-gray-100 p-4 border border-gray-200 overflow-hidden">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 flex items-center gap-2"><Users className="h-4 w-4 text-gray-500" /> Chưa xếp bàn</h3>
              <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold text-gray-600 shadow-sm">{unassigned.length}</span>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2">
              <SortableContext id="unassigned" items={unassigned.map(g => g.id)} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-2 min-h-[200px]">
                  {unassigned.map(g => <SortableGuest key={g.id} guest={g} />)}
                  {unassigned.length === 0 && <div className="text-sm text-gray-400 italic text-center mt-10">Tất cả khách đã có bàn</div>}
                </div>
              </SortableContext>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 pb-8">
              {tables.map((t) => (
                <DroppableTable key={t.id} table={t} handleDelete={handleDelete} />
              ))}
            </div>
          </div>

        </div>
        
        <DragOverlay>
          {activeGuest ? <div className="opacity-90 shadow-xl"><SortableGuest guest={activeGuest} /></div> : null}
        </DragOverlay>
      </DndContext>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-gray-900">Thêm bàn</h2>
            <form onSubmit={handleAdd} className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="number" required placeholder="Số bàn (VD: 1)" value={form.tableNumber} onChange={(e) => setForm({ ...form, tableNumber: e.target.value })} className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm" />
                <input type="number" placeholder="Sức chứa (VD: 10)" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm" />
              </div>
              <input type="text" placeholder="Tên bàn (VD: Bàn gia đình nhà trai)" value={form.tableName} onChange={(e) => setForm({ ...form, tableName: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm" />
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAdd(false)} className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Hủy</button>
                <button type="submit" disabled={loading} className="rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-rose-700">Thêm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}