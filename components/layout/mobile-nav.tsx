'use client'

import { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  ChevronRight, 
  Home,
  Store,
  Sparkles,
  Tag,
  TrendingUp,
  Package,
  FileText,
  HelpCircle,
  Truck,
  RotateCcw,
  Info,
  Mail,
  Phone,
  MapPin,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface MobileNavProps {
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    itemCount: number;
  }>;
}

export default function MobileNav({ categories }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden">
          {/* Backdrop - covers everything */}
          <div
            className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            style={{ top: 0, left: 0, right: 0, bottom: 0 }}
          />

          {/* Menu Panel */}
          <div className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-background border-r border-border z-[101] overflow-y-auto shadow-2xl"
            style={{ height: '100vh' }}
          >
            <div className="p-6">
              {/* Logo */}
              <div className="flex items-center gap-2 mb-6">
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
                  <h2 className="text-lg font-bold">RD Hardware</h2>
                  <p className="text-[10px] text-muted-foreground font-medium">& Fishing Supply, Inc.</p>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1">
                <a
                  href="/"
                  className="flex items-center gap-3 px-3 py-2 rounded-sm hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Home className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Home</span>
                </a>

                <a
                  href="/brand"
                  className="flex items-center gap-3 px-3 py-2 rounded-sm hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Store className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">Brands</span>
                </a>

                <div className="pt-4 pb-2">
                  <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Collections
                  </p>
                </div>

                <a
                  href="/new"
                  className="flex items-center gap-3 px-3 py-2 rounded-sm hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  <span>New Arrivals</span>
                </a>
                <a
                  href="/sale"
                  className="flex items-center gap-3 px-3 py-2 rounded-sm hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Tag className="w-4 h-4 text-red-500" />
                  <span>Sale</span>
                </a>
                <a
                  href="/trending"
                  className="flex items-center gap-3 px-3 py-2 rounded-sm hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span>Trending</span>
                </a>

                <div className="pt-4 pb-2">
                  <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Top Categories
                  </p>
                </div>

                {categories.map((category) => (
                  <a
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="flex items-center justify-between px-3 py-2 rounded-sm hover:bg-muted transition-colors group"
                    onClick={() => setIsOpen(false)}
                  >
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-xs text-muted-foreground">{category.itemCount} items</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                  </a>
                ))}

                <div className="pt-4 pb-2">
                  <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Customer Service
                  </p>
                </div>

                <a
                  href="/track-order"
                  className="flex items-center gap-3 px-3 py-2 rounded-sm hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span>Track Order</span>
                </a>
                <a
                  href="/for-quotation"
                  className="flex items-center gap-3 px-3 py-2 rounded-sm hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span>Request Quotation</span>
                </a>
                <a
                  href="/faq"
                  className="flex items-center gap-3 px-3 py-2 rounded-sm hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <HelpCircle className="w-4 h-4 text-muted-foreground" />
                  <span>FAQ</span>
                </a>
                <a
                  href="/shipping"
                  className="flex items-center gap-3 px-3 py-2 rounded-sm hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Truck className="w-4 h-4 text-muted-foreground" />
                  <span>Shipping Policy</span>
                </a>
                <a
                  href="/returns"
                  className="flex items-center gap-3 px-3 py-2 rounded-sm hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <RotateCcw className="w-4 h-4 text-muted-foreground" />
                  <span>Return Policy</span>
                </a>

                <div className="pt-4 pb-2">
                  <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Company
                  </p>
                </div>

                <a
                  href="/about"
                  className="flex items-center gap-3 px-3 py-2 rounded-sm hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Info className="w-4 h-4 text-muted-foreground" />
                  <span>About Us</span>
                </a>
                <a
                  href="/contact"
                  className="flex items-center gap-3 px-3 py-2 rounded-sm hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>Contact</span>
                </a>
              </nav>

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t border-border space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Contact Us
                </p>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <a href="tel:+639399124032" className="text-sm font-medium hover:text-primary transition-colors">
                    0939 912 4032
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">Mon-Sun 8AM-5PM</p>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">Santiago Boulevard, General Santos City</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
