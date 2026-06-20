import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 bg-primary text-primary-foreground">
      <div className="container mx-auto grid gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <div className="font-display text-2xl font-semibold">Grevora</div>
          <p className="mt-1 text-xs uppercase tracking-widest text-accent">Savor the Goodness</p>
          <p className="mt-3 text-sm text-primary-foreground/80">
            Premium makhana, hand-picked Indian spices and superfood seeds — sourced direct from trusted Indian farms.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider">Shop</h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/category/makhana">Makhana</Link></li>
            <li><Link to="/category/spices">Spices</Link></li>
            <li><Link to="/category/seeds">Seeds</Link></li>
            <li><Link to="/shop">All Products</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider">Help</h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/auth">Login / Register</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/bulk-order">Bulk Order Queries</Link></li>
            <li><Link to="/about">About Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider">Connect</h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@grevora.in</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +91 98765 43210</li>
            <li className="flex items-center gap-3 pt-2">
              <Instagram className="h-5 w-5" />
              <Facebook className="h-5 w-5" />
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15">
        <div className="container mx-auto px-4 py-4 text-center text-xs text-primary-foreground/70">
          © {new Date().getFullYear()} Grevora. All rights reserved.
        </div>
      </div>
    </footer>
  );
}