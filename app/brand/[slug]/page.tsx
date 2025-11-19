import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getBrandProducts, getBrandBySlug } from '@/lib/actions/brand-actions';
import ProductCard from '@/components/products/product-card';
import { Button } from '@/components/ui/button';
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

interface BrandPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
    sort?: string;
    category?: string;
  }>;
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getBrandBySlug(slug);

  if (!result.success || !result.brand) {
    return {
      title: 'Brand Not Found',
    };
  }

  return {
    title: `${result.brand.name} Products | RD Hardware`,
    description: result.brand.description || `Shop ${result.brand.name} products at RD Hardware. Quality products with great prices.`,
  };
}

export default async function BrandPage({ params, searchParams }: BrandPageProps) {
  const { slug } = await params;
  const search = await searchParams;
  const page = parseInt(search.page || '1');
  const sort = (search.sort as 'newest' | 'price-asc' | 'price-desc' | 'popular' | 'name') || 'newest';
  const categoryId = search.category;

  const result = await getBrandProducts(slug, {
    page,
    sortBy: sort,
    categoryId,
    limit: 20,
  });

  if (!result.success || !result.data) {
    notFound();
  }

  const { brand, products, totalCount, totalPages, currentPage } = result.data;

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(search);
    params.set('sort', value);
    params.set('page', '1');
    return `/brand/${brand.slug}?${params.toString()}`;
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(search);
    params.set('page', newPage.toString());
    return `/brand/${brand.slug}?${params.toString()}`;
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link href="/brands" className="hover:text-foreground">
              Brands
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">{brand.name}</span>
          </nav>
        </div>

        {/* Brand Header */}
        <div className="bg-card border border-border rounded-lg p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Brand Logo */}
            {brand.logo && (
              <div className="flex-shrink-0 w-32 h-32 bg-muted/30 rounded-lg flex items-center justify-center overflow-hidden">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={120}
                  height={120}
                  className="object-contain max-h-28"
                />
              </div>
            )}

            {/* Brand Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{brand.name}</h1>
              {brand.description && (
                <p className="text-muted-foreground mb-4">{brand.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-4">
                <div className="text-sm">
                  <span className="font-semibold">{totalCount}</span>{' '}
                  <span className="text-muted-foreground">
                    {totalCount === 1 ? 'product' : 'products'}
                  </span>
                </div>
                {brand.website && (
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    Visit Website
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
            <h2 className="text-xl font-bold">Products</h2>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-muted-foreground whitespace-nowrap">
                Sort by:
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => {
                  window.location.href = handleSortChange(e.target.value);
                }}
                className="border border-border rounded-md px-3 py-1.5 text-sm bg-background"
              >
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
                <option value="name">Name (A-Z)</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={{
                      ...product,
                      barcode: '',
                      bulkPrice: null,
                      moq: 1,
                      leadTime: null,
                      inventories: [],
                      brand: { id: brand.id, name: brand.name, slug: brand.slug },
                    } as import('@/app/actions/products').ProductWithDetails} 
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6">
                  <Link href={handlePageChange(currentPage - 1)}>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </Button>
                  </Link>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Link key={pageNum} href={handlePageChange(pageNum)}>
                          <Button
                            variant={currentPage === pageNum ? 'default' : 'outline'}
                            size="sm"
                            className="w-10"
                          >
                            {pageNum}
                          </Button>
                        </Link>
                      );
                    })}
                  </div>

                  <Link href={handlePageChange(currentPage + 1)}>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              )}

              {/* Page Info */}
              <p className="text-center text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
            </>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-sm text-muted-foreground">
                This brand doesn&apos;t have any products available at the moment
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
