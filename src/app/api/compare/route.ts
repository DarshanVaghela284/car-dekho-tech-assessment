import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatMileage, formatPriceLakh } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const { carIds } = await request.json();

  if (!Array.isArray(carIds) || carIds.length < 2 || carIds.length > 3) {
    return NextResponse.json(
      { error: "Provide 2–3 car IDs to compare" },
      { status: 400 }
    );
  }

  const cars = await prisma.car.findMany({ where: { id: { in: carIds } } });
  if (cars.length !== carIds.length) {
    return NextResponse.json({ error: "One or more cars not found" }, { status: 404 });
  }

  const ordered = carIds.map((id: string) => cars.find((c) => c.id === id)!);

  const fields = [
    { label: "Price", values: ordered.map((c) => formatPriceLakh(c.priceLakh)), winner: findMinIndex(ordered.map((c) => c.priceLakh)) },
    { label: "Mileage / Range", values: ordered.map((c) => formatMileage(c.mileageKmpl, c.fuelType)), winner: findMaxIndex(ordered.map((c) => c.mileageKmpl)) },
    { label: "Safety Rating", values: ordered.map((c) => `${c.safetyRating} / 5`), winner: findMaxIndex(ordered.map((c) => c.safetyRating)) },
    { label: "Review Score", values: ordered.map((c) => `${c.reviewScore} / 5`), winner: findMaxIndex(ordered.map((c) => c.reviewScore)) },
    { label: "Seating", values: ordered.map((c) => `${c.seating} seats`), winner: findMaxIndex(ordered.map((c) => c.seating)) },
    { label: "Transmission", values: ordered.map((c) => c.transmission) },
    { label: "Key Features", values: ordered.map((c) => c.features) },
  ];

  return NextResponse.json({ cars: ordered, fields });
}

function findMinIndex(values: number[]): number {
  const min = Math.min(...values);
  return values.indexOf(min);
}

function findMaxIndex(values: number[]): number {
  const max = Math.max(...values);
  return values.indexOf(max);
}
