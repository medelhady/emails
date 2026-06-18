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

  const [availableCities, setAvailableCities] = useState<CityInfo[]>([]);
  const [availableKeywords, setAvailableKeywords] = useState<KeywordItem[]>([]);
  const [keywordsLoading, setKeywordsLoading] = useState(false);

  const [showMiniList, setShowMiniList] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkKeywordsText, setBulkKeywordsText] = useState("");
  const [isSavingBulk, setIsSavingBulk] = useState(false);

  const miniListRef = useRef<HTMLDivElement>(null);
  const buttonListRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        miniListRef.current && 
        !miniListRef.current.contains(event.target as Node) &&
        buttonListRef.current &&
        !buttonListRef.current.contains(event.target as Node)
      ) {
        setShowMiniList(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    const arr = bulkKeywordsText
      .split("\n")
      .map(k => k.trim())
      .filter(k => k.length > 0);

    if (arr.length === 0) {
      setIsSavingBulk(false);
      return;
    }

    try {
      const rows = arr.map(kw => ({
        state_name: state,
        keyword: kw,
        status: 'ready' as const
      }));
      
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
    onSearch({ keyword, maxResults: 50, state, city });
  };

  const lastSearchedItem = [...availableKeywords]
    .filter(k => k.last_searched_at)
    .sort((a, b) => new Date(b.last_searched_at!).getTime() - new Date(a.last_searched_at!).getTime())[0];

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded-xl border" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 flex flex-col">
            <label className="text-xs font-semibold" style={{ color: "var(--color-text-muted)" }}>الولاية (State)</label>
            <select value={state} onChange={(e) => setState(e.target.value)} className="rounded-lg border px-3 py-2 text-sm outline-none" style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)", color: "var(--color-text)" }}>
              <option value="">Select State...</option>
              {usStates.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>

          <div className="space-y-1.5 flex flex-col">
            <label className="text-xs font-semibold" style={{ color: "var(--color-text-muted)" }}>المقاطعة (County)</label>
            <select value={city} onChange={(e) => setCity(e.target.value)} disabled={!state || availableCities.length === 0} className="rounded-lg border px-3 py-2 text-sm outline-none disabled:opacity-40" style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)", color: "