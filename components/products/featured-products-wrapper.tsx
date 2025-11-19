import { getProducts } from '@/app/actions/products';
import FeaturedProducts from './featured-products';

interface FeaturedProductsWrapperProps {
  limit?: number;
  title?: string;
}

export default async function FeaturedProductsWrapper({ 
  limit = 5,
  title = "Featured Products" 
}: FeaturedProductsWrapperProps) {
  // Get random products from different categories
  const allProducts = await getProducts({ limit: 100 });
  
  // Shuffle products to get random selection from different categories
  const shuffled = allProducts.sort(() => Math.random() - 0.5);
  const products = shuffled.slice(0, limit);

  return <FeaturedProducts products={products} title={title} />;
}
