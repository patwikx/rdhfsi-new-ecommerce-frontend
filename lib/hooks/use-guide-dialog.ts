'use client';

import { useState, useEffect } from 'react';

const GUIDE_DISMISSED_KEY = 'rd-hardware-guide-dismissed';
const ONE_HOUR = 60 * 60 * 1000; // 1 hour in milliseconds

export function useGuideDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const checkShouldShowGuide = () => {
      const dismissedAt = localStorage.getItem(GUIDE_DISMISSED_KEY);

      if (!dismissedAt) {
        // Never dismissed, show the guide
        setIsOpen(true);
        return;
      }

      const dismissedTime = parseInt(dismissedAt, 10);
      const currentTime = Date.now();
      const timeSinceDismissed = currentTime - dismissedTime;

      // Show again if more than 1 hour has passed
      if (timeSinceDismissed >= ONE_HOUR) {
        setIsOpen(true);
      }
    };

    checkShouldShowGuide();
  }, [mounted]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);

    // If closing, save the dismissed timestamp
    if (!open) {
      localStorage.setItem(GUIDE_DISMISSED_KEY, Date.now().toString());
    }
  };

  const openGuide = () => {
    setIsOpen(true);
  };

  return {
    isOpen,
    setIsOpen: handleOpenChange,
    openGuide,
  };
}
