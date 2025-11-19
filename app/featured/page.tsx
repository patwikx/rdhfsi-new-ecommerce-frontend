import { Metadata } from 'next';
import { getFeaturedProducts } from '@/lib/actions/product-collections-actions';
import { getHeroBanners } from '@/lib/actions/hero-banner-actions';
import { ProductCollectionPage } from '@/components/products/product-collection-page';
import { HeroCarousel } from '@/components/hero/hero-carousel';
import { getDefaultBanners } from '@/components/hero/default-banners';
import { Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Featured Products | RD Hardware',
  description: 'Shop our hand-picked featured products at RD Hardware. Quality products you can trust.',
};

interface FeaturedPageProps {
  searchParams: Promise<{
    page?: string;
    sort?: string;
  }>;
}

export default async function FeaturedPage({ searchParams }: FeaturedPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const sort = (params.sort as 'newest' | 'price-asc' | 'price-desc' | 'popular') || 'newest';

  const [result, bannersResult] = await Promise.all([
    getFeaturedProducts({
      page,
      sortBy: sort,
      limit: 20,
    }),
    getHeroBanners('FEATURED'),
  ]);

  if (!result.success || !result.data) {
    return (
      <div className="bg-background min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <h1 className="text-3xl font-bold mb-6">Featured Products</h1>
          <div className="text-center py-12">
            <p className="text-muted-foreground">{result.error || 'Failed to load products'}</p>
          </div>
        </div>
      </div>
    );
  }

  const { products, totalCount, totalPages, currentPage } = result.data;
  const customBanners = bannersResult.success && bannersResult.banners ? bannersResult.banners : [];
  const banners = customBanners.length > 0 ? customBanners : getDefaultBanners('FEATURED');

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero Carousel */}
        <div className="mb-8">
          <HeroCarousel banners={banners} />
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Featured Products</h1>
          </div>
          <p className="text-muted-foreground">
            Hand-picked products recommended by our experts.
          </p>
        </div>

        {/* Products */}
        <ProductCollectionPage
          title="Featured Selection"
          description="Check back later for featured products"
          products={products}
          totalCount={totalCount}
          totalPages={totalPages}
          currentPage={currentPage}
          basePath="/featured"
        />
      </div>
    </div>
  );
}
