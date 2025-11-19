import { prisma } from '../lib/prisma';

async function updateCategoryCounts() {
  console.log('Updating category item counts...');

  const categories = await prisma.category.findMany({
    where: { isActive: true }
  });

  console.log(`Found ${categories.length} categories`);

  for (const category of categories) {
    const count = await prisma.product.count({
      where: {
        categoryId: category.id,
        isActive: true,
        isPublished: true
      }
    });

    await prisma.category.update({
      where: { id: category.id },
      data: { itemCount: count }
    });

    console.log(`${category.name}: ${count} items`);
  }

  console.log('Category counts updated successfully!');
}

updateCategoryCounts()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
