// Search-related types

export interface SearchParams {
  q?: string;
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: 'relevance' | 'price-asc' | 'price-desc' | 'newest' | 'popular';
  page?: string;
}

export interface SearchFilters {
  query: string;
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'relevance' | 'price-asc' | 'price-desc' | 'newest' | 'popular';
  page: number;
  limit: number;
}

export interface SearchResult {
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
    inventories: {
      availableQty: number;
    }[];
  }[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface SearchSuggestion {
  id: string;
  name: string;
  slug: string;
  category: string;
  image?: string;
}
