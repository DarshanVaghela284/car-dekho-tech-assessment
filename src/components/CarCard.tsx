"use client";

import { Car, Fuel, Heart, Shield, Star } from "lucide-react";
import { cn, formatMileage, formatPriceLakh } from "@/lib/utils";
import type { CarRecord, ScoredCar } from "@/lib/types";

interface CarCardProps {
  car: ScoredCar;
  rank?: number;
  onAddToShortlist?: (carId: string) => void;
  isInShortlist?: boolean;
  showReasons?: boolean;
}

export function VehicleBadge({ car }: { car: CarRecord }) {
  const label = car.fuelType === "Electric" ? "EV" : car.bodyType.slice(0, 3).toUpperCase();

  return (
    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-stone-100 text-ink-900">
      <Car className="h-5 w-5 text-brand-600" />
      <span className="mt-0.5 text-[10px] font-bold leading-none">{label}</span>
    </div>
  );
}

export function CarCard({
  car,
  rank,
  onAddToShortlist,
  isInShortlist,
  showReasons = true,
}: CarCardProps) {
  return (
    <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm transition hover:border-stone-300 hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <VehicleBadge car={car} />
          <div>
            {rank !== undefined && (
              <span className="text-xs font-semibold uppercase text-brand-600">#{rank} match</span>
            )}
            <h3 className="text-lg font-bold text-ink-900">
              {car.make} {car.model}
            </h3>
            <p className="text-sm text-stone-500">{car.variant}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {[car.bodyType, car.fuelType, car.transmission].map((item) => (
                <span
                  key={item}
                  className="rounded-md bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 sm:block sm:text-right">
          <div
            className={cn(
              "inline-flex items-center rounded-md px-3 py-1 text-sm font-bold",
              car.matchScore >= 80
                ? "bg-emerald-100 text-emerald-800"
                : car.matchScore >= 60
                  ? "bg-brand-100 text-brand-700"
                  : "bg-amber-100 text-amber-800"
            )}
          >
            {car.matchScore}% match
          </div>
          <p className="text-lg font-bold text-ink-900 sm:mt-2">{formatPriceLakh(car.priceLakh)}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 border-t border-stone-100 pt-4 sm:grid-cols-3">
        <Spec icon={Fuel} value={formatMileage(car.mileageKmpl, car.fuelType)} />
        <Spec icon={Shield} value={`${car.safetyRating}/5 safety`} />
        <Spec icon={Star} value={`${car.reviewScore}/5 owners`} />
      </div>

      {showReasons && car.reasons.length > 0 && (
        <div className="mt-4 rounded-lg bg-brand-50 p-4">
          <p className="mb-2 text-xs font-semibold uppercase text-brand-700">Why it ranks here</p>
          <ul className="space-y-1">
            {car.reasons.map((reason) => (
              <li key={reason} className="flex items-start gap-2 text-sm text-brand-900">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {onAddToShortlist && (
        <button
          type="button"
          onClick={() => onAddToShortlist(car.id)}
          disabled={isInShortlist}
          className={cn(
            "mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold transition",
            isInShortlist
              ? "cursor-default bg-stone-100 text-stone-500"
              : "bg-brand-600 text-white hover:bg-brand-700"
          )}
        >
          <Heart className={cn("h-4 w-4", isInShortlist && "fill-current")} />
          {isInShortlist ? "Saved to shortlist" : "Add to shortlist"}
        </button>
      )}
    </article>
  );
}

function Spec({ icon: Icon, value }: { icon: typeof Fuel; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-stone-600">
      <Icon className="h-4 w-4 text-trust-600" />
      {value}
    </div>
  );
}
