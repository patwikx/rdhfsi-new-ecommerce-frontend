'use client'

import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Category {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
}

interface BrowseCategoriesProps {
  categories: Category[];
}

export function BrowseCategories({ categories }: BrowseCategoriesProps) {
  return (
    <section className="py-6 px-6 bg-zinc-900 mt-6">
      <div className="max-w-[1600px] mx-auto">
        <h2 className="text-lg font-bold mb-4 text-white">Browse Categories</h2>
        <TooltipProvider>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => {
              const growthPercent = Math.floor(Math.random() * 20) + 5;
              return (
                <Tooltip key={category.id}>
                  <TooltipTrigger asChild>
                    <Link
                      href={`/category/${category.slug}`}
                      className="flex-shrink-0 bg-black border border-zinc-800 rounded px-4 py-3 hover:border-zinc-700 transition-colors min-w-[140px]"
                    >
                      <p className="font-semibold text-sm text-white mb-1">{category.name}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400">{category.itemCount} items</span>
                        <span className="text-green-500 font-medium">+{growthPercent}%</span>
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Browse {category.itemCount} {category.name.toLowerCase()} products</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      </div>
    </section>
  );
}
