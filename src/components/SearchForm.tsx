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

  const [availableCities, setAvailableCities] = useState<CityInfo[]>([]);
  const [availableKeywords, setAvailableKeywords] = useState<KeywordItem[]>([]);
  const [keywordsLoading, setKeywordsLoading] = useState(false);

  const [showMiniList, setShowMiniList] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkKeywordsText, setBulkKeywordsText] = useState("");
  const [isSavingBulk, setIsSavingBulk] = useState(false);

  const miniListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (miniListRef.current && !miniListRef.current.contains(event.target as Node)) {
        setShowMiniList(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!state) {
      setAvailableCities([]);
      setCity("");
      return;
    }
    const res = usStates.find(s => s.name === state || s.id === state);
    if (res) setAvailableCities(res.cities);
    setCity(""); 
  }, [state]);

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

  const handleBulkAddKeywords = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state || !bulkKeywordsText.trim()) return;

    setIsSavingBulk(true);
    const arr = bulkKeywordsText.split("\n").map(k => k.trim()).filter(k => k.length > 0);
    if (arr.length === 0) {
      setIsSavingBulk(false);
      return;
    }

    try {
      const rows = arr.map(kw => ({ state_name: state, keyword: kw, status: 'ready' }));
      const { error } = await supabase.from("state_keywords").insert(rows);
      if (error) throw error;
      await fetchKeywords(state);
      setBulkKeywordsText("");
      setShowBulkModal(false);
    } catch (err) {
      console.error(err);
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
        await supabase.from("state_keywords")
          .update({ status: 'searching', last_searched_at: new Date().toISOString() })
          .eq("id", activeKw.id);
        fetchKeywords(state);
      } catch (err) {
        console.error(err);
      }
    }
    onSearch({ keyword, maxResults: 50, state, city });
  };

  const lastSearchedItem = [...availableKeywords]
    .filter(k => k.last_searched_at)
    .sort((a, b) => new Date(b.last_searched_at!).getTime() - new Date(a.last_searched_at!).getTime())[0];

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded-xl border" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 flex flex-col">
            <label className="text-xs font-semibold" style={{ color: "var(--color-text-muted)" }}>الولاية (State)</label>
            <select value={state} onChange={(e) => setState(e.target.value)} className="rounded-lg border px-3 py-2 text-sm outline-none" style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)", color: "var(--color-text)" }}>
              <option value="">Select State...</option>
              {usStates.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>

          <div className="space-y-1.5 flex flex-col">
            <label className="text-xs font-semibold" style={{ color: "var(--color-text-muted)" }}>المقاطعة (County)</label>
            <select value={city} onChange={(e) => setCity(e.target.value)} disabled={!state || availableCities.length === 0} className="rounded-lg border px-3 py-2 text-sm outline-none disabled:opacity-40" style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)", color: "var(--color-text)" }}>
              <option value="">{!state ? "Select State first..." : "Select County..."}</option>
              {availableCities.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-1.5 flex flex-col relative">
          <label className="text-xs font-semibold" style={{ color: "var(--color-text-muted)" }}>كلمة البحث (Keyword)</label>
          <div className="relative flex items-center w-full">
            <select value={keyword} onChange={(e) => setKeyword(e.target.value)} disabled={!state || keywordsLoading || availableKeywords.length === 0} className="w-full rounded-lg border pl-24 pr-3 py-2 text-sm outline-none disabled:opacity-40 appearance-none" style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)", color: "var(--color-text)" }}>
              <option value="">{!state ? "Select State first..." : keywordsLoading ? "Loading..." : availableKeywords.length === 0 ? "No keywords..." : "Select a Keyword..."}</option>
              {availableKeywords.map((k) => <option key={k.id} value={k.keyword}>{k.keyword}</option>)}
            </select>

            <div className="absolute left-2 flex items-center gap-1">
              <button type="button" disabled={!state || availableKeywords.length === 0} onClick={() => setShowMiniList(!showMiniList)} className="p-1 px-2 bg-gray-800 border border-gray-700 text-white rounded-md text-xs">🗂️ القائمة</button>
              <button type="button" disabled={!state} onClick={() => setShowBulkModal(true)} className="p-1 px-2 bg-blue-600 text-white rounded-md text-xs font-bold">➕ سهم</button>
            </div>
          </div>

          {showMiniList && (
            <div ref={miniListRef} className="absolute left-0 top-[64px] z-30 w-72 rounded-xl border p-3 shadow-xl" style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)" }}>
              <div className="text-[11px] font-bold pb-1.5 mb-1.5 border-b border-gray-700 text-gray-400 flex justify-between">
                <span>الكلمات والتتبع:</span>
                <span className="text-blue-400">➜ التوقف الحالي</span>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                {availableKeywords.map((k, index) => {
                  const isCurrent = lastSearchedItem?.id === k.id;
                  return (
                    <div key={k.id} onClick={() => { setKeyword(k.keyword); setShowMiniList(false); }} className={`flex items-center justify-between p-1.5 px-2 rounded-md text-xs cursor-pointer ${isCurrent ? 'bg-blue-600/20 text-blue-300' : 'text-gray-300 hover:bg-gray-800'}`}>
                      <span className="font-mono text-gray-500">{index + 1}.</span>
                      <span className="flex-1 mr-2 text-right truncate">{k.keyword}</span>
                      {isCurrent && <span className="text-blue-400 font-bold">➜</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <button type="submit" disabled={isLoading || !state || !keyword} className="w-full py-2 px-4 rounded-lg bg-blue-600 text-white font-medium text-sm disabled:opacity-50">
          {isLoading ? "Searching..." : "Search Leads"}
        </button>
      </form>

      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border p-5 space-y-4 shadow-2xl" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
            <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: "var(--color-border)" }}>
              <h3 className="text-sm font-bold text-white">➕ إضافة مجموعة كلمات مفتاحية</h3>
              <button type="button" onClick={() => setShowBulkModal(false)} className="text-gray-400 text-sm">✕</button>
            </div>
            <form onSubmit={handleBulkAddKeywords} className="space-y-3">
              <textarea value={bulkKeywordsText} onChange={(e) => setBulkKeywordsText(e.target.value)} rows={6} required placeholder="Word 1&#10;Word 2" className="w-full rounded-lg border p-3 text-xs bg-gray-950 text-white border-gray-800 resize-none" />
              <div className="flex justify-end gap-2 text-xs">
                <button type="button" onClick={() => setShowBulkModal(false)} className="px-3 py-1.5 bg-gray-800 text-white rounded-lg">إلغاء</button>
                <button type="submit" disabled={isSavingBulk || !bulkKeywordsText.trim()} className="px-4 py-1.5 bg-blue-600 text-white rounded-lg">{isSavingBulk ? "جاري الرفع..." : "حفظ"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}