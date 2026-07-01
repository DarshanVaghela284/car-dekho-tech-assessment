"use client";

import { cn, formatMileage, formatPriceLakh } from "@/lib/utils";
import type { ScoredCar } from "@/lib/types";
import { Heart, Star, Shield, Fuel } from "lucide-react";

interface CarCardProps {
  car: ScoredCar;
  rank?: number;
  onAddToShortlist?: (carId: string) => void;
  isInShortlist?: boolean;
  showReasons?: boolean;
}

export function CarCard({
  car,
  rank,
  onAddToShortlist,
  isInShortlist,
  showReasons = true,
}: CarCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-3xl">
            {car.imageEmoji}
          </div>
          <div>
            {rank !== undefined && (
              <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                #{rank} Match
              </span>
            )}
            <h3 className="text-lg font-bold text-slate-900">
              {car.make} {car.model}
            </h3>
            <p className="text-sm text-slate-500">{car.variant}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                {car.bodyType}
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                {car.fuelType}
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                {car.transmission}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1 text-sm font-bold",
              car.matchScore >= 80
                ? "bg-green-100 text-green-700"
                : car.matchScore >= 60
                  ? "bg-brand-100 text-brand-700"
                  : "bg-amber-100 text-amber-700"
            )}
          >
            {car.matchScore}% match
          </div>
          <p className="mt-2 text-lg font-bold text-slate-900">{formatPriceLakh(car.priceLakh)}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Fuel className="h-4 w-4 text-brand-500" />
          {formatMileage(car.mileageKmpl, car.fuelType)}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Shield className="h-4 w-4 text-brand-500" />
          {car.safetyRating}/5 safety
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Star className="h-4 w-4 text-brand-500" />
          {car.reviewScore}/5 reviews
        </div>
      </div>

      {showReasons && car.reasons.length > 0 && (
        <div className="mt-4 rounded-xl bg-brand-50 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-700">
            Why this car?
          </p>
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
            "mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition",
            isInShortlist
              ? "cursor-default bg-slate-100 text-slate-500"
              : "bg-brand-600 text-white hover:bg-brand-700"
          )}
        >
          <Heart className={cn("h-4 w-4", isInShortlist && "fill-current")} />
          {isInShortlist ? "In shortlist" : "Add to shortlist"}
        </button>
      )}
    </article>
  );
}
