import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.category.createMany({
    data: [
      { name: 'Computer Science' },
      { name: 'Music' },
      { name: 'Fitness' },
      { name: 'Photography' },
      { name: 'Accounting' },
      { name: 'Engineering' },
      { name: 'Filming' },
    ],
  });
}

await main();
