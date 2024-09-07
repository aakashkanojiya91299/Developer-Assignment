const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
  for (let i = 0; i < 100; i++) {
    await prisma.category.create({
      data: {
        name: faker.commerce.department(),
        description: faker.commerce.productDescription(),
      },
    });
  }

  console.log('100 categories have been inserted into the database');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
