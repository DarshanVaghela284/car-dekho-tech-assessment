import { NextRequest, NextResponse } from "next/server";
import { ensureDbSeeded } from "@/lib/db-init";
import { prisma } from "@/lib/prisma";
import { formatMileage, formatPriceLakh } from "@/lib/utils";

export async function POST(request: NextRequest) {
  await ensureDbSeeded();

  const { carIds } = await request.json();

  if (!Array.isArray(carIds) || carIds.length < 2 || carIds.length > 3) {
    return NextResponse.json({ error: "Provide 2-3 car IDs to compare" }, { status: 400 });
  }

  const cars = await prisma.car.findMany({ where: { id: { in: carIds } } });
  if (cars.length !== carIds.length) {
    return NextResponse.json({ error: "One or more cars not found" }, { status: 404 });
  }

  const ordered = carIds.map((id: string) => cars.find((car) => car.id === id)!);
  const fields = [
    {
      label: "Price",
      values: ordered.map((car) => formatPriceLakh(car.priceLakh)),
      winner: findMinIndex(ordered.map((car) => car.priceLakh)),
    },
    {
      label: "Mileage / range",
      values: ordered.map((car) => formatMileage(car.mileageKmpl, car.fuelType)),
      winner: findMaxIndex(ordered.map((car) => car.mileageKmpl)),
    },
    {
      label: "Safety rating",
      values: ordered.map((car) => `${car.safetyRating} / 5`),
      winner: findMaxIndex(ordered.map((car) => car.safetyRating)),
    },
    {
      label: "Owner score",
      values: ordered.map((car) => `${car.reviewScore} / 5`),
      winner: findMaxIndex(ordered.map((car) => car.reviewScore)),
    },
    {
      label: "Seating",
      values: ordered.map((car) => `${car.seating} seats`),
      winner: findMaxIndex(ordered.map((car) => car.seating)),
    },
    { label: "Transmission", values: ordered.map((car) => car.transmission) },
    { label: "Key features", values: ordered.map((car) => car.features) },
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
