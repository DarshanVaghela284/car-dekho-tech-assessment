"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, GitCompare } from "lucide-react";
import { CarCard } from "@/components/CarCard";
import type { ScoredCar, UserPreferences } from "@/lib/types";

interface ResultsData {
  preferences: UserPreferences;
  totalMatches: number;
  recommendations: ScoredCar[];
}

export default function ResultsPage() {
  const [data, setData] = useState<ResultsData | null>(null);
  const [shortlistIds, setShortlistIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("carmatch_results");
    if (stored) {
      setData(JSON.parse(stored));
    }
    fetchShortlist();
  }, []);

  const fetchShortlist = async () => {
    const res = await fetch("/api/shortlist");
    const json = await res.json();
    setShortlistIds(new Set(json.items.map((i: { car: { id: string } }) => i.car.id)));
  };

  const addToShortlist = async (carId: string) => {
    const res = await fetch("/api/shortlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ carId }),
    });
    const json = await res.json();
    if (res.ok) {
      setShortlistIds(new Set(json.items.map((i: { car: { id: string } }) => i.car.id)));
      setToast("Added to shortlist!");
      setTimeout(() => setToast(null), 2000);
    } else {
      setToast(json.error ?? "Could not add");
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (!data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-slate-600">No results yet.</p>
        <Link href="/find" className="mt-4 inline-block text-brand-600 hover:underline">
          Start the car finder →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}

      <Link
        href="/find"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Refine preferences
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-slate-900">Your top matches</h1>
      <p className="mt-2 text-slate-600">
        Found {data.totalMatches} cars in your range. Here are the best {data.recommendations.length}{" "}
        for your priorities.
      </p>

      <div className="mt-6 flex gap-3">
        <Link
          href="/shortlist"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
        >
          View shortlist ({shortlistIds.size})
        </Link>
        {shortlistIds.size >= 2 && (
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            <GitCompare className="h-4 w-4" />
            Compare saved cars
          </Link>
        )}
      </div>

      <div className="mt-8 space-y-5">
        {data.recommendations.map((car, i) => (
          <CarCard
            key={car.id}
            car={car}
            rank={i + 1}
            onAddToShortlist={addToShortlist}
            isInShortlist={shortlistIds.has(car.id)}
          />
        ))}
      </div>
    </div>
  );
}
