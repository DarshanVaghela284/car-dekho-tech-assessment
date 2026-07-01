import { PrismaClient } from "@prisma/client";
import { CAR_SEED_DATA } from "../src/lib/seed-data";

const prisma = new PrismaClient();

async function main() {
  await prisma.shortlistItem.deleteMany();
  await prisma.shortlist.deleteMany();
  await prisma.car.deleteMany();

  for (const car of CAR_SEED_DATA) {
    await prisma.car.create({ data: car });
  }

  console.log(`Seeded ${CAR_SEED_DATA.length} cars`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
