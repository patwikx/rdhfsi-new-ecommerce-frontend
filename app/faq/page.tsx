import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function FAQPage() {
  const faqs = [
    {
      question: 'How do I place an order?',
      answer: 'Browse our products, add items to your cart, and proceed to checkout. You\'ll need to create an account or log in to complete your purchase.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept major credit cards, debit cards, and online payment methods. All transactions are processed securely.',
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping typically takes 3-5 business days. Express shipping options are available for faster delivery.',
    },
    {
      question: 'Do you offer bulk order discounts?',
      answer: 'Yes! We offer special pricing for bulk orders. Please use our Bulk Order feature or contact us directly for a custom quote.',
    },
    {
      question: 'Can I track my order?',
      answer: 'Yes, once your order ships, you\'ll receive a tracking number via email. You can also track your order in the Orders section of your account.',
    },
    {
      question: 'What is your return policy?',
      answer: 'We accept returns within 30 days of purchase for unused items in original packaging. Please see our Return Policy page for full details.',
    },
    {
      question: 'Do you ship nationwide?',
      answer: 'Yes, we ship to all locations within the Philippines. Shipping costs vary based on location and order size.',
    },
    {
      question: 'How can I contact customer support?',
      answer: 'You can reach us at +639 123 945 6789 during business hours (Monday-Sunday, 8:00 AM - 5:00 PM) or email us at info@rdhardware.com.',
    },
    {
      question: 'Do you have a physical store?',
      answer: 'Yes, we have a physical location at 123 Hardware Street, Manila. You\'re welcome to visit us during business hours.',
    },
    {
      question: 'Can I cancel or modify my order?',
      answer: 'Orders can be cancelled or modified within 24 hours of placement. Please contact us immediately if you need to make changes.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-6">Frequently Asked Questions</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Find answers to common questions about our products, services, and policies.
        </p>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 p-6 bg-muted rounded-lg">
          <h2 className="text-xl font-bold mb-2">Still have questions?</h2>
          <p className="text-muted-foreground mb-4">
            Can't find the answer you're looking for? Please contact our customer support team.
          </p>
          <a href="/contact" className="text-primary hover:underline font-medium">
            Contact Us →
          </a>
        </div>
      </div>
    </div>
  );
}
