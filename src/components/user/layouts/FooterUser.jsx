import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const FooterUser = () => {
  return (
    <footer className="bg-black mt-10 py-12 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">
              Subscribe to our Email Alerts!
            </h3>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white text-black"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>+1 234 567 890</li>
              <li>support@dune.com</li>
              <li>123 Audio Street</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Shop</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Headphones</li>
              <li>Earbuds</li>
              <li>Accessories</li>
              <li>New Arrivals</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Help</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Track Order</li>
              <li>Returns</li>
              <li>Shipping</li>
              <li>FAQs</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>© 2024 Dune. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
