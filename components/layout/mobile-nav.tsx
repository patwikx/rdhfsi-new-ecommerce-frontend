'use client'

import { useState, useEffect } from 'react';
import { Menu, X, Building2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
                <div className="w-9 h-9 bg-primary flex items-center justify-center rounded-sm">
                  <Building2 className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="leading-none">
                  <h2 className="text-lg font-bold">ProSupply</h2>
                  <p className="text-[10px] text-muted-foreground font-medium">Enterprise</p>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1">
                <a
                  href="/"
                  className="flex items-center justify-between px-3 py-2 rounded-sm hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="font-medium">Home</span>
                </a>

                <a
                  href="/brand"
                  className="flex items-center justify-between px-3 py-2 rounded-sm hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="font-medium">Brands</span>
                </a>

                <a
                  href="/categories"
                  className="flex items-center justify-between px-3 py-2 rounded-sm hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="font-medium">All Categories</span>
                </a>

                <div className="pt-4 pb-2">
                  <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Collections
                  </p>
                </div>

                <a
                  href="/new"
                  className="flex items-center justify-between px-3 py-2 rounded-sm hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span>New Arrivals</span>
                </a>
                <a
                  href="/sale"
                  className="flex items-center justify-between px-3 py-2 rounded-sm hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span>Sale</span>
                </a>
                <a
                  href="/trending"
                  className="flex items-center justify-between px-3 py-2 rounded-sm hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span>Trending</span>
                </a>
                <a
                  href="/featured"
                  className="flex items-center justify-between px-3 py-2 rounded-sm hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span>Featured</span>
                </a>
                <a
                  href="/clearance"
                  className="flex items-center justify-between px-3 py-2 rounded-sm hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span>Clearance</span>
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
                    Support
                  </p>
                </div>

                <a
                  href="/orders"
                  className="flex items-center justify-between px-3 py-2 rounded-sm hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span>Track Order</span>
                </a>
                <a
                  href="/bulk-order"
                  className="flex items-center justify-between px-3 py-2 rounded-sm hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span>Bulk Order</span>
                </a>
                <a
                  href="#"
                  className="flex items-center justify-between px-3 py-2 rounded-sm hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span>Help Center</span>
                </a>
              </nav>

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Contact Us
                </p>
                <p className="text-sm font-medium mb-1">1-800-SUPPLY-PRO</p>
                <p className="text-xs text-muted-foreground">Mon-Fri 7AM-8PM EST</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
