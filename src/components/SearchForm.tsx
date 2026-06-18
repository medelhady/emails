"use client";

import { useState, useEffect } from "react";
import { SearchParams } from "@/types";
import { usStates, CityInfo } from "@/data/usData";

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  // الحقول الجديدة التي أضفناها
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [availableCities, setAvailableCities] = useState<CityInfo[]>([]);

  // الحقول الأصلية المتوقعة من الـ SearchParams لتفادي خطأ الـ Build
  const [keyword, setKeyword] = useState("");
  const [maxResults, setMaxResults] = useState(50);

  // تحديث قائمة المقاطعات فور تغيير الولاية
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // نرسل الحقول كاملة للـ API لحل مشكلة النوع (Type error)
    onSearch({ 
      keyword, 
      maxResults, 
      state, 
      city 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded-xl border" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
      
      {/* إذا كان تطبيقك يحتوي على خانة بحث نصية (Keyword) يمكنك إظهار هذا الحقل */}
      <div className="space-y-2 flex flex-col">
        <label className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>كلمة البحث (Keyword / Business Type)</label>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="e.g. Property Management, Real Estate..."
          className="rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
          style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* خانة اختيار الولاية */}
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

        {/* خانة اختيار المقاطعة (County) */}
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

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors disabled:opacity-50 cursor-pointer"
      >
        {isLoading ? "Searching..." : "Search Leads"}
      </button>
    </form>
  );
}