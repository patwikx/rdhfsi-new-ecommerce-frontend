import { Building2, Phone, Mail } from 'lucide-react';
import Image from 'next/image';

export default function SiteFooter() {
  return (
    <footer className="bg-card border-t border-border py-12 px-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
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
            <p className="text-sm text-muted-foreground mb-3">
              Trusted store for construction, industrial, DIY, fishing and office supplies for your needs.
            </p>
            <div className="space-y-1.5 text-sm">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" />
                <span className="font-medium">+639 123 4567</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />
             rdh_warehouse@rdretailgroup.com.ph
              </p>
            </div>
          </div>
          <div>
            <h5 className="font-semibold text-sm mb-3">Categories</h5>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li><a href="/category/construction" className="hover:text-foreground transition-colors">Construction</a></li>
              <li><a href="/category/industrial" className="hover:text-foreground transition-colors">Industrial</a></li>
              <li><a href="/category/fishing" className="hover:text-foreground transition-colors">Fishing</a></li>
              <li><a href="/category/do-it-yourself" className="hover:text-foreground transition-colors">DIY Tools</a></li>
              <li><a href="/category/office-supplies" className="hover:text-foreground transition-colors">Office Supplies</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-sm mb-3">Support</h5>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Track Order</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
          <p>© 2024 ProSupply Enterprise. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
