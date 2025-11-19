import { Truck, Package, Clock, MapPin } from 'lucide-react';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-6">Shipping Policy</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Learn about our shipping options, delivery times, and policies.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="p-6 border rounded-lg">
            <Truck className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-bold text-lg mb-2">Standard Shipping</h3>
            <p className="text-muted-foreground text-sm mb-2">3-5 business days</p>
            <p className="text-2xl font-bold">₱150</p>
          </div>

          <div className="p-6 border rounded-lg">
            <Package className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-bold text-lg mb-2">Express Shipping</h3>
            <p className="text-muted-foreground text-sm mb-2">1-2 business days</p>
            <p className="text-2xl font-bold">₱350</p>
          </div>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">Shipping Coverage</h2>
            <p>
              We ship to all locations within the Philippines. Shipping costs may vary based on your location and the size/weight of your order.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Processing Time</h2>
            <p>
              Orders are typically processed within 1-2 business days. You will receive a confirmation email once your order has been shipped with tracking information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Tracking Your Order</h2>
            <p>
              Once your order ships, you'll receive a tracking number via email. You can also track your order status by logging into your account and visiting the Orders page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Delivery</h2>
            <p>
              Our shipping partners will attempt delivery during business hours. If you're not available, they will leave a notice with instructions for redelivery or pickup.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Bulk Orders</h2>
            <p>
              For bulk orders, please contact us for special shipping arrangements and rates. We can accommodate large orders and provide customized delivery solutions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Shipping Restrictions</h2>
            <p>
              Some items may have shipping restrictions due to size, weight, or hazardous materials regulations. These restrictions will be noted on the product page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p>
              For shipping inquiries, please contact us at +639 123 945 6789 or email info@rdhardware.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
