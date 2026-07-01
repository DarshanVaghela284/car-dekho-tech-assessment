"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy } from "lucide-react";
import { cn, formatPriceLakh } from "@/lib/utils";
import type { CarRecord } from "@/lib/types";

interface CompareField {
  label: string;
  values: string[];
  winner?: number;
}

interface CompareData {
  cars: CarRecord[];
  fields: CompareField[];
}

export default function ComparePage() {
  const [data, setData] = useState<CompareData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const slRes = await fetch("/api/shortlist");
      const sl = await slRes.json();
      const carIds = sl.items.map((i: { car: { id: string } }) => i.car.id);

      if (carIds.length < 2) {
        setError("Add at least 2 cars to your shortlist to compare.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carIds: carIds.slice(0, 3) }),
      });

      if (!res.ok) {
        const json = await res.json();
        setError(json.error);
      } else {
        setData(await res.json());
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center text-slate-500">Loading comparison...</div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-slate-600">{error}</p>
        <Link href="/shortlist" className="mt-4 inline-block text-brand-600 hover:underline">
          Go to shortlist →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link
        href="/shortlist"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to shortlist
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-slate-900">Side-by-side comparison</h1>
      <p className="mt-2 text-slate-600">
        Green highlights show the best value in each row.
      </p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="p-4 text-left font-medium text-slate-500">Spec</th>
              {data.cars.map((car) => (
                <th key={car.id} className="p-4 text-left">
                  <div className="text-2xl">{car.imageEmoji}</div>
                  <div className="mt-1 font-bold text-slate-900">
                    {car.make} {car.model}
                  </div>
                  <div className="text-xs text-slate-500">{car.variant}</div>
                  <div className="mt-1 font-semibold text-brand-600">
                    {formatPriceLakh(car.priceLakh)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.fields.map((field) => (
              <tr key={field.label} className="border-b border-slate-100">
                <td className="p-4 font-medium text-slate-700">{field.label}</td>
                {field.values.map((value, i) => (
                  <td
                    key={i}
                    className={cn(
                      "p-4",
                      field.winner === i && "bg-green-50 font-semibold text-green-800"
                    )}
                  >
                    <span className="flex items-center gap-1">
                      {field.winner === i && <Trophy className="h-3.5 w-3.5 text-green-600" />}
                      {value}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
