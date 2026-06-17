"use client";

import { useEffect, useState, useCallback } from "react";
import { Mail, Download, AlertCircle, CheckCircle, Radar, Users, Plus, X, Building2 } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { SearchForm } from "@/components/SearchForm";
import { LeadsTable } from "@/components/LeadsTable";
import { supabase } from "@/lib/supabase";
import { Lead, SearchParams, SearchResult } from "@/types";

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [manualEmails, setManualEmails] = useState("");
  const [addingEmails, setAddingEmails] = useState(false);
  const [addResult, setAddResult] = useState<string | null>(null);

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
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Search failed"); return; }
      setLastResult(data as SearchResult);
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
        city: "",
        state: "",
      }]);
      if (!error) added++;
    }
    setAddResult(`✅ تم إضافة ${added} — تخطي ${skipped} مكرر`);
    setManualEmails("");
    await loadLeads();
    setAddingEmails(false);
  };

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
            <button onClick={() => { setShowModal(true); setAddResult(null); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all cursor-pointer"
              style={{ background: "var(--color-surface)", borderColor: "var(--color-accent)", color: "var(--color-accent)" }}>
              <Plus size={14} />Add Emails
            </button>
            <button onClick={handleExport} disabled={exporting || leads.length === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              style={{ background: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-text-dim)" }}>
              <Download size={14} />{exporting ? "Exporting…" : "Export CSV"}
            </button>
          </div>
        </div>
      </header>

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
        <LeadsTable leads={leads} />
      </main>
    </div>
  );
}