import type { CarRecord, Priority, ScoredCar, UserPreferences } from "./types";

function countFeatures(features: string): number {
  return features.split(",").filter(Boolean).length;
}

function normalize(value: number, min: number, max: number): number {
  if (max === min) return 1;
  return (value - min) / (max - min);
}

function scorePrice(car: CarRecord, prefs: UserPreferences, pool: CarRecord[]): number {
  const midBudget = (prefs.budgetMin + prefs.budgetMax) / 2;
  const inRange =
    car.priceLakh >= prefs.budgetMin && car.priceLakh <= prefs.budgetMax;
  if (!inRange) {
    const distance = Math.min(
      Math.abs(car.priceLakh - prefs.budgetMin),
      Math.abs(car.priceLakh - prefs.budgetMax)
    );
    return Math.max(0, 1 - distance / prefs.budgetMax);
  }
  const prices = pool.map((c) => c.priceLakh);
  const affordability = 1 - normalize(car.priceLakh, Math.min(...prices), midBudget);
  return 0.6 + affordability * 0.4;
}

function scoreMileage(car: CarRecord, pool: CarRecord[]): number {
  const mileages = pool.map((c) => c.mileageKmpl);
  return normalize(car.mileageKmpl, Math.min(...mileages), Math.max(...mileages));
}

function scoreSafety(car: CarRecord): number {
  return car.safetyRating / 5;
}

function scoreFeatures(car: CarRecord, pool: CarRecord[]): number {
  const counts = pool.map((c) => countFeatures(c.features));
  return normalize(countFeatures(car.features), Math.min(...counts), Math.max(...counts));
}

function scoreReviews(car: CarRecord, pool: CarRecord[]): number {
  const scores = pool.map((c) => c.reviewScore);
  return normalize(car.reviewScore, Math.min(...scores), Math.max(...scores));
}

function buildReasons(car: CarRecord, prefs: UserPreferences, scores: Record<Priority, number>): string[] {
  const reasons: string[] = [];

  if (car.priceLakh <= prefs.budgetMax && car.priceLakh >= prefs.budgetMin) {
    reasons.push(`Fits your ₹${prefs.budgetMin}–${prefs.budgetMax} Lakh budget at ₹${car.priceLakh} Lakh`);
  }

  if (prefs.priorities.includes("mileage") && scores.mileage >= 0.7) {
    reasons.push(
      car.fuelType === "Electric"
        ? `Strong range of ${car.mileageKmpl} km per charge`
        : `Excellent fuel efficiency at ${car.mileageKmpl} kmpl`
    );
  }

  if (prefs.priorities.includes("safety") && car.safetyRating >= 4) {
    reasons.push(`${car.safetyRating}-star safety rating — among the safest in this segment`);
  }

  if (prefs.priorities.includes("features") && countFeatures(car.features) >= 5) {
    reasons.push(`Well-equipped: ${car.features.split(",").slice(0, 3).join(", ")} and more`);
  }

  if (prefs.priorities.includes("reviews") && car.reviewScore >= 4.2) {
    reasons.push(`Highly rated by owners (${car.reviewScore}/5)`);
  }

  if (prefs.priorities.includes("price") && car.priceLakh <= (prefs.budgetMin + prefs.budgetMax) / 2) {
    reasons.push("Strong value for money in your budget range");
  }

  if (prefs.seating && car.seating >= prefs.seating) {
    reasons.push(`Seats ${car.seating} — fits your family size`);
  }

  if (reasons.length === 0) {
    reasons.push(`Solid ${car.bodyType} option from ${car.make} with balanced specs`);
  }

  return reasons.slice(0, 4);
}

const PRIORITY_WEIGHTS: Record<Priority, number> = {
  price: 1.2,
  mileage: 1.1,
  safety: 1.0,
  features: 0.9,
  reviews: 0.8,
};

export function filterCars(cars: CarRecord[], prefs: UserPreferences): CarRecord[] {
  return cars.filter((car) => {
    const bodyOk = prefs.bodyTypes.length === 0 || prefs.bodyTypes.includes(car.bodyType as UserPreferences["bodyTypes"][number]);
    const fuelOk = prefs.fuelTypes.length === 0 || prefs.fuelTypes.includes(car.fuelType as UserPreferences["fuelTypes"][number]);
    const seatingOk = !prefs.seating || car.seating >= prefs.seating;
    const budgetOk = car.priceLakh <= prefs.budgetMax * 1.15;
    return bodyOk && fuelOk && seatingOk && budgetOk;
  });
}

export function scoreCars(cars: CarRecord[], prefs: UserPreferences): ScoredCar[] {
  const pool = filterCars(cars, prefs);
  if (pool.length === 0) return [];

  const priorities = prefs.priorities.length > 0 ? prefs.priorities : (["price", "mileage", "safety"] as Priority[]);

  const scored = pool.map((car) => {
    const dimensionScores: Record<Priority, number> = {
      price: scorePrice(car, prefs, pool),
      mileage: scoreMileage(car, pool),
      safety: scoreSafety(car),
      features: scoreFeatures(car, pool),
      reviews: scoreReviews(car, pool),
    };

    let totalWeight = 0;
    let weightedSum = 0;
    for (const p of priorities) {
      const w = PRIORITY_WEIGHTS[p];
      weightedSum += dimensionScores[p] * w;
      totalWeight += w;
    }

    const matchScore = Math.round((weightedSum / totalWeight) * 100);
    const reasons = buildReasons(car, prefs, dimensionScores);

    return { ...car, matchScore, reasons };
  });

  return scored.sort((a, b) => b.matchScore - a.matchScore);
}

export function parseNaturalLanguage(input: string): Partial<UserPreferences> {
  const text = input.toLowerCase();
  const prefs: Partial<UserPreferences> = { priorities: [] };

  const budgetMatch = text.match(/(\d+)\s*(?:lakh|lac|l)\b/g);
  if (budgetMatch) {
    const values = budgetMatch.map((m) => parseFloat(m));
    if (text.includes("under") || text.includes("below") || text.includes("max")) {
      prefs.budgetMax = Math.max(...values);
      prefs.budgetMin = Math.max(3, prefs.budgetMax * 0.5);
    } else if (values.length >= 2) {
      prefs.budgetMin = Math.min(...values);
      prefs.budgetMax = Math.max(...values);
    } else {
      prefs.budgetMax = values[0];
      prefs.budgetMin = Math.max(3, values[0] * 0.6);
    }
  }

  const bodyTypes: UserPreferences["bodyTypes"] = [];
  if (text.includes("suv")) bodyTypes.push("SUV");
  if (text.includes("sedan")) bodyTypes.push("Sedan");
  if (text.includes("hatchback") || text.includes("hatch")) bodyTypes.push("Hatchback");
  if (text.includes("mpv") || text.includes("muv")) bodyTypes.push("MPV");
  if (bodyTypes.length) prefs.bodyTypes = bodyTypes;

  const fuelTypes: UserPreferences["fuelTypes"] = [];
  if (text.includes("electric") || text.includes(" ev")) fuelTypes.push("Electric");
  if (text.includes("diesel")) fuelTypes.push("Diesel");
  if (text.includes("petrol")) fuelTypes.push("Petrol");
  if (text.includes("cng")) fuelTypes.push("CNG");
  if (fuelTypes.length) prefs.fuelTypes = fuelTypes;

  const priorities: Priority[] = [];
  if (text.includes("mileage") || text.includes("fuel")) priorities.push("mileage");
  if (text.includes("safe") || text.includes("safety")) priorities.push("safety");
  if (text.includes("cheap") || text.includes("budget") || text.includes("affordable")) priorities.push("price");
  if (text.includes("feature") || text.includes("luxury")) priorities.push("features");
  if (text.includes("review") || text.includes("rating")) priorities.push("reviews");
  if (priorities.length) prefs.priorities = priorities;

  if (text.includes("family") || text.includes("7 seater") || text.includes("7-seater")) {
    prefs.seating = 7;
  } else if (text.includes("5 seater") || text.includes("5-seater")) {
    prefs.seating = 5;
  }

  return prefs;
}
