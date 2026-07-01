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
    if (stored) setData(JSON.parse(stored));
    fetchShortlist();
  }, []);

  const fetchShortlist = async () => {
    const res = await fetch("/api/shortlist");
    const json = await res.json();
    setShortlistIds(new Set(json.items.map((item: { car: { id: string } }) => item.car.id)));
  };

  const addToShortlist = async (carId: string) => {
    const res = await fetch("/api/shortlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ carId }),
    });
    const json = await res.json();
    if (res.ok) {
      setShortlistIds(new Set(json.items.map((item: { car: { id: string } }) => item.car.id)));
      showToast("Saved to shortlist");
    } else {
      showToast(json.error ?? "Could not save");
    }
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  if (!data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-stone-600">No recommendations yet.</p>
        <Link href="/find" className="mt-4 inline-block text-brand-600 hover:underline">
          Start the car finder
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-ink-900 px-5 py-3 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}

      <Link href="/find" className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-brand-600">
        <ArrowLeft className="h-4 w-4" />
        Refine preferences
      </Link>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Your top matches</h1>
          <p className="mt-2 text-stone-600">
            Found {data.totalMatches} cars close to the brief. Showing the best {data.recommendations.length}.
          </p>
        </div>
        <div className="rounded-lg bg-white px-4 py-3 text-sm shadow-sm ring-1 ring-stone-200">
          <span className="font-semibold text-ink-900">Budget:</span> Rs. {data.preferences.budgetMin}-
          {data.preferences.budgetMax} lakh
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/shortlist"
          className="inline-flex min-h-10 items-center rounded-lg border border-stone-200 bg-white px-4 text-sm font-medium hover:bg-stone-50"
        >
          View shortlist ({shortlistIds.size})
        </Link>
        {shortlistIds.size >= 2 && (
          <Link
            href="/compare"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700"
          >
            <GitCompare className="h-4 w-4" />
            Compare saved cars
          </Link>
        )}
      </div>

      <div className="mt-8 space-y-5">
        {data.recommendations.map((car, index) => (
          <CarCard
            key={car.id}
            car={car}
            rank={index + 1}
            onAddToShortlist={addToShortlist}
            isInShortlist={shortlistIds.has(car.id)}
          />
        ))}
      </div>
    </div>
  );
}
