"use client";

import { useState, useEffect } from "react";
import { SearchParams } from "@/types";
import { usStates, CityInfo } from "@/data/usData";
import { supabase } from "@/lib/supabase"; 

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  // الحقول الأساسية للبحث
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [keyword, setKeyword] = useState("");
  const [maxResults, setMaxResults] = useState(50);

  // القوائم الديناميكية وحالات التحميل
  const [availableCities, setAvailableCities] = useState<CityInfo[]>([]);
  const [availableKeywords, setAvailableKeywords] = useState<string[]>([]);
  const [keywordsLoading, setKeywordsLoading] = useState(false);

  // حقول خاصة بإضافة كلمة مفتاحية جديدة من الصفحة
  const [newKeyword, setNewKeyword] = useState("");
  const [isAddingKeyword, setIsAddingKeyword] = useState(false);

  // 1. تحديث قائمة المقاطعات فور تغيير الولاية
  useEffect(() => {
    if (!state) {
      setAvailableCities([]);
      setCity("");
      return;
    }
    
    const selectedStateInfo = usStates.find(s => s.name === state || s.id === state);
    if (selectedStateInfo) {
      setAvailableCities(selectedStateInfo.cities);
    } else {
      setAvailableCities([]);
    }
    setCity(""); 
  }, [state]);

  // 2. دالة جلب الكلمات المفتاحية (توضع في دالة مستقلة لإعادة استدعائها عند الإضافة)
  const fetchKeywordsForState = async (selectedState: string) => {
    if (!selectedState) {
      setAvailableKeywords([]);
      setKeyword("");
      return;
    }

    setKeywordsLoading(true);
    try {
      const { data, error } = await supabase
        .from("state_keywords")
        .select("keyword")
        .eq("state_name", selectedState);

      if (error) throw error;

      if (data) {
        const keywordsList = data.map((item: any) => item.keyword);
        setAvailableKeywords(Array.from(new Set(keywordsList)));
      }
    } catch (err) {
      console.error("Error fetching keywords:", err);
      setAvailableKeywords([]);
    } finally {
      setKeywordsLoading(false);
    }
  };

  useEffect(() => {
    fetchKeywordsForState(state);
    setKeyword(""); 
  }, [state]);

  // 3. دالة إضافة كلمة مفتاحية جديدة إلى سوبابيز مباشرة من الصفحة
  const handleAddKeyword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state || !newKeyword.trim()) return;

    setIsAddingKeyword(true);
    try {
      const { error } = await supabase
        .from("state_keywords")
        .insert([{ state_name: state, keyword: newKeyword.trim() }]);

      if (error) throw error;

      // إعادة جلب الكلمات وتحديث القائمة المنسدلة فوراً لرؤية الكلمة الجديدة
      await fetchKeywordsForState(state);
      setNewKeyword("");
      alert("تمت إضافة الكلمة المفتاحية بنجاح! 🎉");
    } catch (err) {
      console.error("Error adding keyword:", err);
      alert("حدث خطأ أثناء إضافة الكلمة.");
    } finally {
      setIsAddingKeyword(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ keyword, maxResults, state, city });
  };

  return (
    <div className="space-y-6">
      {/* 1. نموذج البحث الأساسي */}
      <form onSubmit={handleSubmit} className="space-y-4 p-5 rounded-xl border" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
        <h3 className="text-sm font-bold border-b pb-2 mb-2" style={{ color: "var(--color-text)", borderColor: "var(--color-border)" }}>🔎 محرك فرز وتقصي الـ Leads</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* حقل اختيار الولاية */}
          <div className="space-y-2 flex flex-col">
            <label className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>الولاية (State)</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="rounded-lg border px-3 py-2 text-sm outline-none cursor-pointer focus:border-blue-500"
              style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
            >
              <option value="">Select State...</option>
              {usStates.map((s) => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* حقل اختيار المقاطعة (County) */}
          <div className="space-y-2 flex flex-col">
            <label className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>المقاطعة (County / City)</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={!state || availableCities.length === 0}
              className="rounded-lg border px-3 py-2 text-sm outline-none cursor-pointer focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
            >
              <option value="">
                {!state ? "Select a State first..." : "Select County (Ordered by Population)..."}
              </option>
              {availableCities.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* خانة كلمة البحث المنسدلة من Supabase */}
        <div className="space-y-2 flex flex-col">
          <label className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>الكلمات المفتاحية الحالية المرفوعة لهذه الولاية</label>
          <select
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            disabled={!state || keywordsLoading || availableKeywords.length === 0}
            className="rounded-lg border px-3 py-2 text-sm outline-none cursor-pointer focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
          >
            <option value="">
              {!state 
                ? "Select a State first to view current keywords..." 
                : keywordsLoading 
                ? "Loading keywords from Supabase..." 
                : availableKeywords.length === 0 
                ? "No keywords found for this state..." 
                : "Select a Keyword..."}
            </option>
            {availableKeywords.map((kw, index) => (
              <option key={index} value={kw}>{kw}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading || !state || !keyword}
          className="w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? "Searching..." : "Search Leads"}
        </button>
      </form>

      {/* 2. واجهة إدارة وإضافة الكلمات المفتاحية التابعة للولاية */}
      <div className="p-5 rounded-xl border border-dashed" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
        <h3 className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: "var(--color-text)" }}>
          ➕ إضافة وتوسيع الكلمات المفتاحية للولاية أونلاين
        </h3>
        <p className="text-xs mb-3" style={{ color: "var(--color-text-muted)" }}>
          اختر الولاية من الأعلى أولاً، ثم اكتب الكلمة الجديدة هنا لحفظها وتحديث القائمة المنسدلة تلقائياً في قاعدة البيانات.
        </p>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            disabled={!state}
            placeholder={state ? `Add new keyword for ${state}...` : "Please select a state from above first..."}
            className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500 disabled:opacity-50"
            style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
          />
          <button
            type="button"
            onClick={handleAddKeyword}
            disabled={isAddingKeyword || !state || !newKeyword.trim()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            {isAddingKeyword ? "Saving..." : "إضافة وحفظ"}
          </button>
        </div>
      </div>
    </div>
  );
}