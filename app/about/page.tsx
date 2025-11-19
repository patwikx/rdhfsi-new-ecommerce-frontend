export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-6">About Us</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
          <p className="text-lg text-muted-foreground">
            Welcome to RD Hardware & Fishing Supply, Inc. - your trusted partner for quality hardware and fishing supplies.
          </p>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p>
              Founded with a passion for providing top-quality products and exceptional service, RD Hardware & Fishing Supply has been serving our community for years. We pride ourselves on offering a comprehensive selection of hardware tools, construction materials, and fishing equipment.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p>
              Our mission is to be the go-to destination for professionals and enthusiasts alike, providing quality products at competitive prices with unmatched customer service.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">What We Offer</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Comprehensive range of hardware and construction tools</li>
              <li>Premium fishing equipment and supplies</li>
              <li>Expert advice and customer support</li>
              <li>Competitive pricing and bulk order discounts</li>
              <li>Fast and reliable delivery</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
            <p>
              <strong>Phone:</strong> +639 123 945 6789<br />
              <strong>Hours:</strong> Monday-Sunday, 8:00 AM - 5:00 PM
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
