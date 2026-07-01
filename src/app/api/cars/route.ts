import { NextResponse } from "next/server";
import { ensureDbSeeded } from "@/lib/db-init";
import { prisma } from "@/lib/prisma";
import type { CarRecord } from "@/lib/types";

export async function GET() {
  await ensureDbSeeded();
  const cars = await prisma.car.findMany({ orderBy: { priceLakh: "asc" } });
  return NextResponse.json(cars satisfies CarRecord[]);
}
