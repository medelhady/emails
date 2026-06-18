"use client";

import { Lead } from "@/types";
import { ExternalLink, Mail, ChevronUp, ChevronDown, Copy, Check } from "lucide-react";
import { useState } from "react";

interface LeadsTableProps {
  leads: Lead[];
}

type SortKey = keyof Lead;
type SortDir = "asc" | "desc";

export function LeadsTable({ leads }: LeadsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [filter, setFilter] = useState("");
  const [copiedColumn, setCopiedColumn] = useState<string | null>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  // دالة نسخ العمود بالكامل
  const handleCopyColumn = (e: React.MouseEvent, key: "email" | "website") => {
    e.stopPropagation(); // منع تفعيل الفرز عند الضغط على زر النسخ

    // استخراج القيم الفريدة وغير الفارغة من الجدول المفلتر والمصفى حالياً
    const valuesToCopy = sorted
      .map((lead) => lead[key])
      .filter((value): value is string => !!value && value.trim() !== "");

    if (valuesToCopy.length === 0) return;

    // دمج العناصر بسطر جديد ونسخها للحافظة
    const textToCopy = valuesToCopy.join("\n");
    navigator.clipboard.writeText(textToCopy);

    // إظهار تلميح "تم النسخ" مؤقتاً لمدة ثانيتين
    setCopiedColumn(key);
    setTimeout(() => setCopiedColumn(null), 2000);
  };

  const filtered = leads.filter((l) =>
    filter === ""
      ? true
      : [l.company_name, l.email, l.city, l.state, l.website].some((v) =>
          v?.toLowerCase().includes(filter.toLowerCase())
        )
  );

  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortKey] ?? "";
    const bv = b[sortKey] ?? "";
    const cmp = av < bv ? -1 : av > bv ? 1 : 0;
    return sortDir === "asc" ? cmp : -cmp;
  });

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (
      sortDir === "asc" ? (
        <ChevronUp size={12} />
      ) : (
        <ChevronDown size={12} />
      )
    ) : (
      <ChevronDown size={12} className="opacity-30" />
    );

  const cols: { key: SortKey; label: string; copyable?: boolean }[] = [
    { key: "company_name", label: "الشركة" },
    { key: "email", label: "الإيميل", copyable: true },
    { key: "website", label: "الموقع", copyable: true },
    { key: "city", label: "المقاطعة" },
    { key: "state", label: "الولاية" },
  ];

  return (
    <div
      style={{
        background: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
      className="rounded-xl border"
    >
      <div
        className="flex items-center justify-between gap-4 p-4 border-b"
        style={{ borderColor: "var(--color-border)" }}
      >
        <h2
          className="font-semibold text-sm uppercase tracking-wider"
          style={{ color: "var(--color-text-muted)" }}
        >
          النتائج — {sorted.length} leads
        </h2>
        <input
          type="text"
          placeholder="فلتر..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            background: "var(--color-surface-2)",
            borderColor: "var(--color-border)",
            color: "var(--color-text)",
          }}
          className="rounded-lg border px-3 py-1.5 text-sm outline-none focus:border-blue-500 transition-colors w-64 placeholder:text-slate-600"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr
              style={{ borderColor: "var(--color-border)" }}
              className="border-b"
            >
              {cols.map((c) => (
                <th
                  key={c.key}
                  onClick={() => handleSort(c.key)}
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer select-none whitespace-nowrap group"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1">
                      {c.label}
                      <SortIcon col={c.key} />
                    </span>

                    {/* زر نسخ العمود يظهر فقط للأعمدة القابلة للنسخ وعند تمرير الفأرة Group Hover */}
                    {c.copyable && (
                      <button
                        onClick={(e) =>
                          handleCopyColumn(e, c.key as "email" | "website")
                        }
                        title={`نسخ كل ${c.label}`}
                        className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      >
                        {copiedColumn === c.key ? (
                          <span className="flex items-center gap-1 text-green-400 text-[10px] font-normal normal-case">
                            <Check size={11} /> تم!
                          </span>
                        ) : (
                          <Copy size={11} />
                        )}
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  لا توجد نتائج بعد.
                </td>
              </tr>
            ) : (
              sorted.map((lead, i) => (
                <tr
                  key={lead.id ?? i}
                  className="border-b transition-colors hover:bg-white/[0.02]"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <td
                    className="px-4 py-3 font-medium max-w-[200px] truncate"
                    style={{ color: "var(--color-text)" }}
                  >
                    {lead.company_name}
                  </td>
                  <td className="px-4 py-3">
                    {lead.email ? (
                      <span className="flex items-center gap-1.5 text-blue-400">
                        <Mail size={12} />
                        <span className="truncate max-w-[200px]">
                          {lead.email}
                        </span>
                      </span>
                    ) : (
                      <span style={{ color: "var(--color-text-muted)" }}>
                        —
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {lead.website ? (
                      <a
                        href={
                          lead.website.startsWith("http")
                            ? lead.website
                            : "https://" + lead.website
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors truncate max-w-[180px]"
                      >
                        <ExternalLink size={11} />
                        {lead.website.replace(/^https?:\/\/(www\.)?/, "")}
                      </a>
                    ) : (
                      <span style={{ color: "var(--color-text-muted)" }}>
                        —
                      </span>
                    )}
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{ color: "var(--color-text-dim)" }}
                  >
                    {lead.city || "—"}
                  </td>
                  <td className="px-4 py-3">
                    {lead.state ? (
                      <span
                        className="px-2 py-0.5 rounded text-xs font-mono font-medium"
                        style={{
                          background: "var(--color-surface-2)",
                          color: "var(--color-text-muted)",
                        }}
                      >
                        {lead.state}
                      </span>
                    ) : (
                      <span style={{ color: "var(--color-text-muted)" }}>
                        —
                      </span>
                    )}
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