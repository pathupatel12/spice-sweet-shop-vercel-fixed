import { Star } from "lucide-react";

const REVIEWS = [
  { name: "Priya Sharma", city: "Mumbai", rating: 5, text: "The Peri Peri Makhana is unbelievably crunchy and fresh. My go-to evening snack now!" },
  { name: "Rahul Verma", city: "Delhi", rating: 5, text: "Spices smell so authentic — exactly like my grandmother's masala dabba. Pure quality." },
  { name: "Ananya Iyer", city: "Bengaluru", rating: 5, text: "Chia and flax seeds are top-notch. Packaging is premium and stays airtight." },
  { name: "Mohit Patel", city: "Ahmedabad", rating: 4, text: "Loved the Cheese Makhana — kids finished the jar in two days. Will reorder!" },
  { name: "Sneha Kapoor", city: "Pune", rating: 5, text: "Pink Salt Makhana is perfectly seasoned, not too salty. Highly recommended." },
  { name: "Arjun Nair", city: "Kochi", rating: 5, text: "Delivery was quick and everything was sealed beautifully. Trustworthy brand." },
] as const;

export function Reviews() {
  return (
    <section id="reviews" className="container mx-auto px-4 py-16">
      <div className="text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-accent">Loved by Foodies</div>
        <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold">What Our Customers Say</h2>
        <div className="mt-3 flex items-center justify-center gap-1 text-accent">
          {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
          <span className="ml-2 text-sm font-semibold text-foreground">4.9 / 5 from 2,400+ reviews</span>
        </div>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {REVIEWS.map((r) => (
          <div key={r.name} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-1 text-accent">
              {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/90">"{r.text}"</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 font-semibold text-primary">
                {r.name[0]}
              </div>
              <div>
                <div className="text-sm font-semibold">{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.city} · Verified Buyer</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function StickyReviewBadge() {
  return (
    <a
      href="#reviews"
      className="fixed bottom-6 right-6 z-30 hidden md:flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 transition"
      aria-label="See customer reviews"
    >
      <Star className="h-4 w-4 fill-accent text-accent" />
      <span>4.9 ★ · 2.4k+ Reviews</span>
    </a>
  );
}