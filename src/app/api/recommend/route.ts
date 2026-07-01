import { NextRequest, NextResponse } from "next/server";
import { ensureDbSeeded } from "@/lib/db-init";
import { prisma } from "@/lib/prisma";
import { normalizePreferences, parseNaturalLanguage, scoreCars } from "@/lib/scoring";
import type { UserPreferences } from "@/lib/types";

export async function POST(request: NextRequest) {
  await ensureDbSeeded();

  const body = await request.json();
  const cars = await prisma.car.findMany();
  let prefs: UserPreferences = normalizePreferences(body.preferences);

  if (body.naturalLanguage && typeof body.naturalLanguage === "string") {
    const parsed = parseNaturalLanguage(body.naturalLanguage);
    prefs = normalizePreferences({
      ...prefs,
      ...parsed,
      bodyTypes: parsed.bodyTypes ?? prefs.bodyTypes,
      fuelTypes: parsed.fuelTypes ?? prefs.fuelTypes,
      priorities: parsed.priorities?.length ? parsed.priorities : prefs.priorities,
    });
  }

  const limit = Number.isFinite(body.limit) ? Math.min(Math.max(Number(body.limit), 1), 10) : 5;
  const matches = scoreCars(cars, prefs);

  return NextResponse.json({
    preferences: prefs,
    totalMatches: matches.length,
    recommendations: matches.slice(0, limit),
  });
}
