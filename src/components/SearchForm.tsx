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
  const [maxResults, setMaxResults] = useState(50); // الحقل المستعاد للعدد المطلوب للبحث

  const [availableCities, setAvailableCities] = useState<CityInfo[]>([]);
  const [availableKeywords, setAvailableKeywords] = useState<KeywordItem[]>([]);
  const [keywordsLoading, setKeywordsLoading] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkKeywordsText, setBulkKeywordsText] = useState("");
  const [isSavingBulk, setIsSavingBulk] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // جلب المقاطعات عند تغيير الولاية
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

  // جلب الكلمات من Supabase
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
    onSearch({ keyword, maxResults, state, city });
  };

  return (
    <div className="w-full text-slate-200">
      <form onSubmit={handleSubmit} className="space-y-5 p-7 rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl relative">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2.5 flex flex-col">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 text-right">الولاية (STATE)</label>
            <select value={state} onChange={(e) => setState(e.target.value)} className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3.5 text-sm text-slate-100 outline-none transition-all focus:border-blue-500 cursor-pointer text-right">
              <option value="">Select State...</option>
              {usStates.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>

          <div className="space-y-2.5 flex flex-col">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 text-right">المقاطعة (COUNTY)</label>
            <select value={city} onChange={(e) => setCity(e.target.value)} disabled={!state || availableCities.length === 0} className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3.5 text-sm text-slate-100 outline-none transition-all focus:border-blue-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-right">
              <option value="">{!state ? "Select State first..." : "Select County..."}</option>
              {availableCities.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {/* حقل اختيار الكلمات المفتاحية مع المنبثقة المحسنة للأعلى */}
        <div className="space-y-2.5 flex flex-col relative" ref={dropdownRef}>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 text-right">كلمة البحث أو النطاق (KEYWORD / DOMAIN)</label>
          <div className="flex items-center gap-2 w-full flex-row-reverse">
            
            {/* زر فتح القائمة */}
            <button
              type="button"
              disabled={!state || keywordsLoading}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-sm font-medium text-slate-200 transition-all cursor-pointer shadow-lg disabled:opacity-50"
            >
              <span className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-md text-xs font-mono text-blue-400 font-bold">
                {availableKeywords.length}
              </span>
              <span>القائمة</span>
              <span>📁</span>
            </button>

            {/* زر الإضافة السريعة */}
            <button 
              type="button" 
              disabled={!state} 
              onClick={() => setShowBulkModal(true)} 
              className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-lg font-bold transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-lg"
            >
              +
            </button>

            {/* عرض الكلمة المختارة حالياً */}
            <div className="flex-1 rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3.5 text-sm text-slate-300 truncate text-right">
              {keyword || "اختر كلمة مفتاحية من القائمة..."}
            </div>
          </div>

          {/* النافذة المنبثقة تفتح للأعلى (bottom-[55px]) فوق الحقول */}
          {isDropdownOpen && (
            <div className="absolute left-0 right-0 bottom-[55px] z-[9999] w-full rounded-2xl border border-slate-800 bg-slate-950/98 shadow-2xl p-4 space-y-3 text-right animate-in fade-in slide-in-from-bottom-2 duration-150">
              <div className="border-b border-slate-800/80 pb-2 flex items-center justify-between flex-row-reverse">
                <span className="text-xs font-bold text-slate-400">تتبع الكلمات الجاهزة ({availableKeywords.length} كلمة)</span>
                <span className="text-[10px] text-slate-500 font-mono">Supabase Server Sync</span>
              </div>

              {/* قائمة الكلمات مع ترقيم واضح */}
              <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                {availableKeywords.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-500">لا توجد كلمات لهذه الولاية، اضغط (+) لإضافة كلماتك.</div>
                ) : (
                  availableKeywords.map((k, index) => (
                    <div
                      key={k.id}
                      onClick={() => {
                        setKeyword(k.keyword);
                        setIsDropdownOpen(false);
                      }}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs cursor-pointer transition-colors border ${
                        keyword === k.keyword 
                          ? 'bg-blue-600/10 text-blue-400 border-blue-500/40' 
                          : 'text-slate-300 hover:bg-slate-900/80 border-transparent'
                      }`}
                    >
                      <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${
                        k.status === 'searching' 
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}>
                        {k.status}
                      </span>

                      <div className="flex items-center gap-3 flex-row-reverse">
                        <span className="font-mono text-[11px] text-slate-500 bg-slate-900/50 border border-slate-800 px-1.5 py-0.5 rounded">
                          {(index + 1).toString().padStart(2, '0')}
                        </span>
                        <span className="font-medium tracking-wide text-right">{k.keyword}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* سطر زر البحث ومعه حقل اختيار العدد الأقصى لنتائج البحث المعاد تصميمه */}
        <div className="flex items-center gap-3 w-full flex-row-reverse">
          <button 
            type="submit" 
            disabled={isLoading || !state || !keyword} 
            className="flex-1 py-4 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all cursor-pointer flex items-center justify-center shadow-lg"
          >
            <span>{isLoading ? "جاري البحث والمزامنة..." : "إبدأ البحث عن الليدز (Find Leads)"}</span>
          </button>

          <div className="flex flex-col space-y-1.5 min-w-[90px]">
            <input 
              type="number"
              min="1"
              max="500"
              value={maxResults}
              onChange={(e) => setMaxResults(parseInt(e.target.value) || 50)}
              className="w-full h-[52px] text-center bg-slate-950 border border-slate-800 rounded-xl outline-none text-white focus:border-blue-500 font-mono font-bold text-sm shadow-inner"
              title="الحد الأقصى للنتائج"
            />
          </div>
        </div>

      </form>

      {/* المودال الخاص بالإدخال الجماعي */}
      {showBulkModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-row-reverse">
              <h3 className="text-sm font-bold text-white">➕ إضافة مجموعة كلمات مفتاحية</h3>
              <button type="button" onClick={() => setShowBulkModal(false)} className="text-slate-400 hover:text-white text-sm">✕</button>
            </div>
            <form onSubmit={handleBulkAddKeywords} className="space-y-4">
              <textarea value={bulkKeywordsText} onChange={(e) => setBulkKeywordsText(e.target.value)} rows={6} required placeholder="Real Estate&#10;Roofing Contractors" className="w-full rounded-xl border border-slate-800 p-3.5 text-xs bg-slate-950 text-slate-100 placeholder-slate-600 focus:border-blue-500 outline-none resize-none text-right" />
              <div className="flex justify-end gap-2 text-xs flex-row-reverse">
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