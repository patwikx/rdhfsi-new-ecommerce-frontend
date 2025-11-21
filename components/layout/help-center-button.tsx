'use client';

import { useState } from 'react';
import { GuideDialog } from '@/components/shared/guide-dialog';

export function HelpCenterButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-xs font-medium transition-colors hover:text-primary"
      >
        Help Center
      </button>
      <GuideDialog open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
