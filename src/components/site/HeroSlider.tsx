import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import bannerMakhana from "@/assets/banner-makhana-new.png.asset.json";
import bannerSeeds from "@/assets/banner-seeds-new.png.asset.json";
import bannerSpices from "@/assets/banner-spices.jpg";

const SLIDES = [
  {
    image: bannerMakhana.url,
    eyebrow: "All 5 Flavours",
    title: "Premium Phool Makhana",
    sub: "Roasted in A2 ghee · Zero maida · Guilt-free snacking",
    to: "/category/makhana",
    cta: "Shop Makhana",
  },
  {
    image: bannerSeeds.url,
    eyebrow: "Superfood Range",
    title: "Nutrient-Rich Seeds",
    sub: "Chia, flax, sunflower & pumpkin — naturally powerful",
    to: "/category/seeds",
    cta: "Shop Seeds",
  },
  {
    image: bannerSpices,
    eyebrow: "Direct from Farms",
    title: "Pure Indian Spices",
    sub: "Whole & ground — cardamom, pepper, jeera, clove and more",
    to: "/category/spices",
    cta: "Shop Spices",
  },
] as const;

export function HeroSlider() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);
  const prev = () => setI((x) => (x - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setI((x) => (x + 1) % SLIDES.length);
  return (
    <section className="relative w-full overflow-hidden bg-secondary aspect-[16/9] max-h-[640px]">
      {SLIDES.map((s, idx) => (
        <div
          key={s.title}
          className={`absolute inset-0 transition-opacity duration-1000 ${idx === i ? "opacity-100" : "opacity-0"}`}
        >
          <img src={s.image} alt={s.title} className="h-full w-full object-cover object-center" />
          <Link to={s.to} className="absolute inset-0" aria-label={s.cta} />
        </div>
      ))}
      <button onClick={prev} aria-label="Previous slide" className="absolute left-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-foreground shadow hover:bg-white">
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button onClick={next} aria-label="Next slide" className="absolute right-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-foreground shadow hover:bg-white">
        <ChevronRight className="h-6 w-6" />
      </button>
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            aria-label={`Slide ${idx + 1}`}
            onClick={() => setI(idx)}
            className={`h-2 rounded-full transition-all ${idx === i ? "w-8 bg-accent" : "w-2 bg-white/60"}`}
          />
        ))}
      </div>
    </section>
  );
}