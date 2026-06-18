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

  // التحكم في القائمة المنبثقة العلوية
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownSearch, setDropdownSearch] = useState("");
  const [copyFrom, setCopyFrom] = useState<string>("1");
  const [copyTo, setCopyTo] = useState<string>("");
  const [copiedFeedback, setCopiedFeedback] = useState(false);

  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkKeywordsText, setBulkKeywordsText] = useState("");
  const [isSavingBulk, setIsSavingBulk] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
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

  // فلترة الكلمات داخل القائمة المنبثقة
  const filteredKeywords = availableKeywords.filter((k) =>
    k.keyword.toLowerCase().includes(dropdownSearch.toLowerCase())
  );

  // نسخ النطاق المخصص
  const handleCopyRange = () => {
    const fromIndex = parseInt(copyFrom) - 1;
    const toIndex = parseInt(copyTo || filteredKeywords.length.toString()) - 1;

    if (isNaN(fromIndex) || isNaN(toIndex) || fromIndex < 0 || toIndex >= filteredKeywords.length || fromIndex > toIndex) {
      alert("الرجاء إدخال نطاق صحيح ومتاح في القائمة!");
      return;
    }

    const rangeItems = filteredKeywords.slice(fromIndex, toIndex + 1);
    const listText = rangeItems.map((k) => k.keyword).join("\n");

    if (!listText) return;

    navigator.clipboard.writeText(listText);
    setCopiedFeedback(true);
    setTimeout(() => setCopiedFeedback(false), 2000);
  };

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

  return (
    <div className="relative w-full text-slate-200">
      <form onSubmit={handleSubmit} className="space-y-5 p-7 rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl">
        
        {/* صف اختيار الولاية والمقاطعة */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2.5 flex flex-col">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">الولاية (STATE)</label>
            <select value={state} onChange={(e) => setState(e.target.value)} className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3.5 text-sm text-slate-100 outline-none transition-all focus:border-blue-500 cursor-pointer">
              <option value="">Select State...</option>
              {usStates.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>

          <div className="space-y-2.5 flex flex-col">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">المقاطعة (COUNTY)</label>
            <select value={city} onChange={(e) => setCity(e.target.value)} disabled={!state || availableCities.length === 0} className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3.5 text-sm text-slate-100 outline-none transition-all focus:border-blue-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
              <option value="">{!state ? "Select State first..." : "Select County..."}</option>
              {availableCities.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {/* حقل الكلمة المفتاحية والقائمة المنبثقة */}
        <div className="space-y-2.5 flex flex-col relative" ref={dropdownRef}>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">كلمة البحث أو النطاق (KEYWORD / DOMAIN)</label>
          <div className="flex items-center gap-2 w-full">
            
            <button
              type="button"
              disabled={!state || keywordsLoading}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-sm font-medium text-slate-200 transition-all cursor-pointer shadow-lg disabled:opacity-50"
            >
              <span>📁</span>
              <span>القائمة</span>
              <span className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded-md text-xs font-mono text-blue-400 font-bold">
                {availableKeywords.length}
              </span>
            </button>

            <button 
              type="button" 
              disabled={!state} 
              onClick={() => setShowBulkModal(true)} 
              className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-lg font-bold transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-lg"
              title="إضافة كلمات مجمعة"
            >
              +
            </button>

            <div className="flex-1 rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3.5 text-sm text-slate-400 truncate">
              {keyword || "Select a Keyword from the list..."}
            </div>
          </div>

          {/* القائمة المنبثقة الطائرة */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-[85px] z-50 w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-950/95 shadow-2xl backdrop-blur-xl p-4 space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-150 text-right">
              
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">تتبع الكلمات الجاهزة</span>
                  {copiedFeedback && (
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">✓ تم النسخ</span>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-end">
                  <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-800 px-2 py-1 rounded-lg text-[11px]">
                    <span className="text-slate-500">نسخ من</span>
                    <input 
                      type="number" 
                      value={copyFrom}
                      onChange={(e) => setCopyFrom(e.target.value)}
                      className="w-10 h-6 text-center bg-slate-950 border border-slate-800 rounded outline-none text-white focus:border-blue-500 text-xs font-mono"
                    />
                    <span className="text-slate-500">إلى</span>
                    <input 
                      type="number" 
                      placeholder={filteredKeywords.length.toString()} 
                      value={copyTo}
                      onChange={(e) => setCopyTo(e.target.value)}
                      className="w-10 h-6 text-center bg-slate-950 border border-slate-800 rounded outline-none text-white focus:border-blue-500 text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleCopyRange}
                      disabled={filteredKeywords.length === 0}
                      className="mr-1.5 px-2 py-0.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-medium transition-colors cursor-pointer"
                    >
                      نسخ النطاق
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="بحث سريع..."
                    value={dropdownSearch}
                    onChange={(e) => setDropdownSearch(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 outline-none focus:border-blue-500 w-28"
                  />
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {filteredKeywords.map((k, index) => (
                  <div
                    key={k.id}
                    onClick={() => {
                      setKeyword(k.keyword);
                      setIsDropdownOpen(false);
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors group ${
                      keyword === k.keyword 
                        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                        : 'text-slate-300 hover:bg-slate-900/50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11px] text-slate-600 group-hover:text-slate-400">
                        {(index + 1).toString().padStart(2, '0')}
                      </span>
                      <span className="font-mono truncate max-w-xs">{k.keyword}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-400">
                        {k.status}
                      </span>
                      {keyword === k.keyword && <span className="text-blue-400">✓</span>}
                    </div>
                  </div>
                ))}

                {filteredKeywords.length === 0 && (
                  <div className="text-center py-6 text-xs text-slate-600">
                    لا توجد ليدز أو كلمات مطابقة...
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

        <button 
          type="submit" 
          disabled={isLoading || !state || !keyword} 
          className="w-full py-4 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>إبدأ البحث عن الليدز (Find Leads)</span>
        </button>
      </form>

      {/* مودال الإدخال الجماعي - مغلق بالكامل هنا وبدون أي انقطاع */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">➕ إضافة مجموعة كلمات مفتاحية</h3>
              <button type="button" onClick={() => setShowBulkModal(false)} className="text-slate-400 hover:text-white text-sm p-1">✕</button>
            </div>
            <form onSubmit={handleBulkAddKeywords} className="space-y-4">
              <textarea value={bulkKeywordsText} onChange={(e) => setBulkKeywordsText(e.target.value)} rows={6} required placeholder="Real Estate&#10;Roofing Contractors" className="w-full rounded-xl border border-slate-800 p-3.5 text-xs bg-slate-950 text-slate-100 placeholder-slate-600 focus:border-blue-500 outline-none resize-none" />
              <div className="flex justify-end gap-2 text-xs">
                <button type="button" onClick={() => setShowBulkModal(false)} className="px-4 py-2 bg-slate-800 text-slate-200 rounded-xl">إلغاء</button>
                <button type="submit" disabled={isSavingBulk || !bulkKeywordsText.trim()} className="px-5 py-2 bg-blue-600 text-white rounded-xl font-semibold">{isSavingBulk ? "جاري الحفظ..." : "حفظ الكلمات"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}