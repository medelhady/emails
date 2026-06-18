"use client";

import { useState } from "react";

interface LeadItem {
  id: string;
  company_name?: string | null; // اسم الشركة المضافة من نتائج البحث
  email: string | null;
  website: string | null;
  created_at?: string;
}

interface LeadsTableProps {
  leads: LeadItem[];
  isLoading: boolean;
}

export function LeadsTable({ leads, isLoading }: LeadsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // 🛡️ تصفية صارمة وعميقة لمنع تكرار الإيميلات والمواقع الإلكترونية نهائياً
  const uniqueLeads = leads.filter((lead, index, self) => {
    // 1. إذا تطابق الإيميل مع عنصر سابق (تجاهل حالة الأحرف)
    if (lead.email) {
      return self.findIndex(l => l.email?.toLowerCase() === lead.email?.toLowerCase()) === index;
    }
    // 2. إذا لم يكن هناك إيميل وتطابق الموقع مع عنصر سابق
    if (lead.website) {
      return self.findIndex(l => l.website?.toLowerCase() === lead.website?.toLowerCase()) === index;
    }
    return true;
  });

  // تطبيق البحث النصي على القائمة الفريدة المصفاة عبر كافة الحقول
  const filteredLeads = uniqueLeads.filter(lead => 
    lead.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.website?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full bg-slate-950/40 border border-slate-800/80 rounded-2xl p-6 space-y-4 shadow-xl text-slate-200">
      
      {/* الرأس: شريط البحث النصي وعدد النتائج المحدث */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 flex-row-reverse">
        <div className="flex items-center gap-2 flex-row-reverse">
          <span className="text-base font-bold text-white">نتائج البحث — {filteredLeads.length}</span>
        </div>
        <input
          type="text"
          placeholder="بحث سريع..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 outline-none focus:border-blue-500 w-full sm:w-64 text-right"
        />
      </div>

      {/* جدول البيانات المتناسق مع لقطة الشاشة */}
      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-bold">
              <th className="py-3 px-4 text-right">الموقع</th>
              <th className="py-3 px-4 text-center">الإيميل</th>
              <th className="py-3 px-4 text-right">الشركة</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} className="text-center py-8 text-slate-500">جاري تصفية البيانات وجلب النتائج الحصرية...</td>
              </tr>
            ) : filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-8 text-slate-500">لا توجد نتائج مطابقة أو اللائحة فارغة حالياً.</td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-slate-900 hover:bg-slate-900/40 transition-colors">
                  
                  {/* عمود الموقع الإلكتروني */}
                  <td className="py-3.5 px-4 text-blue-400 font-mono truncate max-w-[240px]">
                    {lead.website ? (
                      <a 
                        href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="hover:underline flex items-center gap-1 justify-end"
                      >
                        <span>🔗</span>
                        <span className="truncate">{lead.website}</span>
                      </a>
                    ) : "—"}
                  </td>

                  {/* عمود البريد الإلكتروني (ممركز بالمنتصف) */}
                  <td className="py-3.5 px-4 text-slate-300 font-mono text-center truncate max-w-[200px]">
                    {lead.email ? (
                      <div className="flex items-center gap-1 justify-center">
                        <span>✉️</span>
                        <span>{lead.email}</span>
                      </div>
                    ) : "—"}
                  </td>

                  {/* عمود الشركة (على اليمين) */}
                  <td className="py-3.5 px-4 text-slate-100 font-medium max-w-[220px] truncate text-right">
                    {lead.company_name ? lead.company_name : "—"}
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}