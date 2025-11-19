import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { WishlistContent } from '@/components/wishlist/wishlist-content';
import { Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'My Wishlist | RD Hardware',
  description: 'View and manage your wishlist items',
};

export default async function WishlistPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/login?redirect=/wishlist');
  }

  // Fetch wishlist items
  const wishlistItems = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          brand: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          images: {
            select: {
              id: true,
              url: true,
              altText: true,
              isPrimary: true,
            },
            orderBy: {
              sortOrder: 'asc',
            },
            take: 1,
          },
          inventories: {
            select: {
              availableQty: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const items = wishlistItems.map((item) => ({
    id: item.id,
    productId: item.product.id,
    name: item.product.name,
    slug: item.product.slug,
    sku: item.product.sku,
    retailPrice: Number(item.product.retailPrice),
    compareAtPrice: item.product.compareAtPrice ? Number(item.product.compareAtPrice) : null,
    isOnSale: item.product.isOnSale,
    averageRating: item.product.averageRating ? Number(item.product.averageRating) : null,
    reviewCount: item.product.reviewCount,
    category: item.product.category,
    brand: item.product.brand,
    image: item.product.images[0]?.url || null,
    availableQty: item.product.inventories.reduce((sum, inv) => sum + Number(inv.availableQty), 0),
    notes: item.notes,
    addedAt: item.createdAt,
  }));

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">My Wishlist</h1>
          </div>
          <p className="text-muted-foreground">
            {items.length} {items.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>

        {/* Wishlist Content */}
        <WishlistContent items={items} />
      </div>
    </div>
  );
}
