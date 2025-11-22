'use server';

import { prisma } from '@/lib/prisma';
import { SearchFilters, SearchResult, SearchSuggestion } from '@/types/search';
import { Prisma } from '@prisma/client';
import { logSearch } from './activity-log-actions';

/**
 * Search products with filters and pagination
 */
export async function searchProducts(
  filters: SearchFilters
): Promise<{ success: boolean; data?: SearchResult; error?: string }> {
  try {
    const { query, categoryId, brandId, minPrice, maxPrice, sortBy, page, limit } = filters;

    // Build where clause with site filter (include both 007 and sale items from 026)
    const where: Prisma.ProductWhereInput = {
      isActive: true,
      isPublished: true,
      OR: [
        {
          // Regular products from site 007
          isOnSale: false,
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
          // Sale products from site 007
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
          // All products from site 026 (markdown)
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

    // Search query - search in name, description, SKU
    if (query && query.trim().length > 0) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { sku: { contains: query, mode: 'insensitive' } },
      ];
    }

    // Category filter
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Brand filter
    if (brandId) {
      where.brandId = brandId;
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.poPrice = {};
      if (minPrice !== undefined) {
        where.poPrice.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.poPrice.lte = maxPrice;
      }
    }

    // Build order by clause
    let orderBy: Prisma.ProductOrderByWithRelationInput[] = [];

    switch (sortBy) {
      case 'price-asc':
        orderBy = [{ poPrice: 'asc' }];
        break;
      case 'price-desc':
        orderBy = [{ poPrice: 'desc' }];
        break;
      case 'newest':
        orderBy = [{ createdAt: 'desc' }];
        break;
      case 'popular':
        orderBy = [{ reviewCount: 'desc' }, { averageRating: 'desc' }];
        break;
      case 'relevance':
      default:
        // For relevance, prioritize: exact name match > featured > rating > newest
        orderBy = [
          { isFeatured: 'desc' },
          { averageRating: 'desc' },
          { reviewCount: 'desc' },
          { createdAt: 'desc' },
        ];
        break;
    }

    const skip = (page - 1) * limit;

    // Execute query
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
                  in: ['007', '026'],
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

    // Convert Decimal to number
    const productsWithNumbers = products.map((product) => ({
      ...product,
      poPrice: Number(product.poPrice),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      averageRating: product.averageRating ? Number(product.averageRating) : null,
      inventories: product.inventories.map((inv) => ({
        ...inv,
        availableQty: Number(inv.availableQty),
      })),
    }));

    // Log search activity (async, don't wait for it)
    if (query && query.trim().length > 0) {
      logSearch({
        query,
        filters: {
          categoryId,
          brandId,
          minPrice,
          maxPrice,
          sortBy,
        },
        resultsCount: totalCount,
      }).catch((error) => console.error('Failed to log search:', error));
    }

    return {
      success: true,
      data: {
        products: productsWithNumbers,
        totalCount,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  } catch (error) {
    console.error('Error searching products:', error);
    return { success: false, error: 'Failed to search products' };
  }
}

/**
 * Get search suggestions for autocomplete
 */
export async function getSearchSuggestions(
  query: string,
  limit: number = 5
): Promise<{ success: boolean; suggestions?: SearchSuggestion[]; error?: string }> {
  try {
    if (!query || query.trim().length < 2) {
      return { success: true, suggestions: [] };
    }

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isPublished: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { sku: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        category: {
          select: {
            name: true,
          },
        },
        images: {
          select: {
            url: true,
          },
          where: {
            isPrimary: true,
          },
          take: 1,
        },
      },
      orderBy: [{ isFeatured: 'desc' }, { reviewCount: 'desc' }],
      take: limit,
    });

    const suggestions: SearchSuggestion[] = products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      category: product.category.name,
      image: product.images[0]?.url,
    }));

    return { success: true, suggestions };
  } catch (error) {
    console.error('Error getting search suggestions:', error);
    return { success: false, error: 'Failed to get suggestions' };
  }
}

/**
 * Get available filters for search results
 */
export async function getSearchFilters(query?: string): Promise<{
  success: boolean;
  filters?: {
    categories: { id: string; name: string; slug: string; count: number }[];
    brands: { id: string; name: string; slug: string; count: number }[];
    priceRange: { min: number; max: number };
  };
  error?: string;
}> {
  try {
    const where: Prisma.ProductWhereInput = {
      isActive: true,
      isPublished: true,
    };

    // Apply search query if provided
    if (query && query.trim().length > 0) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { sku: { contains: query, mode: 'insensitive' } },
      ];
    }

    // Get categories with product counts
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
        products: {
          some: where,
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            products: {
              where,
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Get brands with product counts
    const brands = await prisma.brand.findMany({
      where: {
        isActive: true,
        products: {
          some: where,
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            products: {
              where,
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Get price range
    const priceAgg = await prisma.product.aggregate({
      where,
      _min: {
        poPrice: true,
      },
      _max: {
        poPrice: true,
      },
    });

    return {
      success: true,
      filters: {
        categories: categories.map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          count: cat._count.products,
        })),
        brands: brands.map((brand) => ({
          id: brand.id,
          name: brand.name,
          slug: brand.slug,
          count: brand._count.products,
        })),
        priceRange: {
          min: Number(priceAgg._min.poPrice) || 0,
          max: Number(priceAgg._max.poPrice) || 10000,
        },
      },
    };
  } catch (error) {
    console.error('Error getting search filters:', error);
    return { success: false, error: 'Failed to get filters' };
  }
}

/**
 * Get popular/trending searches based on activity logs
 */
export async function getPopularSearches(limit: number = 10): Promise<{
  success: boolean;
  searches?: string[];
  error?: string;
}> {
  try {
    // Get search activity logs from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const logs = await prisma.activityLog.findMany({
      where: {
        action: 'SEARCH',
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        metadata: true,
      },
      take: 1000, // Limit to last 1000 searches for performance
    });

    // Count search queries
    const searchCounts = new Map<string, number>();

    logs.forEach((log) => {
      if (log.metadata && typeof log.metadata === 'object' && 'query' in log.metadata) {
        const query = (log.metadata as { query?: string }).query;
        if (query && typeof query === 'string' && query.trim().length > 0) {
          const normalizedQuery = query.toLowerCase().trim();
          searchCounts.set(normalizedQuery, (searchCounts.get(normalizedQuery) || 0) + 1);
        }
      }
    });

    // Convert to array and sort by count
    const searches = Array.from(searchCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([query]) => query);

    // If no searches found, return popular categories as fallback
    if (searches.length === 0) {
      const categories = await prisma.category.findMany({
        where: {
          isActive: true,
          isFeatured: true,
        },
        select: {
          name: true,
        },
        orderBy: {
          itemCount: 'desc',
        },
        take: limit,
      });

      return { success: true, searches: categories.map((cat) => cat.name) };
    }

    return { success: true, searches };
  } catch (error) {
    console.error('Error getting popular searches:', error);
    return { success: false, error: 'Failed to get popular searches' };
  }
}

