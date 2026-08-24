"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function FeedbackForm({ dict }: { dict: Record<string, any> }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      category: formData.get("category"),
      subject: formData.get("subject"),
      content: formData.get("content"),
    };

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || dict.errorMessage);
      }

      toast(dict.successMessage, "success");
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{dict.formTitle}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input name="name" label={dict.name} required placeholder={dict.namePlaceholder} />
        <Input name="email" label={dict.email} type="email" placeholder={dict.emailPlaceholder} />
      </div>
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">{dict.category}</label>
        <select name="category" required className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500">
          <option value="bug">{dict.categoryOptions.bug}</option>
          <option value="feature">{dict.categoryOptions.feature}</option>
          <option value="question">{dict.categoryOptions.question}</option>
          <option value="other">{dict.categoryOptions.other}</option>
        </select>
      </div>
      <Input name="subject" label={dict.subject} required placeholder={dict.subjectPlaceholder} />
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">{dict.content}</label>
        <textarea
          name="content"
          required
          rows={4}
          className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
          placeholder={dict.contentPlaceholder}
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading ? dict.sending : dict.submit}
      </Button>
    </form>
  );
}
