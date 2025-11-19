import { BrandCard } from './brand-card';

interface BrandGridProps {
  brands: {
    name: string;
    slug: string;
    logo: string | null;
    description: string | null;
    productCount: number;
  }[];
}

export function BrandGrid({ brands }: BrandGridProps) {
  if (brands.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">No brands found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {brands.map((brand) => (
        <BrandCard key={brand.slug} brand={brand} />
      ))}
    </div>
  );
}
