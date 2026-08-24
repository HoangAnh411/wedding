"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useTranslation } from "@/components/i18n-provider";
import { usePathname } from "next/navigation";

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const { toast } = useToast();
  
  const pathname = usePathname();
  const lang = pathname.split('/')[1] || 'vi';
  const dict = useTranslation();

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const url = statusFilter ? `/api/feedback?status=${statusFilter}` : "/api/feedback";
      const res = await fetch(url);
      if (!res.ok) throw new Error(dict.feedback.loadError);
      const { data } = await res.json();
      setFeedbacks(data);
    } catch (err: any) {
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/feedback`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error(dict.feedback.updateFailed);
      toast(dict.feedback.updateSuccess, "success");
      fetchFeedbacks();
    } catch (err: any) {
      toast(err.message, "error");
    }
  };

  const getCategoryLabel = (cat: string) => {
    const map: Record<string, string> = {
      bug: dict.feedback.categoryBug,
      feature: dict.feedback.categoryFeature,
      question: dict.feedback.categoryQuestion,
      other: dict.feedback.categoryOther,
    };
    return map[cat] || cat;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{dict.feedback.adminTitle}</h1>
        <div className="flex gap-2">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border-gray-300 py-2 pl-3 pr-8 text-sm focus:border-rose-500 focus:ring-rose-500"
          >
            <option value="">{dict.feedback.allStatus}</option>
            <option value="new">{dict.feedback.statusNew}</option>
            <option value="reviewing">{dict.feedback.statusReviewing}</option>
            <option value="resolved">{dict.feedback.statusResolved}</option>
            <option value="dismissed">{dict.feedback.statusDismissed}</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">{dict.common.loading}</div>
        ) : feedbacks.length === 0 ? (
          <div className="p-8 text-center text-gray-500">{dict.feedback.noFeedback}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">{dict.feedback.tableSender}</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">{dict.feedback.tableTypeTitle}</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">{dict.feedback.tableContent}</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">{dict.feedback.tableStatus}</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">{dict.feedback.tableActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {feedbacks.map((fb) => (
                  <tr key={fb.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{fb.name}</div>
                      {fb.email && <div className="text-gray-500">{fb.email}</div>}
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(fb.createdAt).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={fb.category === 'bug' ? 'danger' : 'info'}>
                        {getCategoryLabel(fb.category)}
                      </Badge>
                      <div className="font-medium text-gray-900">{fb.subject}</div>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate" title={fb.content}>
                      {fb.content}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={fb.status}
                        onChange={(e) => updateStatus(fb.id, e.target.value)}
                        className="rounded-md border-gray-300 py-1 text-sm focus:border-rose-500 focus:ring-rose-500"
                      >
                        <option value="new">{dict.feedback.statusNew}</option>
                        <option value="reviewing">{dict.feedback.statusReviewingShort}</option>
                        <option value="resolved">{dict.feedback.statusResolved}</option>
                        <option value="dismissed">{dict.feedback.statusDismissed}</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button variant="ghost" size="sm" onClick={() => alert(fb.content)}>{dict.common.view}</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
