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

const STEPS = ["Budget", "Body and fuel", "Priorities", "Review"];

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
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-brand-600">Buyer brief</p>
          <h1 className="mt-1 text-2xl font-bold text-ink-900">Find a confident shortlist</h1>
        </div>
        <p className="text-sm text-stone-500">
          Step {step + 1} of {STEPS.length}: {STEPS[step]}
        </p>
      </div>

      <div className="mt-6 flex gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="h-1.5 flex-1 rounded-full bg-stone-200">
            <div
              className={cn(
                "h-full rounded-full bg-brand-600 transition-all",
                i <= step ? "w-full" : "w-0"
              )}
            />
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-lg border border-brand-200 bg-brand-50 p-4">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-brand-900">
          <input
            type="checkbox"
            checked={useNL}
            onChange={(e) => setUseNL(e.target.checked)}
            className="h-4 w-4 rounded border-brand-300 accent-brand-600"
          />
          <MessageSquare className="h-4 w-4" />
          Parse a plain-English buying note
        </label>
        {useNL && (
          <textarea
            value={naturalLanguage}
            onChange={(e) => setNaturalLanguage(e.target.value)}
            placeholder='Example: "Family SUV under 15 lakh with good safety and diesel"'
            className="mt-3 w-full rounded-lg border border-brand-200 bg-white p-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            rows={2}
          />
        )}
      </div>

      <div className="mt-8 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        {step === 0 && (
          <div className="space-y-6">
            <RangeField
              label="Minimum budget"
              value={prefs.budgetMin}
              min={3}
              max={50}
              onChange={(value) =>
                setPrefs((p) => ({ ...p, budgetMin: Math.min(value, p.budgetMax - 1) }))
              }
            />
            <RangeField
              label="Maximum budget"
              value={prefs.budgetMax}
              min={5}
              max={55}
              onChange={(value) =>
                setPrefs((p) => ({ ...p, budgetMax: Math.max(value, p.budgetMin + 1) }))
              }
            />
            <div>
              <label className="block text-sm font-medium text-stone-700">Seating needed</label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {[5, 7].map((n) => (
                  <ChoiceButton
                    key={n}
                    active={prefs.seating === n}
                    onClick={() => setPrefs((p) => ({ ...p, seating: n }))}
                  >
                    {n} seats
                  </ChoiceButton>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <OptionGroup title="Body type" note="Leave empty to include all types">
              {BODY_TYPES.map((type) => (
                <ChoiceButton key={type} active={prefs.bodyTypes.includes(type)} onClick={() => toggleBody(type)}>
                  {type}
                </ChoiceButton>
              ))}
            </OptionGroup>
            <OptionGroup title="Fuel type">
              {FUEL_TYPES.map((type) => (
                <ChoiceButton key={type} active={prefs.fuelTypes.includes(type)} onClick={() => toggleFuel(type)}>
                  {type}
                </ChoiceButton>
              ))}
            </OptionGroup>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="text-sm font-medium text-stone-700">What should the ranking optimize?</p>
            <div className="mt-4 space-y-3">
              {PRIORITIES.map(({ id, label, description }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => togglePriority(id)}
                  className={cn(
                    "w-full rounded-lg border p-4 text-left transition",
                    prefs.priorities.includes(id)
                      ? "border-brand-600 bg-brand-50"
                      : "border-stone-200 hover:border-stone-300"
                  )}
                >
                  <p className="font-semibold text-ink-900">{label}</p>
                  <p className="text-sm text-stone-500">{description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3 text-sm">
            <SummaryRow label="Budget" value={`Rs. ${prefs.budgetMin} - Rs. ${prefs.budgetMax} lakh`} />
            <SummaryRow label="Seating" value={`${prefs.seating} seats`} />
            <SummaryRow label="Body types" value={prefs.bodyTypes.length ? prefs.bodyTypes.join(", ") : "All"} />
            <SummaryRow label="Fuel types" value={prefs.fuelTypes.length ? prefs.fuelTypes.join(", ") : "All"} />
            <SummaryRow
              label="Priorities"
              value={prefs.priorities.map((p) => PRIORITIES.find((x) => x.id === p)?.label).join(", ")}
            />
            {useNL && naturalLanguage && <SummaryRow label="Buyer note" value={`"${naturalLanguage}"`} />}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-stone-200 px-5 text-sm font-medium text-stone-700 disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            See my matches
          </button>
        )}
      </div>
    </div>
  );
}

function RangeField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="flex items-center justify-between text-sm font-medium text-stone-700">
        {label}
        <span className="font-bold text-ink-900">Rs. {value} lakh</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-brand-600"
      />
    </div>
  );
}

function OptionGroup({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-medium text-stone-700">{title}</p>
      <div className="mt-2 grid grid-cols-2 gap-3">{children}</div>
      {note && <p className="mt-2 text-xs text-stone-500">{note}</p>}
    </div>
  );
}

function ChoiceButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-12 rounded-lg border px-3 py-2 font-medium transition",
        active ? "border-brand-600 bg-brand-50 text-brand-700" : "border-stone-200 hover:border-stone-300"
      )}
    >
      {children}
    </button>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-stone-100 py-2">
      <span className="text-stone-500">{label}</span>
      <span className="text-right font-medium text-ink-900">{value}</span>
    </div>
  );
}
