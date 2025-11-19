import { Metadata } from 'next';
import { getNewArrivals } from '@/lib/actions/product-collections-actions';
import { getHeroBanners } from '@/lib/actions/hero-banner-actions';
import { ProductCollectionPage } from '@/components/products/product-collection-page';
import { HeroCarousel } from '@/components/hero/hero-carousel';
import { getDefaultBanners } from '@/components/hero/default-banners';
import { Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'New Arrivals | RD Hardware',
  description: 'Check out the latest products at RD Hardware. New arrivals added regularly.',
};

interface NewPageProps {
  searchParams: Promise<{
    page?: string;
    sort?: string;
  }>;
}

export default async function NewPage({ searchParams }: NewPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const sort = (params.sort as 'newest' | 'price-asc' | 'price-desc' | 'popular') || 'newest';

  const [result, bannersResult] = await Promise.all([
    getNewArrivals({
      page,
      sortBy: sort,
      limit: 20,
      days: 30, // Last 30 days
    }),
    getHeroBanners('NEW_ARRIVALS'),
  ]);

  if (!result.success || !result.data) {
    return (
      <div className="bg-background min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <h1 className="text-3xl font-bold mb-6">New Arrivals</h1>
          <div className="text-center py-12">
            <p className="text-muted-foreground">{result.error || 'Failed to load products'}</p>
          </div>
        </div>
      </div>
    );
  }

  const { products, totalCount, totalPages, currentPage } = result.data;
  const customBanners = bannersResult.success && bannersResult.banners ? bannersResult.banners : [];
  const banners = customBanners.length > 0 ? customBanners : getDefaultBanners('NEW_ARRIVALS');

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
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">New Arrivals</h1>
          </div>
          <p className="text-muted-foreground">
            Fresh products added in the last 30 days. Be the first to get them.
          </p>
        </div>

        {/* Products */}
        <ProductCollectionPage
          title="Latest Products"
          description="Check back later for new arrivals"
          products={products}
          totalCount={totalCount}
          totalPages={totalPages}
          currentPage={currentPage}
          basePath="/new"
        />
      </div>
    </div>
  );
}
