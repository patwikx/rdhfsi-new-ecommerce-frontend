'use server'

import { prisma } from '@/lib/prisma';

export async function getRelatedProducts(productId: string, limit: number = 6) {
  try {
    // Get the current product to find related items
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        categoryId: true,
        brandId: true,
      },
    });

    if (!product) {
      return { success: false, products: [] };
    }

    // First, try to get products from ProductAssociation
    const associations = await prisma.productAssociation.findMany({
      where: {
        OR: [
          { productId: productId },
          { associatedProductId: productId },
        ],
      },
      include: {
        product: {
          include: {
            category: true,
            brand: true,
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
        associatedProduct: {
          include: {
            category: true,
            brand: true,
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
      },
      take: limit,
    });

    // Extract related products from associations
    const relatedFromAssociations = associations.map((assoc) =>
      assoc.productId === productId ? assoc.associatedProduct : assoc.product
    );

    // If we have enough from associations, return them
    if (relatedFromAssociations.length >= limit) {
      return {
        success: true,
        products: relatedFromAssociations.slice(0, limit),
      };
    }

    // Otherwise, supplement with products from same category or brand
    const supplementProducts = await prisma.product.findMany({
      where: {
        AND: [
          { id: { not: productId } },
          { isActive: true },
          { isPublished: true },
          {
            OR: [
              { categoryId: product.categoryId },
              { brandId: product.brandId },
            ],
          },
        ],
      },
      include: {
        category: true,
        brand: true,
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
      take: limit - relatedFromAssociations.length,
      orderBy: [
        { isFeatured: 'desc' },
        { reviewCount: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    const allRelated = [...relatedFromAssociations, ...supplementProducts];

    return {
      success: true,
      products: allRelated.slice(0, limit),
    };
  } catch (error) {
    console.error('Error fetching related products:', error);
    return { success: false, products: [] };
  }
}
