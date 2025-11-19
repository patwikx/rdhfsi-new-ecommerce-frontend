import { notFound } from 'next/navigation';
import { Star, Truck, Check, AlertCircle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getProductBySlug } from '@/app/actions/products';
import ProductAddToCartSection from '@/components/products/product-add-to-cart-section';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
  const totalStock = product.inventories.reduce((sum, inv) => sum + inv.availableQty, 0);
  const inStock = totalStock > 0;
  
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-muted-foreground">
            <li><a href="/" className="hover:text-foreground transition-colors">Home</a></li>
            <li>/</li>
            <li>
              <a href={`/category/${product.category.slug}`} className="hover:text-foreground transition-colors">
                {product.category.name}
              </a>
            </li>
            <li>/</li>
            <li className="text-foreground font-medium truncate">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Product Images - 5 columns */}
          <div className="lg:col-span-5">
            <div>
              {/* Main Image */}
              <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-4 border border-border">
                {primaryImage?.url ? (
                  <img
                    src={primaryImage.url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-32 h-32 text-muted-foreground/40" />
                  </div>
                )}
              </div>
              
              {/* Thumbnail Images - Show up to 4 */}
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((image) => (
                  <div key={image.id} className="aspect-square bg-muted rounded-sm overflow-hidden cursor-pointer hover:opacity-75 transition-opacity border border-border">
                    <img
                      src={image.url}
                      alt={image.altText || product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                
                {/* Show placeholder boxes if less than 4 images */}
                {product.images.length < 4 && [...Array(4 - product.images.length)].map((_, i) => (
                  <div key={`placeholder-${i}`} className="aspect-square bg-muted rounded-sm border border-border flex items-center justify-center">
                    <Package className="w-8 h-8 text-muted-foreground/30" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Info - 7 columns */}
          <div className="lg:col-span-7 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2 leading-tight">{product.name}</h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="text-muted-foreground">SKU: <span className="font-mono font-medium text-foreground">{product.sku}</span></span>
                    <span className="text-muted-foreground">•</span>
                    <a 
                      href={`/category/${product.category.slug}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {product.category.name}
                    </a>
                    {product.brand && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <span className="font-medium">{product.brand.name}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Price and Delivery Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Price Section with Product Info and Add to Cart */}
              <div className="bg-muted/50 rounded-lg p-5 space-y-4">
                {/* Product Information */}
                <div className="pb-3 border-b border-border">
                  <h3 className="text-sm font-bold mb-3">Product Information</h3>
                  <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                    <div>
                      <dt className="text-muted-foreground mb-0.5">SKU</dt>
                      <dd className="font-medium font-mono">{product.sku}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground mb-0.5">Barcode</dt>
                      <dd className="font-medium font-mono">{product.barcode}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground mb-0.5">Category</dt>
                      <dd className="font-medium">{product.category.name}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground mb-0.5">Min. Order</dt>
                      <dd className="font-medium lowercase">{product.moq} {product.baseUom || (product.moq === 1 ? 'unit' : 'units')}</dd>
                    </div>
                    {product.brand && (
                      <div>
                        <dt className="text-muted-foreground mb-0.5">Brand</dt>
                        <dd className="font-medium">{product.brand.name}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-muted-foreground mb-1">Availability</dt>
                      <dd>
                        {inStock ? (
                          <Badge className="bg-green-500 hover:bg-green-600 gap-1 px-2 py-0.5 text-xs">
                            <Check className="w-3 h-3" />
                            In Stock
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="gap-1 px-2 py-0.5 text-xs">
                            <AlertCircle className="w-3 h-3" />
                            Out of Stock
                          </Badge>
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Price Display */}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Price per {product.baseUom || 'unit'}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold">
                      ₱{formatPrice(product.retailPrice)}
                      {product.baseUom && <span className="text-base text-muted-foreground ml-1 lowercase">/{product.baseUom}</span>}
                    </p>
                    {product.compareAtPrice && Number(product.compareAtPrice) > product.retailPrice && (
                      <p className="text-lg text-muted-foreground line-through">
                        ₱{formatPrice(Number(product.compareAtPrice))}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bulk Pricing */}
                {product.bulkPrice && inStock && (
                  <div className="border-t border-border pt-3">
                    <div className="bg-primary/10 rounded-lg p-3">
                      <p className="text-xs font-semibold text-primary mb-1">💰 Bulk Pricing Available</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-xl font-bold">
                          ₱{formatPrice(product.bulkPrice)}
                          {product.baseUom && <span className="text-sm text-muted-foreground ml-1 lowercase">/{product.baseUom}</span>}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Order {product.moq}+ {product.baseUom || 'units'} to unlock
                      </p>
                    </div>
                  </div>
                )}

                {/* Quantity & Add to Cart */}
                {inStock ? (
                  <ProductAddToCartSection
                    productId={product.id}
                    name={product.name}
                    sku={product.sku}
                    price={product.retailPrice}
                    image={primaryImage?.url}
                    maxStock={totalStock}
                  />
                ) : (
                  <div className="border-t border-border pt-4 space-y-2">
                    <Button size="lg" disabled className="w-full">
                      Out of Stock
                    </Button>
                    <Button size="default" variant="outline" className="w-full">
                      Notify When Available
                    </Button>
                  </div>
                )}
              </div>

              {/* Delivery Information */}
              <div className="bg-muted/50 rounded-lg p-5 space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" />
                  Delivery Information
                </h3>
                
                <div className="space-y-3">
                  {/* Standard Delivery */}
                  <div className="flex items-start gap-3 pb-3 border-b border-border">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Truck className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">Standard Delivery</p>
                      <p className="text-xs text-muted-foreground mt-0.5">3-5 business days</p>
                      <p className="text-xs text-green-600 font-medium mt-1">FREE for orders over ₱5,000</p>
                    </div>
                  </div>

                  {/* Pickup Option */}
                  <div className="flex items-start gap-3 pb-3 border-b border-border">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Truck className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">Store Pickup</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Available next business day</p>
                      <p className="text-xs text-muted-foreground mt-1">FREE - Pick up at RD Hardware Santiago Branch</p>
                    </div>
                  </div>

                  {/* Bulk Orders */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Truck className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">Bulk Orders</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Special arrangements available</p>
                      <p className="text-xs text-muted-foreground mt-1">Contact us for large quantity orders</p>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="pt-3 border-t border-border space-y-2">
                  <p className="text-xs text-muted-foreground">
                    📍 Delivery available in General Santos City and surrounding areas.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ⚠️ Delivery is subject to truck availability. Delivery fees vary by area.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    📞 For delivery inquiries, contact us at (083) 552-XXXX
                  </p>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-muted/50 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold">Customer Reviews</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.averageRating || 0)
                              ? 'fill-amber-500 text-amber-500'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {product.averageRating?.toFixed(1) || '0.0'} out of 5 • {product.reviewCount} total reviews
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Write Review</Button>
              </div>

              {product.reviewCount > 0 ? (
                <div className="space-y-2">
                  {/* This will show when we have real review data */}
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Review breakdown will appear here when reviews are available.
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No reviews yet. Be the first to review this product!
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} - ProSupply Enterprise`,
    description: `${product.name} - SKU: ${product.sku}. Starting at ₱${product.retailPrice.toLocaleString('en-PH')}. ${product.category.name} category.`,
  };
}
