import { NextRequest, NextResponse } from "next/server";
import { ensureDbSeeded } from "@/lib/db-init";
import { prisma } from "@/lib/prisma";
import { parseNaturalLanguage, scoreCars } from "@/lib/scoring";
import type { UserPreferences } from "@/lib/types";

const DEFAULT_PREFS: UserPreferences = {
  budgetMin: 5,
  budgetMax: 25,
  bodyTypes: [],
  fuelTypes: [],
  priorities: ["price", "mileage", "safety"],
};

export async function POST(request: NextRequest) {
  await ensureDbSeeded();
  const body = await request.json();
  const cars = await prisma.car.findMany();

  let prefs: UserPreferences = { ...DEFAULT_PREFS, ...body.preferences };

  if (body.naturalLanguage && typeof body.naturalLanguage === "string") {
    const parsed = parseNaturalLanguage(body.naturalLanguage);
    prefs = {
      ...prefs,
      ...parsed,
      bodyTypes: parsed.bodyTypes ?? prefs.bodyTypes,
      fuelTypes: parsed.fuelTypes ?? prefs.fuelTypes,
      priorities: parsed.priorities?.length ? parsed.priorities : prefs.priorities,
    };
  }

  const recommendations = scoreCars(cars, prefs).slice(0, body.limit ?? 5);

  return NextResponse.json({
    preferences: prefs,
    totalMatches: scoreCars(cars, prefs).length,
    recommendations,
  });
}
