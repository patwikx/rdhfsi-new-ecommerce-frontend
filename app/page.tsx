import { Shield, Truck, Award, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getProducts, getCategories, getFeaturedBrands, getProductCount } from './actions/products';
import ProductsSection from '@/components/products/products-section';
import QuickActions from '@/components/layout/quick-actions';

export default async function EnterpriseEcommerce() {
  // Fetch data server-side
  const [products, categories, totalProducts] = await Promise.all([
    getProducts({ limit: 20 }),
    getCategories({ limit: 8 }),
    getProductCount(),
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Quick Actions Bar -  <QuickActions /> Only visible when logged in */}
    

      {/* Products Section */}
      <section className="py-8 px-6">
        <div className="max-w-[1600px] mx-auto">
          <ProductsSection 
            initialProducts={products}
            totalProducts={totalProducts}
            categories={categories}
          />
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-8 px-6 border-y border-border bg-muted/30">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <p className="font-semibold text-sm">Secure Ordering</p>
                <p className="text-xs text-muted-foreground">SSL Encrypted</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="w-8 h-8 text-primary" />
              <div>
                <p className="font-semibold text-sm">Fast Delivery</p>
                <p className="text-xs text-muted-foreground">Same Day Available</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-primary" />
              <div>
                <p className="font-semibold text-sm">Certified Products</p>
                <p className="text-xs text-muted-foreground">Quality Guaranteed</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-primary" />
              <div>
                <p className="font-semibold text-sm">24/7 Support</p>
                <p className="text-xs text-muted-foreground">Always Here to Help</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
