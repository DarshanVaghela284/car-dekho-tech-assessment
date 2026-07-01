import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPriceLakh(price: number): string {
  return `₹${price.toFixed(2)} Lakh`;
}

export function formatMileage(mileage: number, fuelType: string): string {
  if (fuelType === "Electric") return `${mileage} km/charge`;
  return `${mileage} kmpl`;
}
