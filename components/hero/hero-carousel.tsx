'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface HeroBanner {
  id: string;
  title: string;
  description: string | null;
  image: string;
  link: string | null;
  buttonText: string | null;
  textColor: string | null;
  overlayColor: string | null;
}

interface HeroCarouselProps {
  banners: HeroBanner[];
  autoPlayInterval?: number; // milliseconds
}

export function HeroCarousel({ banners, autoPlayInterval = 3000 }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [banners.length, autoPlayInterval]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-lg bg-gray-900">
      {/* Render all banners, stack them on top of each other */}
      {banners.map((banner, index) => {
        const isActive = index === currentIndex;
        
        return (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image - Preload all images */}
            <Image
              src={banner.image}
              alt={banner.title}
              fill
              className="object-cover"
              priority={index === 0}
              loading={index === 0 ? 'eager' : 'lazy'}
            />

            {/* Overlay */}
            {banner.overlayColor && (
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: banner.overlayColor,
                  opacity: 0.6,
                }}
              />
            )}

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center md:justify-start">
              <div className="max-w-2xl px-6 md:px-12 text-center md:text-left">
                <h2
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
                  style={{ color: banner.textColor || '#ffffff' }}
                >
                  {banner.title}
                </h2>
                {banner.description && (
                  <p
                    className="text-lg md:text-xl mb-6"
                    style={{ color: banner.textColor || '#ffffff' }}
                  >
                    {banner.description}
                  </p>
                )}
                {banner.buttonText && banner.link && (
                  <Button size="lg" asChild>
                    <Link href={banner.link}>{banner.buttonText}</Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Clickable overlay if banner has link but no button */}
            {banner.link && !banner.buttonText && (
              <Link href={banner.link} className="absolute inset-0 z-20" aria-label={banner.title} />
            )}
          </div>
        );
      })}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
