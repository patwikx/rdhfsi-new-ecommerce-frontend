import { getCategories } from '@/app/actions/products';
import { 
  Wrench, 
  Hammer, 
  Zap, 
  Paintbrush, 
  Building2, 
  Package, 
  TrendingUp, 
  TrendingDown,
  Factory,
  Fish,
  Briefcase,
  HardHat
} from 'lucide-react';
import Link from 'next/link';
import FeaturedProductsWrapper from '@/components/products/featured-products-wrapper';

// Helper function to get icon based on category name
function getCategoryIcon(categoryName: string) {
  const name = categoryName.toLowerCase();
  
  // Specific category matches
  if (name.includes('industrial')) return Factory;
  if (name.includes('fishing') || name.includes('fish')) return Fish;
  if (name.includes('office')) return Briefcase;
  if (name.includes('do-it-yourself') || name.includes('diy')) return Hammer;
  
  // General matches
  if (name.includes('tool')) return Wrench;
  if (name.includes('construction') || name.includes('hardware')) return HardHat;
  if (name.includes('electrical') || name.includes('electric')) return Zap;
  if (name.includes('paint') || name.includes('finishing')) return Paintbrush;
  if (name.includes('plumb')) return Building2;
  
  return Package;
}

// Helper function to get gradient colors based on category
function getCategoryGradient(categoryName: string) {
  const name = categoryName.toLowerCase();
  if (name.includes('tool')) return 'from-blue-500/20 to-blue-600/20';
  if (name.includes('construction') || name.includes('hardware')) return 'from-orange-500/20 to-orange-600/20';
  if (name.includes('electrical') || name.includes('electric')) return 'from-yellow-500/20 to-yellow-600/20';
  if (name.includes('paint') || name.includes('finishing')) return 'from-purple-500/20 to-purple-600/20';
  if (name.includes('plumb')) return 'from-cyan-500/20 to-cyan-600/20';
  return 'from-gray-500/20 to-gray-600/20';
}

export default async function CategoriesPage() {
  const categories = await getCategories({ limit: 50 });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">All Categories</h1>
          <p className="text-muted-foreground">Browse our complete range of products by category</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {categories.map((category) => {
            const CategoryIcon = getCategoryIcon(category.name);
            const gradient = getCategoryGradient(category.name);
            const hasTrend = category.trendPercent !== null && category.trendPercent !== 0;
            const isPositiveTrend = category.trendPercent && category.trendPercent > 0;

            return (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group relative overflow-hidden rounded-lg h-64 transition-all hover:shadow-xl"
              >
                {/* Background Image with Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-transform duration-500 group-hover:scale-110`}>
                  {/* Dark overlay for better text contrast */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center text-white p-6">
                  {/* Icon */}
                  <div className="mb-4 transform transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                    <CategoryIcon className="w-16 h-16" />
                  </div>

                  {/* Category Name */}
                  <h3 className="font-bold text-xl mb-2 text-center">
                    {category.name}
                  </h3>

                  {/* Product Count */}
                  <p className="text-sm text-white/80 mb-3">
                    {category.itemCount} {category.itemCount === 1 ? 'product' : 'products'}
                  </p>

                  {/* View Products Link */}
                  <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    View Products →
                  </span>
                </div>

                {/* Trend Badge */}
                {hasTrend && (
                  <div className={`absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium backdrop-blur-sm ${
                    isPositiveTrend 
                      ? 'bg-green-500/80 text-white' 
                      : 'bg-red-500/80 text-white'
                  }`}>
                    {isPositiveTrend ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {Math.abs(category.trendPercent || 0)}%
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No categories found</h3>
            <p className="text-muted-foreground">Check back later for new categories</p>
          </div>
        )}

        {/* Featured Products Section */}
        <div className="mt-16">
          <FeaturedProductsWrapper limit={5} title="Featured Products" />
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'All Categories - ProSupply Enterprise',
  description: 'Browse our complete range of hardware and supply products by category',
};
