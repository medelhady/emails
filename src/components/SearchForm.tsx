"use client";

import { useState, useEffect, useRef } from "react";
import { SearchParams } from "@/types";
import { usStates, CityInfo } from "@/data/usData";
import { supabase } from "@/lib/supabase"; 

interface KeywordItem {
  id: number;
  state_name: string;
  keyword: string;
  status: 'ready' | 'searching' | 'completed';
  last_searched_at: string | null;
}

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [keyword, setKeyword] = useState("");
  const [maxResults] = useState(50);

  const [availableCities, setAvailableCities] = useState<CityInfo[]>([]);
  const [availableKeywords, setAvailableKeywords] = useState<KeywordItem[]>([]);
  const [keywordsLoading, setKeywordsLoading] = useState(false);

  // التحكم في القوائم المنسدلة المخصصة والـ Popups
  const [showMiniList, setShowMiniList] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkKeywordsText, setBulkKeywordsText] = useState("");
  const [isSavingBulk, setIsSavingBulk] = useState(false);

  const miniListRef = useRef<HTMLDivElement>(null);

  // إغلاق المنسدلة الصغيرة عند الضغط خارجها
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (miniListRef.current && !miniListRef.current.contains(event.target as Node)) {
        setShowMiniList(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // تحديث قائمة المقاطعات
  useEffect(() => {
    if (!state) {
      setAvailableCities([]);
      setCity("");
      return;
    }
    const selectedStateInfo = usStates.find(s => s.name === state || s.id === state);
    if (selectedStateInfo) setAvailableCities(selectedStateInfo.cities);
    setCity(""); 
  }, [state]);

  // جلب الكلمات من سوبابيز
  const fetchKeywords = async (selectedState: string) => {
    if (!selectedState) {
      setAvailableKeywords([]);
      return;
    }
    setKeywordsLoading(true);
    try {
      const { data, error } = await supabase
        .from("state_keywords")
        .select("id, state_name, keyword, status, last_searched_at")
        .eq("state_name", selectedState)
        .order("id", { ascending: true });

      if (error) throw error;
      if (data) setAvailableKeywords(data as KeywordItem[]);
    } catch (err) {
      console.error(err);
    } finally {
      setKeywordsLoading(false);
    }
  };

  useEffect(() => {
    fetchKeywords(state);
    setKeyword(""); 
  }, [state]);

  // معالجة إضافة الكلمات الجماعية (Bulk Insert)
  const handleBulkAddKeywords = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state || !bulkKeywordsText.trim()) return;

    setIsSavingBulk(true);
    const keywordsArray = bulkKeywordsText
      .split("\n")
      .map(k => k.trim())
      .filter(k => k.length > 0);

    if (keywordsArray.length === 0) {
      setIsSavingBulk(false);
      return;
    }

    const rowsToInsert = keywordsArray.map(kw => ({
      state_name: state,
      keyword: kw,
      status: 'ready'
    }));

    try {
      const { error } = await supabase.from("state_keywords").insert(rowsToInsert);
      if (error) throw error;
      await fetchKeywords(state);
      setBulkKeywordsText("");
      setShowBulkModal(false);
    } catch (err) {
      console.error("Error saving bulk keywords:", err);
    } finally {
      setIsSavingBulk(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state || !keyword) return;

    const activeKw = availableKeywords.find(k => k.keyword === keyword);
    if (activeKw) {
      try {
        await supabase
          .from("state_keywords")
          .update({ status: 'searching', last_searched_at: new Date().toISOString() })
          .eq("id", activeKw.id);
        fetchKeywords(state);
      } catch (err) {
        console.error(err);
      }
    }

    onSearch({ keyword, maxResults, state, city });

    if (activeKw) {
      setTimeout(async () => {
        await supabase.from("state_keywords").update({ status: 'completed' }).eq("id", activeKw.id);
        fetchKeywords(state);
      }, 4000);
    }
  };

  // تحديد آخر كلمة تم البحث عنها
  const lastSearchedItem = [...availableKeywords]
    .filter(k => k.last_searched_at)
    .sort((a, b) => new Date(b.last_searched_at!).getTime() - new Date(a.last_searched_at!).getTime())[0];

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded-xl border bg-card text-card-foreground" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* حقل اختيار الولاية */}
          <div className="space-y-1.5 flex flex-col">
            <label className="text-xs font-semibold text-muted-foreground" style={{ color: "var(--color-text-muted)" }}>الولاية (State)</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500 transition-all cursor-pointer"
              style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
            >
              <option value="">Select State...</option>
              {usStates.map((s) => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* pقل اختيار المقاطعة */}
          <div className="space-y-1.5 flex flex-col">
            <label className="text-xs font-semibold text-muted-foreground" style={{ color: "var(--color-text-muted)" }}>المقاطعة (County)</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={!state || availableCities.length === 0}
              className="rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500 disabled:opacity-40 transition-all cursor-pointer"
              style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
            >
              <option value="">
                {!state ? "Select State first..." : "Select County..."}
              </option>
              {availableCities.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* حقل الكلمة المفتاحية المطور والأنيق مع الأزرار المدمجة بالداخل */}
        <div className="space-y-1.5 flex flex-col relative">
          <label className="text-xs font-semibold text-muted-foreground" style={{ color: "var(--color-text-muted)" }}>كلمة البحث (Keyword)</label>
          
          <div className="relative flex items-center w-full">
            <select
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              disabled={!state || keywordsLoading || availableKeywords.length === 0}
              className="w-full rounded-lg border pl-24 pr-3 py-2 text-sm outline-none focus:border-blue-500 disabled:opacity-40 transition-all cursor-pointer appearance-none"
              style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
            >
              <option value="">
                {!state ? "Select State first..." : keywordsLoading ? "Loading keywords..." : availableKeywords.length === 0 ? "No keywords..." : "Select a Keyword..."}
              </option>
              {availableKeywords.map((k) => (
                <option key={k.id} value={k.keyword}>{k.keyword}</option>
              ))}
            </select>

            <div className="absolute left-2 flex items-center gap-1">
              <button
                type="button"
                disabled={!state || availableKeywords.length === 0}
                onClick={() => setShowMiniList(!showMiniList)}
                className="p-1 px-2 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 rounded-md text-xs font-mono transition-all disabled:opacity-30 cursor-pointer"
              >
                🗂️ القائمة
              </button>

              <button
                type="button"
                disabled={!state}
                onClick={() => setShowBulkModal(true)}
                className="p-1 px-2 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/40 rounded-md text-xs font-bold transition-all disabled:opacity-30 cursor-pointer"
              >
                ➕ سهم
              </button>
            </div>
          </div>

          {/* القائمة المنسدلة المصغرة التتبعية */}
          {showMiniList && (
            <div ref={miniListRef} className="absolute left-0 top-[64px] z-30 w-72 rounded-xl border p-3 shadow-xl" style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)" }}>
              <div className="text-[11px] font-bold pb-1.5 mb-1.5 border-b border-gray-700 text-gray-400 flex justify-between">
                <span>الكلمات المرقّمة والتتبع:</span>
                <span className="text-blue-400">➜ التوقف الحالي</span>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {availableKeywords.map((k, index) => {
                  const isCurrentPointer = lastSearchedItem?.id === k.id;
                  return (
                    <div 
                      key={k.id} 
                      onClick={() => { setKeyword(k.keyword); setShowMiniList(false); }}
                      className={`flex items-center justify-between p-1.5 px-2 rounded-md text-xs cursor-pointer transition-colors ${isCurrentPointer ? 'bg-blue-600/20 border border-blue-500/30 text-blue-300' : 'hover:bg-gray-800 text-gray-300'}`}
                    >
                      <span className="font-mono text-gray-500 text-[11px]">{index + 1}.</span>
                      <span className="flex-1 mr-2 text-right font-medium truncate">{k.keyword}</span>
                      {isCurrentPointer && <span className="text-blue-400 font-bold mr-1 text-[13px]">➜</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !state || !keyword}
          className="w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? "Searching..." : "Search Leads"}
        </button>
      </form>

      {/* بوب أب الإضافة الجماعية المطور من سطر النص الكبير */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border p-5 space-y-4 shadow-2xl" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
            <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: "var(--color-border)" }}>
              <div>
                <h3 className="text-sm font-bold text-white">➕ إضافة مجموعة كلمات مفتاحية</h3>
                <p className="text-[11px] text-gray-400">سيتم ربطها تلقائياً بـ {state}</p>
              </div>
              <button type="button" onClick={() => setShowBulkModal(false)} className="text-gray-400 hover:text-white font-mono text-sm">✕</button>
            </div>

            <form onSubmit={handleBulkAddKeywords} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] text-gray-400">أدخل الكلمات (كلمة واحدة في كل سطر):</label>
                <textarea
                  value={bulkKeywordsText}
                  onChange={(e) => setBulkKeywordsText(e.target.value)}
                  rows={6}
                  required
                  placeholder="Property Management&#10;Real Estate Broker&#10;Apartment Rentals"
                  className="w-full rounded-lg border p-3 text-xs outline-none bg-gray-950 text-white border-gray-800 focus:border-blue-500 resize-none font-mono placeholder:text-gray-600"
                />
              </div>

              <div className