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
  const buttonListRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        miniListRef.current && 
        !miniListRef.current.contains(event.target as Node) &&
        buttonListRef.current &&
        !buttonListRef.current.contains(event.target as Node)
      ) {
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
    const arr = bulkKeywordsText
      .split("\n")
      .map(k => k.trim())
      .filter(k => k.length > 0);

    if (arr.length === 0) {
      setIsSavingBulk(false)
      return;
    }

    try {
      const rows = arr.map(kw => ({
        state_name: state,
        keyword: kw,
        status: 'ready'
      }));
      
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
    <div className="relative w-full text-slate-200">
      <form onSubmit={handleSubmit} className="space-y-5 p-6 rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl backdrop-blur-md">
        
        {/* صف اختيار الولاية والمقاطعة */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2 flex flex-col">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">الولاية (State)</label>
            <select 
              value={state} 
              onChange={(e) => setState(e.target.value)} 
              className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none transition-all duration-200 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/10 cursor-pointer"
            >
              <option value="" className="bg-slate-950">Select State...</option>
              {usStates.map((s) => <option key={s.id} value={s.name} className="bg-slate-950">{s.name}</option>)}
            </select>
          </div>

          <div className="space-y-2 flex flex-col">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">المقاطعة (County)</label>
            <select 
              value={city} 
              onChange={(e) => setCity(e.target.value)} 
              disabled={!state || availableCities.length === 0} 
              className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none transition-all duration-200 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <option value="" className="bg-slate-950">{!state ? "Select State first..." : "Select County..."}</option>
              {availableCities.map((c) => <option key={c.id} value={c.name} className="bg-slate-950">{c.name}</option>)}
            </select>
          </div>
        </div>

        {/* حقل الكلمات المفتاحية مع فتح القائمة إلى الأعلى */}
        <div className="space-y-2 flex flex-col relative">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">كلمة البحث (Keyword)</label>
          
          <div className="flex items-center gap-2 w-full">
            <div className="relative flex-1">
              <select 
                value={keyword} 
                onChange={(e) => setKeyword(e.target.value)} 
                disabled={!state || keywordsLoading || availableKeywords.length === 0} 
                className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none transition-all duration-200 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <option value="" className="bg-slate-950">
                  {!state ? "Select State first..." : keywordsLoading ? "Loading keywords..." : availableKeywords.length === 0 ? "No keywords available..." : "Select a Keyword..."}
                </option>
                {availableKeywords.map((k) => <option key={k.id} value={k.keyword} className="bg-slate-950">{k.keyword}</option>)}
              </select>
            </div>

            <button 
              ref={buttonListRef} 
              type="button" 
              disabled={!state || availableKeywords.length === 0} 
              onClick={() => setShowMiniList(!showMiniList)} 
              className="flex items-center gap-1.5 h-[46px] px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-sm font-medium transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer whitespace-nowrap shadow-md"
              title="عرض القائمة"
            >
              🗂️ <span>القائمة</span>
            </button>
            
            <button 
              type="button" 
              disabled={!state} 
              onClick={() => setShowBulkModal(true)} 
              className="flex items-center justify-center w-12 h-[46px] bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xl font-bold shadow-lg shadow-blue-600/20 transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              title="إضافة كلمات"
            >
              +
            </button>
          </div>

          {/* 🌟 تعديل هنا: القائمة تفتح إلى الأعلى الآن بشكل كامل ومريح للتتبع */}
          {showMiniList && (
            <div ref={miniListRef} className="absolute left-0 bottom-[54px] z-30 w-80 rounded-xl border border-slate-800 bg-slate-950/95 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center bg-slate-900/40 rounded-t-xl">
                <span className="text-xs font-bold text-slate-400">تتبع الكلمات الجاهزة</span>
                <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-md border border-blue-500/20 font-medium">➜ النشط حالياً</span>
              </div>
              <div className="max-h-56 overflow-y-auto p-2 space-y-0.5 custom-scrollbar">
                {availableKeywords.map((k, index) => {
                  const isCurrent = lastSearchedItem?.id === k.id;
                  return (
                    <div 
                      key={k.id} 
                      onClick={() => { setKeyword(k.keyword); setShowMiniList(false); }} 
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs cursor-pointer transition-all duration-150 group/item ${
                        isCurrent 
                          ? 'bg-blue-600/10 text-blue-400 font-semibold border border-blue-500/20' 
                          : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-500 group-hover/item:text-slate-400">{(index + 1).toString().padStart(2, '0')}</span>
                        <span className="truncate max-w-[180px]">{k.keyword}</span>
                      </div>
                      {isCurrent ? (
                        <span className="text-blue-400 text-[10px]">➜</span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-slate-500 rounded group-hover/item:border-slate-700 group-hover/item:text-slate-400 transition-colors uppercase">{k.status}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* زر البحث الرئيسي */}
        <button 
          type="submit" 
          disabled={isLoading || !state || !keyword} 
          className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm shadow-xl shadow-blue-600/10 transition-all duration-200 hover:shadow-blue-600/20 active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none cursor-pointer flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Searching Leads...</span>
            </>
          ) : (
            <span>Search Leads</span>
          )}
        </button>
      </form>

      {/* مودال إدخال الكلمات الجماعي */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>➕ إضافة مجموعة كلمات مفتاحية</span>
              </h3>
              <button 
                type="button" 
                onClick={() => setShowBulkModal(false)} 
                className="text-slate-400 hover:text-white text-sm p-1 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleBulkAddKeywords} className="space-y-4">
              <div className="space-y-1">
                <p className="text-[11px] text-slate-400 mb-2">أدخل كل كلمة في سطر منفصل ليتم إضافتها للولاية المحددة تلقائياً:</p>
                <textarea 
                  value={bulkKeywordsText} 
                  onChange={(e) => setBulkKeywordsText(e.target.value)} 
                  rows={6} 
                  required 
                  placeholder="Real Estate&#10;Roofing Contractors&#10;Plumbing Services" 
                  className="w-full rounded-xl border border-slate-800 p-3.5 text-xs bg-slate-950 text-slate-100 placeholder-slate-600 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/10 outline-none resize-none font-mono leading-relaxed" 
                />
              </div>
              <div className="flex justify-end gap-2 text-xs pt-1">
                <button 
                  type="button" 
                  onClick={() => setShowBulkModal(false)} 
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors cursor-pointer font-medium"
                >
                  إلغاء
                </button>
                <button 
                  type="submit" 
                  disabled={isSavingBulk || !bulkKeywordsText.trim()} 
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/10 transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                >
                  {isSavingBulk ? "جاري الحفظ..." : "حفظ الكلمات"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}