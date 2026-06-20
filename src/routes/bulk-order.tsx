import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/Layout";
import { toast } from "sonner";
import { Package, Truck, Tag } from "lucide-react";

export const Route = createFileRoute("/bulk-order")({
  head: () => ({
    meta: [
      { title: "Bulk Order Queries — Grevora" },
      { name: "description", content: "Wholesale and bulk orders for Grevora makhana, spices and seeds. Special pricing for retailers, gifting and corporates." },
    ],
  }),
  component: BulkOrder,
});

function BulkOrder() {
  const [submitting, setSubmitting] = useState(false);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    toast.success("Thanks! Our team will reach out within 24 hours.");
    (e.target as HTMLFormElement).reset();
  };
  return (
    <SiteLayout>
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-14 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-accent">Wholesale & Corporate</div>
          <h1 className="mt-2 font-display text-4xl md:text-5xl font-semibold">Bulk Order Queries</h1>
          <p className="mt-3 mx-auto max-w-2xl text-primary-foreground/85">
            Special pricing for retailers, distributors, corporate gifting and events. Tell us what you need — we will respond within 24 hours.
          </p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: Tag, t: "Best Pricing", s: "Volume-based slabs" },
              { icon: Package, t: "Custom Packaging", s: "Private labelling" },
              { icon: Truck, t: "Pan-India Delivery", s: "Reliable logistics" },
            ].map((f) => (
              <div key={f.t} className="rounded-xl border border-border bg-card p-4 text-center">
                <f.icon className="mx-auto h-7 w-7 text-leaf" />
                <div className="mt-2 text-sm font-semibold">{f.t}</div>
                <div className="text-xs text-muted-foreground">{f.s}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl bg-secondary/40 p-6 text-sm">
            <div className="font-semibold">Direct contact</div>
            <div className="mt-2 text-muted-foreground">Email: bulk@grevora.in</div>
            <div className="text-muted-foreground">Phone: +91 98765 43210</div>
            <div className="mt-3 text-xs text-muted-foreground">Mon–Sat, 10 AM – 7 PM IST</div>
          </div>
        </div>
        <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <h2 className="font-display text-2xl font-semibold">Send us your requirement</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name" name="name" required />
            <Field label="Company (optional)" name="company" />
            <Field label="Email" name="email" type="email" required />
            <Field label="Phone" name="phone" type="tel" required />
            <Field label="City" name="city" />
            <Field label="Estimated Quantity" name="qty" placeholder="e.g. 200 kg / 500 jars" />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground">Products of interest</label>
            <textarea
              name="message"
              required
              rows={4}
              placeholder="Which products & weights are you interested in?"
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {submitting ? "Sending..." : "Submit Enquiry"}
          </button>
        </form>
      </section>
    </SiteLayout>
  );
}

function Field({ label, name, type = "text", required, placeholder }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs font-medium text-foreground">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}