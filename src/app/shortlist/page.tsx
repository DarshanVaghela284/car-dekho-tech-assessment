"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GitCompare, Search, Trash2 } from "lucide-react";
import { CarCard } from "@/components/CarCard";
import type { CarRecord } from "@/lib/types";

interface ShortlistItem {
  id: string;
  car: CarRecord;
}

export default function ShortlistPage() {
  const [items, setItems] = useState<ShortlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchShortlist = async () => {
    const res = await fetch("/api/shortlist");
    const json = await res.json();
    setItems(json.items);
    setLoading(false);
  };

  useEffect(() => {
    fetchShortlist();
  }, []);

  const removeItem = async (carId: string) => {
    await fetch("/api/shortlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ carId }),
    });
    fetchShortlist();
  };

  const clearAll = async () => {
    await fetch("/api/shortlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    fetchShortlist();
  };

  if (loading) {
    return <div className="mx-auto max-w-3xl px-4 py-20 text-center text-stone-500">Loading shortlist...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Your shortlist</h1>
          <p className="mt-1 text-stone-600">{items.length}/5 cars saved. Compare the strongest 2 or 3.</p>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex min-h-10 items-center gap-1 rounded-lg px-2 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mt-16 rounded-lg border border-stone-200 bg-white p-10 text-center shadow-sm">
          <p className="text-stone-500">No cars saved yet.</p>
          <Link
            href="/find"
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            <Search className="h-4 w-4" />
            Find cars
          </Link>
        </div>
      ) : (
        <>
          {items.length >= 2 && (
            <Link
              href="/compare"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              <GitCompare className="h-4 w-4" />
              Compare {Math.min(items.length, 3)} cars
            </Link>
          )}
          <div className="mt-8 space-y-5">
            {items.map(({ id, car }) => (
              <div key={id} className="relative">
                <CarCard car={{ ...car, matchScore: 0, reasons: [] }} showReasons={false} />
                <button
                  type="button"
                  onClick={() => removeItem(car.id)}
                  className="absolute right-5 top-5 rounded-lg bg-white/90 p-2 text-stone-400 shadow hover:text-red-500"
                  aria-label="Remove from shortlist"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
