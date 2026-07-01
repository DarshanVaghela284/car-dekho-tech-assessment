"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BODY_TYPES,
  FUEL_TYPES,
  PRIORITIES,
  type BodyType,
  type FuelType,
  type Priority,
  type UserPreferences,
} from "@/lib/types";

const STEPS = ["Budget", "Body & Fuel", "Priorities", "Review"];

const DEFAULT_PREFS: UserPreferences = {
  budgetMin: 8,
  budgetMax: 18,
  bodyTypes: [],
  fuelTypes: [],
  priorities: ["price", "mileage", "safety"],
  seating: 5,
};

export default function FindPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [prefs, setPrefs] = useState<UserPreferences>(DEFAULT_PREFS);
  const [naturalLanguage, setNaturalLanguage] = useState("");
  const [loading, setLoading] = useState(false);
  const [useNL, setUseNL] = useState(false);

  const toggleBody = (type: BodyType) => {
    setPrefs((p) => ({
      ...p,
      bodyTypes: p.bodyTypes.includes(type)
        ? p.bodyTypes.filter((t) => t !== type)
        : [...p.bodyTypes, type],
    }));
  };

  const toggleFuel = (type: FuelType) => {
    setPrefs((p) => ({
      ...p,
      fuelTypes: p.fuelTypes.includes(type)
        ? p.fuelTypes.filter((t) => t !== type)
        : [...p.fuelTypes, type],
    }));
  };

  const togglePriority = (priority: Priority) => {
    setPrefs((p) => ({
      ...p,
      priorities: p.priorities.includes(priority)
        ? p.priorities.filter((t) => t !== priority)
        : [...p.priorities, priority].slice(0, 3),
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferences: prefs,
          naturalLanguage: useNL ? naturalLanguage : undefined,
          limit: 5,
        }),
      });
      const data = await res.json();
      sessionStorage.setItem("carmatch_results", JSON.stringify(data));
      router.push("/results");
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Find your perfect car</h1>
      <p className="mt-2 text-slate-600">
        Step {step + 1} of {STEPS.length} — {STEPS[step]}
      </p>

      <div className="mt-6 flex gap-2">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i <= step ? "bg-brand-600" : "bg-slate-200"
            )}
          />
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-brand-200 bg-brand-50 p-4">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-brand-800">
          <input
            type="checkbox"
            checked={useNL}
            onChange={(e) => setUseNL(e.target.checked)}
            className="rounded border-brand-300"
          />
          <MessageSquare className="h-4 w-4" />
          Also parse a natural language description (AI-native bonus)
        </label>
        {useNL && (
          <textarea
            value={naturalLanguage}
            onChange={(e) => setNaturalLanguage(e.target.value)}
            placeholder='e.g. "Family SUV under 15 lakh with good safety and diesel"'
            className="mt-3 w-full rounded-lg border border-brand-200 bg-white p-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            rows={2}
          />
        )}
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Minimum budget (₹ Lakh)
              </label>
              <input
                type="range"
                min={3}
                max={50}
                value={prefs.budgetMin}
                onChange={(e) =>
                  setPrefs((p) => ({
                    ...p,
                    budgetMin: Math.min(Number(e.target.value), p.budgetMax - 1),
                  }))
                }
                className="mt-2 w-full accent-brand-600"
              />
              <p className="mt-1 text-lg font-semibold">₹{prefs.budgetMin} Lakh</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Maximum budget (₹ Lakh)
              </label>
              <input
                type="range"
                min={5}
                max={55}
                value={prefs.budgetMax}
                onChange={(e) =>
                  setPrefs((p) => ({
                    ...p,
                    budgetMax: Math.max(Number(e.target.value), p.budgetMin + 1),
                  }))
                }
                className="mt-2 w-full accent-brand-600"
              />
              <p className="mt-1 text-lg font-semibold">₹{prefs.budgetMax} Lakh</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Seating needed</label>
              <div className="mt-2 flex gap-3">
                {[5, 7].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPrefs((p) => ({ ...p, seating: n }))}
                    className={cn(
                      "flex-1 rounded-xl border py-3 font-medium transition",
                      prefs.seating === n
                        ? "border-brand-600 bg-brand-50 text-brand-700"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    {n} seats
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-slate-700">Body type (pick any)</p>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {BODY_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleBody(type)}
                    className={cn(
                      "rounded-xl border py-3 font-medium transition",
                      prefs.bodyTypes.includes(type)
                        ? "border-brand-600 bg-brand-50 text-brand-700"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <p className="mt-1 text-xs text-slate-500">Leave empty to include all types</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Fuel type (pick any)</p>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {FUEL_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleFuel(type)}
                    className={cn(
                      "rounded-xl border py-3 font-medium transition",
                      prefs.fuelTypes.includes(type)
                        ? "border-brand-600 bg-brand-50 text-brand-700"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="text-sm font-medium text-slate-700">What matters most? (pick up to 3)</p>
            <div className="mt-4 space-y-3">
              {PRIORITIES.map(({ id, label, description }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => togglePriority(id)}
                  className={cn(
                    "w-full rounded-xl border p-4 text-left transition",
                    prefs.priorities.includes(id)
                      ? "border-brand-600 bg-brand-50"
                      : "border-slate-200 hover:border-slate-300"
                  )}
                >
                  <p className="font-semibold text-slate-900">{label}</p>
                  <p className="text-sm text-slate-500">{description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3 text-sm">
            <SummaryRow label="Budget" value={`₹${prefs.budgetMin} – ₹${prefs.budgetMax} Lakh`} />
            <SummaryRow label="Seating" value={`${prefs.seating} seats`} />
            <SummaryRow
              label="Body types"
              value={prefs.bodyTypes.length ? prefs.bodyTypes.join(", ") : "All"}
            />
            <SummaryRow
              label="Fuel types"
              value={prefs.fuelTypes.length ? prefs.fuelTypes.join(", ") : "All"}
            />
            <SummaryRow
              label="Priorities"
              value={prefs.priorities.map((p) => PRIORITIES.find((x) => x.id === p)?.label).join(", ")}
            />
            {useNL && naturalLanguage && (
              <SummaryRow label="Your words" value={`"${naturalLanguage}"`} />
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            See my matches
          </button>
        )}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-slate-100 py-2">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900">{value}</span>
    </div>
  );
}
