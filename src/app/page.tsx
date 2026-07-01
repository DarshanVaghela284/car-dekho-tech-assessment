import Link from "next/link";
import { ArrowRight, BarChart3, CheckCircle2, IndianRupee, ShieldCheck } from "lucide-react";

const snapshot = [
  { label: "Budget", value: "Rs. 8-18 lakh", icon: IndianRupee },
  { label: "Use case", value: "Family + city", icon: CheckCircle2 },
  { label: "Priority", value: "Safety first", icon: ShieldCheck },
];

const sampleMatches = [
  { name: "Tata Nexon EV", score: 91, note: "safe, efficient, city-friendly" },
  { name: "Hyundai Creta", score: 86, note: "feature-rich diesel SUV" },
  { name: "Toyota Hyryder", score: 83, note: "hybrid running cost edge" },
];

export default function HomePage() {
  return (
    <div>
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1fr_0.9fr] md:items-center md:py-16">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700">
              <BarChart3 className="h-4 w-4" />
              CarDekho Group AI assignment
            </p>
            <h1 className="max-w-2xl text-4xl font-bold leading-tight text-ink-900 md:text-5xl">
              CarMatch
            </h1>
            <p className="mt-5 max-w-xl text-lg text-stone-600">
              A guided shortlist builder for buyers who know their budget, but not the right car.
              It ranks Indian-market options, explains the tradeoffs, and lets the buyer compare
              finalists without opening ten tabs.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/find"
                className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-brand-600 px-5 font-semibold text-white shadow-sm transition hover:bg-brand-700"
              >
                Start matching
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/shortlist"
                className="inline-flex min-h-12 items-center rounded-lg border border-stone-300 px-5 font-semibold text-stone-700 transition hover:bg-stone-50"
              >
                View shortlist
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-stone-200 bg-road-50 p-4 shadow-sm">
            <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
              {snapshot.map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-lg border border-stone-200 bg-white p-4">
                  <Icon className="h-5 w-5 text-brand-600" />
                  <p className="mt-3 text-xs font-semibold uppercase text-stone-500">{label}</p>
                  <p className="mt-1 font-bold text-ink-900">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-lg border border-stone-200 bg-white">
              <div className="border-b border-stone-100 px-4 py-3">
                <p className="text-sm font-semibold text-ink-900">Example ranked output</p>
              </div>
              <div className="divide-y divide-stone-100">
                {sampleMatches.map((match, index) => (
                  <div key={match.name} className="flex items-center justify-between gap-4 px-4 py-3">
                    <div>
                      <p className="text-sm font-bold text-ink-900">
                        #{index + 1} {match.name}
                      </p>
                      <p className="text-xs text-stone-500">{match.note}</p>
                    </div>
                    <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-sm font-bold text-emerald-800">
                      {match.score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Guided input", "Budget, fuel, body type, seating, and priorities stay explicit."],
            ["Explainable ranking", "Every recommendation carries buyer-facing reasons."],
            ["Shortlist compare", "Save up to five cars and compare two or three side-by-side."],
          ].map(([title, desc]) => (
            <div key={title} className="border-l-4 border-brand-600 bg-white p-5 shadow-sm">
              <h2 className="font-bold text-ink-900">{title}</h2>
              <p className="mt-2 text-sm text-stone-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
