export type BodyType = "SUV" | "Sedan" | "Hatchback" | "MPV";
export type FuelType = "Petrol" | "Diesel" | "Electric" | "CNG";
export type Priority = "mileage" | "safety" | "price" | "features" | "reviews";

export interface UserPreferences {
  budgetMin: number;
  budgetMax: number;
  bodyTypes: BodyType[];
  fuelTypes: FuelType[];
  priorities: Priority[];
  seating?: number;
}

export interface CarRecord {
  id: string;
  make: string;
  model: string;
  variant: string;
  bodyType: string;
  fuelType: string;
  priceLakh: number;
  mileageKmpl: number;
  safetyRating: number;
  seating: number;
  transmission: string;
  features: string;
  reviewScore: number;
  imageEmoji: string;
}

export interface ScoredCar extends CarRecord {
  matchScore: number;
  reasons: string[];
}

export interface CompareField {
  label: string;
  key: keyof CarRecord;
  format?: (value: unknown, car: CarRecord) => string;
}

export const BODY_TYPES: BodyType[] = ["SUV", "Sedan", "Hatchback", "MPV"];
export const FUEL_TYPES: FuelType[] = ["Petrol", "Diesel", "Electric", "CNG"];
export const PRIORITIES: { id: Priority; label: string; description: string }[] = [
  { id: "price", label: "Best Value", description: "Lower price within your budget" },
  { id: "mileage", label: "Fuel Efficiency", description: "Higher mileage / range" },
  { id: "safety", label: "Safety", description: "Higher crash-test ratings" },
  { id: "features", label: "Features", description: "More comfort & tech" },
  { id: "reviews", label: "Owner Reviews", description: "Higher user ratings" },
];
