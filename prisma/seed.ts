import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding default stages...");

  const stages = [
    { name: "Lead / Prospect", probability: 10, order: 1 },
    { name: "Meeting Scheduled", probability: 30, order: 2 },
    { name: "Proposal Sent", probability: 50, order: 3 },
    { name: "Negotiation", probability: 80, order: 4 },
    { name: "Closed Won", probability: 100, order: 5 },
    { name: "Closed Lost", probability: 0, order: 6 },
  ];

  for (const stage of stages) {
    const existing = await prisma.stage.findFirst({
      where: { name: stage.name },
    });

    if (existing) {
      await prisma.stage.update({
        where: { id: existing.id },
        data: { probability: stage.probability, order: stage.order },
      });
    } else {
      await prisma.stage.create({
        data: {
          name: stage.name,
          probability: stage.probability,
          order: stage.order,
        },
      });
    }
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
