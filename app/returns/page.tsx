import { RotateCcw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-6">Return Policy</h1>
        <p className="text-lg text-muted-foreground mb-12">
          We want you to be completely satisfied with your purchase. Review our return policy below.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 border rounded-lg text-center">
            <RotateCcw className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="font-bold mb-2">30-Day Returns</h3>
            <p className="text-sm text-muted-foreground">Return within 30 days of purchase</p>
          </div>

          <div className="p-6 border rounded-lg text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-4" />
            <h3 className="font-bold mb-2">Easy Process</h3>
            <p className="text-sm text-muted-foreground">Simple return procedure</p>
          </div>

          <div className="p-6 border rounded-lg text-center">
            <AlertCircle className="w-8 h-8 text-blue-500 mx-auto mb-4" />
            <h3 className="font-bold mb-2">Full Refund</h3>
            <p className="text-sm text-muted-foreground">Get your money back</p>
          </div>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">Return Eligibility</h2>
            <p>
              Items must meet the following conditions to be eligible for return:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Returned within 30 days of purchase</li>
              <li>In original, unused condition</li>
              <li>In original packaging with all accessories and documentation</li>
              <li>Include proof of purchase (receipt or order confirmation)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Non-Returnable Items</h2>
            <p>
              The following items cannot be returned:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Custom or special-order items</li>
              <li>Opened or used consumables</li>
              <li>Items marked as final sale</li>
              <li>Gift cards</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">How to Return</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Contact our customer service at +639 123 945 6789 or email info@rdhardware.com</li>
              <li>Provide your order number and reason for return</li>
              <li>Receive return authorization and shipping instructions</li>
              <li>Pack the item securely in original packaging</li>
              <li>Ship the item to the provided address</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Refund Process</h2>
            <p>
              Once we receive and inspect your return:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Approved returns will be refunded within 5-7 business days</li>
              <li>Refunds will be issued to the original payment method</li>
              <li>Shipping costs are non-refundable unless the return is due to our error</li>
              <li>You'll receive an email confirmation once the refund is processed</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Exchanges</h2>
            <p>
              If you need to exchange an item for a different size, color, or model, please contact us. We'll process the exchange as quickly as possible.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Damaged or Defective Items</h2>
            <p>
              If you receive a damaged or defective item, please contact us immediately at +639 123 945 6789. We'll arrange for a replacement or full refund, including shipping costs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Questions?</h2>
            <p>
              If you have any questions about our return policy, please don't hesitate to contact us at +639 123 945 6789 or info@rdhardware.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
