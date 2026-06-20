## Greenfinity-style Dryfruits/Spices/Seeds E-commerce Website

### Tech Stack
- **Framework**: TanStack Start (React 19 + Vite SSR — Next.js जैसा ही, Lovable पर यही supported है)
- **Backend**: Lovable Cloud (Postgres + Auth + Storage)
- **Payments**: Razorpay (test mode पहले, फिर live keys आप add करेंगे)
- **Styling**: Tailwind v4 + custom green/earthy theme matching Greenfinity

### Theme & Visual Design
- **Colors**: Deep forest green (#1f5132 primary), warm cream (#faf6ee bg), terracotta accent, gold for prices
- **Typography**: Playfair Display (headings) + Inter (body)
- **Layout**: Greenfinity जैसा — top utility bar, main nav with logo+search+cart+account, sliding hero banner, category strip, best sellers grid

### Pages / Routes
```
/                       Home (banner slider, categories, best sellers)
/shop                   All products with filters
/category/$slug         Makhana / Spices / Seeds category pages
/product/$slug          Product detail (with "Do Not Change Product" label badge)
/cart                   Cart page
/checkout               Razorpay checkout
/auth                   Login / Register (Email+Password, Google, Phone OTP)
/account                Order history, profile
/account/orders/$id     Order details
```

### Home Page Sections (Greenfinity reference)
1. **Top utility bar** — "Free shipping above ₹499 | COD available"
2. **Header** — Logo, nav (Home, Shop, Makhana, Spices, Seeds, About, Contact), search, account, cart icon with badge
3. **Hero slider** (3 slides, auto-scroll):
   - Slide 1: All 5 Makhanas combined image — "Premium Phool Makhana Collection"
   - Slide 2: All 7 Spices combined image — "Pure Indian Spices"
   - Slide 3: All seeds combined image — "Superfood Seeds"
4. **Shop by Category** — 3 large cards (Makhana / Spices / Seeds) — NO "New Arrivals" section as you asked
5. **Best Sellers** — grid of top products with Add to Cart
6. **Why Choose Us** — quality strip
7. **Footer** — links, contact, social, newsletter

### Product Catalog (16 products from your ZIP)

**Makhana (5)** — *all combined in Slide 1*
1. Raw Phool Makhana
2. Himalayan Pink Salt Makhana
3. Cheese Masala Makhana
4. Peri Peri Makhana
5. Pudina Makhana

**Spices (8)** — *combined in Slide 2*
- Green Cardamom (whole), Cardamom Powder, Black Pepper, Clove, Cumin, Fennel, Star Anise, Peanut

**Seeds (4)** — *combined in Slide 3*
- Flax Seeds, Chia Seeds, Sunflower Seeds, Pumpkin Seeds (Pepita)

Each product card shows: image, name, weight variants (50g/100g/250g/500g/1kg), price, "Do Not Change Product" trust badge, Add to Cart button, quick view.

### Features
- ✅ Cart (add/remove/update qty) — persisted per user in DB, guest cart in localStorage
- ✅ Wishlist
- ✅ Search + category filters + price sort
- ✅ Login/Register: Email+Password, Google, Phone OTP
- ✅ User profile + order history
- ✅ Razorpay checkout (Cloud secret for keys)
- ✅ Address management
- ✅ Admin: I'll seed all 16 products via migration; you can manage later

### Database (Lovable Cloud)
```
profiles          (id→auth.users, name, phone)
categories        (id, slug, name, image)
products          (id, slug, name, category_id, description, base_price, images[], stock)
product_variants  (id, product_id, weight, price, sku)
cart_items        (id, user_id, variant_id, qty)
wishlist          (id, user_id, product_id)
orders            (id, user_id, total, status, razorpay_order_id, payment_id, address)
order_items       (id, order_id, variant_id, name, price, qty)
addresses         (id, user_id, full_name, phone, line1, city, state, pincode)
user_roles        (id, user_id, role)  -- separate roles table
```
All tables get proper RLS + GRANTs.

### Banner Images
I'll generate 3 hero images using AI:
1. 5 Makhana varieties artfully arranged in wooden bowls with green leaf accents
2. 7 spices in small wooden spoons on dark slate
3. 4 seeds in glass jars with natural lighting

Plus the actual product photos from your ZIP go on product cards (uploaded as Lovable Assets).

### Build Order
1. Enable Lovable Cloud
2. DB migration with all tables + seed all 16 products + categories
3. Design system (colors, fonts, components) matching Greenfinity
4. Header + Footer + Layout
5. Home page (hero slider + categories + best sellers)
6. Product cards + category & product pages
7. Cart + Wishlist (server functions)
8. Auth pages (Email + Google + Phone OTP) + account dashboard
9. Razorpay checkout (will ask for Key ID + Secret when ready, can start in test)
10. Generate 3 banner images, upload product images to CDN
11. Polish + SEO meta + sitemap

### Technical Notes
- Cart writes via `createServerFn` with `requireSupabaseAuth`
- Razorpay webhook at `/api/public/webhooks/razorpay` with HMAC verification
- Google sign-in via `lovable.auth.signInWithOAuth("google")`
- Phone OTP via `supabase.auth.signInWithOtp({ phone })`
- All product images uploaded via `lovable-assets` CLI (CDN)

---

This is a **big build** (~30-40 files). I'll do it in phases and show progress. Approve to start with Phase 1 (Cloud + DB + seed data + design system).