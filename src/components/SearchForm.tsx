"use client";

import { useState, useEffect } from "react";
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
  // الحقول الأساسية في مكانها السابق
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [keyword, setKeyword] = useState("");
  const [maxResults, setMaxResults] = useState(50);

  // القوائم وحالات التحميل
  const [availableCities, setAvailableCities] = useState<CityInfo[]>([]);
  const [availableKeywords, setAvailableKeywords] = useState<KeywordItem[]>([]);
  const [keywordsLoading, setKeywordsLoading] = useState(false);

  // التحكم في البوب أب (Modal) وإضافة الكلمات
  const [isOpenModal, setIsOpenModal] = useState(false);
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

  // 2. جلب الكلمات المفتاحية من Supabase للولاية المحددة
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
      console.error("Error fetching keywords:", err);
    } finally {
      setKeywordsLoading(false);
    }
  };

  useEffect(() => {
    fetchKeywords(state);
    setKeyword(""); 
  }, [state]);

  // 3. إضافة كلمة جديدة من داخل البوب أب
  const handleAddKeyword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state || !newKeyword.trim()) return;

    setIsAddingKeyword(true);
    try {
      const { error } = await supabase
        .from("state_keywords")
        .insert([{ state_name: state, keyword: newKeyword.trim(), status: 'ready' }]);

      if (error) throw error;
      await fetchKeywords(state);
      setNewKeyword("");
    } catch (err) {
      console.error("Error adding keyword:", err);
    } finally {
      setIsAddingKeyword(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state || !keyword) return;

    // العثور على الكلمة المحددة لتحديث حالتها إلى "جاري البحث" أونلاين
    const activeKw = availableKeywords.find(k => k.keyword === keyword);
    if (activeKw) {
      try {
        await supabase
          .from("state_keywords")
          .update({ status: 'searching', last_searched_at: new Date().toISOString() })
          .eq("id", activeKw.id);
        
        fetchKeywords(state); // تحديث القائمة لرؤية مؤشر الحالة المحدث فوراً
      } catch (err) {
        console.error(err);
      }
    }

    // إطلاق عملية البحث الأساسية
    onSearch({ keyword, maxResults, state, city });

    // بعد انتهاء الفرز، تحويل الحالة إلى مكتملة
    if (activeKw) {
      setTimeout(async () => {
        await supabase
          .from("state_keywords")
          .update({ status: 'completed' })
          .eq("id", activeKw.id);
        fetchKeywords(state);
      }, 3000);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded-xl border" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
        
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

          {/* خانة اختيار المقاطعة */}
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

        {/* خانة كلمة البحث في مكانها السابق مع زر البوب أب الذكي */}
        <div className="space-y-2 flex flex-col">
          <label className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
            كلمة البحث (Keyword / Business Type)
          </label>
          <div className="flex gap-2">
            <select
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              disabled={!state || keywordsLoading || availableKeywords.length === 0}
              className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none cursor-pointer focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
            >
              <option value="">
                {!state 
                  ? "Select a State first..." 
                  : keywordsLoading 
                  ? "Loading keywords..." 
                  : availableKeywords.length === 0 
                  ? "No keywords found..." 
                  : "Select a Keyword..."}
              </option>
              {availableKeywords.map((k) => (
                <option key={k.id} value={k.keyword}>
                  {k.keyword} {k.status === 'searching' ? '⏳' : k.status === 'completed' ? '✅' : '⚙️'}
                </option>
              ))}
            </select>

            {/* زر فتح البوب أب لإدارة الكلمات وتتبعها بمرونة */}
            <button
              type="button"
              onClick={() => setIsOpenModal(true)}
              disabled={!state}
              className="px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-lg text-xs font-medium transition-all cursor-pointer disabled:opacity-40"
              title="إدارة وتتبع الكلمات بالترقيم"
            >
              📊 لوحة التحكم
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !state || !keyword}
          className="w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? "Searching..." : "Search Leads"}
        </button>
      </form>

      {/* 📥 البوب أب المنبثق (Modal Overlay) لإدارة وتتبع الكلمات بالترقيم */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl border p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
            
            {/* الرأس */}
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--color-border)" }}>
              <div>
                <h3 className="text-base font-bold text-white">📋 الكلمات المرقّمة لولاية {state}</h3>
                <p className="text-xs text-gray-400">رؤية الكلمات الحالية، الترتيب بالرقم، ومعرفة أين وصلت عمليات البحث الأخيرة.</p>
              </div>
              <button 
                onClick={() => setIsOpenModal(false)}
                className="text-gray-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* نموذج إضافة كلمة جديدة داخل البوب أب */}
            <form onSubmit={handleAddKeyword} className="flex gap-2 bg-gray-900/40 p-3 rounded-xl border border-dashed border-gray-700">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="أدخل كلمة مفتاحية جديدة للرفع والتخزين..."
                className="flex-1 rounded-lg border px-3 py-1.5 text-xs outline-none focus:border-blue-500 bg-gray-950 text-white border-gray-800"
              />
              <button 
                type="submit" 
                disabled={isAddingKeyword || !newKeyword.trim()} 
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-all"
              >
                {isAddingKeyword ? "جاري الحفظ..." : "إضافة وحفظ"}
              </button>
            </form>

            {/* الجدول التتبعي المرقّم */}
            <div className="overflow-y-auto max-h-64 rounded-lg border border-gray-800">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-900 text-gray-300 border-b border-gray-800">
                    <th className="py-2 px-3 text-right w-12">#</th>
                    <th className="py-2 px-3">الكلمة المفتاحية (Keyword)</th>
                    <th className="py-2 px-3 text-center">حالة المؤشر</th>
                    <th className="py-2 px-3 text-center">آخر توقيت بحث</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {availableKeywords.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-gray-500">لا توجد كلمات حالية للولاية، أضف أول كلمة بالنموذج العلوي!</td>
                    </tr>
                  ) : (
                    availableKeywords.map((k, index) => (
                      <tr key={k.id} className={`hover:bg-gray-800/40 transition-colors ${k.status === 'searching' ? 'bg-amber-950/30' : ''}`}>
                        <td className="py-2 px-3 text-right font-mono text-gray-500">{index + 1}</td>
                        <td className="py-2 px-3 font-medium text-gray-200">{k.keyword}</td>
                        <td className="py-2 px-3 text-center">
                          {k.status === 'ready' && <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-400 text-[10px]">جاهزة 🟢</span>}
                          {k.status === 'searching' && <span className="px-2 py-0.5 rounded bg-amber-600 text-white text-[10px] animate-pulse">جاري البحث 🟡</span>}
                          {k.status === 'completed' && <span className="px-2 py-0.5 rounded bg-blue-900 text-blue-200 text-[10px]">مكتملة ومؤرشفة 🔵</span>}
                        </td>
                        <td className="py-2 px-3 text-center font-mono text-gray-400">
                          {k.last_searched_at ? new Date(k.last_searched_at).toLocaleTimeString() : "لم تبحث بعد"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* الإغلاق */}
            <div className="flex justify-end pt-2 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setIsOpenModal(false)}
                className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-xs font-medium transition-all"
              >
                إغلاق الواجهة
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}