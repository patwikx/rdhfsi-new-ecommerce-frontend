'use client'

import { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/store/cart-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ShoppingBag, MapPin, CreditCard, Truck, Minus, Plus, Trash2, Check, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FileUpload, UploadedFileDisplay } from '@/components/shared/file-upload';
import { toast } from 'sonner';
import { Session } from 'next-auth';
import { OrderConfirmationDialog } from '@/components/orders/order-confirmation-dialog';
import { MinioImage } from '@/components/shared/minio-image';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type CheckoutStep = 'contact' | 'delivery' | 'payment' | 'review';

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('contact');
  const { items, getTotalPrice, clearCart, updateQuantity, removeItem } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; type: string; id: string } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [taxRate, setTaxRate] = useState<{ name: string; code: string; rate: number }>({ 
    name: 'VAT 12%', 
    code: 'VAT12', 
    rate: 12.00 
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [orderDialog, setOrderDialog] = useState<{
    open: boolean;
    success: boolean;
    orderNumber?: string;
    orderId?: string;
    trackingNumber?: string;
    totalAmount?: number;
    error?: string;
  }>({
    open: false,
    success: false,
  });

  const [formData, setFormData] = useState({
    // Contact Information
    fullName: '',
    email: '',
    phone: '',
    
    // Company Details
    companyName: '',
    taxId: '',
    
    // Purchase Order
    poNumber: '',
    poFile: null as { fileName: string; name: string; fileUrl: string } | null,
    
    // Delivery Type
    deliveryType: 'delivery' as 'delivery' | 'pickup',
    
    // Shipping Address (only for delivery)
    address: '',
    city: '',
    province: '',
    postalCode: '',
    
    // Delivery Notes
    notes: '',
    
    // Payment Method
    paymentMethod: 'po' as 'po' | 'cod' | 'online',
  });

  useEffect(() => {
    setMounted(true);
    
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const sessionData = await response.json();
        
        if (sessionData && sessionData.user) {
          setIsAuthenticated(true);
          setSession(sessionData);
          
          // Auto-fill form data from session
          setFormData(prev => ({
            ...prev,
            fullName: sessionData.user.name || '',
            email: sessionData.user.email || '',
            phone: sessionData.user.phone || '',
            companyName: sessionData.user.companyName || '',
            taxId: sessionData.user.taxId || '',
          }));
        } else {
          setIsAuthenticated(false);
          toast.error('Please login to continue', {
            description: 'You need to be logged in to place an order',
          });
          router.push('/auth/login?redirect=/checkout');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        router.push('/auth/login?redirect=/checkout');
      }
    };
    
    const fetchTaxRate = async () => {
      try {
        const { getDefaultTaxRate } = await import('@/app/actions/tax');
        const rate = await getDefaultTaxRate();
        setTaxRate({
          name: rate.name,
          code: rate.code,
          rate: Number(rate.rate),
        });
      } catch (error) {
        console.error('Error fetching tax rate:', error);
        // Keep default fallback
      }
    };
    
    checkAuth();
    fetchTaxRate();
  }, [router]);

  useEffect(() => {
    // Don't redirect if order dialog is open or processing
    if (mounted && items.length === 0 && !orderDialog.open && !isProcessing) {
      router.push('/');
    }
  }, [mounted, items.length, router, orderDialog.open, isProcessing]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const subtotal = mounted ? getTotalPrice() : 0;
  const shippingFee = appliedCoupon?.type === 'FREE_SHIPPING' ? 0 : (subtotal >= 5000 ? 0 : 150);
  const couponDiscount = appliedCoupon?.discount || 0;
  const subtotalAfterDiscount = subtotal - couponDiscount;
  const vatAmount = (subtotalAfterDiscount * taxRate.rate) / 100;
  const total = subtotalAfterDiscount + shippingFee + vatAmount;

  const handleApplyCoupon = async () => {
    setCouponError('');
    
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    try {
      const { validateCoupon } = await import('@/app/actions/coupon');
      const result = await validateCoupon(couponCode, subtotal);

      if (!result.valid || !result.coupon) {
        setCouponError(result.error || 'Invalid coupon code');
        return;
      }

      setAppliedCoupon({
        code: result.coupon.code,
        discount: result.discount || 0,
        type: result.coupon.discountType,
        id: result.coupon.id,
      });
      
      toast.success(`Coupon "${result.coupon.name}" applied successfully!`);
      setCouponCode('');
    } catch (error) {
      console.error('Error applying coupon:', error);
      setCouponError('Failed to apply coupon. Please try again.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
    toast.success('Coupon removed');
  };

  const steps: { id: CheckoutStep; label: string; icon: typeof MapPin }[] = [
    { id: 'contact', label: 'Contact & Company', icon: MapPin },
    { id: 'delivery', label: 'Delivery', icon: Truck },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'review', label: 'Review Order', icon: ShoppingBag },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const validateStep = (step: CheckoutStep): boolean => {
    switch (step) {
      case 'contact':
        if (!formData.fullName || !formData.email || !formData.phone || !formData.companyName) {
          toast.error('Please fill in all required fields');
          return false;
        }
        return true;
      
      case 'delivery':
        if (formData.deliveryType === 'delivery' && (!formData.address || !formData.city || !formData.province)) {
          toast.error('Please fill in shipping address');
          return false;
        }
        return true;
      
      case 'payment':
        if (formData.paymentMethod === 'po') {
          if (!formData.poNumber) {
            toast.error('Purchase Order number is required for PO payment');
            return false;
          }
          if (!formData.poFile) {
            toast.error('Please upload your approved Purchase Order document');
            return false;
          }
        }
        return true;
      
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < steps.length) {
        setCurrentStep(steps[nextIndex].id);
      }
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep('payment')) {
      return;
    }

    // Show confirmation dialog
    setShowConfirmDialog(true);
  };

  const handleConfirmOrder = async () => {
    setShowConfirmDialog(false);
    setIsProcessing(true);

    try {
      const { createOrder } = await import('@/app/actions/orders');
      
      const orderData = {
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          sku: item.sku,
        })),
        
        // Customer Info
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        companyName: formData.companyName,
        taxId: formData.taxId || undefined,
        
        // Delivery
        deliveryType: formData.deliveryType,
        address: formData.deliveryType === 'delivery' ? formData.address : undefined,
        city: formData.deliveryType === 'delivery' ? formData.city : undefined,
        province: formData.deliveryType === 'delivery' ? formData.province : undefined,
        postalCode: formData.deliveryType === 'delivery' ? formData.postalCode : undefined,
        notes: formData.notes || undefined,
        
        // Payment
        paymentMethod: formData.paymentMethod,
        poNumber: formData.poNumber || undefined,
        poFileUrl: formData.poFile?.fileUrl || undefined,
        
        // Pricing
        subtotal,
        shippingAmount: shippingFee,
        taxAmount: vatAmount,
        discountAmount: couponDiscount,
        totalAmount: total,
        
        // Coupon
        appliedCoupon: appliedCoupon ? {
          id: appliedCoupon.id,
          code: appliedCoupon.code,
          discount: appliedCoupon.discount,
        } : undefined,
      };

      const result = await createOrder(orderData);

      console.log('Order result:', result);
      setIsProcessing(false);

      if (!result.success) {
        console.log('Order failed, showing error dialog');
        setOrderDialog({
          open: true,
          success: false,
          error: result.error || 'Failed to create order. Please try again.',
        });
        return;
      }

      // Save total amount before clearing cart
      const orderTotal = total;
      
      // Clear cart and show success dialog
      console.log('Order success, clearing cart and showing dialog');
      clearCart();
      setOrderDialog({
        open: true,
        success: true,
        orderNumber: result.orderNumber,
        orderId: result.orderId,
        trackingNumber: result.trackingNumber,
        totalAmount: orderTotal,
      });
      
      console.log('Dialog state set:', {
        open: true,
        success: true,
        orderNumber: result.orderNumber,
        orderId: result.orderId,
        trackingNumber: result.trackingNumber,
        totalAmount: orderTotal,
      });
      
      // TODO: Send order confirmation email
      console.log('TODO: Send order confirmation email to', formData.email);
    } catch (error) {
      console.error('Error submitting order:', error);
      setIsProcessing(false);
      setOrderDialog({
        open: true,
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      });
    }
  };

  if (!mounted) {
    return null;
  }

  // Don't return null if dialog is open (cart might be empty after order)
  if (items.length === 0 && !orderDialog.open) {
    return null;
  }

  return (
    <>
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Your Order</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <p className="mb-4">
                  Are you sure you want to place this order? Please review your order details before confirming.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium">₱{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span className="font-medium">₱{formatPrice(shippingFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({taxRate.name}):</span>
                    <span className="font-medium">₱{formatPrice(vatAmount)}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span className="font-medium">-₱{formatPrice(couponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2 text-base font-bold">
                    <span>Total:</span>
                    <span>₱{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmOrder}>
              Confirm Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <OrderConfirmationDialog
        open={orderDialog.open}
        onOpenChange={(open) => setOrderDialog({ ...orderDialog, open })}
        success={orderDialog.success}
        orderNumber={orderDialog.orderNumber}
        orderId={orderDialog.orderId}
        trackingNumber={orderDialog.trackingNumber}
        customerEmail={formData.email}
        totalAmount={orderDialog.totalAmount}
        error={orderDialog.error}
      />
      
      <div className="bg-background min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-muted-foreground">Complete your order in {steps.length} easy steps</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-4">
          <div className="flex items-center justify-between max-w-2xl">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                        isCompleted
                          ? 'bg-primary border-primary text-primary-foreground'
                          : isCurrent
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'bg-muted border-border text-muted-foreground'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <p className={`text-[10px] mt-1.5 font-medium text-center ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.label}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-1 transition-all ${
                        isCompleted ? 'bg-primary' : 'bg-border'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column - Step Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Contact & Company Information */}
              {currentStep === 'contact' && (
                <div>
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-primary" />
                    Contact & Company Information
                  </h2>
                  <div className="space-y-6">
                    {/* Contact Details */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Contact Details</h3>
                      <div className="space-y-2">
                        <Label htmlFor="fullName">
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="Juan Dela Cruz"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">
                            Email Address <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">
                            Phone Number <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="09XX XXX XXXX"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Company Details */}
                    <div className="space-y-4 pt-4 border-t border-border">
                      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Company Details</h3>
                      <div className="space-y-2">
                        <Label htmlFor="companyName">
                          Company Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="companyName"
                          type="text"
                          placeholder="Your Company Name"
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="taxId">Tax ID / TIN (Optional)</Label>
                        <Input
                          id="taxId"
                          type="text"
                          placeholder="XXX-XXX-XXX-XXX"
                          value={formData.taxId}
                          onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button type="button" onClick={handleNext}>
                      Continue <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Delivery */}
              {currentStep === 'delivery' && (
                <div>
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Truck className="w-6 h-6 text-primary" />
                    Delivery Options
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <label className="flex items-center gap-3 p-4 border-2 border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-primary">
                      <input
                        type="radio"
                        name="deliveryType"
                        value="delivery"
                        checked={formData.deliveryType === 'delivery'}
                        onChange={(e) => setFormData({ ...formData, deliveryType: e.target.value as 'delivery' | 'pickup' })}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">Delivery</p>
                        <p className="text-sm text-muted-foreground">Have your order delivered to your address</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 border-2 border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-primary">
                      <input
                        type="radio"
                        name="deliveryType"
                        value="pickup"
                        checked={formData.deliveryType === 'pickup'}
                        onChange={(e) => setFormData({ ...formData, deliveryType: e.target.value as 'delivery' | 'pickup' })}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">Store Pickup</p>
                        <p className="text-sm text-muted-foreground">Pick up at RD Hardware Santiago Branch</p>
                      </div>
                    </label>
                  </div>

                  {formData.deliveryType === 'delivery' && (
                    <div className="space-y-4 pt-4 border-t border-border">
                      <h3 className="font-semibold">Shipping Address</h3>
                      <div className="space-y-2">
                        <Label htmlFor="address">
                          Street Address <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="address"
                          type="text"
                          placeholder="House No., Street Name, Barangay"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">
                            City <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="city"
                            type="text"
                            placeholder="General Santos"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="province">
                            Province <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="province"
                            type="text"
                            placeholder="South Cotabato"
                            value={formData.province}
                            onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="postalCode">Postal Code</Label>
                          <Input
                            id="postalCode"
                            type="text"
                            placeholder="9500"
                            value={formData.postalCode}
                            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">Delivery Notes (Optional)</Label>
                        <Textarea
                          id="notes"
                          placeholder="Any special instructions for delivery..."
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          rows={3}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between mt-6">
                    <Button type="button" variant="outline" onClick={handleBack}>
                      Back
                    </Button>
                    <Button type="button" onClick={handleNext}>
                      Continue <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 'payment' && (
                <div>
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-primary" />
                    Payment Method
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="poNumber">
                        PO Number {formData.paymentMethod === 'po' && <span className="text-red-500">*</span>}
                        {formData.paymentMethod !== 'po' && <span className="text-muted-foreground text-xs">(Optional)</span>}
                      </Label>
                      <Input
                        id="poNumber"
                        type="text"
                        placeholder="PO-2024-XXXX"
                        value={formData.poNumber}
                        onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })}
                        required={formData.paymentMethod === 'po'}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <label className="flex items-center gap-3 p-4 border-2 border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-primary">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="po"
                        checked={formData.paymentMethod === 'po'}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as 'po' | 'cod' | 'online' })}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">Purchase Order (PO)</p>
                        <p className="text-sm text-muted-foreground">Pay with approved purchase order</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 border-2 border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-primary">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as 'po' | 'cod' | 'online' })}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">Cash on Delivery</p>
                        <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 border-2 border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-primary">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={formData.paymentMethod === 'online'}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as 'po' | 'cod' | 'online' })}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">Online Payment</p>
                        <p className="text-sm text-muted-foreground">Pay securely online</p>
                        {/* TODO: Integrate payment gateway (PayMongo, Paymaya, etc.) */}
                      </div>
                    </label>
                  </div>

                  {formData.paymentMethod === 'po' && (
                    <div className="space-y-2 pt-4 border-t border-border">
                      <Label>
                        Upload Approved PO Document <span className="text-red-500">*</span>
                      </Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Please upload a copy of your approved purchase order
                      </p>
                      {!formData.poFile ? (
                        <FileUpload
                          onUploadComplete={(result) => {
                            setFormData({ ...formData, poFile: result });
                            toast.success('PO document uploaded successfully');
                          }}
                          onUploadError={(error) => {
                            toast.error('Upload failed', { description: error });
                          }}
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          maxSize={10}
                          multiple={false}
                        />
                      ) : (
                        <UploadedFileDisplay
                          fileName={formData.poFile.fileName}
                          name={formData.poFile.name}
                          fileUrl={formData.poFile.fileUrl}
                          onRemove={() => setFormData({ ...formData, poFile: null })}
                        />
                      )}
                    </div>
                  )}

                  <div className="flex justify-between mt-6">
                    <Button type="button" variant="outline" onClick={handleBack}>
                      Back
                    </Button>
                    <Button type="button" onClick={handleNext}>
                      Review Order <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Review Order */}
              {currentStep === 'review' && (
                <div>
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <ShoppingBag className="w-6 h-6 text-primary" />
                    Review Your Order
                  </h2>

                  <div className="space-y-4">
                    {/* Contact & Company Info */}
                    <div className="bg-muted/30 rounded-lg p-4">
                      <h3 className="font-semibold mb-3 flex items-center gap-2 text-base">
                        <MapPin className="w-4 h-4 text-primary" />
                        Contact & Company Information
                      </h3>
                      <div className="space-y-1.5 ml-6">
                        <div className="flex items-start gap-2">
                          <span className="text-sm text-muted-foreground min-w-[80px]">Name:</span>
                          <span className="text-sm font-medium">{formData.fullName}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-sm text-muted-foreground min-w-[80px]">Email:</span>
                          <span className="text-sm font-medium">{formData.email}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-sm text-muted-foreground min-w-[80px]">Phone:</span>
                          <span className="text-sm font-medium">{formData.phone}</span>
                        </div>
                        <div className="flex items-start gap-2 pt-2 border-t border-border/50 mt-2">
                          <span className="text-sm text-muted-foreground min-w-[80px]">Company:</span>
                          <span className="text-sm font-medium">{formData.companyName}</span>
                        </div>
                        {formData.taxId && (
                          <div className="flex items-start gap-2">
                            <span className="text-sm text-muted-foreground min-w-[80px]">TIN:</span>
                            <span className="text-sm font-medium">{formData.taxId}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Delivery */}
                    <div className="bg-muted/30 rounded-lg p-4">
                      <h3 className="font-semibold mb-3 flex items-center gap-2 text-base">
                        <Truck className="w-4 h-4 text-primary" />
                        Delivery
                      </h3>
                      <div className="space-y-1.5 ml-6">
                        <div className="flex items-start gap-2">
                          <span className="text-sm text-muted-foreground min-w-[80px]">Method:</span>
                          <span className="text-sm font-medium">
                            {formData.deliveryType === 'delivery' ? 'Delivery' : 'Store Pickup'}
                          </span>
                        </div>
                        {formData.deliveryType === 'delivery' ? (
                          <>
                            <div className="flex items-start gap-2">
                              <span className="text-sm text-muted-foreground min-w-[80px]">Address:</span>
                              <span className="text-sm font-medium">
                                {formData.address}<br />
                                {formData.city}, {formData.province} {formData.postalCode}
                              </span>
                            </div>
                            {formData.notes && (
                              <div className="flex items-start gap-2">
                                <span className="text-sm text-muted-foreground min-w-[80px]">Notes:</span>
                                <span className="text-sm font-medium italic">{formData.notes}</span>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="flex items-start gap-2">
                            <span className="text-sm text-muted-foreground min-w-[80px]">Location:</span>
                            <span className="text-sm font-medium">RD Hardware Santiago Branch</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Payment */}
                    <div className="bg-muted/30 rounded-lg p-4">
                      <h3 className="font-semibold mb-3 flex items-center gap-2 text-base">
                        <CreditCard className="w-4 h-4 text-primary" />
                        Payment
                      </h3>
                      <div className="space-y-1.5 ml-6">
                        <div className="flex items-start gap-2">
                          <span className="text-sm text-muted-foreground min-w-[80px]">Method:</span>
                          <span className="text-sm font-medium">
                            {formData.paymentMethod === 'po' 
                              ? 'Purchase Order (PO)' 
                              : formData.paymentMethod === 'cod' 
                              ? 'Cash on Delivery' 
                              : 'Online Payment'}
                          </span>
                        </div>
                        {formData.poNumber && (
                          <div className="flex items-start gap-2">
                            <span className="text-sm text-muted-foreground min-w-[80px]">PO Number:</span>
                            <span className="text-sm font-medium">{formData.poNumber}</span>
                          </div>
                        )}
                        {formData.poFile && (
                          <div className="flex items-start gap-2">
                            <span className="text-sm text-muted-foreground min-w-[80px]">Document:</span>
                            <span className="text-sm font-medium text-green-600">✓ PO Document Uploaded</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-start mt-6">
                    <Button type="button" variant="outline" onClick={handleBack}>
                      Back
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1 lg:-mt-48">
              <div className="sticky top-2">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-3 mb-4 max-h-[400px] overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="pb-3 border-b border-border">
                      <div className="flex gap-3">
                        <div className="relative w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                          {item.image && (
                            <MinioImage
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm line-clamp-2">{item.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">SKU: {item.sku}</p>
                          <p className="text-sm font-bold mt-1">₱{formatPrice(item.price)}</p>
                        </div>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-border rounded-lg">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="px-2 py-1 hover:bg-muted transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-sm font-medium border-x border-border min-w-[2.5rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= item.maxStock}
                            className="px-2 py-1 hover:bg-muted transition-colors disabled:opacity-50"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold">₱{formatPrice(item.price * item.quantity)}</p>
                          <button
                            type="button"
                            onClick={() => removeItem(item.productId)}
                            className="text-destructive hover:text-destructive/80 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Code */}
                <div className="mb-3">
                  <Label htmlFor="couponCode" className="text-xs font-medium mb-1.5 block">
                    Have a coupon?
                  </Label>
                  {!appliedCoupon ? (
                    <div className="flex gap-1.5">
                      <Input
                        id="couponCode"
                        type="text"
                        placeholder="Enter code"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value.toUpperCase());
                          setCouponError('');
                        }}
                        className="flex-1 h-9 text-sm"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleApplyCoupon}
                        disabled={!couponCode.trim()}
                        className="h-9 px-3 text-sm"
                      >
                        Apply
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-green-700 dark:text-green-300">
                          {appliedCoupon.code}
                        </span>
                        <span className="text-[10px] text-green-600 dark:text-green-400">
                          {appliedCoupon.type === 'FREE_SHIPPING' 
                            ? 'Free Shipping' 
                            : `-₱${formatPrice(appliedCoupon.discount)}`}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-[10px] text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  {couponError && (
                    <p className="text-[10px] text-red-500 mt-1">{couponError}</p>
                  )}
                </div>

                {/* Pricing */}
                <div className="space-y-1.5 pt-3 border-t border-border">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₱{formatPrice(subtotal)}</span>
                  </div>
                  {appliedCoupon && appliedCoupon.type !== 'FREE_SHIPPING' && (
                    <div className="flex justify-between text-xs text-green-600">
                      <span>Coupon ({appliedCoupon.code})</span>
                      <span>-₱{formatPrice(couponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{taxRate.name}</span>
                    <span className="font-medium">₱{formatPrice(vatAmount)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Shipping Fee</span>
                    <span className="font-medium">
                      {shippingFee === 0 ? (
                        <span className="text-green-600 text-xs">
                          FREE {appliedCoupon?.type === 'FREE_SHIPPING' && '(Coupon)'}
                        </span>
                      ) : (
                        `₱${formatPrice(shippingFee)}`
                      )}
                    </span>
                  </div>
                  {!appliedCoupon && subtotal < 5000 && (
                    <p className="text-[10px] text-muted-foreground pt-0.5">
                      Add ₱{formatPrice(5000 - subtotal)} more for free shipping
                    </p>
                  )}
                  <div className="flex justify-between text-base font-bold pt-1.5 border-t border-border">
                    <span>Total</span>
                    <span>₱{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full mt-4"
                  disabled={isProcessing || currentStep !== 'review'}
                >
                  {isProcessing ? 'Processing...' : currentStep !== 'review' ? 'Complete Steps to Order' : 'Place Order'}
                </Button>

                <p className="text-[10px] text-muted-foreground text-center mt-3">
                  By placing your order, you agree to our terms and conditions
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}
