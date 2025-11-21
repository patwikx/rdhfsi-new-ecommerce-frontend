import { Clock, Phone, Tag, Sparkles, TrendingUp, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import ClientWrapper from './client-wrapper';
import SearchBar from '@/components/search/search-bar';
import UserNavWrapper from './user-nav-wrapper';
import MobileNav from './mobile-nav';
import CartIcon from './cart-icon';
import WishlistSheet from '@/components/wishlist/wishlist-sheet';
import { HelpCenterButton } from './help-center-button';
import { NotificationBell } from './notification-bell';
import { auth } from '@/auth';
import { getCategories } from '@/app/actions/products';
import Image from 'next/image';

export default async function SiteHeader() {
  const session = await auth() as { user?: { name?: string | null; email?: string | null } } | null;
  const categories = await getCategories({ limit: 100 }); // Get all categories for dropdown
  return (
    <>
      {/* Top Bar - Hidden on mobile */}
      <div className="bg-muted border-b border-border py-2 px-4 sm:px-6 hidden sm:block">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between text-sm">
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5" />
              <a href="tel:+63939 912 4032" className="font-medium text-xs sm:text-sm hover:text-primary transition-colors">0939 912 4032</a>
            </div>
            <div className="hidden md:flex items-center gap-2 text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs">Monday-Sunday 8:00 AM - 5:00 PM</span>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <a href="/track-order" className="hover:text-primary transition-colors font-medium text-xs">Track Order</a>
            <a href="/for-quotation" className="hover:text-primary transition-colors font-medium text-xs">Quotation</a>
            <HelpCenterButton />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 w-full bg-background/98 backdrop-blur-md z-40 border-b border-border shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-2 sm:gap-6">
            {/* Mobile Menu */}
            <MobileNav categories={categories} />

            {/* Logo */}
            <a href="/" className="flex items-center gap-1">
              <div className="w-9 h-9 flex items-center justify-center rounded-sm overflow-hidden flex-shrink-0">
                <Image 
                  src="/rdh-logo.png" 
                  alt="RD Hardware Logo" 
                  width={36} 
                  height={36}
                  className="object-contain"
                />
              </div>
              <div className="leading-none">
                <h1 className="text-base sm:text-lg font-bold whitespace-nowrap">RD Hardware</h1>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground font-medium">& Fishing Supply, Inc.</p>
              </div>
            </a>
            
            {/* Search Bar - Hidden on mobile, shown on tablet+ */}
            <div className="hidden md:block flex-1">
              <SearchBar />
            </div>

            {/* User Navigation */}
            <div className="flex items-center gap-3">
              <ClientWrapper>
                <WishlistSheet />
                <CartIcon />
              </ClientWrapper>
              {session?.user && <NotificationBell />}
              <UserNavWrapper user={session?.user || null} />
            </div>
          </div>

          {/* Mobile Search - Below main nav on mobile */}
          <div className="md:hidden mt-3">
            <SearchBar />
          </div>
        </div>

        {/* Secondary Navigation - Hidden on mobile */}
        <div className="border-t border-border bg-muted/30 hidden lg:block">
          <div className="max-w-[1600px] mx-auto px-6 py-2">
            <TooltipProvider>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1.5 h-8" asChild>
                      <a href="/brand">
                        Brands
                        <Store className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Browse all brands</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1.5 h-8" asChild>
                      <a href="/new">
                        New Arrivals
                        <Sparkles className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Check out our latest products</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1.5 h-8" asChild>
                      <a href="/sale">
                        Sale
                        <Tag className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Hot deals & discounts</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1.5 h-8" asChild>
                      <a href="/trending">
                        Trending
                        <TrendingUp className="w-3.5 h-3.5 text-green-500 animate-pulse" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Popular items right now</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </div>
      </nav>
    </>
  );
}
