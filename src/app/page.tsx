import Link from "next/link";
import { ArrowRight, Sparkles, Target, ListChecks } from "lucide-react";

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-700 to-brand-600 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggIGQ9Ik0zNiAzNGg0djJoLTR6bS0yMCAyMGg0djJoLTR6bTIwLTIwaDR2MmgtNHptLTIwIDIwaDR2MmgtNHptMjAtMjBoNHYyaC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm backdrop-blur">
            <Sparkles className="h-4 w-4" />
            CarDekho Group — AI Assignment
          </p>
          <h1 className="max-w-2xl text-4xl font-bold leading-tight md:text-5xl">
            From &ldquo;I don&apos;t know what to buy&rdquo; to a confident shortlist
          </h1>
          <p className="mt-5 max-w-xl text-lg text-brand-100">
            Answer a few questions about your budget and priorities. We&apos;ll rank 35+ cars and
            explain why each one fits — then save your favorites to compare.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/find"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-brand-700 shadow-lg transition hover:bg-brand-50"
            >
              Start finding cars
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/shortlist"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              View shortlist
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold text-slate-900">How it works</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {[
            {
              icon: Target,
              title: "Tell us what matters",
              desc: "Budget, body type, fuel preference, and what you care about most — mileage, safety, or value.",
            },
            {
              icon: Sparkles,
              title: "Get ranked matches",
              desc: "Our scoring engine ranks cars and explains why each one fits your needs — no black box.",
            },
            {
              icon: ListChecks,
              title: "Build your shortlist",
              desc: "Save up to 5 favorites and compare them side-by-side on price, mileage, safety, and features.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
