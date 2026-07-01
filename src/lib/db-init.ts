import { prisma } from "./prisma";
import { CAR_SEED_DATA } from "./seed-data";

let initialized = false;

export async function ensureDbSeeded() {
  if (initialized) return;
  const count = await prisma.car.count();
  if (count === 0) {
    for (const car of CAR_SEED_DATA) {
      await prisma.car.create({ data: car });
    }
  }
  initialized = true;
}
