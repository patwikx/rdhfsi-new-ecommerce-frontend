'use client';

import { useGuideDialog } from '@/lib/hooks/use-guide-dialog';
import { GuideDialog } from './guide-dialog';

export function GuideDialogWrapper() {
  const { isOpen, setIsOpen } = useGuideDialog();

  return <GuideDialog open={isOpen} onOpenChange={setIsOpen} />;
}
