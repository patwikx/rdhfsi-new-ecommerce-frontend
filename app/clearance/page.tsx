import { Metadata } from 'next';
import { getClearanceProducts } from '@/lib/actions/product-collections-actions';
import { getHeroBanners } from '@/lib/actions/hero-banner-actions';
import { ProductCollectionPage } from '@/components/products/product-collection-page';
import { HeroCarousel } from '@/components/hero/hero-carousel';
import { getDefaultBanners } from '@/components/hero/default-banners';
import { Percent } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Clearance Products | RD Hardware',
  description: 'Huge clearance sale at RD Hardware. Limited stock, massive savings.',
};

interface ClearancePageProps {
  searchParams: Promise<{
    page?: string;
    sort?: string;
  }>;
}

export default async function ClearancePage({ searchParams }: ClearancePageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const sort = (params.sort as 'newest' | 'price-asc' | 'price-desc') || 'newest';

  const [result, bannersResult] = await Promise.all([
    getClearanceProducts({
      page,
      sortBy: sort,
      limit: 20,
    }),
    getHeroBanners('CLEARANCE'),
  ]);

  if (!result.success || !result.data) {
    return (
      <div className="bg-background min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <h1 className="text-3xl font-bold mb-6">Clearance Products</h1>
          <div className="text-center py-12">
            <p className="text-muted-foreground">{result.error || 'Failed to load products'}</p>
          </div>
        </div>
      </div>
    );
  }

  const { products, totalCount, totalPages, currentPage } = result.data;
  const customBanners = bannersResult.success && bannersResult.banners ? bannersResult.banners : [];
  const banners = customBanners.length > 0 ? customBanners : getDefaultBanners('CLEARANCE');

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
            <Percent className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Clearance Sale</h1>
          </div>
          <p className="text-muted-foreground">
            Massive savings on clearance items. Limited stock available.
          </p>
        </div>

        {/* Products */}
        <ProductCollectionPage
          title="Clearance Items"
          description="Check back later for clearance products"
          products={products}
          totalCount={totalCount}
          totalPages={totalPages}
          currentPage={currentPage}
          basePath="/clearance"
        />
      </div>
    </div>
  );
}
