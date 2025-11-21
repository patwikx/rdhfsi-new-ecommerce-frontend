import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="bg-card border-t border-border py-12 px-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 flex items-center justify-center rounded-sm overflow-hidden flex-shrink-0">
                <Image
                  src="/rdh-logo.png" 
                  alt="RD Hardware Logo" 
                  width={36} 
                  height={36}
                  className="object-contain"
                />
              </div>
              <div className="leading-none">
                <h4 className="text-base font-bold">RD Hardware</h4>
                <p className="text-[10px] text-muted-foreground">& Fishing Supply, Inc.</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Your trusted partner for quality hardware and fishing supplies.
            </p>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>0939 912 4032</span>
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span className="text-xs">rdh_santiago@rdretailgroup.com.ph</span>
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-xs">Santiago Boulevard, General Santos City</span>
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="text-xs">Mon-Sun: 8AM-5PM</span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-semibold text-sm mb-4">Quick Links</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link href="/brand" className="hover:text-foreground transition-colors">Brands</Link></li>
              <li><Link href="/categories" className="hover:text-foreground transition-colors">All Categories</Link></li>
              <li><Link href="/for-quotation" className="hover:text-foreground transition-colors">Request Quotation</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h5 className="font-semibold text-sm mb-4">Customer Service</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-foreground transition-colors">Shipping Policy</Link></li>
              <li><Link href="/returns" className="hover:text-foreground transition-colors">Return Policy</Link></li>
              <li><Link href="/track-order" className="hover:text-foreground transition-colors">Track Order</Link></li>
              <li><Link href="/profile/quotes" className="hover:text-foreground transition-colors">My Quotations</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h5 className="font-semibold text-sm mb-4">Legal</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} RD Hardware & Fishing Supply, Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
