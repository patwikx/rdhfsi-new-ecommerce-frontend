import { Metadata } from 'next';
import { getAllBrands } from '@/lib/actions/brand-actions';
import { getHeroBanners } from '@/lib/actions/hero-banner-actions';
import { BrandGrid } from '@/components/brands/brand-grid';
import { HeroCarousel } from '@/components/hero/hero-carousel';
import { getDefaultBanners } from '@/components/hero/default-banners';
import { Package } from 'lucide-react';

export const metadata: Metadata = {
  title: 'All Brands | RD Hardware',
  description: 'Browse all brands available at RD Hardware. Find your favorite brands and explore their products.',
};

export default async function BrandsPage() {
  const [result, bannersResult] = await Promise.all([
    getAllBrands({ sortBy: 'featured' }),
    getHeroBanners('BRANDS'),
  ]);

  if (!result.success || !result.brands) {
    return (
      <div className="bg-background min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <h1 className="text-3xl font-bold mb-6">All Brands</h1>
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{result.error || 'Failed to load brands'}</p>
          </div>
        </div>
      </div>
    );
  }

  const brands = result.brands;
  const featuredBrands = brands.filter((b) => b.isFeatured);
  const regularBrands = brands.filter((b) => !b.isFeatured);
  const customBanners = bannersResult.success && bannersResult.banners ? bannersResult.banners : [];
  const banners = customBanners.length > 0 ? customBanners : getDefaultBanners('BRANDS');

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero Carousel */}
        <div className="mb-8">
          <HeroCarousel banners={banners} />
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Brands</h1>
          <p className="text-muted-foreground">
            Explore {brands.length} {brands.length === 1 ? 'brand' : 'brands'} and discover quality products
          </p>
        </div>

        {/* Featured Brands */}
        {featuredBrands.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Featured Brands</h2>
            <BrandGrid
              brands={featuredBrands.map((brand) => ({
                name: brand.name,
                slug: brand.slug,
                logo: brand.logo,
                description: brand.description,
                productCount: brand._count.products,
              }))}
            />
          </div>
        )}

        {/* All Brands */}
        {regularBrands.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              {featuredBrands.length > 0 ? 'All Brands' : 'Our Brands'}
            </h2>
            <BrandGrid
              brands={regularBrands.map((brand) => ({
                name: brand.name,
                slug: brand.slug,
                logo: brand.logo,
                description: brand.description,
                productCount: brand._count.products,
              }))}
            />
          </div>
        )}

        {/* Empty State */}
        {brands.length === 0 && (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No brands available</h3>
            <p className="text-sm text-muted-foreground">
              Check back later for new brands
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
