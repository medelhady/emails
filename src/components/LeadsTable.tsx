"use client";

import { useState } from "react";
import { Lead } from "@/types";

interface LeadsTableProps {
  leads: Lead[];
}

export function LeadsTable({ leads }: LeadsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [copyFrom, setCopyFrom] = useState("1");
  const [copyTo, setCopyTo] = useState("");
  const [copiedFeedback, setCopiedFeedback] = useState(false);

  // الفلترة بناءً على حقل البحث المكتوب
  const filteredLeads = leads.filter(lead => 
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.website?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // دالة نسخ النطاق المخصصة من X إلى Y
  const handleCopyRange = () => {
    const fromIndex = parseInt(copyFrom) - 1;
    const toIndex = parseInt(copyTo || filteredLeads.length.toString()) - 1;

    if (isNaN(fromIndex) || isNaN(toIndex) || fromIndex < 0 || toIndex >= filteredLeads.length || fromIndex > toIndex) {
      alert("الرجاء تحديد نطاق صحيح متاح داخل الجدول!");
      return;
    }

    const rangeItems = filteredLeads.slice(fromIndex, toIndex + 1);
    const emailsList = rangeItems.map(l => l.email).filter(Boolean).join("\n");

    if (!emailsList) {
      alert("لا توجد إيميلات صالحة للنسخ في هذا النطاق!");
      return;
    }

    navigator.clipboard.writeText(emailsList);
    setCopiedFeedback(true);
    setTimeout(() => setCopiedFeedback(false), 2000);
  };

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4 shadow-xl">
      
      {/* شريط التحكم العلوي فوق الجدول */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-900 pb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-white">Leads — {filteredLeads.length}</h2>
          {copiedFeedback && (
            <span className="text-[11px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">✓ تم نسخ النطاق</span>
          )}
        </div>

        {/* أدوات الفلترة والنسخ المتقدمة المستقرة هنا */}
        <div className="flex flex-wrap items-center gap-3 justify-end">
          
          {/* شريط نسخ النطاق المخصص المستقر */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-slate-400">نسخ من</span>
            <input 
              type="number" 
              value={copyFrom}
              onChange={(e) => setCopyFrom(e.target.value)}
              className="w-12 h-7 text-center bg-slate-950 border border-slate-800 rounded-lg outline-none text-white focus:border-blue-500 font-mono"
            />
            <span className="text-slate-400">إلى</span>
            <input 
              type="number" 
              placeholder={filteredLeads.length.toString()} 
              value={copyTo}
              onChange={(e) => setCopyTo(e.target.value)}
              className="w-12 h-7 text-center bg-slate-950 border border-slate-800 rounded-lg outline-none text-white focus:border-blue-500 font-mono"
            />
            <button
              type="button"
              onClick={handleCopyRange}
              disabled={filteredLeads.length === 0}
              className="mr-2 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium cursor-pointer"
            >
              نسخ الإيميلات
            </button>
          </div>

          {/* صندوق البحث الداخلي */}
          <input
            type="text"
            placeholder="بحث داخل النتائج..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 outline-none focus:border-blue-500 w-48 text-right"
          />
        </div>
      </div>

      {/* جدول عرض البيانات */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-900 text-slate-400 font-bold uppercase">
              <th className="py-3 px-4 w-12 text-center">#</th>
              <th className="py-3 px-4 text-right">الإيميل</th>
              <th className="py-3 px-4 text-left">الموقع</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900/60 text-slate-300">
            {filteredLeads.map((lead, index) => (
              <tr key={lead.id || index} className="hover:bg-slate-900/30 transition-colors">
                <td className="py-3.5 px-4 text-center font-mono text-slate-600">{(index + 1).toString().padStart(2, '0')}</td>
                <td className="py-3.5 px-4 text-right font-mono text-blue-400">{lead.email || "—"}</td>
                <td className="py-3.5 px-4 text-left truncate max-w-xs text-slate-400">
                  {lead.website ? (
                    <a href={lead.website} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                      🔗 {lead.website}
                    </a>
                  ) : "—"}
                </td>
              </tr>
            ))}

            {filteredLeads.length === 0 && (
              <tr>
                <td colSpan={3} className="py-10 text-center text-slate-600">
                  لا توجد ليدز متاحة حالياً للعرض أو البحث المكتوب...
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}