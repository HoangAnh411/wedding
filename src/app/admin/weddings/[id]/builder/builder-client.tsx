"use client";

import { useState } from "react";

interface LayoutBlock {
  id: string;
  visible: boolean;
}

const SECTION_NAMES: Record<string, string> = {
  hero: "Phần giới thiệu (Tên Cô Dâu Chú Rể)",
  countdown: "Đồng hồ đếm ngược",
  story: "Câu chuyện tình yêu",
  events: "Lịch trình sự kiện",
  dresscode: "Trang phục (Dress Code)",
  travel: "Di chuyển & Lưu trú",
  faqs: "Hỏi đáp (Q&A)",
  gallery: "Album ảnh",
  rsvp: "Xác nhận tham dự (RSVP)",
  wishes: "Gửi lời chúc",
  map: "Bản đồ chỉ đường",
  payment: "Thông tin mừng cưới"
};

const THEMES = [
  { id: "modern", name: "Hiện đại (Modern)" },
  { id: "classic", name: "Cổ điển (Classic)" },
  { id: "floral", name: "Hoa cỏ (Floral)" }
];

const COLORS = [
  { id: "#e11d48", name: "Rose (Mặc định)", class: "bg-rose-600" },
  { id: "#0f172a", name: "Slate", class: "bg-slate-900" },
  { id: "#b45309", name: "Amber", class: "bg-amber-600" },
  { id: "#166534", name: "Green", class: "bg-green-800" },
  { id: "#4c1d95", name: "Purple", class: "bg-violet-900" }
];

export default function BuilderClient({
  weddingId,
  slug,
  initialTheme,
  initialColor,
  initialLayout
}: {
  weddingId: string;
  slug: string;
  initialTheme: string;
  initialColor: string;
  initialLayout: any[];
}) {
  const [theme, setTheme] = useState(initialTheme);
  const [color, setColor] = useState(initialColor);
  
  // Format legacy string array to object array if needed
  let formattedLayout = initialLayout.map(item => 
    typeof item === 'string' ? { id: item, visible: true } : item
  ) as LayoutBlock[];
  
  // Auto-append missing sections (newly added features)
  Object.keys(SECTION_NAMES).forEach(key => {
    if (!formattedLayout.find(l => l.id === key)) {
      formattedLayout.push({ id: key, visible: true });
    }
  });
  
  const [layout, setLayout] = useState<LayoutBlock[]>(formattedLayout);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newLayout = [...layout];
      [newLayout[index - 1], newLayout[index]] = [newLayout[index], newLayout[index - 1]];
      setLayout(newLayout);
    } else if (direction === 'down' && index < layout.length - 1) {
      const newLayout = [...layout];
      [newLayout[index + 1], newLayout[index]] = [newLayout[index], newLayout[index + 1]];
      setLayout(newLayout);
    }
  };

  const toggleVisibility = (index: number) => {
    const newLayout = [...layout];
    newLayout[index].visible = !newLayout[index].visible;
    setLayout(newLayout);
  };

  const saveConfig = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/weddings/${weddingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme,
          primaryColor: color,
          layoutConfig: layout
        })
      });
      if (!res.ok) throw new Error("Lỗi khi lưu");
      setMessage("✅ Đã lưu cấu hình thành công!");
    } catch (err) {
      setMessage("❌ Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Thiết kế thiệp</h1>
          <p className="mt-1 text-sm text-gray-500">Tùy chỉnh giao diện và bố cục thiệp cưới</p>
        </div>
        <div className="flex gap-3">
          <a
            href={`/${slug}`}
            target="_blank"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Xem trước
          </a>
          <button
            onClick={saveConfig}
            disabled={loading}
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-rose-700 disabled:opacity-50"
          >
            {loading ? "Đang lưu..." : "Lưu thiết kế"}
          </button>
        </div>
      </div>

      {message && <div className="p-3 bg-white border border-gray-200 rounded-lg text-sm">{message}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Style Settings */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">Chủ đề (Theme)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {THEMES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`p-4 rounded-xl border-2 text-sm font-medium transition ${
                    theme === t.id ? "border-rose-600 bg-rose-50 text-rose-700" : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-gray-500">Chủ đề ảnh hưởng đến font chữ, họa tiết trang trí và hiệu ứng xuất hiện.</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Màu chủ đạo</h2>
            <div className="flex gap-4">
              {COLORS.map(c => (
                <button
                  key={c.id}
                  onClick={() => setColor(c.id)}
                  title={c.name}
                  className={`w-12 h-12 rounded-full border-4 transition ${c.class} ${
                    color === c.id ? "border-gray-900 scale-110" : "border-transparent hover:scale-105 shadow-sm"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Layout Settings */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Bố cục trang (Sắp xếp block)</h2>
          <p className="text-sm text-gray-500 mb-6">Thay đổi thứ tự hiển thị hoặc ẩn các phần không cần thiết trên thiệp mời.</p>
          
          <div className="space-y-3">
            {layout.map((item, index) => (
              <div 
                key={item.id} 
                className={`flex items-center justify-between p-4 rounded-lg border transition ${
                  item.visible ? "bg-gray-50 border-gray-200" : "bg-gray-100 border-gray-100 opacity-60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <button 
                      onClick={() => moveItem(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-900 disabled:opacity-30"
                    >
                      ▲
                    </button>
                    <button 
                      onClick={() => moveItem(index, 'down')}
                      disabled={index === layout.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-900 disabled:opacity-30"
                    >
                      ▼
                    </button>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{SECTION_NAMES[item.id] || item.id}</p>
                    <p className="text-xs text-gray-500">{item.visible ? "Đang hiển thị" : "Đã ẩn"}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => toggleVisibility(index)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 ${
                    item.visible ? 'bg-rose-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`${
                      item.visible ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
