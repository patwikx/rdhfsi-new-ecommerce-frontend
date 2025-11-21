'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  ShoppingCart,
  Search,
  Package,
  FileText,
  Truck,
  CreditCard,
  HelpCircle,
} from 'lucide-react';

interface GuideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface GuideStep {
  icon: React.ElementType;
  title: string;
  description: string;
}

const guideSteps: GuideStep[] = [
  {
    icon: Search,
    title: 'Browse & Search Products',
    description:
      'Use the search bar to find products quickly, or browse by categories and brands. Filter by price, availability, and more.',
  },
  {
    icon: ShoppingCart,
    title: 'Add to Cart',
    description:
      'Click "Add to Cart" on any product. Review your cart anytime by clicking the cart icon in the header.',
  },
  {
    icon: FileText,
    title: 'Request Quotation',
    description:
      'Need bulk pricing? Add items to your quotation list and submit a request. Our team will respond within 1-2 business days.',
  },
  {
    icon: CreditCard,
    title: 'Checkout',
    description:
      'Complete your order with multiple payment options: Purchase Order (PO), Cash on Delivery (COD), or Online Payment.',
  },
  {
    icon: Truck,
    title: 'Track Your Order',
    description:
      'Use your tracking number to monitor your order status. Choose between delivery or store pickup.',
  },
  {
    icon: Package,
    title: 'Manage Orders',
    description:
      'View your order history, track shipments, and download invoices from your profile dashboard.',
  },
];

export function GuideDialog({ open, onOpenChange }: GuideDialogProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < guideSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    onOpenChange(false);
  };

  const currentGuide = guideSteps[currentStep];
  const Icon = currentGuide.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HelpCircle className="h-6 w-6 text-primary" />
              <DialogTitle className="text-2xl">How to Use RD Hardware E-Commerce</DialogTitle>
            </div>
          </div>
          <DialogDescription>
            A quick guide to help you navigate and shop on our platform
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {/* Progress Indicator */}
          <div className="mb-6 flex items-center justify-center gap-2">
            {guideSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-primary'
                    : index < currentStep
                      ? 'w-2 bg-primary/50'
                      : 'w-2 bg-muted'
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>

          {/* Current Step Content */}
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-6">
                <Icon className="h-12 w-12 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-bold">{currentGuide.title}</h3>
              <p className="text-muted-foreground">{currentGuide.description}</p>
            </div>

            {/* Step Counter */}
            <div className="text-center text-sm text-muted-foreground">
              Step {currentStep + 1} of {guideSteps.length}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between border-t pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>

          {currentStep === guideSteps.length - 1 ? (
            <Button onClick={handleClose}>Got it!</Button>
          ) : (
            <Button onClick={handleNext}>Next</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
