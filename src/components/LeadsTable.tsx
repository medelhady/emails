"use client";

import { useState } from "react";
import { Lead } from "@/types";

interface LeadsTableProps {
  leads: Lead[];
}

export function LeadsTable({ leads }: LeadsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [copyFrom, setCopyFrom] = useState<string>("1");
  const [copyTo, setCopyTo] = useState<string>("");
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // فلترة الليدز بناءً على البحث
  const filteredLeads = leads.filter(
    (lead) =>
      (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.website && lead.website.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // نسخ عمود كامل
  const handleCopyColumn = (type: "email" | "website") => {
    const list = filteredLeads
      .map((lead) => (type === "email" ? lead.email : lead.website))
      .filter((val) => val && val.trim() !== "");

    if (list.length === 0) return;

    navigator.clipboard.writeText(list.join("\n"));
    triggerCopyFeedback(type === "email" ? "جميع الإيميلات" : "جميع المواقع");
  };

  // نسخ نطاق محدد من X إلى Y
  const handleCopyRange = (type: "email" | "website") => {
    const fromIndex = parseInt(copyFrom) - 1;
    const toIndex = parseInt(copyTo || filteredLeads.length.toString()) - 1;

    if (isNaN(fromIndex) || isNaN(toIndex) || fromIndex < 0 || toIndex >= filteredLeads.length || fromIndex > toIndex) {
      alert("الرجاء إدخال نطاق صفوف صحيح ومتاح في الجدول!");
      return;
    }

    const rangeLeads = filteredLeads.slice(fromIndex, toIndex + 1);
    const list = rangeLeads
      .map((lead) => (type === "email" ? lead.email : lead.website))
      .filter((val) => val && val.trim() !== "");

    if (list.length === 0) return;

    navigator.clipboard.writeText(list.join("\n"));
    triggerCopyFeedback(`النطاق من ${copyFrom} إلى ${toIndex + 1}`);
  };

  const triggerCopyFeedback = (message: string) => {
    setCopiedType(message);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-6 shadow-2xl space-y-4 text-slate-200">
      
      {/* البار العلوي النظيف والمستقر */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-white tracking-wide">
            Leads — {filteredLeads.length}
          </h2>
          {copiedType && (
            <span className="text-[11px] bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              ✓ تم نسخ {copiedType} بنجاح!
            </span>
          )}
        </div>

        {/* شريط أدوات النسخ والبحث مدمج تلقائياً بشكل فلات ونظيف */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* أدوات النسخ من X إلى Y */}
          <div className="flex items-center gap-1.5 bg-slate-950/60 border border-slate-800 px-2.5 py-1.5 rounded-xl text-xs">
            <span className="text-slate-400">نسخ من</span>
            <input 
              type="number" 
              placeholder="1" 
              value={copyFrom}
              onChange={(e) => setCopyFrom(e.target.value)}
              className="w-12 h-7 text-center bg-slate-900 border border-slate-800 rounded-md outline-none text-white focus:border-blue-500"
            />
            <span className="text-slate-400">إلى</span>
            <input 
              type="number" 
              placeholder={filteredLeads.length.toString()} 
              value={copyTo}
              onChange={(e) => setCopyTo(e.target.value)}
              className="w-12 h-7 text-center bg-slate-900 border border-slate-800 rounded-md outline-none text-white focus:border-blue-500"
            />
            <div className="flex gap-1 mr-1">
              <button
                type="button"
                onClick={() => handleCopyRange("email")}
                disabled={filteredLeads.length === 0}
                className="px-2 py-1 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/20 rounded cursor-pointer transition-colors"
              >
                📧 إيميل
              </button>
              <button
                type="button"
                onClick={() => handleCopyRange("website")}
                disabled={filteredLeads.length === 0}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded cursor-pointer transition-colors"
              >
                🌐 موقع
              </button>
            </div>
          </div>

          {/* خانة البحث السريع */}
          <input
            type="text"
            placeholder="بحث..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-48 bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100 outline-none transition-all focus:border-blue-500"
          />
        </div>
      </div>

      {/* الجدول الرئيسي للبيانات مع الترقيم التلقائي المحسن */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/60 custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/40 border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
              <th className="py-3.5 px-4 w-14 text-center border-r border-slate-800/40">#</th>
              <th className="py-3.5 px-5 group/th">
                <div className="flex items-center justify-between">
                  <span>العنوان البريدي (Email)</span>
                  <button
                    type="button"
                    onClick={() => handleCopyColumn("email")}
                    className="opacity-0 group-hover/th:opacity-100 p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-all text-[10px] cursor-pointer"
                  >
                    📋 نسخ الكل
                  </button>
                </div>
              </th>
              <th className="py-3.5 px-5 group/th">
                <div className="flex items-center justify-between">
                  <span>الموقع الإلكتروني (Website)</span>
                  <button
                    type="button"
                    onClick={() => handleCopyColumn("website")}
                    className="opacity-0 group-hover/th:opacity-100 p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-all text-[10px] cursor-pointer"
                  >
                    📋 نسخ الكل
                  </button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
            {filteredLeads.map((lead, index) => (
              <tr key={index} className="hover:bg-slate-900/30 transition-colors">
                {/* الترقيم التسلسلي التلقائي النظيف */}
                <td className="py-3 px-4 text-center font-mono text-slate-500 bg-slate-950/20 border-r border-slate-800/40">
                  {(index + 1).toString().padStart(2, '0')}
                </td>
                <td className="py-3 px-5 font-mono text-slate-200">
                  {lead.email ? (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">✉</span>
                      <span className="select-all">{lead.email}</span>
                    </div>
                  ) : (
                    <span className="text-slate-600">—</span>
                  )}
                </td>
                <td className="py-3 px-5 text-blue-400 font-mono">
                  {lead.website ? (
                    <a
                      href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-1 max-w-xs truncate"
                    >
                      <span>↗</span>
                      <span className="select-all">{lead.website}</span>
                    </a>
                  ) : (
                    <span className="text-slate-600">—</span>
                  )}
                </td>
              </tr>
            ))}

            {filteredLeads.length === 0 && (
              <tr>
                <td colSpan={3} className="py-8 text-center text-slate-500 text-xs">
                  لا توجد ليدز متاحة حالياً للعرض أو البحث المكتوب...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}