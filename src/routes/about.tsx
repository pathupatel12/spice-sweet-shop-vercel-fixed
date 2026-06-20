import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { Leaf, ShieldCheck, Sprout, Heart } from "lucide-react";
import logo from "@/assets/grevora-logo.png.asset.json";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Grevora" },
      { name: "description", content: "Grevora — Savor the Goodness. Our story and commitment to premium, natural Indian superfoods." },
      { property: "og:title", content: "About Grevora" },
      { property: "og:description", content: "Premium makhana, spices and seeds direct from trusted Indian farms." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <section className="bg-secondary/40">
        <div className="container mx-auto px-4 py-16 text-center">
          <img src={logo.url} alt="Grevora" className="mx-auto h-24 w-auto" />
          <h1 className="mt-6 font-display text-4xl md:text-5xl font-semibold">About Grevora</h1>
          <p className="mt-4 mx-auto max-w-2xl text-muted-foreground">
            Savor the Goodness. We bring you premium phool makhana, hand-picked Indian spices and superfood seeds — sourced direct from trusted Indian farms and packed in small batches to lock in freshness.
          </p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-16 grid gap-10 md:grid-cols-2 items-center">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-accent">Our Story</div>
          <h2 className="mt-2 font-display text-3xl font-semibold">Goodness, the way nature intended</h2>
          <p className="mt-4 text-foreground/85">
            Grevora was born out of a simple belief — that snacking and cooking should never compromise on health. Every product is 100% natural, free from preservatives and artificial colours, and tested for purity before it reaches your kitchen.
          </p>
          <p className="mt-3 text-foreground/85">
            From the lotus ponds of Bihar to the spice fields of Kerala and Gujarat, we partner directly with farmers to bring authentic, traceable, premium-grade ingredients to your home.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Leaf, t: "100% Natural", s: "No preservatives" },
            { icon: ShieldCheck, t: "Lab Tested", s: "Quality you can trust" },
            { icon: Sprout, t: "Direct from Farms", s: "Traceable sourcing" },
            { icon: Heart, t: "Made with Care", s: "Small-batch packed" },
          ].map((f) => (
            <div key={f.t} className="rounded-2xl border border-border bg-card p-5">
              <f.icon className="h-7 w-7 text-leaf" />
              <div className="mt-3 font-semibold">{f.t}</div>
              <div className="text-xs text-muted-foreground">{f.s}</div>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}