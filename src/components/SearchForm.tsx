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
  // الحقول الأساسية للبحث
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [selectedKeyword, setSelectedKeyword] = useState("");
  
  // القوائم والبيانات
  const [availableCities, setAvailableCities] = useState<CityInfo[]>([]);
  const [keywordsTable, setKeywordsTable] = useState<KeywordItem[]>([]);
  const [keywordsLoading, setKeywordsLoading] = useState(false);

  // إدخال كلمة جديدة
  const [newKeyword, setNewKeyword] = useState("");
  const [isAddingKeyword, setIsAddingKeyword] = useState(false);

  // تحديث قائمة المقاطعات عند تغيير الولاية
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

  // جلب الكلمات وجدولتها بناءً على الولاية المختارة
  const fetchKeywordsTable = async (selectedState: string) => {
    if (!selectedState) {
      setKeywordsTable([]);
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
      if (data) setKeywordsTable(data as KeywordItem[]);
    } catch (err) {
      console.error("Error fetching keywords table:", err);
    } finally {
      setKeywordsLoading(false);
    }
  };

  useEffect(() => {
    fetchKeywordsTable(state);
    setSelectedKeyword("");
  }, [state]);

  // إضافة كلمة جديدة للجدول
  const handleAddKeyword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state || !newKeyword.trim()) return;

    setIsAddingKeyword(true);
    try {
      const { error } = await supabase
        .from("state_keywords")
        .insert([{ state_name: state, keyword: newKeyword.trim(), status: 'ready' }]);

      if (error) throw error;
      await fetchKeywordsTable(state);
      setNewKeyword("");
    } catch (err) {
      console.error("Error adding keyword:", err);
    } finally {
      setIsAddingKeyword(false);
    }
  };

  // دالة بدء تتبع وتشغيل البحث للكلمة المختارة
  const handleTriggerSearch = async (kwItem: KeywordItem) => {
    setSelectedKeyword(kwItem.keyword);
    
    // 1. تحديث حالة الكلمة في Supabase لتصبح قيد البحث وتحديث وقت التوقف الحالي
    try {
      await supabase
        .from("state_keywords")
        .update({ status: 'searching', last_searched_at: new Date().toISOString() })
        .eq("id", kwItem.id);

      // تحديث الجدول محلياً فوراً
      setKeywordsTable(prev => prev.map(item => 
        item.id === kwItem.id ? { ...item, status: 'searching', last_searched_at: new Date().toISOString() } : item
      ));

      // 2. إطلاق دالة البحث الأساسية لجلب الـ Leads
      onSearch({ keyword: kwItem.keyword, maxResults: 50, state, city });

      // 3. محاكاة أو تحويل الحالة إلى اكتمال بعد انتهاء طلب البحث
      await supabase
        .from("state_keywords")
        .update({ status: 'completed' })
        .eq("id", kwItem.id);
        
      setKeywordsTable(prev => prev.map(item => 
        item.id === kwItem.id ? { ...item, status: 'completed' } : item
      ));

    } catch (err) {
      console.error("Error updating search pointer status:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* قسم فلترة الولاية والمقاطعة */}
      <div className="p-5 rounded-xl border grid grid-cols-1 md:grid-cols-2 gap-4" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
        <div className="space-y-2 flex flex-col">
          <label className="text-xs font-medium">الولاية الحالية لفرز الكلمات</label>
          <select value={state} onChange={(e) => setState(e.target.value)} className="rounded-lg border px-3 py-2 text-sm style-input">
            <option value="">اختر الولاية...</option>
            {usStates.map((s) => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2 flex flex-col">
          <label className="text-xs font-medium">المقاطعة المستهدفة (County)</label>
          <select value={city} onChange={(e) => setCity(e.target.value)} disabled={!state} className="rounded-lg border px-3 py-2 text-sm style-input">
            <option value="">{state ? "جميع المقاطعات المتوفرة..." : "اختر الولاية أولاً..."}</option>
            {availableCities.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* لوحة تحكم وإدارة الكلمات (الجدول المطور) */}
      <div className="p-5 rounded-xl border space-y-4" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b pb-3">
          <div>
            <h3 className="text-sm font-bold">📋 لوحة مراقبة وإدارة الكلمات بالترقيم</h3>
            <p className="text-xs text-gray-400">تتبع الكلمات، حالتها، ومؤشر آخر بحث تم القيام به للولاية.</p>
          </div>
          
          {/* حقل الإدخال السريع أعلى الجدول */}
          <form onSubmit={handleAddKeyword} className="flex gap-2">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              disabled={!state}
              placeholder={state ? "أدخل كلمة جديدة هنا..." : "اختر ولاية للإضافة..."}
              className="rounded-lg border px-3 py-1.5 text-xs outline-none focus:border-blue-500"
            />
            <button type="submit" disabled={isAddingKeyword || !state || !newKeyword.trim()} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-colors">
              {isAddingKeyword ? "جاري الحفظ..." : "إضافة"}
            </button>
          </form>
        </div>

        {/* عرض الجدول المرقّم والذكي */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--color-border)" }}>
                <th className="py-2 text-right w-12">#</th>
                <th className="py-2">الكلمة المفتاحية (Keyword)</th>
                <th className="py-2 text-center">حالة البحث</th>
                <th className="py-2 text-center">آخر توقيت للبحث</th>
                <th className="py-2 text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody>
              {keywordsLoading ? (
                <tr><td colSpan={5} className="py-4 text-center">جاري سحب بيانات الكلمات من السوبابيز...</td></tr>
              ) : keywordsTable.length === 0 ? (
                <tr><td colSpan={5} className="py-4 text-center text-gray-400">{state ? "لا توجد كلمات مفتاحية مسجلة لهذه الولاية. أضف كلمة جديدة!" : "الرجاء اختيار ولاية من الأعلى لعرض وإدارة جولتها المرقّمة."}</td></tr>
              ) : (
                keywordsTable.map((kw, index) => {
                  const isLastSearched = kw.last_searched_at !== null;
                  return (
                    <tr key={kw.id} className={`border-b hover:bg-opacity-20 hover:bg-gray-700 transition-colors ${kw.status === 'searching' ? 'bg-amber-950 bg-opacity-20' : ''}`} style={{ borderColor: "var(--color-border)" }}>
                      <td className="py-2.5 font-mono text-gray-400 text-right">{index + 1}</td>
                      <td className="py-2.5 font-medium flex items-center gap-1">
                        {kw.keyword}
                        {kw.status === 'searching' && <span className="animate-pulse text-amber-500">⏳</span>}
                      </td>
                      <td className="py-2.5 text-center">
                        {kw.status === 'ready' && <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 text-[10px]">جاهزة 🟢</span>}
                        {kw.status === 'searching' && <span className="px-2 py-0.5 rounded bg-amber-600 text-white text-[10px] animate-pulse">جاري البحث 🟡</span>}
                        {kw.status === 'completed' && <span className="px-2 py-0.5 rounded bg-blue-900 text-blue-200 text-[10px]">مكتملة ومؤرشفة 🔵</span>}
                      </td>
                      <td className="py-2.5 text-center font-mono text-gray-400">
                        {kw.last_searched_at ? new Date(kw.last_searched_at).toLocaleTimeString() : "لم تبحث بعد"}
                      </td>
                      <td className="py-2.5 text-center">
                        <button
                          onClick={() => handleTriggerSearch(kw)}
                          disabled={isLoading}
                          className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                            kw.status === 'completed' 
                              ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' 
                              : 'bg-blue-600 hover:bg-blue-500 text-white'
                          }`}
                        >
                          {kw.status === 'searching' ? "يقوم بالفرز..." : "ابدأ فرز الـ Leads"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}