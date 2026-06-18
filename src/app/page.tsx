"use client";

import { useEffect, useState, useCallback } from "react";
import { Mail, Download, AlertCircle, CheckCircle, Radar, Users, Plus, X, ExternalLink, ChevronDown, Building2, Copy, Check } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { SearchForm } from "@/components/SearchForm";
import { supabase } from "@/lib/supabase";
import { Lead, SearchParams, SearchResult } from "@/types";

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchLeads, setSearchLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLeadsDropdown, setShowLeadsDropdown] = useState(false);
  const [leadsFilter, setLeadsFilter] = useState("");
  const [manualEmails, setManualEmails] = useState("");
  const [addingEmails, setAddingEmails] = useState(false);
  const [addResult, setAddResult] = useState<string | null>(null);
  
  // حالة لإظهار إشعار النسخ لكل عمود بشكل منفصل
  const [copiedColumn, setCopiedColumn] = useState<"email" | "website" | null>(null);

  const loadLeads = useCallback(async () => {
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (data) setLeads(data);
  }, []);

  useEffect(() => { loadLeads(); }, [loadLeads]);

  const totalEmails = leads.filter((l) => l.email).length;

  const handleSearch = async (params: SearchParams) => {
    setIsLoading(true);
    setError(null);
    setLastResult(null);
    setSearchLeads([]);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Search failed"); return; }
      setLastResult(data as SearchResult);
      setSearchLeads((data as SearchResult).leads ?? []);
      await loadLeads();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch("/api/export");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leads-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    } finally {
      setExporting(false);
    }
  };

  const handleAddEmails = async () => {
    if (!manualEmails.trim()) return;
    setAddingEmails(true);
    setAddResult(null);
    const emailList = manualEmails
      .split(/[\n,]+/)
      .map((e) => e.trim())
      .filter((e) => e.includes("@"));
    let added = 0;
    let skipped = 0;
    for (const email of emailList) {
      const { data: existing } = await supabase.from("leads").select("id").eq("email", email).limit(1);
      if (existing && existing.length > 0) { skipped++; continue; }
      const { error } = await supabase.from("leads").insert([{
        company_name: "Manual Entry",
        website: "",
        email,
      }]);
      if (!error) added++;
    }
    setAddResult(`✅ تم إضافة ${added} — تخطي ${skipped} مكرر`);
    setManualEmails("");
    await loadLeads();
    setAddingEmails(false);
  };

  // دالة نسخ العمود بالكامل مفصولاً بسطور جديدة
  const copyColumnData = (type: "email" | "website") => {
    const activeLeads = searchLeads;
    if (activeLeads.length === 0) return;

    const itemsToCopy = activeLeads
      .map((lead) => lead[type])
      .filter((val): val is string => !!val && val.trim() !== "");

    if (itemsToCopy.length === 0) return;

    const finalClipboardText = itemsToCopy.join("\n");
    navigator.clipboard.writeText(finalClipboardText);

    setCopiedColumn(type);
    setTimeout(() => setCopiedColumn(null), 2000);
  };

  const filteredLeads = leads.filter((l) =>
    leadsFilter === ""
      ? true
      : [l.email, l.website].some((v) => v?.toLowerCase().includes(leadsFilter.toLowerCase()))
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <header className="sticky top-0 z-10 border-b backdrop-blur-sm"
        style={{ background: "rgba(10,15,30,0.85)", borderColor: "var(--color-border)" }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Radar size={20} className="text-blue-400" />
            </div>
            <div>
              <h1 className="text-base font-bold" style={{ color: "var(--color-text)" }}>LeadRadar</h1>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Property Management Lead Generator</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Leads Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowLeadsDropdown((v) => !v)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all cursor-pointer"
                style={{ background: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-text-dim)" }}>
                <Users size={14} />
                Leads
                <span className="px-1.5 py-0.5 rounded text-xs font-mono"
                  style={{ background: "var(--color-surface-2)", color: "var(--color-text-muted)" }}>
                  {leads.length}
                </span>
                <ChevronDown size={12} className={`transition-transform ${showLeadsDropdown ? "rotate-180" : ""}`} />
              </button>

              {showLeadsDropdown && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setShowLeadsDropdown(false)} />
                  <div className="absolute right-0 top-full mt-2 z-30 w-[500px] rounded-xl border shadow-2xl overflow-hidden"
                    style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
                    <div className="flex items-center justify-between px-4 py-3 border-b"
                      style={{ borderColor: "var(--color-border)" }}>
                      <span className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                        Leads — {filteredLeads.length}
                      </span>
                      <input
                        type="text"
                        placeholder="بحث..."
                        value={leadsFilter}
                        onChange={(e) => setLeadsFilter(e.target.value)}
                        className="rounded-lg border px-3 py-1 text-xs outline-none focus:border-blue-500 w-40"
                        style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
                      />
                    </div>
                    <div className="overflow-y-auto max-h-[420px]">
                      <table className="w-full text-xs">
                        <thead className="sticky top-0" style={{ background: "var(--color-surface)" }}>
                          <tr className="border-b" style={{ borderColor: "var(--color-border)" }}>
                            <th className="px-4 py-2.5 text-left font-medium uppercase tracking-wider w-1/2"
                              style={{ color: "var(--color-text-muted)" }}>الإيميل</th>
                            <th className="px-4 py-2.5 text-left font-medium uppercase tracking-wider w-1/2"
                              style={{ color: "var(--color-text-muted)" }}>الموقع</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredLeads.length === 0 ? (
                            <tr>
                              <td colSpan={2} className="px-4 py-8 text-center text-xs"
                                style={{ color: "var(--color-text-muted)" }}>لا توجد نتائج</td>
                            </tr>
                          ) : (
                            filteredLeads.map((lead, i) => (
                              <tr key={lead.id ?? i}
                                className="border-b hover:bg-white/[0.03] transition-colors"
                                style={{ borderColor: "var(--color-border)" }}>
                                <td className="px-4 py-2.5">
                                  {lead.email ? (
                                    <span className="flex items-center gap-1.5 text-blue-400">
                                      <Mail size={11} className="shrink-0" />
                                      <span className="truncate max-w-[190px]">{lead.email}</span>
                                    </span>
                                  ) : (
                                    <span style={{ color: "var(--color-text-muted)" }}>—</span>
                                  )}
                                </td>
                                <td className="px-4 py-2.5">
                                  {lead.website ? (
                                    <a href={lead.website.startsWith("http") ? lead.website : "https://" + lead.website}
                                      target="_blank" rel="noopener noreferrer"
                                      className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors truncate max-w-[190px]">
                                      <ExternalLink size={10} className="shrink-0" />
                                      {lead.website.replace(/^https?:\/\/(www\.)?/, "")}
                                    </a>
                                  ) : (
                                    <span style={{ color: "var(--color-text-muted)" }}>—</span>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Add Emails */}
            <button onClick={() => { setShowModal(true); setAddResult(null); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all cursor-pointer"
              style={{ background: "var(--color-surface)", borderColor: "var(--color-accent)", color: "var(--color-accent)" }}>
              <Plus size={14} />Add Emails
            </button>

            {/* Export CSV */}
            <button onClick={handleExport} disabled={exporting || leads.length === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              style={{ background: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-text-dim)" }}>
              <Download size={14} />{exporting ? "Exporting…" : "Export CSV"}
            </button>
          </div>
        </div>
      </header>

      {/* Add Emails Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="w-full max-w-md rounded-xl border p-6 space-y-4"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold" style={{ color: "var(--color-text)" }}>Add Emails</h2>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                  {leads.length} leads مجموع
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="cursor-pointer" style={{ color: "var(--color-text-muted)" }}>
                <X size={18} />
              </button>
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: "var(--color-text-muted)" }}>
                الإيميلات <span className="opacity-60">(واحد في كل سطر أو مفصولة بفاصلة)</span>
              </label>
              <textarea value={manualEmails} onChange={(e) => setManualEmails(e.target.value)}
                placeholder={"john@company.com\ninfo@realty.com\ncontact@pm.com"} rows={8}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500 resize-none font-mono"
                style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)", color: "var(--color-text)" }} />
            </div>
            {addResult && <p className="text-sm text-emerald-400">{addResult}</p>}
            <div className="flex gap-3 pt-1">
              <button onClick={handleAddEmails} disabled={addingEmails || !manualEmails.trim()}
                className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 cursor-pointer"
                style={{ background: "var(--color-accent)", color: "#fff" }}>
                {addingEmails ? "جاري الإضافة..." : "إضافة"}
              </button>
              <button onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg text-sm border cursor-pointer"
                style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}>
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard label="Total Leads" value={leads.length} icon={<Users size={20} />} color="blue" description="Rows saved in Supabase" />
          <StatCard label="Emails Found" value={totalEmails} icon={<Mail size={20} />} color="green" description="Verified email addresses" />
        </div>

        <SearchForm onSearch={handleSearch} isLoading={isLoading} />

        {error && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <div><p className="font-medium">Error</p><p className="opacity-80">{error}</p></div>
          </div>
        )}

        {lastResult && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400">
            <CheckCircle size={16} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Search complete</p>
              <p className="opacity-80">Found {lastResult.stats.companiesFound} companies → {lastResult.stats.emailsFound} emails, {lastResult.stats.skippedDuplicates} duplicates skipped.</p>
            </div>
          </div>
        )}

        {/* Search Results Table */}
        {searchLeads.length > 0 && (
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--color-border)" }}>
              <div className="flex items-center gap-2">
                <Building2 size={14} className="text-blue-400" />
                <span className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                  نتائج البحث — {searchLeads.length}
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: "var(--color-border)" }}>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                      الشركة
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                      <div className="flex items-center gap-2">
                        <span>الإيميل</span>
                        {/* زر نسخ عمود الإيميلات المدمج */}
                        <button 
                          onClick={() => copyColumnData("email")}
                          className="px-2 py-0.5 text-[10px] font-normal normal-case rounded bg-white/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                        >
                          {copiedColumn === "email" ? (
                            <>
                              <Check size={10} className="text-emerald-400" />
                              <span className="text-emerald-400">تم النسخ!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={10} />
                              <span>نسخ العمود</span>
                            </>
                          )}
                        </button>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                      <div className="flex items-center gap-2">
                        <span>الموقع</span>
                        {/* زر نسخ عمود المواقع المدمج */}
                        <button 
                          onClick={() => copyColumnData("website")}
                          className="px-2 py-0.5 text-[10px] font-normal normal-case rounded bg-white/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                        >
                          {copiedColumn === "website" ? (
                            <>
                              <Check size={10} className="text-emerald-400" />
                              <span className="text-emerald-400">تم النسخ!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={10} />
                              <span>نسخ العمود</span>
                            </>
                          )}
                        </button>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {searchLeads.map((lead, i) => (
                    <tr key={lead.id ?? i} className="border-b hover:bg-white/[0.02] transition-colors" style={{ borderColor: "var(--color-border)" }}>
                      <td className="px-4 py-3 font-medium max-w-[200px] truncate" style={{ color: "var(--color-text)" }}>
                        {lead.company_name}
                      </td>
                      <td className="px-4 py-3">
                        {lead.email ? (
                          <span className="flex items-center gap-1.5 text-blue-400">
                            <Mail size={12} />
                            <span className="truncate max-w-[200px]">{lead.email}</span>
                          </span>
                        ) : <span style={{ color: "var(--color-text-muted)" }}>—</span>}
                      </td>
                      <td className="px-4 py-3">
                        {lead.website ? (
                          <a href={lead.website.startsWith("http") ? lead.website : "https://" + lead.website}
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors truncate max-w-[180px]">
                            <ExternalLink size={11} />
                            {lead.website.replace(/^https?:\/\/(www\.)?/, "")}
                          </a>
                        ) : <span style={{ color: "var(--color-text-muted)" }}>—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}