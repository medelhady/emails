"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface LeadItem {
  id: string;
  company_name?: string | null;
  email: string | null;
  website: string | null;
  created_at?: string;
}

interface ValidatedEmail {
  id: number;
  email: string;
  created_at: string;
}

interface LeadsTableProps {
  leads: LeadItem[];
  isLoading: boolean;
}

export function LeadsTable({ leads, isLoading }: LeadsTableProps) {
  // --- حالات جدول البحث الرئيسي ---
  const [searchTerm, setSearchTerm] = useState("");

  // --- حالات جدول الإيميلات المعتمدة (اليدوي) ---
  const [validatedEmails, setValidatedEmails] = useState<ValidatedEmail[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [isValidatedLoading, setIsValidatedLoading] = useState(true);
  const [isInserting, setIsInserting] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // 1. جلب بيانات الإيميلات المعتمدة من سوبابيز
  const fetchValidatedEmails = async () => {
    setIsValidatedLoading(true);
    try {
      const { data, error } = await supabase
        .from("validated_emails")
        .select("*")
        .order("id", { ascending: true });
      if (error) throw error;
      if (data) setValidatedEmails(data);
    } catch (err) {
      console.error("Error fetching validated emails:", err);
    } finally {
      setIsValidatedLoading(false);
    }
  };

  useEffect(() => {
    fetchValidatedEmails();
  }, []);

  // 2. دالة الإضافة اليدوية الخاصة بك فقط
  const handleAddEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    setIsInserting(true);
    try {
      const { error } = await supabase
        .from("validated_emails")
        .insert([{ email: newEmail.trim().toLowerCase(), status: "valid" }]);

      if (error) {
        if (error.code === "23505") {
          alert("هذا الإيميل مضاف مسبقاً في القائمة!");
        } else {
          throw error;
        }
      } else {
        setNewEmail("");
        await fetchValidatedEmails();
      }
    } catch (err) {
      console.error("Error inserting email:", err);
    } finally {
      setIsInserting(false);
    }
  };

  // 3. نسخ بريد فردي
  const handleCopyEmail = (email: string, index: number) => {
    navigator.clipboard.writeText(email);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // 4. نسخ كل الإيميلات المعتمدة دفعة واحدة
  const handleCopyAllValidated = () => {
    if (validatedEmails.length === 0) return;
    const allText = validatedEmails.map(e => e.email).join("\n");
    navigator.clipboard.writeText(allText);
    alert(`🎯 تم نسخ جميع الإيميلات المعتمدة (${validatedEmails.length} إيميل) إلى الحافظة!`);
  };

  // 5. تصفية جدول البحث الرئيسي لمنع التكرار فوراً
  const uniqueLeads = leads.filter((lead, index, self) => {
    if (lead.email) {
      return self.findIndex(l => l.email?.toLowerCase() === lead.email?.toLowerCase()) === index;
    }
    if (lead.website) {
      return self.findIndex(l => l.website?.toLowerCase() === lead.website?.toLowerCase()) === index;
    }
    return true;
  });

  const filteredLeads = uniqueLeads.filter(lead => 
    lead.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.website?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full space-y-10 text-slate-200">
      
      {/* 🟢 القسم الأول: جدول نتائج البحث الأساسي (مصفى بدون تكرار) */}
      <div className="w-full bg-slate-950/40 border border-slate-800/80 rounded-2xl p-6 space-y-4 shadow-xl">
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

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold">
                <th className="py-3 px-4 text-right">الموقع</th>
                <th className="py-3 px-4 text-center">البريد الإلكتروني</th>
                <th className="py-3 px-4 text-right">الشركة</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-slate-500">جاري تصفية البيانات وعرض النتائج الحصرية...</td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-slate-500">لا توجد نتائج مطابقة حالياً.</td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-slate-900 hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4 text-blue-400 font-mono truncate max-w-[240px]">
                      {lead.website ? (
                        <a href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1 justify-end">
                          <span>🔗</span> <span className="truncate">{lead.website}</span>
                        </a>
                      ) : "—"}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-mono text-center truncate max-w-[200px]">
                      {lead.email ? lead.email : "—"}
                    </td>
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

      <hr className="border-slate-800/60" />

      {/* 🔵 القسم الثاني: واجهة الإيميلات المعتمدة (إضافة يدوية منك فقط في منتصف الصفحة) */}
      <div className="w-full bg-slate-950/40 border border-emerald-500/20 rounded-2xl p-6 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4 flex-row-reverse">
          <div className="flex items-center gap-3 flex-row-reverse">
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-md text-xs font-bold">✓ عزل يدوي</span>
            <h3 className="text-base font-bold text-white">قائمة الإيميلات المعتمدة من قبلك ({validatedEmails.length})</h3>
          </div>
          <div className="flex gap-2 flex-row-reverse">
            <button 
              onClick={handleCopyAllValidated}
              disabled={validatedEmails.length === 0}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-all active:scale-95 disabled:opacity-40 cursor-pointer shadow-lg flex items-center gap-1"
            >
              <span>📋</span> <span>نسخ الكل (All)</span>
            </button>
            <button onClick={fetchValidatedEmails} className="p-2 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 text-xs transition-colors">🔄 تحديث</button>
          </div>
        </div>

        {/* حقل الإدخال اليدوي الخاص بك */}
        <form onSubmit={handleAddEmail} className="flex gap-2 w-full flex-row-reverse max-w-md mx-auto bg-slate-900/60 p-2 rounded-xl border border-slate-800">
          <input 
            type="email" 
            required
            placeholder="أدخل الإيميل لحفظه يدوياً في سوبابيز..." 
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="flex-1 bg-transparent px-3 py-2 text-xs text-slate-100 outline-none text-right"
          />
          <button 
            type="submit"
            disabled={isInserting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-lg text-xs font-bold transition-all whitespace-nowrap"
          >
            {isInserting ? "جاري الحفظ..." : "إضافة للقائمة"}
          </button>
        </form>

        {/* الجدول المرقم مع خاصية نسخ من وإلى */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold">
                <th className="py-3 px-4 text-center">الإجراء</th>
                <th className="py-3 px-4 text-center">البريد الإلكتروني المعتمد</th>
                <th className="py-3 px-4 text-right w-16">#</th>
              </tr>
            </thead>
            <tbody>
              {isValidatedLoading ? (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-slate-500">جاري جلب القائمة اليدوية...</td>
                </tr>
              ) : validatedEmails.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-slate-500">القائمة فارغة، قم بإضافة أول إيميل من الحقل أعلاه.</td>
                </tr>
              ) : (
                validatedEmails.map((item, index) => (
                  <tr key={item.id} className="border-b border-slate-900 hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleCopyEmail(item.email, index)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                          copiedIndex === index 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                        }`}
                      >
                        {copiedIndex === index ? "✓ تم النسخ" : "نسخ البريد"}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center text-slate-200 font-mono font-medium tracking-wide">
                      {item.email}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-500 font-mono bg-slate-900/20 border-l border-slate-900">
                      {(index + 1).toString().padStart(2, '0')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}