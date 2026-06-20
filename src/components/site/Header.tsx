import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingCart, User, Search, Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import logo from "@/assets/grevora-logo.png.asset.json";

export function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const [subOpen, setSubOpen] = useState(false);
  const navigate = useNavigate();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    setSearchOpen(false);
    setOpen(false);
    navigate({ to: "/shop", search: { q: q.trim() } as never });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <Link to="/" className="flex items-center gap-2">
          <img src={logo.url} alt="Grevora" className="h-12 w-auto md:h-14" />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold uppercase tracking-wide">
          <Link to="/" className="text-foreground/80 hover:text-primary transition" activeProps={{ className: "text-primary" }} activeOptions={{ exact: true }}>
            HOME
          </Link>
          <div className="relative" onMouseEnter={() => setSubOpen(true)} onMouseLeave={() => setSubOpen(false)}>
            <Link to="/shop" className="flex items-center gap-1 text-foreground/80 hover:text-primary transition" activeProps={{ className: "text-primary" }}>
              ALL PRODUCTS <ChevronDown className="h-3.5 w-3.5" />
            </Link>
            {subOpen && (
              <div className="absolute left-0 top-full pt-2 w-52">
                <div className="rounded-lg border border-border bg-background shadow-lg py-2">
                  <Link to="/category/$slug" params={{ slug: "makhana" }} className="block px-4 py-2 text-xs hover:bg-secondary">MAKHANA</Link>
                  <Link to="/category/$slug" params={{ slug: "spices" }} className="block px-4 py-2 text-xs hover:bg-secondary">SPICES</Link>
                  <Link to="/category/$slug" params={{ slug: "seeds" }} className="block px-4 py-2 text-xs hover:bg-secondary">SEEDS</Link>
                </div>
              </div>
            )}
          </div>
          <Link to="/bulk-order" className="text-foreground/80 hover:text-primary transition" activeProps={{ className: "text-primary" }}>
            BULK ORDER QUERIES
          </Link>
          <Link to="/about" className="text-foreground/80 hover:text-primary transition" activeProps={{ className: "text-primary" }}>
            ABOUT US
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <button aria-label="Search" onClick={() => setSearchOpen((s) => !s)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary">
            <Search className="h-5 w-5" />
          </button>
          <Link to="/auth" aria-label="Account" className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary">
            <User className="h-5 w-5" />
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative grid h-9 w-9 place-items-center rounded-full hover:bg-secondary">
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
      {searchOpen && (
        <div className="border-t border-border bg-background">
          <form onSubmit={submitSearch} className="container mx-auto flex items-center gap-2 px-4 py-3">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search makhana, spices, seeds..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button type="submit" className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">Search</button>
            <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close"><X className="h-5 w-5" /></button>
          </form>
        </div>
      )}
      {open && (
        <nav className="md:hidden border-t border-border bg-background">
          <div className="container mx-auto flex flex-col px-4 py-2 uppercase text-sm font-semibold">
            <Link to="/" onClick={() => setOpen(false)} className="py-3 border-b border-border/50">HOME</Link>
            <Link to="/shop" onClick={() => setOpen(false)} className="py-3 border-b border-border/50">ALL PRODUCTS</Link>
            <Link to="/category/$slug" params={{ slug: "makhana" }} onClick={() => setOpen(false)} className="py-2 pl-4 text-xs border-b border-border/30">— MAKHANA</Link>
            <Link to="/category/$slug" params={{ slug: "spices" }} onClick={() => setOpen(false)} className="py-2 pl-4 text-xs border-b border-border/30">— SPICES</Link>
            <Link to="/category/$slug" params={{ slug: "seeds" }} onClick={() => setOpen(false)} className="py-2 pl-4 text-xs border-b border-border/30">— SEEDS</Link>
            <Link to="/bulk-order" onClick={() => setOpen(false)} className="py-3 border-b border-border/50">BULK ORDER QUERIES</Link>
            <Link to="/about" onClick={() => setOpen(false)} className="py-3">ABOUT US</Link>
          </div>
        </nav>
      )}
    </header>
  );
}