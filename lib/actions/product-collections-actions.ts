'use server';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Helper function to add site filtering (007 only for regular pages, exclude isOnSale)
const addSiteFilter = (where: Prisma.ProductWhereInput): Prisma.ProductWhereInput => {
  return {
    ...where,
    isOnSale: false, // Exclude sale items from regular pages
    inventories: {
      some: {
        site: {
          code: '007', // SANTIAGO BRANCH only
        },
        availableQty: {
          gt: 0, // Only show products with available stock
        },
      },
    },
  };
};

interface ProductCollectionResult {
  products: {
    id: string;
    sku: string;
    name: string;
    slug: string;
    description: string | null;
    poPrice: number;
    compareAtPrice: number | null;
    isOnSale: boolean;
    isFeatured: boolean;
    averageRating: number | null;
    reviewCount: number;
    category: {
      id: string;
      name: string;
      slug: string;
    };
    brand: {
      id: string;
      name: string;
      slug: string;
    } | null;
    images: {
      id: string;
      url: string;
      altText: string | null;
      isPrimary: boolean;
    }[];
  }[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

/**
 * Get trending products
 */
export async function getTrendingProducts(options?: {
  page?: number;
  limit?: number;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'popular';
}): Promise<{ success: boolean; data?: ProductCollectionResult; error?: string }> {
  try {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;

    const where = addSiteFilter({
      isActive: true,
      isPublished: true,
      isTrending: true,
    });

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };

    switch (options?.sortBy) {
      case 'price-asc':
        orderBy = { poPrice: 'asc' };
        break;
      case 'price-desc':
        orderBy = { poPrice: 'desc' };
        break;
      case 'popular':
        orderBy = { reviewCount: 'desc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          sku: true,
          name: true,
          slug: true,
          description: true,
          poPrice: true,
          compareAtPrice: true,
          isOnSale: true,
          isFeatured: true,
          averageRating: true,
          reviewCount: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          brand: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          images: {
            select: {
              id: true,
              url: true,
              altText: true,
              isPrimary: true,
            },
            orderBy: {
              sortOrder: 'asc',
            },
            take: 1,
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    const productsWithNumbers = products.map((product) => ({
      ...product,
      poPrice: Number(product.poPrice),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      averageRating: product.averageRating ? Number(product.averageRating) : null,
    }));

    return {
      success: true,
      data: {
        products: productsWithNumbers,
        totalCount,
        totalPages,
        currentPage: page,
      },
    };
  } catch (error) {
    console.error('Error fetching trending products:', error);
    return { success: false, error: 'Failed to fetch trending products' };
  }
}

/**
 * Get sale products
 * Shows products from site 007 with isOnSale=true AND all products from site 026 (SANTIAGO - MARKDOWN SITE)
 */
export async function getSaleProducts(options?: {
  page?: number;
  limit?: number;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'discount';
}): Promise<{ success: boolean; data?: ProductCollectionResult; error?: string }> {
  try {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;

    // Show products from site 007 with isOnSale=true OR all products from site 026
    const where: Prisma.ProductWhereInput = {
      isActive: true,
      isPublished: true,
      OR: [
        {
          // Products from site 007 that are marked as on sale
          isOnSale: true,
          inventories: {
            some: {
              site: {
                code: '007',
              },
              availableQty: {
                gt: 0,
              },
            },
          },
        },
        {
          // All products from site 026 (markdown site)
          inventories: {
            some: {
              site: {
                code: '026',
              },
              availableQty: {
                gt: 0,
              },
            },
          },
        },
      ],
    };

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };

    switch (options?.sortBy) {
      case 'price-asc':
        orderBy = { poPrice: 'asc' };
        break;
      case 'price-desc':
        orderBy = { poPrice: 'desc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          sku: true,
          name: true,
          slug: true,
          description: true,
          poPrice: true,
          compareAtPrice: true,
          isOnSale: true,
          isFeatured: true,
          averageRating: true,
          reviewCount: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          brand: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          images: {
            select: {
              id: true,
              url: true,
              altText: true,
              isPrimary: true,
            },
            orderBy: {
              sortOrder: 'asc',
            },
            take: 1,
          },
          inventories: {
            where: {
              site: {
                code: {
                  in: ['007', '026'], // Show inventory from both sites for sale page
                },
              },
              availableQty: {
                gt: 0,
              },
            },
            select: {
              id: true,
              availableQty: true,
              site: {
                select: {
                  name: true,
                  code: true,
                },
              },
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    const productsWithNumbers = products.map((product) => ({
      ...product,
      poPrice: Number(product.poPrice),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      averageRating: product.averageRating ? Number(product.averageRating) : null,
      inventories: product.inventories?.map((inv) => ({
        ...inv,
        availableQty: Number(inv.availableQty),
      })) || [],
    }));

    return {
      success: true,
      data: {
        products: productsWithNumbers,
        totalCount,
        totalPages,
        currentPage: page,
      },
    };
  } catch (error) {
    console.error('Error fetching sale products:', error);
    return { success: false, error: 'Failed to fetch sale products' };
  }
}

/**
 * Get clearance products
 */
export async function getClearanceProducts(options?: {
  page?: number;
  limit?: number;
  sortBy?: 'newest' | 'price-asc' | 'price-desc';
}): Promise<{ success: boolean; data?: ProductCollectionResult; error?: string }> {
  try {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;

    const where = addSiteFilter({
      isActive: true,
      isPublished: true,
      isClearance: true,
    });

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };

    switch (options?.sortBy) {
      case 'price-asc':
        orderBy = { poPrice: 'asc' };
        break;
      case 'price-desc':
        orderBy = { poPrice: 'desc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          sku: true,
          name: true,
          slug: true,
          description: true,
          poPrice: true,
          compareAtPrice: true,
          isOnSale: true,
          isFeatured: true,
          averageRating: true,
          reviewCount: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          brand: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          images: {
            select: {
              id: true,
              url: true,
              altText: true,
              isPrimary: true,
            },
            orderBy: {
              sortOrder: 'asc',
            },
            take: 1,
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    const productsWithNumbers = products.map((product) => ({
      ...product,
      poPrice: Number(product.poPrice),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      averageRating: product.averageRating ? Number(product.averageRating) : null,
    }));

    return {
      success: true,
      data: {
        products: productsWithNumbers,
        totalCount,
        totalPages,
        currentPage: page,
      },
    };
  } catch (error) {
    console.error('Error fetching clearance products:', error);
    return { success: false, error: 'Failed to fetch clearance products' };
  }
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(options?: {
  page?: number;
  limit?: number;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'popular';
}): Promise<{ success: boolean; data?: ProductCollectionResult; error?: string }> {
  try {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;

    const where = addSiteFilter({
      isActive: true,
      isPublished: true,
      isFeatured: true,
    });

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };

    switch (options?.sortBy) {
      case 'price-asc':
        orderBy = { poPrice: 'asc' };
        break;
      case 'price-desc':
        orderBy = { poPrice: 'desc' };
        break;
      case 'popular':
        orderBy = { reviewCount: 'desc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          sku: true,
          name: true,
          slug: true,
          description: true,
          poPrice: true,
          compareAtPrice: true,
          isOnSale: true,
          isFeatured: true,
          averageRating: true,
          reviewCount: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          brand: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          images: {
            select: {
              id: true,
              url: true,
              altText: true,
              isPrimary: true,
            },
            orderBy: {
              sortOrder: 'asc',
            },
            take: 1,
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    const productsWithNumbers = products.map((product) => ({
      ...product,
      poPrice: Number(product.poPrice),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      averageRating: product.averageRating ? Number(product.averageRating) : null,
    }));

    return {
      success: true,
      data: {
        products: productsWithNumbers,
        totalCount,
        totalPages,
        currentPage: page,
      },
    };
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return { success: false, error: 'Failed to fetch featured products' };
  }
}

/**
 * Get new arrivals (products created in last 30 days)
 */
export async function getNewArrivals(options?: {
  page?: number;
  limit?: number;
  days?: number;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'popular';
}): Promise<{ success: boolean; data?: ProductCollectionResult; error?: string }> {
  try {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const days = options?.days || 30;
    const skip = (page - 1) * limit;

    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    const where = addSiteFilter({
      isActive: true,
      isPublished: true,
      createdAt: {
        gte: dateThreshold,
      },
    });

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };

    switch (options?.sortBy) {
      case 'price-asc':
        orderBy = { poPrice: 'asc' };
        break;
      case 'price-desc':
        orderBy = { poPrice: 'desc' };
        break;
      case 'popular':
        orderBy = { reviewCount: 'desc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          sku: true,
          name: true,
          slug: true,
          description: true,
          poPrice: true,
          compareAtPrice: true,
          isOnSale: true,
          isFeatured: true,
          averageRating: true,
          reviewCount: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          brand: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          images: {
            select: {
              id: true,
              url: true,
              altText: true,
              isPrimary: true,
            },
            orderBy: {
              sortOrder: 'asc',
            },
            take: 1,
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    const productsWithNumbers = products.map((product) => ({
      ...product,
      poPrice: Number(product.poPrice),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      averageRating: product.averageRating ? Number(product.averageRating) : null,
    }));

    return {
      success: true,
      data: {
        products: productsWithNumbers,
        totalCount,
        totalPages,
        currentPage: page,
      },
    };
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    return { success: false, error: 'Failed to fetch new arrivals' };
  }
}

