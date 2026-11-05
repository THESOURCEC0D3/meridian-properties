# Meridian Properties NG — Full Website Audit

**Auditor:** Senior UX / Frontend / CRO / IA review
**Date:** 29 July 2026
**Repo:** `meridian-properties` · Next.js 16.2.6 · React 19.2.4 · Tailwind v4 · TypeScript (strict)
**Context:** Portfolio piece, not client work. The audience for this build is a hiring manager or prospective client, not a Port Harcourt homebuyer.

---

## How to read this document

This is a merged audit. Two frameworks were supplied — a 14-part learning audit and a 20-part strategy checklist — which overlapped by roughly 60%. They are combined here into **15 parts** with no duplication.

Every finding follows the same shape: **what**, **why it matters**, **what a senior engineer would do instead**. Where useful, implementations are compared as *bad / good / excellent* so the reasoning transfers to your next project rather than staying stuck to this one.

**Site classification:** Traditional full-service estate agency (brokerage) with a small commercial arm and a two-listing shortlet sideline. Audited primarily against real estate standards; hospitality/shortlet standards applied only to the shortlet subset, where they genuinely apply.

**Inventory:** 12 listings — 5 sale (incl. 1 land), 5 let (incl. 1 office, 1 warehouse), 2 shortlet. 3 agent "desks". 5 routes, 19 static pages.

---

## Contents

1. Technical Architecture
2. Business Model, Brand & Positioning
3. Information Architecture & Page-by-Page Audit
4. Homepage, Section by Section
5. Property Experience
6. User Journeys — Six Personas
7. UX, Interaction & Responsive Design
8. Accessibility
9. Conversion & Trust
10. Content Strategy
11. Design System, Components & Code Quality
12. Performance & SEO
13. Real Estate Feature Matrix
14. AI Opportunities
15. Scorecard, Priority Roadmap & Final Verdict

---

# PART 1 — TECHNICAL ARCHITECTURE

## 1.1 What ships

```
Route (app)
┌ ○ /                      Static
├ ○ /_not-found            Static
├ ○ /about                 Static
├ ○ /contact               Static
├ ○ /properties            Static
└ ● /properties/[id]       SSG — 12 prerendered paths
```

19 static pages. **Zero server-rendered pages, zero API routes, zero database, zero server actions.** Every byte is generated at build time and servable from a CDN.

This is correct for the current data model — 12 properties in a TypeScript array, no CMS, no accounts. Static generation gives the fastest possible delivery, near-zero hosting cost, and no server attack surface.

**The ceiling:** the agency can never add a property without a developer. Every new listing is a code edit, a commit, and a redeploy. Fine for a portfolio piece. For a client, this is the single biggest architectural decision in the project, and it is currently made by default rather than deliberately.

## 1.2 Folder structure

```
app/                      routes only — 8 files, all routing conventions
├── layout.tsx            root shell: html/body, fonts, Navbar, Footer
├── page.tsx              /
├── globals.css           Tailwind v4 + design tokens
├── about/page.tsx
├── contact/page.tsx
└── properties/
    ├── page.tsx
    ├── loading.tsx
    ├── error.tsx
    └── [id]/page.tsx
components/
├── ui/                   7 shadcn primitives
├── layout/               Navbar, Footer
├── shared/               WhatsAppButton
├── home/                 7 sections
├── about/                5 sections
├── contact/              3 sections
└── properties/           4 components
lib/
├── data/properties.ts    types + data + query helpers (563 lines)
└── utils.ts              cn()
```

**Why `app/` holds only routes.** In the App Router every file in `app/` is a routing concern — `page.tsx` creates a URL, `layout.tsx` wraps it, `loading.tsx` / `error.tsx` / `not-found.tsx` are reserved filenames. Putting components there invites confusion about what is routable. This codebase keeps that boundary clean.

**Why `components/` is grouped by feature, not by type.** The alternative — `components/cards/`, `components/forms/` — feels tidier and is worse. You edit by feature, not by type. When the brief is "change the About page," one folder holds everything. When a page is deleted, its folder goes with it and nothing is orphaned. Type-grouping scatters a single change across five directories and lets dead components accumulate invisibly.

This is **colocation**, and it is one of the highest-leverage habits available. It scales from 12 pages to 400 routes unchanged.

**Why `components/ui/` must stay separate.** These are generated primitives you own but do not hand-edit — the *vocabulary*. Everything else is *sentences*. A sharp boundary means primitives can be regenerated or upgraded without touching business components.

**Why `shared/` exists.** `WhatsAppButton` appears on every page and in both layout components. It is not a `ui/` primitive — it encodes business logic (phone number, message template, `wa.me` URL format) — and it is not page-specific.

> **Discipline:** a component earns `shared/` by being used on two or more pages, not by *feeling* generic. Otherwise `shared/` becomes the junk drawer.

## 1.3 Routing

File-system routing: the folder path is the URL path; a `page.tsx` inside a folder makes it routable.

| File | URL | Rendering |
|---|---|---|
| `app/page.tsx` | `/` | Static |
| `app/about/page.tsx` | `/about` | Static |
| `app/contact/page.tsx` | `/contact` | Static |
| `app/properties/page.tsx` | `/properties` | Static |
| `app/properties/[id]/page.tsx` | `/properties/prop-001` | SSG × 12 |

**The `[id]` dynamic segment** matches any value in that URL position and passes it to the component. One file, twelve URLs. Without it you would maintain twelve near-identical page files.

> **One template, many URLs, driven by data.** Every listings site, blog, and storefront on the internet works this way. It is the most important idea in web routing.

**A Next.js 16 breaking change handled correctly:**

```ts
interface PropertyPageProps {
  params: Promise<{ id: string }>;   // a Promise, not a plain object
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params;       // must be awaited
```

In Next 14 and earlier `params` was synchronous. From Next 15 it is a Promise. Most tutorials still show the old form. Both `generateMetadata` and the page component use the new form correctly.

**Why the change happened:** so Next can render a page's static shell *before* dynamic values resolve — a prerequisite for streaming and Partial Prerendering. Not churn; API design catching up to the rendering model.

## 1.4 Layouts

`app/layout.tsx` is the root layout and is mandatory — the only place `<html>` and `<body>` can be written.

```tsx
<html lang="en">
  <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
    <Navbar />
    <main className="pt-16">{children}</main>
    <Footer />
  </body>
</html>
```

**Why Navbar and Footer live here:** a layout wraps every route beneath it and **does not unmount on navigation**. React swaps only `{children}`. The result: no flicker, no layout shift, navbar state survives navigation, its JavaScript parses once per session, and it is written once instead of four times.

### `lang="en"`

Screen readers use it to select a pronunciation engine. Without it, VoiceOver may read English content with a French phoneme set — technically readable, practically unusable. One attribute, WCAG 3.1.1 Level A. Present and correct.

### `<main className="pt-16">` — right instinct, fragile execution

The Navbar is `fixed` and therefore out of document flow; without top padding the first 64px of every page hides beneath it. `pt-16` = 4rem = 64px, matching the Navbar's `h-16`.

The problem is **coupling by coincidence** — two files, two hardcoded numbers, nothing linking them. Change the Navbar to `h-20` and every page silently loses 16px of content behind the header. Nothing errors. Nothing warns.

The same magic number appears twice more: `PropertiesClient` uses `sticky top-16` for the filter bar, and the property detail page uses `sticky top-24` for the price card.

**Fix — a design token:**

```css
:root { --nav-height: 4rem; }
```
```tsx
<main className="pt-[var(--nav-height)]">
```

> **When the same number appears in more than one file and the values must agree, that number is a token, not a literal.** Same reasoning behind colour variables and spacing scales.

### `suppressHydrationWarning` — a code smell

Hydration is where React attaches interactivity to server-rendered HTML, comparing what the server produced against what the client would render. A mismatch warns, and can cause React to discard the server HTML and re-render.

`suppressHydrationWarning` disables that comparison for an element. There is exactly one legitimate use on `<body>`: browser extensions (Grammarly, password managers) inject attributes before React hydrates, producing an unavoidable mismatch unrelated to your code.

The danger is that **you cannot tell from the code whether that is why it is there**. It permanently silences a diagnostic channel — including real bugs introduced later, and `<body>` is exactly where a `new Date()` or `Math.random()` bug would surface first.

| Level | Approach |
|---|---|
| Bad | Added to silence a warning nobody read |
| Good | Added for extensions, with a comment saying so |
| Excellent | The above, plus verified there is no *other* mismatch |

**Action:** if the reason is not remembered, remove it, run dev in a clean browser profile, and see whether anything warns. Five minutes either restores the safety net or documents a real reason.

## 1.5 Pages — the thin composer pattern

```tsx
export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsBar />
      <FeaturedProperties />
      <WhyChooseUs />
      <AgentSection />
      <Testimonials />
      <CTABanner />
    </div>
  );
}
```

Why this is genuinely good, despite looking too simple to praise:

1. **The page reads as an outline.** The file *is* the wireframe. Anyone understands the narrative in five seconds.
2. **Reordering is one line.** In a 900-line monolith it is a delicate cut-and-paste with a real chance of breaking div nesting.
3. **Independent blast radius.** Breaking `Testimonials` leaves `HeroSection` untouched — different file, different diff, different review.
4. **Git history becomes meaningful.** `git log components/home/HeroSection.tsx` tells the story of the hero. In a monolith, every commit touches one file and history says nothing.

| Level | Approach |
|---|---|
| Bad | One 900-line `page.tsx`, all sections inline |
| **Good** | **Sections extracted, page composes them — what this project does** |
| Excellent | Section order driven by a config array so a non-developer can reorder |

**Do not build the "excellent" version here.** It adds indirection for zero current benefit. Knowing when *not* to abstract is a senior skill; most over-engineering is a pattern applied outside the context that justified it.

**The exception:** `app/contact/page.tsx` composes *and* holds layout logic (a two-column grid). Defensible — the column relationship is a page-level concern neither child should know about.

**But note:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` is duplicated in **15+ files**. The container convention exists; it was never extracted into a component. See Part 11.

## 1.6 Server vs Client Components

The concept that separates people who *use* Next.js from people who *understand* it.

Every component is a **Server Component by default** — it renders on the server, produces HTML, and **its JavaScript never reaches the browser**. A component becomes a **Client Component** only when its file starts with `"use client"`; then its code downloads, parses, and hydrates.

> **Think of `"use client"` as a doorway, not a label.** Once a file has it, that file *and everything it imports* becomes client code. It is contagious downward. `"use client"` at the top of the app = a client-side React app with extra steps. `"use client"` at the leaves = a fast server-rendered site with small islands of interactivity.

### The actual boundary

| Component | Client? | Why |
|---|---|---|
| `Navbar` | Yes | `useState` — mobile menu |
| `PropertiesClient` | Yes | filter/search state |
| `PropertyGallery` | Yes | `useState` — active image |
| `PropertyDetailClient` | Yes | `navigator.share` / clipboard |
| `ContactForm` | Yes | form state |
| **All other ~25 components** | **No** | no interactivity |

**Five client components out of thirty.** A genuinely good ratio, and the result of asking "does this need state or browser APIs?" per component rather than reflexively adding `"use client"` when something errors.

### Two places the boundary is drawn with real skill

**`PropertyDetailClient` — the surgical extraction.** The detail page is large: gallery, header, description, features, price breakdown, agent card, trust signals. Exactly one thing needs browser JavaScript — the Share button.

The lazy approach is `"use client"` at the top of the page, shipping all of it. Instead, a ~50-line component holds *only* the share button, and that is the page's entire client-side JS cost.

**The `…Client` suffix is the tell.** It announces purpose: *this exists to hold the client boundary*. Anyone reading the tree instantly sees where server ends and client begins. A recognised professional pattern, applied correctly twice.

**`PropertyCard` is a Server Component.** It renders images, badges, prices, and two buttons — one `<Link>`, one `<a>`. Both are plain HTML navigation, so **no state, no JavaScript shipped** — and it renders 6× on the homepage and 12× on the listings page.

> Beginners make cards client components because "cards have buttons." **A button that navigates is a link, and links do not need JavaScript.**

### The flaw

`PropertiesClient` is `"use client"` and renders `PropertyCard` inside its filter loop. Because `"use client"` is contagious, on `/properties` the card — a perfectly good Server Component on the homepage — becomes a Client Component, shipping its code plus `WhatsAppButton` plus the lucide icons all three use.

**The `children` pattern is the canonical fix:**

```tsx
<PropertiesClient>
  {properties.map(p => <PropertyCard key={p.id} property={p} />)}
</PropertiesClient>
```

A Client Component can *render* server-rendered children it receives as props — it just cannot *import* them.

**Not recommended right now**, because the filter needs the data to decide which cards to show. The clean version requires moving filter state into the URL and filtering on the server — a bigger change with a bigger payoff, which also fixes a live bug (§1.7). See Part 15 roadmap.

**Understand the trade-off even where the current code is right:** client-side filtering is *instant* but *unshareable* and *invisible to search engines*. At 12 properties, instant wins. At 300 listings with SEO ambitions — where `/properties?area=gra` should be an indexable landing page — server-side filtering wins decisively.

## 1.7 Data flow — and a live bug

`lib/data/properties.ts` carries three responsibilities: type definitions, the data, and six query helpers.

**The query-helper layer is the smartest thing in the codebase.**

```ts
export const getPropertyById = (id: string): Property | undefined =>
  properties.find((p) => p.id === id);
```

This is an **abstraction seam**. When the data moves to a database, six function bodies change:

```ts
export const getPropertyById = async (id: string) =>
  db.property.findUnique({ where: { id } });
```

Call sites barely move. With inline `.find()` calls you would hunt through every component instead.

> **Designing for change** does not mean building the database now. It means making sure adding it later is a contained edit rather than an archaeology project.

### Problem 1 — module-scope evaluation

`components/home/FeaturedProperties.tsx`:

```tsx
const featuredProperties = getFeaturedProperties();   // outside the component

export default function FeaturedProperties() { ... }
```

That call runs **once when the module is first imported**, not when the component renders. Works with a static array; breaks the moment the helper is async, because you cannot `await` at module scope in a component module and the value freezes at process start.

Every other component does this correctly — `AgentSection` maps inside render, `PropertyCard` calls `getAgentById` inside the component. So this is an inconsistency, not a pattern. The fix is moving one line inside the function; in a Server Component the cost is zero.

> **Module scope is for constants that are true forever** — config, lookup tables, enum maps. Anything derived from *data* belongs in render.

### Problem 2 — the filter links are broken

`Footer.tsx` links to:

```tsx
{ label: "Properties For Sale",   href: "/properties?type=sale" },
{ label: "Properties To Let",     href: "/properties?type=let" },
{ label: "Short-Let Apartments",  href: "/properties?type=shortlet" },
{ label: "Commercial Properties", href: "/properties?area=trans-amadi" },
```

`PropertiesClient.tsx` initialises:

```tsx
const [selectedType, setSelectedType] = useState("all");
const [selectedArea, setSelectedArea] = useState("all");
```

**Nothing in the codebase ever reads `searchParams`.** No `useSearchParams`, no `searchParams` prop.

All four footer links land on the completely unfiltered page. A user clicks "Short-Let Apartments," expects 2 listings, gets 12 mixed with no indication anything was meant to happen. The URL says one thing; the page says another.

**This is the classic failure of client-only state:** URL and UI are two sources of truth that silently disagree. It also means searches cannot be bookmarked or shared, and the back button does not undo a filter.

**One change fixes five things.** Read filter state from the URL instead of `useState` and you get: working footer links, shareable searches, bookmarkable filters, correct back-button behaviour, and indexable landing pages. **High priority.**

## 1.8 State management — the right amount of nothing

No Redux, Zustand, Context, or TanStack Query. Correct.

State libraries solve *shared* state — a cart, an auth session, a theme. This site has three pieces of state, each used by exactly one component: mobile menu (Navbar), filters (PropertiesClient), active image (PropertyGallery). Zero sharing, zero prop drilling.

> **Reach for a state library when state is shared, not when it is complex.** Complex local state is still local state. This is one of the most common over-engineering mistakes, and it was avoided.

`useMemo` on the filtered list is unmeasurable at 12 items but has a **correct and complete dependency array**, which is what makes it good practice rather than cargo-culting — and it becomes genuinely necessary at 500 listings.

> Learn to distinguish *premature optimization* (complexity for imagined performance) from *correct habit* (a standard pattern, applied correctly, at trivial cost, where it will matter).

## 1.9 TypeScript

**Strong foundation.** `strict: true` is on — non-negotiable, and without it `null` and `undefined` flow into every type.

**Union types instead of strings:**

```ts
export type PropertyType = "sale" | "let" | "shortlet";
export type TitleType = "C of O" | "Deed of Assignment" | "Governor's Consent" | "Deed of Conveyance";
```

With `type: string`, a typo — `"salle"` — compiles and produces a listing that silently vanishes from every filter. With the union it is a red squiggle before you save. You also get autocomplete and exhaustiveness checking: add a new member and TypeScript flags every switch and record that does not handle it.

> **The compiler maintains a to-do list of everything a change affects.** That is the real power, not the type annotations.

**Optional fields modelled correctly.** `priceBreakdown?: PriceBreakdown` forces a check before use, which is why `PropertyCard` handles the sale case — the type system made forgetting impossible.

**Nullish handling:** `agent?.whatsapp ?? "2340000000000"` correctly handles a genuinely possible failure.

### The design flaw — one type describing five products

```ts
export interface Property {
  price: number;              // ₦280m total? ₦4.5m/year? ₦95k/night?
  priceBreakdown?: PriceBreakdown;   // rentals only
  bedrooms: number;           // 0 for land, warehouse, office
  titleType: TitleType;       // meaningless to a 2-night guest
}
```

Symptoms visible throughout:

- `formatPrice(price, type)` must branch to append `/year` or `/night` — the number alone is ambiguous
- `.replace("/year", "")` appears **five times** on the detail page, undoing formatting that should not have been applied. A function fighting its own output.
- `bedrooms: 0` is a **sentinel value** meaning "not applicable" — every consumer must guard `property.bedrooms > 0`
- `titleType` is required on shortlets where it is irrelevant

**The senior model — discriminated unions:**

```ts
type Property =
  | { kind: "sale";     price: number; titleType: TitleType; ... }
  | { kind: "rental";   annualRent: number; priceBreakdown: PriceBreakdown; ... }
  | { kind: "shortlet"; nightlyRate: number; maxGuests: number; minNights: number; checkIn: string; ... };
```

TypeScript then *narrows* after checking `kind`. Inside `if (p.kind === "shortlet")`, `maxGuests` exists and `priceBreakdown` does not. **Impossible states become unrepresentable.**

**Not urgent at 12 listings** — but this is *why* the shortlet listings are weak products. The type has no room for guest capacity, minimum nights, check-in time, or house rules, so those fields do not exist, so the UI cannot show them.

> **A modelling decision became a product gap.** Data modelling is not a backend detail; it constrains what the UI is capable of saying.

## 1.10 Images

`next.config.ts` whitelists Unsplash. **Why the whitelist exists:** `next/image` fetches and re-encodes images on your server. Without an allowlist, anyone could hit `/_next/image?url=<any-url>` and turn your infrastructure into a free image-processing proxy you pay for.

**What `next/image` buys over `<img>`:** AVIF/WebP conversion (30–50% smaller), responsive srcsets, lazy loading by default, and reserved space to prevent layout shift (the CLS metric).

**Done right:**

- **`sizes` is correct throughout.** `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"` tells the browser how wide the image will actually be *before layout is computed*. Without it the browser assumes `100vw` and downloads a full-width file for a third-width card — roughly 3× the bytes for identical quality.
- **`priority` on above-the-fold images only.** Hero and gallery main image have it; `PropertyCard` correctly does not. The hero is almost always the LCP element, so preloading it directly improves Core Web Vitals. Preloading 12 card images would sabotage that.
- **`alt=""` on the decorative hero.** Correct: an empty alt tells screen readers to skip it. Describing "a modern house exterior" adds nothing when the headline beside it already says what the page is.

> **`alt=""` for decorative, descriptive `alt` for informative, never omit.** Omitting is worst — some screen readers read the filename, so users hear "photo dash 1613490493576 dash 7fde63acd811 dot jpg."

**The real problem: source images capped at 800px.** Every listing URL ends `?w=800`. Next can only optimize *down* from what it receives.

The gallery main image is `h-96` across a two-column span — roughly 800–900 CSS pixels wide on desktop, needing ~1800 physical pixels on a Retina display. **You supply 800.** Result: visibly soft photos on the page where photo quality drives the enquiry decision. The hero correctly uses `?w=1600`; the listings do not.

**Dead data:** every agent has `photo: "/images/agents/agent-N.jpg"`. Those files do not exist, and nothing renders the field — both agent components use icon/initial placeholders. A field that is never read and points at nothing is a trap for the next developer.

## 1.11 Fonts

```tsx
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
```

**What `next/font/google` does that a `<link>` cannot:**

1. **Self-hosting at build time** — files served from your domain, zero runtime requests to Google
2. **No render-blocking chain** — a `<link>` costs DNS + TLS + CSS fetch + font fetch, serially
3. **Zero layout shift** — Next computes a size-adjusted fallback so the font swap does not reflow. Hand-rolling this is genuinely difficult.
4. **Privacy/GDPR** — no user IP reaches Google, which has been the subject of actual EU rulings

`subsets: ["latin"]` avoids shipping Cyrillic and Vietnamese glyphs to a Port Harcourt audience.

**The waste: `Geist_Mono` is loaded and never used.** No `font-mono` class anywhere in the codebase. Leftover `create-next-app` scaffolding — one preloaded woff2 competing for bandwidth with the LCP hero on every cold visit. Delete it.

> **Scaffolding you never removed is a tax you pay on every page load forever.** `public/` tells the same story — five unused starter SVGs. And `README.md` is still untouched create-next-app boilerplate telling readers to run `bun dev`. For a portfolio piece, that is the first file a technical reviewer opens.

## 1.12 SEO & metadata — the biggest architectural gap

**Implemented:** title + description on all four pages, plus dynamic metadata per property.

```tsx
export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { id } = await params;
  const property = getPropertyById(id);
  if (!property) return { title: "Property Not Found — Meridian Properties NG" };
  return {
    title: `${property.title} — Meridian Properties NG`,
    description: `${property.description.slice(0, 155)}...`,
  };
}
```

Two things done properly: **the not-found case is handled** (commonly forgotten, and it crashes metadata generation), and **the description is sliced to 155 characters** — approximately Google's SERP truncation point. That is not an accidental number.

**Missing, measured against the project owner's own deploy checklist:**

| Requirement | Status |
|---|---|
| `metadata.title.template` | Missing |
| OpenGraph tags | Missing |
| Twitter card tags | Missing |
| `robots` metadata | Missing |
| `viewport` / `themeColor` | Missing |
| `app/opengraph-image.tsx` | Missing |
| `app/sitemap.ts` | Missing |
| `app/robots.ts` | Missing |
| JSON-LD structured data | Missing |
| Per-page canonical URLs | Missing |
| `metadataBase` | Missing |
| `app/not-found.tsx` | Missing |

**Twelve items on the project's own checklist, zero implemented.**

The three that matter most:

**1. No OpenGraph image = WhatsApp shares are invisible.** This is the most expensive omission on the site. The entire conversion strategy is WhatsApp. There is a Share button on the detail page. The intended flow is *find property → share to spouse/diaspora relative on WhatsApp → discuss → enquire.*

WhatsApp fetches the page and looks for `og:image`, `og:title`, `og:description`. There are none. So the share renders as a bare grey link.

A property share *should* be a rich card with the house photo and "₦280,000,000 — 5-Bedroom Duplex, GRA Phase 2" — the entire pitch, delivered inside the app where the decision happens. **The share button was built and the thing that makes sharing work was omitted.**

**2. No JSON-LD.** Structured data lets Google understand *"this page is a 5-bedroom house for sale in Port Harcourt at ₦280m"* rather than *"this page contains those words."* `RealEstateListing` / `Residence` schemas power price/bed/bath enrichments in results. A `LocalBusiness` / `RealEstateAgent` schema on the homepage feeds local pack results — for a business whose stated differentiator is a real physical office. Next 16 ships a guide at `node_modules/next/dist/docs/01-app/02-guides/json-ld.md`.

**3. No `app/not-found.tsx`.** The detail page calls `notFound()` for unknown IDs, which currently renders Next's default black-and-white 404 — no navigation, no branding, no way back. A custom 404 with a logo, a "Browse Properties" button, and a WhatsApp link recovers that visitor. It is a 30-line file.

> **SEO and metadata are invisible during development.** The site looks finished, nothing errors, the build passes clean. Invisible work is the work that gets skipped, and it is usually the work that determines whether anyone finds the site.

## 1.13 Naming

**Consistent and correct:** PascalCase components, camelCase utilities, lowercase route files (dictated by Next), kebab-case shadcn primitives (a deliberate signal that they are generated), `…Client` suffix for boundary components.

> Naming is a communication protocol with your future self. When `PropertyCard.tsx` is PascalCase and `properties.ts` is camelCase, the filename alone tells you which is a component. **The cost of inconsistency is paid on every read, forever.**

**Two names that lie:**

**`components/home/Testimonials.tsx` contains no testimonials.** It holds three value propositions with icons. Not one customer quote, name, or review. Three problems: the file lies; it duplicates `WhyChooseUs` (same three claims, three sections earlier); and it reveals a conversion hole — the filename is a fossil of a homepage that was designed to include social proof, where the proof was never written and a value-props section was dropped into the slot. **The site has zero social proof of any kind.**

**`components/home/AgentSection.tsx` exports `AgentsSection`.** It works, which is why it is a trap: `grep AgentSection` misses the definition, `grep AgentsSection` misses the file.

## 1.14 Dead code

| Item | Status |
|---|---|
| `ui/sheet.tsx` (147 lines) | Never imported |
| `ui/card.tsx` (103 lines) | Never imported |
| `ui/badge.tsx` (49 lines) | Never imported |
| `ui/separator.tsx` (28 lines) | Never imported |
| `Geist_Mono` | Loaded, never used |
| `agent.photo` | Never rendered, files absent |
| `public/*.svg` (5 starter assets) | Unused |
| `getPropertiesByArea`, `getPropertiesByType` | Never called |

**Correction to a common misconception:** unused *modules* cost nothing at runtime — Turbopack tree-shakes them and they never enter the bundle. This is a comprehension problem, not a performance one.

**But it points at a real inconsistency:** `Navbar` hand-rolls a mobile menu with `useState` while `sheet.tsx` — an accessible slide-out built on Radix with focus trapping, escape-to-close, and proper ARIA — sits unused three folders away. The hand-rolled version has none of those behaviours. **The right tool was installed and a worse version was built by hand.**

**Leave the two unused query helpers.** They are four lines each, they complete the data layer's API surface, and they are exactly what area landing pages would use. Dead *primitives* are noise; a coherent data API is not.

## 1.15 The artificial delay

`app/properties/page.tsx`:

```tsx
export default async function PropertiesPage() {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return <PropertiesClient properties={properties} />;
}
```

Almost certainly added to observe `loading.tsx`, which is a reasonable thing to do while learning.

**But the build output says `/properties` is Static.** The page has no dynamic data sources, so Next prerenders it. **The `await` runs once, during `npm run build`.** In production, users receive prebuilt HTML instantly, `loading.tsx` never appears, and the delay slows only the build.

Three lessons stacked in one bug:

1. **`async` does not mean "runs on every request."** A static page's async work is build-time work. Knowing *when* code executes — build, request, or client — is fundamental to reasoning about Next.js.
2. **`loading.tsx` needs something to actually wait for.** It is a Suspense fallback; static pages have nothing to suspend on.
3. **Debug scaffolding must be deleted before it becomes permanent.** The blank lines around it are the fingerprint of temporary code. It survived at least one commit.

Delete it. `loading.tsx` and `error.tsx` then remain as correct scaffolding — and `error.tsx` correctly uses Next 16's `unstable_retry` prop (verified against the local docs), not the older `reset`.

## 1.16 Scalability

**Scales as-is:** component architecture, the query-helper seam, the type system, the server/client discipline, static generation.

**Breaks, in order:**

| Limit | Breaks at | Why |
|---|---|---|
| Adding a property needs a deploy | listing #13 | No CMS; agency cannot self-serve |
| Whole dataset serialized to client | ~100 | Full array in the RSC payload every visit |
| No pagination | ~50 | 50+ cards, 50+ images, one scroll |
| **Filters not in URL** | **now** | Footer links already broken |
| No sort | ~30 | Cannot order by price — table stakes |
| No saved/favourites | ~30 | No cross-session comparison |
| Single flat data file | ~50 | 563 lines already |

**The code architecture scales further than the content architecture.** Components, types, and boundaries are built to grow; the data layer is a hardcoded array requiring a developer for every change.

> **The question that decides it: "who adds property #13, and do they know what a git commit is?"** Ask it before writing a line of code on a client project. Getting it wrong is how developers become unpaid data-entry staff, permanently.

---
# PART 2 — BUSINESS MODEL, BRAND & POSITIONING

This part precedes the page audits deliberately. You cannot judge a headline until you know what the business sells, to whom, and what a converted visitor is worth. Agencies that skip this produce redesigns that look better and convert worse.

## 2.1 Business classification

| Category | Verdict | Evidence |
|---|---|---|
| Individual Agent | No | Three named *desks*, not people |
| **Agency (brokerage)** | **Yes** | Lists owners' properties, earns fees, physical office |
| Developer | No | Nothing built or off-plan, no payment plans |
| Marketplace | No | Single-source inventory, no external agents |
| Investment Company | No | Brokers rather than holds |
| Rental Company | Partial | 5 of 12 rentals, brokered not owned |
| Property Management | Implied | Shortlets imply it; never stated as a service |
| Commercial RE | Partial | 2 of 12 |

**Traditional full-service estate agency with a small commercial arm and an undeclared shortlet sideline.** The most common real estate business type in Nigeria — good choice for a portfolio piece, because the patterns transfer to almost any local agency client.

## 2.2 The five-businesses problem

| Product line | Count | Customer | Decision cycle | Price |
|---|---|---|---|---|
| Residential sale | 4 | Family / executive | 3–12 months | ₦95m – ₦550m |
| Land sale | 1 | Investor / self-builder | 1–6 months | ₦45m |
| Residential rental | 3 | Tenant | 2–6 weeks | ₦1.8m – ₦8m/yr |
| Commercial / industrial | 2 | Business, oil services firm | 1–4 months | ₦12m – ₦18m/yr |
| Shortlet | 2 | Traveller | **10 minutes** | ₦85k – ₦120k/night |

**Five distinct businesses sharing one navigation, one card design, one CTA, and one trust argument.**

A logistics director seeking an 800sqm Trans-Amadi warehouse and a traveller booking two nights in Woji are not the same person, want different information, decide on different timescales, and are worth vastly different amounts. `PropertyCard` renders both identically.

The `bedrooms: 0` sentinel is where this cracks visibly. The warehouse, office, and land all carry `bedrooms: 0`, and the card guards with `{property.bedrooms > 0 && ...}` — so those cards **render nothing** where every other card shows specs.

A land buyer sees a title, a location, a title badge, and a price. **The specs that matter for land — plot count, dimensions, topography, road access — are not in the type system, so the card shows empty space instead.** The information exists in the description prose; the card cannot reach it.

> One data model serving five products means the UI can only display the *intersection* of what all five share. The intersection is small, so every product is under-described — and the most valuable ones, with the most distinguishing detail to lose, are under-described worst.

**For a portfolio piece, narrowing would strengthen it.** Twelve listings across five product types reads as data seeding. Eight residential listings, each fully specified with the fields that product genuinely needs, reads as someone who modelled a business. **Breadth signals "I generated test data." Depth signals "I understood a domain."**

## 2.3 Revenue model — the number that should drive every design decision

The site never states how the business earns, but it shows you in the one place that matters:

```ts
priceBreakdown: { rent: 8000000, agencyFee: 800000, legalFee: 800000, cautionDeposit: 1000000 }
```

**Agency fee: exactly 10% on every rental** — standard Nigerian practice. Sales commission is not shown; market norm is ~5%.

| Line | Total value | Est. commission |
|---|---|---|
| 5 sales (₦280m, ₦550m, ₦95m, ₦45m, ₦420m) | ₦1.39bn | ~₦69.5m @ 5% |
| 5 rentals | ₦43.3m/yr | ₦4.33m (stated in data) |
| 2 shortlets | ₦85k–120k/night | ~₦20–24k/night @ 20% |

**Per-conversion value:**

| Converted lead | Agency earns | Relative |
|---|---|---|
| prop-004 — ₦550m mansion | ~₦27,500,000 | **1,145×** |
| prop-011 — ₦1.8m/yr flat | ₦180,000 | 7.5× |
| prop-003 — one shortlet night | ~₦24,000 | 1× |

**One mansion sale is worth more than a thousand shortlet nights, and the site treats those leads identically** — same card, same grid position, same green Enquire button, same prefilled message.

When lead values differ by 1,000×, the site's job is not to maximise lead *count* but lead *value*. That changes decisions you would otherwise make on instinct:

- **Sort order is not neutral.** The grid renders in array order. Default-sorting price-descending puts the ₦550m listing first — revenue-weighted merchandising, which is why every luxury brokerage does it.
- **Featured selection is not neutral.** Six properties are `featured: true` — 3 sales, 1 rental, 1 shortlet, 1 commercial: a *representative sample*. Representativeness is the wrong objective for the most valuable slots on the site. The ₦550m and ₦420m listings share one slot between them.
- **Not every enquiry deserves the same friction.** A shortlet enquiry should be one tap. A ₦550m buyer *should* meet a qualification step, because agent time is scarce and a serious buyer will happily answer three questions.

> **Design friction in proportion to lead value.** Low-value/high-volume → remove every obstacle. High-value/low-volume → qualification is a feature, not a leak. Most sites apply one setting to everything.

## 2.4 Services offered vs. services visible

`ContactForm.tsx` offers seven enquiry types. The site's content covers two and a half.

| Service | In the form | Content on the site |
|---|---|---|
| Buy | Yes | Full — listings, detail pages, trust arguments |
| Rent | Yes | Full — including the move-in cost breakdown |
| Shortlet | Yes | Two listings, no shortlet-specific content |
| **Sell / list a property** | Yes | **Not one word, anywhere** |
| **Invest** | Yes | **Not one word, anywhere** |
| Diaspora | Yes | Four passing mentions, no dedicated content |

**The seller gap is the expensive one.** In a brokerage, listings are the *supply side* — no mandates, no inventory, no commissions. Sellers actively search ("how to sell my house in Port Harcourt"), convert at high intent, and produce the asset the business runs on. A serious agency site has a *Sell Your Property* page: fees, marketing approach, timelines, documents required, title verification on the seller's behalf.

Meridian has a dropdown option. A seller sees four pages about buying and leaves.

> **Diagnostic habit:** open the contact form's dropdown on any site and ask, *"does this site have content for each option?"* Every option without supporting content is either a page you owe the business or an option to remove. Form-to-sitemap mismatches are among the fastest ways to find missing revenue lines.

## 2.5 Target audience

| Audience | Evidence | Served? |
|---|---|---|
| Oil & gas executives, diplomats | prop-001 description | Named in one listing, never in site copy |
| Mid-market families | Woji/Eliozu/Ada George inventory | Yes |
| **Diaspora buyers (UK/US/Canada)** | Named in 4 places | **Named, never served** |
| Corporate / oil services tenants | prop-012 description | Two listings, zero commercial content |
| Shortlet guests | 2 listings | No guest-facing content |
| Sellers | Form dropdown only | No |
| Investors | Form dropdown only | No |

Naming "oil and gas executives" and "Trans-Amadi logistics operators" is **genuinely good copywriting** — specific, locally credible, signalling real market knowledge. Generic sites say "discerning buyers."

The problem: that specificity lives inside individual property descriptions — the deepest, least-visited content — and never surfaces into positioning, headlines, or page structure where it would attract those people.

## 2.6 The diaspora opportunity — the biggest miss

**Everything the site says about diaspora buyers:** one card in `WhyChooseUs`, a 2020 milestone in `CompanyStory`, a badge in `AboutHero`, one dropdown option. Roughly 40 words. No page, no process, no proof.

**Why this is the most valuable segment:**

1. **They pay cash** — no mortgage chain, the fastest and cleanest transactions in the market
2. **They buy at the top of the range** — the ₦280m–₦550m stock
3. **Their pain is most acute** — buying remotely in a market with widespread title fraud, unable to inspect, relying entirely on someone's word
4. **They are hardest for local competitors to serve**, because serving them requires exactly what Meridian claims: verified titles, transparent pricing, video walkthroughs, escrow

**The positioning writes itself: Meridian's entire differentiation is a solution to the diaspora buyer's specific nightmare.** Verified titles matter most when you cannot inspect. Transparent pricing matters most when you cannot ask a neighbour. Escrow matters most when wiring money from 5,000 miles away.

**And it is buried in card three of a four-card grid.**

What is missing — a page, not a paragraph:

- `/diaspora` explaining **how buying from abroad works**, step by step, with timescales
- What "escrow payment options" concretely means — which escrow, whose account, what triggers release
- What "document verification" means — who verifies, against which registry, what the client receives
- A sample video walkthrough, proving the service exists
- Time-zone-aware contact (a UK buyer messaging 9pm GMT is 10pm WAT — the "within 30 minutes during office hours" promise silently fails)
- Currency context — someone thinking in GBP has no reference for ₦280,000,000
- Diaspora-specific testimonials, since this segment's trust bar is highest

## 2.7 Primary conversion goal

`WhatsAppButton` appears in the navbar, hero, three agent cards, CTA banner, footer, twelve property cards, the detail page, three full agent profiles, the office section, and the contact sidebar — **and the contact form itself submits to WhatsApp.**

**Primary goal: send a WhatsApp message. Secondary: phone call. There is no third.**

**This is correct and market-aware.** Nigeria is a WhatsApp-first market — the default commerce channel, not a fallback. A Western template leading with "Request a Callback" and a six-field form would convert far worse. Choosing the channel the market actually uses and committing fully is real strategic judgment.

**The execution is good too:**

```ts
const whatsappMessage = `Hello, I am interested in this property: ${property.title} located at ${property.location}. Please provide more details.`;
```

The detail page goes further — addressing the agent by name and explicitly requesting an inspection.

> **Why prefilled messages matter more than they look:** the biggest friction in WhatsApp lead-gen is not opening the chat, it is the blank message box — deciding how formal to be, what to ask, whether you sound serious. Many abandon there. A prefilled message removes composition entirely and arrives with the property already identified, so the agent never opens with "which property?" **Friction removed on both sides of the conversation.**

**Three flaws:**

1. **No URL in the message.** With similar titles ("3-Bedroom Flat — For Rent" vs "3-Bedroom Flat — Fully Furnished") the agent still disambiguates. Appending the property URL is one line, removes ambiguity, and lets the agent click straight through.
2. **All three agents share one number** (`2340000000000`). Placeholder data — but the site claims *"a dedicated sales desk you can reach directly"* and *"not a faceless inbox"* while routing every enquiry to one inbox.
3. **No "Schedule a Viewing" anywhere.** **The micro-conversion that predicts a transaction is the inspection booking, not the enquiry.** "I'm interested" is a browsing signal; "Saturday 2pm works" is a buying signal. Agencies track viewings-per-week because that number forecasts revenue. The site has no viewing request, no availability, no calendar.

## 2.8 Where the leads go: nowhere

**Every conversion path leaves the site.**

| Path | Destination | Data retained |
|---|---|---|
| WhatsApp (×20+) | `wa.me` — external | **None** |
| Phone | Native dialer | **None** |
| Email | Mail client | **None** |
| **Contact form** | **`wa.me` — external** | **None** |

`ContactForm.tsx` collects name, phone, email, enquiry type, and message — then URL-encodes it, waits a fake `setTimeout(1000)`, and calls `window.open()`. **The data is never stored or sent anywhere. It lives in React state and is destroyed on navigation.**

Consequences compound:

- **Zero owned audience** — no list to nurture, nothing that survives someone changing their mind three months later, which is *most* of a property sales cycle
- **Zero attribution** — which listing drives enquiries? Which page? Unknowable. The business cannot learn from its own traffic.
- **Silent total loss on abandonment** — if `window.open` is popup-blocked, or WhatsApp is absent, or the tab closes mid-handoff, the lead vanishes. And **the UI has already shown the green success screen**, so nobody knows anything failed. *The success state is displayed before the success actually happens.*
- **No follow-up** — a business with no record of enquiries converts only people ready today

> **This website generates conversations, not leads** — the difference is whether anything survives the conversation.

## 2.9 Positioning

**Who they are — clear.** Stated in the title tag, navbar, hero, footer, and about page.

**Who they serve — partial.** The hero names *"buyers, tenants, and diaspora investors"*; the content serves buyers and tenants. Naming an audience you do not serve is worse than not naming them — the diaspora investor feels seen, finds nothing, and concludes it was marketing language.

**Why they are different — clear and well-chosen.** Four pillars: verified titles, transparent all-in pricing, direct local agents, diaspora-friendly.

**This differentiation is strategically correct.** Weak differentiation is self-focused and unfalsifiable — "quality service," "customer-first." Everyone claims it, nobody can disprove it, nobody believes it. Meridian's pillars each name **a specific fear the customer already has**:

| Pillar | The fear it answers |
|---|---|
| Verified titles | *"I'll buy land that isn't legally sellable"* |
| Transparent pricing | *"They'll spring agency + legal + caution fees after I commit"* |
| Direct local agents | *"I'll be passed around and nobody will own my case"* |
| Diaspora-friendly | *"I can't inspect it and I'll be defrauded from abroad"* |

> **Strong positioning is built from the customer's fears, not the company's virtues.** "We're professional" is a virtue. "Every listing shows the actual title type — no vague 'good title' claims" is a fear, answered. The second converts, because it proves you know what keeps the customer awake.

`WhyTrustUs` is the sharpest expression — six rows of Meridian ✅ / Most Others ❌, each a *checkable behaviour* rather than an adjective. **It is the strongest strategic asset on the site, and it is buried on the About page.**

## 2.10 The proof gap — the central contradiction

**Every trust claim is self-asserted. There is no external evidence anywhere.**

| Claim | Evidence provided |
|---|---|
| "Port Harcourt's Most Trusted" | None — trusted by whom, measured how? |
| "Verified title documents" (8+ places) | None — verified by whom, against what registry? |
| "Founded 2016" | None, and never surfaced on the homepage |
| "Nigeria loses ₦100bn yearly to fraud" | No source cited |
| "We respond within 30 minutes" | None |
| "A referral-led client base" | Not one referral shown |
| "Real people, real results" | Zero results, zero real people |

**And the absences:** zero testimonials, zero reviews, zero case studies, zero statistics, zero certifications (no NIESV or ESVARBON registration — precisely the credential a fraud-conscious Nigerian buyer looks for), zero CAC/RC number, zero named partners despite advertising escrow, and **zero real photographs** — no office photo, no team photo, no agent headshots. The office is offered as proof of legitimacy — *"a real physical office you can walk into. No P.O. boxes"* — **with no photograph of it.**

> **This is a website about verification that provides no verification of itself.** It asks a fraud-wary buyer to trust unverified claims about its trustworthiness. The more emphatically it repeats "verified," "trusted," "transparent," the more a sceptical visitor — exactly the visitor this positioning attracts — notices none of it is backed. **The positioning strategy actively creates scrutiny the site cannot withstand.**

**The diagnostic pattern.** Three components are *named* for proof:

| Component | Name promises | Actually contains |
|---|---|---|
| `StatsBar.tsx` | Statistics | Four adjectives — "Verified", "Transparent", "Local", "Trusted". **Not one number.** |
| `Testimonials.tsx` | Testimonials | Three value propositions. **Not one quote.** |
| `WhyTrustUs.tsx` | Reasons to trust | Six self-scored rows. **No third-party validation.** |

**Three proof slots, all filled with more claims.** Fossils of a homepage that knew it needed social proof; when the proof did not exist, the slots got restated positioning instead.

**`StatsBar` shows how cheap the fix is.** A stats bar's psychological function is that **numbers are falsifiable and adjectives are not.** "312 properties sold" invites verification; "Trusted" invites nothing. Even with invented portfolio data:

```
9 Years   →  Serving Port Harcourt since 2016
312       →  Properties sold and let
₦4.2bn    →  Transacted for our clients
100%      →  Listings with verified title
```

Same component, same layout, same effort — and "9 Years" is *already true per the About page*; the site simply never says it where anyone will see it.

> **Claims are free. Evidence is expensive. Users price them accordingly.** Anyone can write "most trusted." Nobody can fake a Google rating with 47 reviews, a named client quote with a photo, a CAC number, or a professional body membership. Users discount free claims automatically — so the seventh repetition of "verified titles" does not reinforce the first six, it *devalues* them, because unsupported repetition is what low-trust businesses do.

| Level | Approach |
|---|---|
| Bad | "We are the most trusted agency" — pure assertion |
| **Adequate** | **"Every listing shows its title type" — a checkable practice. Where this site is.** |
| Good | The practice, plus a named client saying it worked |
| Excellent | The practice, a named client, a Google rating, a CAC number, an NIESV membership, and a photo of the office you claim exists |

## 2.11 Brand personality, tone & messaging

**Tone: earnest, plain-spoken, deliberately anti-hype.** The best line on the site:

> *"We are not the biggest agency in Port Harcourt. We aim to be the most honest one."*

Conceding a weakness to make a strength credible is a real persuasion technique — it signals you are not claiming everything, which makes the claim you *do* make land harder. It works precisely because it is the only concession on the site.

Voice is consistent across 20+ components written at different times, which is genuinely difficult.

**Where it fails: repetition without escalation.** The trust triad appears in **seven places**. On the homepage alone a visitor reads it **three times in one scroll** — `StatsBar`, `WhyChooseUs`, `Testimonials`. Same claims, different icons.

| Level | Pattern |
|---|---|
| Bad | Different message every section — no identity |
| **Good** | **One message, stated consistently. Where this site is.** |
| Excellent | One message, each restatement *escalating*: claim → mechanism → proof → guarantee |

The excellent version here: hero **claims** verified titles → a section explains the **mechanism** (our 4-step verification process) → a testimonial **proves** it (a named client whose title check caught a problem) → a **guarantee** closes it ("if title doesn't verify, we refund your inspection fee"). Same theme four times, with confidence rising at each step instead of flattening after the second.

## 2.12 Is the business memorable?

**The positioning is memorable. The brand is not.**

Someone reading carefully will remember *"the agency that shows you all the fees upfront."* That is a sticky, differentiated idea. They will not remember "Meridian."

| Element | Current | Problem |
|---|---|---|
| Name | Meridian Properties | Generic — one of the most-used property names worldwide, zero Nigerian association |
| Logo | Lucide `Home` icon in a blue square | A placeholder — and **the Footer uses `MapPin` instead of `Home` for the same brand** |
| Colour | `blue-600` | The most default colour in software — every bank, every SaaS |
| Type | Geist | Vercel's font, the `create-next-app` default |
| Photography | Unsplash stock | **Not one image resembles Port Harcourt** |

**The logo inconsistency:** navbar shows a house, footer shows a map pin. Nobody consciously notices — but brand recognition is built through *exact* repetition, so a mark that changes between header and footer never accumulates recognition at all. Two-character fix.

**The photography point is sharpest.** The core differentiator is *local Port Harcourt expertise* — knowing GRA from Woji, knowing Trans-Amadi is the oil-services corridor. Every image is a generic Western house that could be in Phoenix. **The imagery actively contradicts the positioning**, and the audience most likely to notice is the one that matters.

**For a portfolio piece this compounds.** A reviewer sees `blue-600` + Geist + Unsplash and reads *tutorial defaults* — three signals that design decisions were skipped rather than made. The irony: the strategic thinking here is well above average and the visual expression is entirely average, so the work reads weaker than it is.

## 2.13 Conversion goal support — scored

| Goal | Supported | Notes |
|---|---|---|
| WhatsApp enquiry | **Excellent** | 20+ entry points, context-aware prefills |
| Phone call | Good | `tel:` correct; only 3 locations |
| Email enquiry | Weak | `mailto:` in two places, no form-to-email |
| **Schedule a viewing** | **Absent** | The conversion that predicts revenue |
| **Lead capture / retention** | **Absent** | Nothing stored, anywhere |
| Download brochure / lead magnet | Absent | No reason to give an email |
| Book consultation | Absent | — |
| **Seller mandate** | **Absent** | Supply side of the business, invisible |
| Shortlet booking | Absent | Nightly rate shown, no availability |
| Create account / save | Absent | **Correct omission** |

## 2.14 Part 2 scores

| Dimension | Score | Rationale |
|---|---|---|
| Business clarity | 8/10 | Type, services, audiences legible from the site |
| Positioning strategy | 8/10 | Fear-based pillars genuinely well chosen |
| **Positioning credibility** | **3/10** | Zero evidence behind any claim |
| Audience targeting | 5/10 | Named specifically, served partially |
| Conversion goal clarity | 9/10 | Unambiguous, market-appropriate |
| Conversion goal completeness | 4/10 | One path works; viewing, capture, seller, shortlet absent |
| Brand distinctiveness | 3/10 | Defaults throughout; imagery contradicts positioning |
| Messaging consistency | 8/10 | Coherent voice, over-repeated content |

> **Verdict: a well-positioned business with a credibility gap — it has chosen exactly the right thing to be known for, and provided no evidence that it is.**

---

# PART 3 — INFORMATION ARCHITECTURE & PAGE-BY-PAGE AUDIT

## 3.1 Navigation

Four links — Home, Properties, About, Contact — plus a WhatsApp CTA. Flat, no dropdowns.

**Correct for four pages.** Dropdown menus exist to manage depth; with four destinations they add interaction cost for nothing. Flat navigation also means every page is one click from every other page, which is the ideal for a small site.

**What is right:** the logo links home (a universal convention users rely on unconsciously); the CTA is visually distinct from the links, so navigation and action never compete; mobile collapses to a hamburger with `aria-label` and `aria-expanded` correctly set.

**What is wrong:**

**1. No active state.** Nothing indicates the current page — no visual treatment, no `aria-current="page"`. The user has no orientation cue, and screen reader users get no announcement of where they are.

This is a two-line fix using `usePathname()` (the Navbar is already a Client Component, so there is no boundary cost):

```tsx
const pathname = usePathname();
// ...
<Link
  href={link.href}
  aria-current={pathname === link.href ? "page" : undefined}
  className={pathname === link.href ? "text-blue-600" : "text-slate-600"}
>
```

> **Orientation is one of navigation's three jobs** — *where am I*, *where can I go*, *how do I get back*. This navbar answers two of three.

**2. The mobile menu is hand-rolled and incomplete.** No focus trap, no Escape-to-close, no body scroll lock, no `aria-controls` linking button to panel. Meanwhile `ui/sheet.tsx` — which has all of this — sits unused. Details in Part 8.

**3. No breadcrumbs.** The property detail page has a "Back to Properties" link, which is a partial substitute but not equivalent: breadcrumbs show *hierarchy* (Home › Properties › GRA › this house), a back link shows only one step. Breadcrumbs also produce `BreadcrumbList` structured data, which Google renders in results instead of a raw URL.

## 3.2 Page inventory vs. checklist

| Page | Status | Verdict |
|---|---|---|
| Home | Present | — |
| About | Present | Strongest content on the site |
| **Services** | **Missing** | Services are implied, never listed |
| Properties | Present | — |
| Projects | Absent | **Correctly absent** — a developer feature, not a brokerage one |
| Agents | Section only | Acceptable at 3 desks; becomes a page at ~8 agents |
| Contact | Present | — |
| **FAQs** | **Missing** | Significant — see Part 10 |
| **Blog** | **Missing** | Largest long-term SEO miss |
| **Resources** | **Missing** | No guides, no calculators, no lead magnet |

**Pages that should exist, ranked by business value:**

| # | Page | Why | Effort |
|---|---|---|---|
| 1 | **FAQ** | Objection handling at scale; feeds AI answers later; strong SEO for question queries | Half day |
| 2 | **Sell Your Property** | The supply side of a brokerage is completely invisible | Half day |
| 3 | **Diaspora Buyers** | Highest-value segment, best product fit, currently 40 words | 1 day |
| 4 | **Area guides** (`/areas/gra`, `/areas/woji`…) | *"3 bedroom flat for rent in GRA Port Harcourt"* is the actual search query. Eight pages of pure organic intent. | 1–2 days |
| 5 | Services | Clarifies the offer; supports the missing dropdown options | Half day |
| 6 | Blog / Insights | Long-tail organic, demonstrates expertise | Ongoing |
| 7 | 404 | Currently a branded dead end | 30 min |
| 8 | Privacy / Terms | On the project's own deploy checklist | 1 hour |

**The area guides deserve emphasis.** The site's stated differentiator is local expertise, and it has *zero* content about any area — no description of GRA, no explanation of why Trans-Amadi is industrial, no guidance on which neighbourhood suits which buyer. Eight area pages would simultaneously prove the core claim, capture the highest-intent search traffic in the market, and give the existing `getPropertiesByArea` helper — currently dead code — a purpose. **This is the single highest-value content addition available.**

## 3.3 URL structure

```
/properties/prop-001     ← current
/properties/5-bedroom-detached-duplex-gra-phase-2   ← should be
```

Opaque IDs cost three things: **SEO** (the URL is a ranking signal and keywords in it match query terms), **shareability** (a pasted link tells the recipient nothing), and **trust** (`prop-001` looks like a database row, not a home).

The fix is a `slug` field on `Property` and renaming the dynamic segment to `[slug]` — with the ID retained internally as the stable key. Do it before the site is indexed; afterwards it requires redirects.

## 3.4 Page relationships

```
Home ──→ Properties ──→ Detail ──→ WhatsApp (exit)
 │                                       ↑
 ├──→ About ─────────────────────────────┤
 └──→ Contact ───────────────────────────┘
```

**Every path terminates at WhatsApp, off-site.** Nothing loops back. Specifically:

- **No similar/related properties** on the detail page. A user who rejects one listing has no next step except the back button. This is the highest-value missing link on the site: a visitor on a detail page has already demonstrated interest in a *type* of property, and showing three similar ones converts browse-depth into enquiries. Trivial to build with the existing `getPropertiesByArea` and `getPropertiesByType` helpers.
- **No cross-linking between areas.** `property.location` is plain text, not a link to an area page (which does not exist).
- **The About page's best asset is stranded.** `WhyTrustUs` — the strongest persuasion on the entire site — sits on a page most visitors never reach.

> **Internal linking is not an SEO chore; it is how you keep an interested user moving.** Every page should answer "what would this person want next?" Right now three of five pages answer "leave."

## 3.5 `/` — Homepage

| | |
|---|---|
| **Purpose** | Establish credibility, present inventory, route to enquiry |
| **Business goal** | WhatsApp enquiry or listings browse |
| **Audience** | All six personas — largely undifferentiated |
| **Primary CTA** | "Browse Properties" |
| **Secondary CTA** | "Talk to an Agent" (WhatsApp) |
| **Hierarchy** | Hero → trust → product → differentiation → people → values → close |

**Strengths:** correct funnel shape (attention → trust → product → proof → close); product appears by section 3, which is early enough; dual CTA gives both the browser and the ready buyer a path; consistent visual rhythm at `py-16`.

**Weaknesses:**

**1. No search on the homepage.** This is the most significant structural gap. **Every major real estate site on earth opens with a search widget** — Rightmove, Zillow, PropertyPro, Nigeria Property Centre. It is the single most established pattern in the category.

The reason is behavioural: a property visitor arrives with *criteria in mind* — an area, a budget, a bedroom count. A search field lets them act on intent immediately. "Browse Properties" asks them to abandon their criteria, load an undifferentiated grid, and rebuild those criteria in a filter bar on the next page.

> **Meet intent where it arrives.** A hero search converts intent into a filtered result in one action; a browse button converts it into three.

The fix reuses everything already built: a type + area + price widget in the hero that links to `/properties?type=sale&area=gra` — which requires URL-driven filters, the same change that fixes the broken footer links. **Two of the site's largest problems share one solution.**

**2. Two homepage sections make the same argument.** `WhyChooseUs` (section 4) and `Testimonials` (section 6) both present the trust triad. Section 6 should hold real social proof.

**3. Nothing for sellers, investors, or the diaspora** — three of the seven customer types the contact form recognises.

## 3.6 `/properties` — Listings

| | |
|---|---|
| **Purpose** | Browse and filter inventory |
| **Business goal** | Drive to detail pages, then enquiry |
| **Primary CTA** | "View Details" |
| **Secondary CTA** | "Enquire" (WhatsApp, direct from card) |

**Strengths:**

- **Sticky filter bar** (`sticky top-16`) — stays available while scrolling. Correct: filters that scroll away force a scroll-up to refine, which measurably reduces refinement.
- **Live result count** — *"Showing 7 properties matching your search"* provides feedback that the filter did something. Filters without a count leave users unsure whether anything changed.
- **Genuinely good empty state** — icon, explanation, and a "Clear Filters" recovery action. Most sites ship a bare "No results found," which is a dead end. This one offers the way out.
- **Price ranges adapt to property type** — selecting "Short Let" swaps ₦50m–₦300m brackets for ₦85k–₦120k/night. Thoughtful, and prevents the nonsensical combinations a single global price range would produce.
- **Dual clear-filter affordances** — in the bar and beside the result count.

**Weaknesses:**

1. **No URL state** — footer links broken, nothing shareable or bookmarkable, back button does not undo filters, no indexable filtered pages
2. **No sort** — cannot order by price or recency. Table stakes on any listings page, and the absence is conspicuous.
3. **No bedroom / bathroom / size filters** — bedroom count is among the top three filters on every property portal
4. **Price filter disabled until a type is chosen** — defensible (the brackets are type-specific) but presented as a disabled control reading "Select a type first," which reads as broken before it reads as sequential. A single unified range with dynamic bounds would remove the dependency.
5. **No pagination or lazy loading** — fine at 12, breaks at 50
6. **No saved/favourites** — `localStorage` would deliver this without accounts
7. **Page header is decorative** — a dark band with "All Properties" and a subtitle, costing a full screen band above the filters without conveying anything the `<h1>` alone would not

## 3.7 `/properties/[id]` — Property detail

**The best page on the site.**

| | |
|---|---|
| **Purpose** | Provide enough information to trigger an enquiry |
| **Business goal** | WhatsApp enquiry to the listing agent |
| **Primary CTA** | "WhatsApp Agent" (sticky sidebar) |
| **Secondary CTA** | "Call Agent" |

**Strengths:**

- **Sticky price card** (`sticky top-24`) — the CTA follows the user through a long page. Correct application of the most reliable pattern in property UI.
- **The move-in cost breakdown is the single best feature on the site.** Rent, agency fee, legal fee, caution deposit, and a computed total. In a market where hidden fees are the primary complaint, showing the agency's own 10% cut is a genuinely bold trust move, and it is the one place the site's positioning is *demonstrated* rather than asserted.
- **Title type as a badge** — surfaces the differentiator at the decision point
- **Two-column layout with content left, actions right** — matches the F-pattern of Western reading and keeps CTAs in the persistent right rail
- **Trust signals repeated in the sidebar** at the moment of decision — the correct place for reassurance
- **Clean information order:** gallery → identity → specs → description → features

**Weaknesses:**

1. **No map.** The only map on the site is on the About page showing the office. **A property page without a location map is incomplete** — location is the primary decision variable in real estate, and `property.location` is currently plain text. For a diaspora buyer who cannot visit, this is close to disqualifying.
2. **No similar properties** — the page is a dead end on rejection
3. **No floor plan** — expected on sales at ₦95m–₦550m
4. **No video or virtual tour** — despite the site *promising* video walkthroughs to diaspora buyers
5. **No viewing booking** — the conversion that predicts revenue
6. **No property status** — available / under offer / let. Nothing signals scarcity or freshness.
7. **No listing date** — buyers use recency to judge whether a property is fresh or stale
8. **Mobile column order is wrong** — see below
9. **Duplicate title badge** — the title type appears both as an overlay on the gallery and as a green row beneath
10. **`"Why Buy Through Meridian?"` shows on rentals and shortlets** — wrong verb for a tenant and absurd for a two-night guest

### The mobile ordering problem

The layout is `grid-cols-1 lg:grid-cols-3`, with content in a `lg:col-span-2` and the price card in the right column. On mobile, `grid-cols-1` stacks in DOM order:

```
Gallery → Title → Specs → Description → ALL Features → Price → CTA → Agent → Trust
```

**A mobile user must scroll past the entire description and a fourteen-item feature grid before seeing the price or any call to action.** On a market that is overwhelmingly mobile, this buries both the decision input (price) and the decision output (CTA).

Standard mobile property layout puts price directly beneath the title, with a **sticky bottom action bar** carrying Call and WhatsApp — persistently visible regardless of scroll position.

> **A responsive grid reorders columns, not priorities.** `lg:col-span-2` describes desktop geometry; it silently dictates mobile *sequence*. Whenever a two-column desktop layout collapses to one column, check what order the content actually lands in — it is one of the most common and least noticed responsive failures.

## 3.8 `/about` — About

**The best-written page on the site, and the least visited.**

**Strengths:** the founding story is specific and credible; the *"not the biggest, aim to be the most honest"* line is the best copy on the site; the milestone timeline gives the business a history; `WhyTrustUs` is the strongest persuasion asset anywhere in the project; the office section explicitly answers the "are you real?" objection.

**Weaknesses:**

1. **`min-h-screen` on `AboutHero`** — a full viewport height of hero before any content. On a 667px-tall phone that is an entire screen of headline and badges before the story begins. Heroes earn full height on a *homepage*, where the job is framing; on an interior page the job is *delivering the content the user clicked for*.
2. **`WhyTrustUs` is on the wrong page** — the comparison table should be on the homepage where the audience is
3. **Agent profiles have no photographs** — initials in circles. On a page whose entire purpose is *"we are real people"*, the absence of faces is the most damaging omission on the page.
4. **The office section has no photo of the office** — while arguing *"a real physical office you can walk into. No P.O. boxes"*
5. **The map embed uses a placeholder** with `!1d3975.4823` coordinates and `4v1234567890` — a generic Port Harcourt view, not the stated address
6. **No team photo, no credentials, no registration number** — the page makes legitimacy claims a single CAC number would substantiate

## 3.9 `/contact` — Contact

| | |
|---|---|
| **Purpose** | Convert an undecided visitor into a conversation |
| **Primary CTA** | Form → WhatsApp |
| **Secondary CTA** | Direct WhatsApp / phone |

**Strengths:** *"Talk to a Real Agent — Not an Inbox"* is the strongest headline on the site — it names a real frustration and positions against it in six words. The intent dropdown routes and qualifies simultaneously. Response-time commitments per channel set expectations concretely. Only two required fields — name and phone — is correctly minimal for a WhatsApp-first market where email is optional.

**Weaknesses:**

1. **`min-h-screen` on `ContactHero` pushes the form below the fold — on the page whose only job is the form.** A user who clicked "Contact" has already decided to make contact; the hero delays the action they came for by a full screen. **On a conversion page, the hero should be a band, not a stage.**
2. **The form submits to WhatsApp and stores nothing** — the single most consequential conversion flaw on the site
3. **Success is shown before success happens** — `setTimeout` then `window.open`, with the confirmation rendered regardless of whether the handoff worked
4. **No office photo or map** — the map lives on About; a contact page is where someone plans a visit
5. **No named agent to contact** — contradicts the headline's promise of a real agent
6. **The Select's label is not programmatically associated** — accessibility failure, Part 8

---
# PART 4 — HOMEPAGE, SECTION BY SECTION

Current order: **Hero → StatsBar → FeaturedProperties → WhyChooseUs → AgentSection → Testimonials → CTABanner**

## 4.1 Hero

**Why it exists:** answer *what is this, where, and can I trust it* within three seconds. Hero copy is the highest-read text on any website by an enormous margin.

**What is there:** a credibility badge ("Verified Titles · Transparent Pricing · Local Expertise"), an H1 with a colour-accented location, a subhead naming audiences and areas, and two CTAs.

**What works:**

- **The badge above the headline** is a strong pattern. It sets the frame *before* the claim, so the headline is read through a lens of credibility rather than being evaluated cold.
- **`Port Harcourt` in `text-blue-400`** — colouring the geographic qualifier is the correct choice. Location is the highest-value word for a local business, and highlighting it makes the site's relevance scannable in a fraction of a second.
- **Named areas** — "GRA, Woji, Eliozu, Ada George" is far stronger than "across the city." Specificity is the cheapest credibility signal available.
- **Dual CTA with different intents** — browse for the undecided, WhatsApp for the ready. Correctly differentiated by visual weight.
- **`alt=""` on the background image**, and `priority` set — the LCP element preloads.

**What is missing — the search widget.** Covered in §3.5. This is the single most standard element in the category and its absence is the largest structural gap on the homepage.

**Minor:** the headline *"Find Your Perfect Property in Port Harcourt"* is generic. It describes the user's action, not the business's difference. The site's actual edge is fraud protection and fee transparency; a headline like *"Verified Titles. Full Costs Upfront. Port Harcourt Property Without the Guesswork."* does more work. The current headline could belong to any agency in any city — which is precisely the test a headline should fail.

**Verdict: keep, add search, sharpen the headline.**

## 4.2 StatsBar

**Why it exists — and why the position is right.** Immediately after the hero is the correct slot for credibility reinforcement. The hero makes a promise; the bar is where the visitor's *"prove it"* reflex gets answered before scepticism sets in.

**Why it fails:** it contains no statistics. Four adjectives — Verified, Transparent, Local, Trusted — restating the badge one section above. **The visitor reads the same claim twice in two screens with no new information.**

The psychological function of a stats bar is that numbers are falsifiable and adjectives are not. See §2.10 for the four-number replacement.

**Verdict: keep the slot, replace the content with numbers.** Same component, same layout, dramatically different effect.

## 4.3 FeaturedProperties

**Why it exists:** show the product. A property site that makes users click before seeing a property is asking for commitment before value.

**Why position 3 is correct.** There is a genuine tension in homepage design between *establishing trust first* and *showing product first*. Trust-first risks the visitor leaving before seeing inventory; product-first risks browsing without credibility. Position 3 — after one trust beat, before the full argument — resolves it correctly. **Show enough product to prove you have inventory, then explain why you are different.**

**What works:** the section header pairs an eyebrow with a heading and a "View All" action; the mobile "View All" button is repositioned below the grid rather than cramped into the header — a small responsive courtesy most sites skip; six items in a 3-column grid produces two clean rows.

**Weaknesses:**

1. **The featured mix is representative, not revenue-weighted.** Six slots hold 3 sales, 1 rental, 1 shortlet, 1 commercial. The ₦550m and ₦420m listings — the two most valuable in the inventory — share one slot. These are the highest-traffic slots on the site and should be merchandised, not sampled.
2. **`getFeaturedProperties()` at module scope** — see §1.7
3. **`.slice(0, 6)` after a filter** — a silent cap. If a seventh property is marked featured it disappears with no indication. Better to make the limit explicit in the helper (`getFeaturedProperties(6)`) so the constraint lives with the data, not the JSX.
4. **No section-level context** — no "12 properties available" or "Updated weekly." Inventory freshness is a trust signal in real estate.

**Verdict: keep, reweight featured selection toward value, move the cap into the helper.**

## 4.4 WhyChooseUs

**Why it exists:** differentiation. Four cards mapping to the four positioning pillars, plus a trust banner.

**What works:** each card names a specific fear and answers it. The copy is the strongest on the homepage — *"No vague 'good title' claims"* is exactly the kind of specific, competitor-implicating line that makes a differentiator believable.

**Weaknesses:**

1. **Emoji icons (📋 💰 👤 🌍) while the rest of the site uses lucide.** Three problems: emoji render differently on Windows, macOS, Android, and iOS, so the section's appearance is uncontrolled; they cannot be colour-matched to the palette; and screen readers announce them as words ("clipboard", "money bag", "bust in silhouette", "globe showing Europe-Africa") — noise injected into the reading order. Replace with lucide icons already imported elsewhere. Consistency here is not pedantry; a section that renders differently per OS is a section you cannot design.
2. **The trust banner repeats the four pillars a third time in one scroll** — the section already made these points as cards; the banner restates them as pills immediately below.
3. **No evidence** — four claims, zero proof, immediately before a section titled "Testimonials" that contains none.

**Verdict: keep, swap emoji for lucide, cut the trust banner, add proof.**

## 4.5 AgentSection

**Why it exists:** put humans in front of the transaction. Real estate is a high-trust, high-value, relationship-driven purchase, and people convert to people.

**Why position 5 is right:** after the visitor knows what you sell and why you are different, "who will I actually deal with?" is the natural next question.

**Weaknesses — and this section undercuts itself:**

1. **The eyebrow reads "Real People, Real Results."** There are no real people (generic `Users` icon avatars, no photographs) and no results (no sales figures, no client counts, no reviews). **A heading that promises exactly the two things the section lacks.** This is the same pattern as `StatsBar` and `Testimonials`.
2. **"Meridian Sales Team — GRA" is not a person.** The site elsewhere promises *"not a faceless inbox"* and *"a dedicated agent you can reach directly."* A desk is a faceless inbox with a regional label. The single highest-impact change here is three names, three photographs, three phone numbers.
3. **All three WhatsApp buttons point to the same number.**
4. **`WhatsApp ${agent.name.split(" ")[0]}`** produces "WhatsApp Meridian" for all three — the label is derived from a name format that does not fit.
5. **No credentials** — no years of experience, no specialism proof, no deal history.

**Verdict: keep the section, replace desks with named people.** For a portfolio piece, invented names with stock headshots are entirely legitimate and fix the site's most visible credibility gap in an hour.

## 4.6 Testimonials

**Why the slot exists:** social proof at the point where a visitor is convinced but not committed. Position 6 — after the argument, before the close — is exactly right. **The slot is correct; the content is not.**

**What is actually there:** three value-proposition cards restating verified titles, transparent pricing, and local expertise — the same three claims made in `StatsBar` (section 2) and `WhyChooseUs` (section 4).

**This is the third time the homepage makes the same argument in one scroll.** By this point the visitor is not gaining confidence; repetition without new evidence produces discounting.

**What belongs here:** three to five real testimonials with names, photographs, locations, and — critically — **specificity**. A weak testimonial says *"Great service, highly recommend."* A strong one says *"They caught a title problem on a property in Woji before I paid a naira. I found out the seller didn't have Governor's Consent. That check saved me ₦45 million."* The second is credible because it is falsifiable and detailed; the first could describe any business on earth.

Ideal supporting proof alongside quotes: a Google rating with review count, a diaspora client specifically (highest-value segment, highest trust bar), and a transaction outcome with a number.

**Verdict: rename the file and replace the content entirely.** This is the highest-value single section change on the homepage.

## 4.7 CTABanner

**Why it exists:** capture the visitor who scrolled the whole page — the highest-intent visitor on the site. Someone who reaches section 7 has invested real attention.

**What works:** clear eyebrow → headline → subhead → action structure; a phone option below the primary CTAs, separated by a divider, serving users who dislike chat; *"No pressure, no hidden fees — just honest property advice"* pre-handles the exact objection a visitor has about contacting an agency.

**Weaknesses:**

1. **Button style inconsistency.** The hero's primary is `bg-blue-600`; this section's is `variant="outline"` with `border-slate-600 text-black`. **The same action, styled two different ways on the same page.** A user cannot learn "blue means primary action" if the primary action is not blue. This is also the design system fighting itself — see Part 11.
2. **The headline duplicates the hero's** — "Find Your Perfect Property in Port Harcourt Today" versus "Find Your Perfect Property in Port Harcourt." A closing CTA should feel like a conclusion, not a rewind.
3. **No urgency or specificity** — no inventory count, no response-time promise, nothing that makes acting now better than acting later
4. **No lead capture alternative** — a visitor not ready to WhatsApp has no lower-commitment option (a guide, a mailing list, a callback request)

**Verdict: keep, fix button consistency, rewrite the headline, add a soft-conversion option.**

## 4.8 Recommended homepage order

| # | Section | Status | Purpose |
|---|---|---|---|
| 1 | Hero **+ search widget** | Modify | Frame + capture intent immediately |
| 2 | StatsBar **with real numbers** | Modify | Substantiate the promise |
| 3 | FeaturedProperties **(value-weighted)** | Modify | Show product early |
| 4 | **Browse by Area** | **New** | Local expertise proof + SEO hub + navigation |
| 5 | WhyChooseUs **(lucide icons)** | Modify | Differentiation |
| 6 | **How It Works** | **New** | Process transparency reduces anxiety |
| 7 | **Testimonials (real)** | **Replace** | Social proof |
| 8 | AgentSection **(named people)** | Modify | Human connection |
| 9 | **FAQ** | **New** | Objection handling before the close |
| 10 | CTABanner | Modify | Convert |

**Reasoning for the three new sections:**

**Browse by Area** does four jobs at once: it proves the local-expertise claim, gives eight area landing pages an internal-linking hub, offers an alternative navigation path for users who think geographically rather than by property type — which most property buyers do — and finally gives the dead `getPropertiesByArea` helper a purpose.

**How It Works** addresses the single biggest source of anxiety in Nigerian property transactions: *what actually happens, and when do I pay?* A four-step process (Enquire → Inspect → Verify title → Complete) with explicit fee timing directly serves the transparency positioning and pre-empts the questions that otherwise cause hesitation. **Process transparency is a conversion mechanism, not a content nicety.**

**FAQ** handles objections at scale, targets question-shaped search queries, and — practically — becomes the grounding corpus for an AI assistant later.

---

# PART 5 — PROPERTY EXPERIENCE

The core of any real estate audit. If this fails, nothing else matters.

## 5.1 Property cards

**What works:**

- **Type badge and title badge as image overlays** — the two decision-critical facts are visible before any text is read
- **Colour-coded types** — blue/green/purple for sale/let/shortlet, scannable in a grid
- **Total move-in cost beneath the headline price** — the strongest element on the card and a genuine differentiator; most Nigerian listings show rent only
- **`mt-auto` on the price block** — pushes price to a consistent baseline regardless of title length, so prices align across a row. A small flexbox detail that most cards get wrong, producing ragged grids.
- **`line-clamp-2` on the title** — prevents a long title from breaking card height parity
- **Correct `sizes` and lazy loading**

**Weaknesses:**

1. **The title is `text-sm`** while the price is `text-lg`. The title is what a user scans to decide whether to look further; at 14px it is subordinate to the price, the badges, and the spec row. **Visual hierarchy should follow decision order** — for most browsers that is *what is it* → *where* → *how much*.
2. **The title type is displayed twice** — as an overlay badge on the image and again as a green row in the body. Redundancy within 200 pixels.
3. **The card is not clickable.** Only the small "View Details" button navigates. Users expect the entire card to be a target; that expectation is near-universal in card grids. This is also a Fitts's Law problem — a 28px-tall button versus a ~380px-tall card. Wrapping the card in a `<Link>` with the WhatsApp button handled via `stopPropagation` (or positioned as a sibling with a higher z-index) is the standard solution.
4. **Buttons are `size="sm"` — 28px tall.** Well below the 44×44px minimum touch target in WCAG 2.5.5 and Apple/Google guidance. On the primary browsing surface of a mobile-first market, this is the most consequential accessibility problem on the site.
5. **No favourite/save** — `localStorage` delivers this without accounts
6. **No status or freshness** — no "New", "Reduced", "Under Offer". These are the primary urgency mechanisms in property, and the site has none.
7. **No image placeholder** — no `blurDataURL`, so cards flash empty grey before images resolve
8. **Land and commercial cards render a blank spec area** — `{property.bedrooms > 0 && ...}` hides the whole row, and nothing replaces it

## 5.2 Property detail page

Covered in §3.7. Summary of what a complete detail page needs versus what exists:

| Element | Status | Priority |
|---|---|---|
| Gallery | Present | — |
| Price + breakdown | **Excellent** | — |
| Specs (bed/bath/size) | Present | — |
| Description | Present | — |
| Feature list | Present | — |
| Agent card | Present, no photo | Medium |
| Trust panel | Present, wrong copy on rentals | Low |
| Share | Present | — |
| **Map** | **Missing** | **High** |
| **Similar properties** | **Missing** | **High** |
| **Viewing booking** | **Missing** | **High** |
| **Property status** | **Missing** | Medium |
| Floor plan | Missing | Medium |
| Video / virtual tour | Missing | Medium |
| Listing date | Missing | Medium |
| Neighbourhood info | Missing | Medium |
| Breadcrumbs | Partial | Low |
| Print / PDF brochure | Missing | Low |
| Mortgage calculator | Missing | Low — see Part 13 |

## 5.3 Gallery

**What works:** thumbnail strip with an active-state border, an image counter (`3 / 4`), previous/next arrows, `priority` on the main image, correct `sizes` on both main and thumbnails, and arrows conditionally hidden when there is only one image — a small correctness detail many implementations miss.

**Weaknesses:**

1. **The arrow buttons have no accessible name.** `<button onClick={goToPrevious}><ChevronLeft /></button>` — an icon-only button with no text and no `aria-label`. A screen reader announces "button." **WCAG 4.1.2 (Name, Role, Value), Level A — failure.** Same for the thumbnail buttons.
2. **No keyboard support.** Arrow keys do nothing. Standard for any carousel.
3. **No lightbox / fullscreen.** Property photos are the product; a 384px-tall viewport is not enough to evaluate a ₦550m house.
4. **No swipe on mobile.** On touch devices swiping is the expected interaction; users must hit small arrow buttons instead.
5. **No focus-visible styling** — the arrows use `bg-black/50` with no focus ring, so keyboard users cannot see where they are.
6. **No loop indication or preloading** — the next image is not prefetched, so each navigation triggers a visible load.
7. **Thumbnail strip has `overflow-x-auto` with no scroll affordance** — with more than four images there is no indication more exist.

## 5.4 The shortlet subset — the hospitality gap

Two listings priced per night: prop-003 (₦120,000) and prop-006 (₦85,000). Judged against modern shortlet standards, almost nothing required is present.

| Requirement | Status | Consequence |
|---|---|---|
| Availability calendar | **Missing** | Cannot tell if the dates are free — the first question every guest has |
| Guest capacity | **Missing** | No `maxGuests` field. "Sleeps 6" is a top-three filter on every booking platform. |
| Minimum nights | **Hardcoded** | "Minimum 2-night stay" is a literal string in JSX applied to *all* shortlets regardless of actual policy |
| Check-in / check-out times | **Missing** | Determines whether a same-day arrival works |
| House rules | **Missing** | Smoking, parties, pets, visitors — the source of most host-guest disputes |
| Cleaning / caution fee | **Missing** | The nightly rate is not the price paid |
| Total stay price | **Missing** | No way to compute the cost of a 3-night stay |
| Cancellation policy | **Missing** | A booking blocker for any planned trip |
| Reviews / rating | **Missing** | The primary trust mechanism in short-stay accommodation |
| Power / water reliability | Partial | In features prose only; for Nigerian shortlets, generator hours are decision-critical |
| Wi-Fi speed | Partial | In features prose only |
| Instant booking | **Missing** | Guests decide in minutes; a WhatsApp round-trip loses them |

**And two active errors on shortlet pages:**

- The `titleType` badge ("C of O") is displayed. A Certificate of Occupancy is meaningless to someone booking two nights. It is not merely irrelevant — it is confusing, implying the guest is buying something.
- The sidebar reads **"Why Buy Through Meridian?"** on a nightly rental.

**The root cause is the data model, not the UI.** `Property` has no `maxGuests`, `minNights`, `checkIn`, `houseRules`, or `availability` fields — so the JSX cannot render them, so a hardcoded string stands in for the one that seemed most important.

> **This is the clearest demonstration in the codebase that data modelling determines product capability.** The shortlet listings are not weak because the design is weak. They are weak because the type has no vocabulary for what a shortlet *is*.

**Two legitimate strategic options:**

**(a) Remove the shortlets.** Two listings out of twelve, in a business that is otherwise a sales-and-rentals brokerage, serving a customer with nothing in common with the others. Cutting them makes the site more coherent, removes the weakest content, and eliminates the "Why Buy" copy bug entirely.

**(b) Build them properly** with a discriminated union, guest capacity, availability, house rules, and a total-stay calculator — a genuinely impressive portfolio addition demonstrating a second product model in one codebase.

**Recommendation for a portfolio piece: (a) now, (b) later as a deliberate feature.** Two half-built product lines read worse than one complete one. What is currently there demonstrates neither real estate nor hospitality competence.

## 5.5 Does the customer get enough information to decide?

| Property type | Sufficient? | What is missing |
|---|---|---|
| Residential sale | **No** | Map, floor plan, listing date, status, similar properties, viewing booking |
| Residential rental | **Nearly** | Map, availability date, tenancy terms — the cost breakdown does most of the work |
| Land | **No** | Plot dimensions, topography, survey plan, road access, drainage — none in the data model |
| Commercial | **No** | Power capacity, floor loading, truck access, ceiling height, service charge |
| Shortlet | **No** | Nearly everything a guest needs |

**Only the residential rental experience is close to complete, and only because the move-in cost breakdown is genuinely excellent.** That single feature does more work than everything else on the page combined — which is itself the lesson: **one well-chosen feature that answers the customer's real question outperforms ten generic ones.**

---

# PART 6 — USER JOURNEYS

Six personas, walked through the site as built.

## 6.1 First-time buyer — Chidi, 34, first property, ₦95m budget

**Arrives at:** homepage, from a Google search or a WhatsApp link.

**Thoughts:** *"Is this a real company or another agent who'll waste my time?"* The badge and hero read well. The trust language lands — first-time buyers are the most fraud-anxious segment.

**Confusion begins at StatsBar.** He is scanning for evidence — how many properties, how many years — and finds four adjectives. Mild disappointment, not yet a rejection.

**FeaturedProperties works.** Real listings, real prices. He clicks the ₦95m bungalow.

**On the detail page his questions are:** *Where exactly is Ada George? Is it safe? How far from work? What is a "Deed of Assignment" and is it as good as a C of O? What do I actually pay beyond the price? What happens after I enquire?*

**The site answers one of six.** There is no map, no area context, **no explanation of title types**, no process, no total-cost view for sales (the breakdown exists only for rentals).

> **The title-type gap is the sharpest failure for this persona.** The site's central differentiator is showing the title type — and it never explains what any of them mean. To a first-time buyer, "Deed of Assignment" is a phrase, not information. **A differentiator the customer cannot interpret is not a differentiator.**

**Trust level:** starts 6/10, rises to 7 on the listings, falls to 5 on the detail page as unanswered questions accumulate.

**Drop-off risk: high at the detail page.** He is not ready to WhatsApp because he does not yet know enough to ask a competent question — and first-time buyers avoid contact precisely because they fear sounding naive.

**Conversion opportunity:** a "What does this title mean?" explainer inline with the badge; a "How buying works" process section; a downloadable first-time buyer guide as the site's only lead magnet. Each converts anxiety into a reason to engage.

## 6.2 Luxury buyer — Mrs. Adeyemi, 52, oil & gas executive, ₦500m+

**Arrives at:** a direct link, or a referral.

**Thoughts:** *"Does this agency operate at my level?"*

**Her judgment is made in seconds, on presentation quality.** She sees: an 800px-wide photo rendering soft on her Retina display, stock imagery of houses that are obviously not Nigerian, `blue-600` on Geist — a competent but unremarkable template. Agent "profiles" with no faces.

**On the ₦550m mansion detail page:** four photos, none large enough to evaluate finish quality. No floor plan. No video. No virtual tour. No indication of who she would be dealing with.

> **At this price point the website is not a lead source; it is a credibility test.** She is not deciding whether to buy the house from the website — she is deciding whether this agency is worth a phone call. **Presentation quality is the entire signal**, and the site presents a ₦550m mansion using the same card, the same four small photos, and the same green Enquire button as a ₦85k-a-night flat.

**Trust level:** 4/10. Not because anything is wrong, but because nothing signals that this agency handles properties like hers.

**Drop-off risk: very high, and silently.** She will not enquire and will not indicate why.

**Conversion opportunity:** a distinct premium presentation for high-value listings — full-bleed photography at proper resolution, video walkthrough, floor plans, a named senior agent with credentials, a private-viewing request rather than a public WhatsApp button. **This is where the "friction proportional to lead value" principle pays: a private appointment request converts this persona better than an instant chat link.**

## 6.3 Investor — Emeka, 41, buying to let

**Thoughts:** *"What return does this produce?"*

**Every question he has is unanswered.** Rental yield. Occupancy in the area. Price per sqm. Capital appreciation trends. Service charges. Ground rent. Which areas are appreciating. Whether the property is tenanted.

**The data to answer some of this already exists.** The site has `price` and `size` on every listing — price per square metre is one division. It has sale prices and rental prices in the same areas — indicative gross yield is computable. **None of it is surfaced.**

**Trust level:** 5/10 — no reason to distrust, no reason to engage.

**Drop-off risk: certain.** The site does not acknowledge investors exist, despite "I want to invest in property" being an option in the contact form.

**Conversion opportunity:** the cheapest high-value addition on the site. A yield indicator on rental listings, price-per-sqm on every card, and a short investment page. All derivable from existing data.

## 6.4 Relocating — Sarah, 38, moving from Lagos for work

**Thoughts:** *"I don't know this city. Which area should I even be looking at?"*

**Her need is not a property — it is a map and a recommendation.** Which areas are safe. Which are close to Trans-Amadi. Which flood. Where expatriates live. What ₦5m/year gets in each.

**The site offers eight area filter options — as slugs in a dropdown.** No descriptions, no guidance, no map, no comparison. `gra`, `woji`, `eliozu`, `ada-george`, `trans-amadi`, `rumuola`, `peter-odili`, `eneka` mean nothing to someone who has never lived in Port Harcourt.

> **This persona is the exact use case for the site's core claim — local expertise — and the site provides none of it.** It has the *data* to filter by area but none of the *knowledge* that makes an agency valuable. This is the gap area guide pages would close, and it is why they are the highest-value content addition available.

**Trust level:** 5/10. Drop-off risk: high — she will search "best areas to live in Port Harcourt" and land on someone else's blog.

## 6.5 Casual browser — Tunde, 29, idly looking

**Thoughts:** *"Just seeing what's out there."*

**The site handles him adequately.** Featured listings on the homepage, an easy browse, colour-coded types. He scrolls, looks at a few, and leaves.

**And then he is gone forever.** No email capture, no favourites, no saved search, no notification option, no cookie-based return recognition. **The site has no mechanism to retain anyone who is not ready today** — and in property, *most people are not ready today*. A browsing visitor is typically 3–18 months from a transaction.

**Trust level:** 6/10 — no friction, no memory.

**Conversion opportunity:** the largest untapped volume on the site. Favourites via `localStorage` (no accounts needed), a saved search with email alerts, a "new listings in GRA" subscription. **Even one working email capture would make this the site's most valuable persona rather than its most wasteful.**

## 6.6 Ready to contact — Ngozi, 45, has decided

**Thoughts:** *"I want to see this house on Saturday."*

**This is the persona the site serves best.** WhatsApp buttons everywhere, prefilled with the property. One tap and she is in a chat with the property already identified.

**Two failures remain:**

1. **She cannot book the viewing.** She can only *ask* about one. That is a WhatsApp round-trip — availability, negotiation, confirmation — that a booking widget would resolve in a single action. **The friction is at the exact point of highest intent**, which is the most expensive place to have any.
2. **On mobile, on a detail page, she must scroll past the description and the entire feature grid to reach the CTA.** See §3.7.

**Trust level:** 7/10 — the highest on the site.

**Drop-off risk: low but non-zero** — if she uses the contact form instead and the WhatsApp handoff is popup-blocked, she sees a success screen while nothing happened, and neither she nor the agency ever knows.

## 6.7 Journey summary

| Persona | Trust | Drop-off risk | Primary blocker |
|---|---|---|---|
| First-time buyer | 5/10 | High | No title-type education, no process, no map |
| Luxury buyer | 4/10 | **Very high** | Presentation does not match price point |
| Investor | 5/10 | **Certain** | Zero investment data — despite having it |
| Relocating | 5/10 | High | No area knowledge — the core claim, unfulfilled |
| Casual browser | 6/10 | Certain (unretained) | No capture mechanism of any kind |
| Ready to contact | 7/10 | Low | No viewing booking; mobile CTA buried |

> **The site serves exactly one persona well — the one who has already decided.** That is the cheapest visitor to convert and the rarest. Every persona still forming a decision hits a wall built from the same two materials: **missing local knowledge and missing proof.**

---

# PART 7 — UX, INTERACTION & RESPONSIVE DESIGN

## 7.1 Navigation & scrolling

Fixed navbar (`h-16`), sticky filter bar (`top-16`), sticky price card (`top-24`). The layering is coherent and the z-index hierarchy is correct (`z-50` navbar, `z-40` filters).

**Issues:** no active state (§3.1); the fixed navbar consumes 64px of vertical space on mobile permanently, which is defensible given it carries the WhatsApp CTA; no scroll-to-top on long listing pages; no smooth-scroll or anchor targets anywhere.

## 7.2 Visual hierarchy

**Consistent and good:** section rhythm at `py-16`, container at `max-w-7xl`, h2 at `text-3xl` sitewide, eyebrow-plus-heading pattern applied uniformly across eight sections.

**Problems:**

1. **Property card title at `text-sm`** — the primary scanning element is the third-most-prominent thing on the card
2. **Two competing "primary" button styles** — `bg-blue-600` in the hero, `variant="outline"` in the CTA banner
3. **The trust triad appears three times on the homepage**, flattening the page's argument into a plateau
4. **Section eyebrows are `text-blue-600` uppercase** — consistent and correct, but every section uses the identical treatment, so nothing signals which sections matter more

## 7.3 Typography

One family (Geist Sans). Scale: `text-4xl`→`6xl` for h1, `text-3xl` for h2, `text-lg`/`base` for h3, `text-sm`/`xs` for body and meta.

**Working:** a genuinely consistent scale; `leading-relaxed` on body copy, which materially improves readability on long descriptions; `leading-tight` on headlines; `line-clamp-2` on card titles.

**Problems:** heavy reliance on `text-xs` (12px) for meta information — location, specs, prices on cards. 12px is below comfortable reading size on mobile and pairs badly with low-contrast slate tones (Part 8). A single typeface with no serif or display contrast makes the site typographically anonymous — see Part 11.

## 7.4 Forms

**Good:** visible labels on all text inputs with correct `htmlFor`/`id` pairing; required fields marked with a red asterisk *and* explained at the form's foot; email correctly optional in a WhatsApp-first market; `type="tel"` and `type="email"` trigger the right mobile keyboards; the submit button is disabled until valid; a distinct loading state with a spinner; a proper success state.

**Problems:**

1. **The "What are you looking for?" label is not associated with its control.** It is a bare `<label>` with no `htmlFor`, and Radix's Select trigger has no matching `id`. Clicking the label does nothing, and screen readers do not announce it. **WCAG 1.3.1 / 3.3.2 failure.**
2. **No inline validation** — errors surface only as a disabled button, with nothing explaining *why* it is disabled
3. **No `aria-live` on status changes** — the transition from form to success is silent to screen readers
4. **The success state is shown before success occurs**
5. **No phone format guidance beyond a placeholder** — no normalisation, no country code handling for the diaspora audience the site claims to serve

## 7.5 Buttons & touch targets

The shadcn theme in use defines: `default` = `h-8` (32px), `sm` = `h-7` (28px), `lg` = `h-9` (36px).

**Every one of these is below the 44×44px minimum** for touch targets (WCAG 2.5.5 Level AAA, Apple HIG, and Material Design all converge on ~44–48px).

Worse, `PropertyCard` uses `size="sm"` for both actions — **28px tall targets on the primary browsing surface of a mobile-first site.** Users will mis-tap, and mis-taps on a card grid mean landing on the wrong property.

> This is not a shadcn defect — it is a **theme** whose density suits dashboards, not a public marketing site. The fix is to override button sizing in the theme layer rather than per-instance, so it applies uniformly. See Part 11.

## 7.6 Search & filtering

**Good:** live filtering with no submit step; type-adaptive price ranges; a result count; dual clear affordances; a helpful empty state.

**Problems:** search covers only title and location, not features or description (a user searching "generator" or "pool" gets nothing despite both existing in the data); no debounce (irrelevant at 12 items, required at scale); no URL state; no sort; no bedroom/bathroom filters; no result-count preview per filter option ("GRA (4)"), which is standard and helps users avoid dead ends.

## 7.7 Maps

**One map on the entire site**, on the About page, and it uses **placeholder coordinates** — `!1d3975.4823` with `4v1234567890`, resolving to a generic Port Harcourt view rather than 14 Tombia Street.

**No map on any property page.** In real estate, location is the single most important variable, and the site's own positioning rests on local expertise. This is the highest-impact missing UI element after the homepage search.

**Positive detail:** the iframe has `loading="lazy"` and a `title` attribute — both correct.

## 7.8 Loading, empty & error states

| State | Implementation | Verdict |
|---|---|---|
| Loading | `loading.tsx` skeleton | Well built, **never renders** (§1.15) |
| Empty | Icon + copy + recovery action | **Genuinely good** |
| Error | `error.tsx` with `unstable_retry` | Correct Next 16 API |
| 404 | **None** | Next's unbranded default |
| Image loading | No placeholder | Grey flash |
| Form error | **None** | No failure path exists |

The skeleton uses `bg-gray-200` while the rest of the site uses the `slate` scale — a small inconsistency, and a symptom of the two-palette problem in Part 11.

## 7.9 Responsive

**Desktop (1280px+):** works well. 3-column grids, 2-column detail layout, sticky sidebar, full filter bar.

**Tablet (768–1024px):** `md:grid-cols-2` for cards, filters remain horizontal. Adequate. The detail page drops to one column at `lg`, so tablets get the mobile ordering problem (§3.7) at a width where a two-column layout would still fit comfortably.

**Mobile (<768px):** mostly competent — hamburger menu, collapsible filters, stacked cards, `flex-col` CTA stacks, and a thoughtful repositioning of the "View All" button.

**Mobile-specific failures, ranked:**

1. **Price and CTA buried below the fold on detail pages** (§3.7) — the most consequential
2. **`min-h-screen` heroes on `/about` and `/contact`** — a full viewport of hero before any content, on the two pages where the content *is* the point
3. **28px touch targets** on every card
4. **No swipe on the gallery**
5. **No body-scroll lock when the mobile menu is open** — the page scrolls behind the overlay
6. **The filter panel pushes content rather than overlaying**, so opening filters displaces the results the user is trying to refine
7. **Horizontal thumbnail scroll with no affordance**

---

# PART 8 — ACCESSIBILITY

Assessed against WCAG 2.1. Level A failures are listed first — these are the ones that make content genuinely unusable rather than merely awkward.

## 8.1 Level A failures

**1. Gallery arrow buttons have no accessible name — WCAG 4.1.2**

```tsx
<button onClick={goToPrevious} className="...">
  <ChevronLeft className="w-5 h-5" />
</button>
```

An icon-only button with no text content and no `aria-label`. Screen readers announce "button." A blind user cannot navigate the gallery.

```tsx
<button onClick={goToPrevious} aria-label="Previous photo">
```

**2. Gallery thumbnail buttons have no accessible name — WCAG 4.1.2**

Same defect. Should be `aria-label={`View photo ${index + 1}`}` with `aria-current={index === activeIndex}`.

**3. The interest Select has no associated label — WCAG 1.3.1, 3.3.2**

```tsx
<label className="text-sm font-medium text-slate-700">
  What are you looking for? <span className="text-red-500">*</span>
</label>
<Select value={formData.interest} onValueChange={handleInterestChange}>
  <SelectTrigger>   {/* no id */}
```

No `htmlFor`, no `id`. Clicking the label does nothing; screen readers announce an unlabelled combobox on a **required** field.

**4. No skip link — WCAG 2.4.1**

Every page begins with the same navigation. Keyboard and screen reader users must traverse it on every page load. A skip link is three lines and is a Level A criterion:

```tsx
<a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 ...">
  Skip to content
</a>
```

## 8.2 Level AA failures — colour contrast

WCAG 1.4.3 requires 4.5:1 for normal text, 3:1 for large text (18pt+/14pt bold).

| Combination | Where | Ratio | Verdict |
|---|---|---|---|
| `text-slate-400` on white | `ContactInfo`, `OfficeLocation` field labels | **~2.8:1** | **Fail** |
| `text-blue-200` on `bg-blue-600` | `WhyChooseUs` banner, `ContactInfo` card | **~3.5:1** | **Fail** (normal text) |
| `text-slate-500` on white | Card meta, prices, locations | ~4.6:1 | Marginal pass |
| `text-slate-400` on `slate-900` | Footer, CTA banner | ~7:1 | Pass |
| `text-slate-300` on `slate-900` | Hero subhead | ~11:1 | Pass |
| `text-green-700` on white | Card title badge | ~5.4:1 | Pass |

**The `text-slate-400` on white failures are the worst**, because they are applied to **field labels** — "OFFICE ADDRESS", "PHONE", "EMAIL" — at `text-xs` and uppercase. Small, low-contrast, letter-spaced text is the hardest possible combination to read, and the labels are what give the values meaning.

**Fix:** `text-slate-400` → `text-slate-600` on light backgrounds; `text-blue-200` → `text-blue-50` or `text-white/90` on blue-600.

> **The general rule: the lighter the grey and the smaller the text, the more likely it fails.** Designers reach for light greys to create hierarchy, but hierarchy through *contrast reduction* has a floor. Below 4.5:1 you have not de-emphasised the text, you have removed it for a meaningful share of users — including everyone over 50, which for a ₦550m property is a large part of the target market.

## 8.3 Mobile menu

**Correct:** `aria-label` toggles between "Open menu" and "Close menu"; `aria-expanded` reflects state; links close the menu on click.

**Missing:**

| Requirement | Status |
|---|---|
| Focus trap while open | **Missing** — Tab escapes into page content behind the menu |
| Escape to close | **Missing** |
| Focus returns to trigger on close | **Missing** |
| `aria-controls` linking button to panel | **Missing** |
| Body scroll lock | **Missing** |

**`ui/sheet.tsx`, already installed and unused, provides all five.** The hand-rolled menu is roughly 25 lines that reimplement a fraction of a component sitting in the same repository.

## 8.4 Semantics & structure

**Correct:** `<nav>`, `<main>`, `<footer>`, `<section>` used appropriately; exactly one `<h1>` per page; heading order descends properly (h1 → h2 → h3) with no skipped levels on any route; `lang="en"` present; the map iframe has a `title`; external links carry `rel="noopener noreferrer"`.

**Improvable:** `PropertyCard` renders a `<div>` where `<article>` is semantically correct; the property grid is a `<div>` where a list would let screen readers announce "12 items"; `<address>` is unused for the office address; external links give no indication they open in a new tab.

## 8.5 Focus management

**The default shadcn Button has good focus styles** — `focus-visible:ring-3 focus-visible:ring-ring/50`.

**But every hand-rolled `<button>` has none:**

- gallery arrows and thumbnails
- the mobile menu toggle (`hover:bg-slate-100` only)
- the "Clear filters" text button in the results header
- the "Call {agent}" button in `FullAgentProfiles` — a raw `<button>` with border and hover styles, no focus ring

> **Hover styles are not focus styles.** A keyboard user never triggers `:hover`. Any interactive element styled only for hover is invisible to keyboard navigation — the user is somewhere on the page with no indication where.

## 8.6 Screen reader experience

**Emoji read aloud as words.** `WhyChooseUs` uses 📋 💰 👤 🌍 as icons; `AgentSection` and `FullAgentProfiles` use 📍; the empty state uses 🏠. A screen reader announces "clipboard", "money bag", "bust in silhouette", "globe showing Europe-Africa", "round pushpin", "house". Decorative emoji need `aria-hidden="true"` — or, better, replacement with the lucide icons already in use everywhere else.

**Form status changes are silent.** Submitting swaps the form for a success panel with no `aria-live` region, so a screen reader user gets no confirmation anything happened.

**Filter results are silent.** Changing a filter updates the count in a plain `<p>`. Without `aria-live="polite"`, a screen reader user has no feedback that filtering occurred.

## 8.7 Accessibility scorecard

| Criterion | Level | Status |
|---|---|---|
| 1.1.1 Non-text content (alt) | A | **Pass** — decorative and informative both correct |
| 1.3.1 Info & relationships | A | **Fail** — Select label unassociated |
| 1.4.3 Contrast (minimum) | AA | **Fail** — slate-400/white, blue-200/blue-600 |
| 2.1.1 Keyboard | A | Partial — gallery not keyboard-operable |
| 2.4.1 Bypass blocks | A | **Fail** — no skip link |
| 2.4.6 Headings & labels | AA | Pass |
| 2.4.7 Focus visible | AA | **Fail** — hand-rolled buttons |
| 2.5.5 Target size | AAA | **Fail** — 28px card buttons |
| 3.1.1 Language of page | A | Pass |
| 3.3.2 Labels or instructions | A | **Fail** — Select |
| 4.1.2 Name, role, value | A | **Fail** — gallery buttons |

**Five Level A failures.** All are small fixes — roughly two hours of work in total — and all are the kind of thing an automated audit (axe, Lighthouse) surfaces immediately. **Running one accessibility scan before shipping would have caught most of this**, which is the real lesson: the failures here are not knowledge gaps, they are process gaps.

---
# PART 9 — CONVERSION & TRUST

## 9.1 The conversion architecture

**One path, executed well; every other path absent.**

| Mechanism | Status | Notes |
|---|---|---|
| WhatsApp | **Excellent** | 20+ entry points, context-aware prefills |
| Phone | Good | `tel:` links, 3 locations |
| Email | Weak | `mailto:` only |
| Contact form | **Broken as a lead tool** | Submits to WhatsApp, stores nothing |
| Sticky CTA (desktop) | Good | Price card `sticky top-24` |
| **Sticky CTA (mobile)** | **Missing** | The most important missing conversion element |
| Viewing booking | **Missing** | The conversion that predicts revenue |
| Lead magnet | **Missing** | No reason to give an email |
| Newsletter | **Missing** | No owned audience |
| Callback request | **Missing** | No option for the phone-averse |
| Live chat | Missing | WhatsApp substitutes adequately |

## 9.2 What the site does exceptionally well

**Context-aware WhatsApp deep links.** Covered in §2.7. This is genuinely above the standard of most agency sites and deserves to be recognised as the site's best conversion decision.

**The move-in cost breakdown.** The strongest trust mechanism on the site, and the only place the positioning is *demonstrated* rather than asserted. It works because it does something against the agency's short-term interest — showing its own 10% fee — which is precisely why it is believable.

> **Costly signalling:** claims that would be expensive to fake are the only claims users trust by default. Displaying your own commission is a costly signal. "We are transparent" is free, and priced accordingly.

**Two-field form minimum.** Name and phone. Every additional required field costs completion rate; asking for email in a WhatsApp-first market would have cost conversions for data the business does not need.

**Per-channel response commitments.** "WhatsApp — within 30 minutes. Phone — answered immediately. Email — within 4 hours. After hours — next morning by 9am." Concrete, differentiated, and it reduces the anxiety of not knowing when someone will reply. Unsubstantiated, but well-constructed.

## 9.3 The seven friction points

**1. Mobile detail pages bury the CTA.** (§3.7) A mobile user scrolls past the gallery, title, specs, description, and a fourteen-item feature grid before reaching the price and the WhatsApp button. **The fix — a sticky bottom bar with Call and WhatsApp — is the single highest-ROI conversion change on the site.**

**2. Nothing is captured.** (§2.8) Every path leaves the site with no record. The site converts only visitors ready today, and property buyers are rarely ready today.

**3. The form lies about succeeding.** `setTimeout(1000)` → show success → `window.open()`. If the popup is blocked or WhatsApp is absent, the user sees a green tick and a message saying an agent will respond within two hours. Nothing happened, and nobody knows.

> **Never render a success state for an action you have not confirmed.** The confirmation should follow the outcome, not a timer. This is a correctness principle before it is a UX one.

**4. No viewing booking.** The highest-intent action a property visitor can take is unavailable.

**5. No urgency or scarcity of any kind.** No listing dates, no "new" badges, no view counts, no enquiry counts, no "under offer" status, no price-reduction indicators. Property is one of the few categories where genuine scarcity exists — a specific house is genuinely unique and genuinely gets taken — and the site communicates none of it. **This is legitimate urgency being left unused**, which is different from manufacturing fake urgency.

**6. Four different labels for one action.** "WhatsApp Us", "Talk to an Agent", "Enquire", "Chat With Us", "WhatsApp Agent", "Talk to an Agent Now", "WhatsApp Our Office", "WhatsApp Us Now". **Eight variations of the same CTA.** Users learn interfaces by pattern recognition; eight labels for one action prevents that pattern from forming and makes each instance require fresh evaluation.

**7. No objection handling.** No FAQ. The questions that stop a Nigerian property buyer — *Do I pay an inspection fee? What if the title doesn't check out? Can I pay in instalments? How do I verify you're real? What happens to my money before completion?* — are answered nowhere.

## 9.4 Trust signals — full inventory

| Signal | Present | Impact of absence |
|---|---|---|
| Testimonials | **No** | Highest — no third-party voice anywhere |
| Reviews / ratings | **No** | Highest — no Google rating, no count |
| Case studies | **No** | High — no completed transaction shown |
| Statistics | **No** | High — `StatsBar` contains adjectives |
| Awards | No | Low |
| **Certifications (NIESV / ESVARBON)** | **No** | **High** — the exact credential this audience checks |
| **Company registration (CAC/RC)** | **No** | **High** — baseline legitimacy for a Nigerian business |
| Team | Partial | High — desks, not people; no photographs |
| Office information | Yes | — Address given in 4 places |
| **Office photograph** | **No** | High — the page argues the office is real and shows none |
| Google Maps | Partial | Placeholder coordinates, office page only |
| Partners / escrow provider | **No** | Medium — escrow advertised, provider unnamed |
| Years in business | Stated on About | Medium — never surfaced where it counts |
| Social media | **No** | Medium — no links at all, which itself reads as unusual |
| Press / media | No | Low |
| Guarantees | **No** | Medium — no refund, no title guarantee |

**Fifteen trust categories. Two are properly present.**

For a business whose entire positioning is trustworthiness, this is the central failure of the site, and it is a **content** failure rather than an engineering one. Every item above is writing and photography, not code. **For a portfolio piece, plausible invented evidence is entirely legitimate and would take a single afternoon.**

## 9.5 Microcopy & psychology

**Working well:** *"No pressure, no hidden fees — just honest property advice"* pre-handles the fear of contacting an agency. *"Talk to a Real Agent — Not an Inbox"* names a frustration and positions against it. *"Serious buyers only"* on the ₦280m listing is a genuine qualification signal that filters casual enquiries — a small, sophisticated touch.

**Working against itself:** eight CTA label variants; *"Why Buy Through Meridian?"* on rentals and shortlets; the empty state's 🏠 emoji where the rest of the site uses icons; *"Verified & Trusted"* used as a heading in four separate places with different content beneath it each time.

## 9.6 Where users stop converting

| Stage | Drop-off cause | Fix |
|---|---|---|
| Homepage | No search — intent has nowhere to go | Hero search widget |
| Homepage | No proof — scepticism unanswered | Real stats, real testimonials |
| Listings | No sort, limited filters | Sort + bedroom filter |
| Listings | Cannot save or return | `localStorage` favourites |
| Detail | No map — location unknowable | Embed a map per property |
| Detail | No title explanation | Inline explainer |
| Detail (mobile) | CTA below the fold | Sticky bottom bar |
| Detail | Rejection is a dead end | Similar properties |
| Enquiry | Cannot book a viewing | Viewing request form |
| Enquiry | Handoff can fail silently | Real submission + true success state |
| Post-visit | No retention of any kind | Email capture / lead magnet |

---

# PART 10 — CONTENT STRATEGY

## 10.1 Property descriptions — the best content on the site

```
"This exquisitely built 5-bedroom fully detached duplex is nestled in the heart of
GRA Phase 2, Port Harcourt's most prestigious residential address... Ideal for oil
and gas executives, diplomats, and top-tier professionals... a spacious family lounge,
a study room, a home office, and a separate boys quarters..."
```

**What works:** locally credible specificity (BQ, POP ceiling, Band A federal light, 32KVA Mikano generator, tarred road access — these are the terms a Port Harcourt buyer actually uses); named buyer profiles; explicit title mention; genuine differentiation between listings rather than templated filler.

**What does not:** each description is a single unbroken paragraph of 80–120 words. Nobody reads a wall of text on a phone. The structure that works is **Overview → Highlights → Location → Terms**, with the first sentence carrying the strongest fact.

## 10.2 The title contradiction

**prop-001** — the flagship ₦280m listing, first in the array, featured on the homepage:

```
titleType: "C of O"
description: "... Title is Governor's Consent, available for inspection. Serious buyers only."
```

**The badge and the description state different title types for the same property.** All eleven other listings are internally consistent, which makes this a genuine data error rather than a systemic pattern.

**Why this matters far more than a typo normally would:**

The entire positioning of this business is *"we show you the actual title type — no vague claims."* The site displays the title type as a green verified badge on every card and every detail page. **It is the differentiator.**

A visitor who reads carefully — which is exactly the fraud-cautious visitor this positioning attracts — finds the site's flagship listing contradicting itself about the one fact the site claims to be rigorous on. The damage is not "there is an error." The damage is **"the verification claim is not backed by verification."** One inconsistency destroys more credibility than a hundred correct listings build.

> **Your differentiator is where you can least afford to be sloppy.** Errors elsewhere are noise; errors in the thing you claim to be best at are disproof. Whatever a site's core claim is, that content needs a validation step — here, a build-time check that `titleType` appears in the description, or simply removing title claims from prose so there is one source of truth.

**For a portfolio piece, this is the detail a sharp reviewer finds.** It is also a strong argument for deriving prose from data rather than writing both by hand.

## 10.3 Headlines

| Headline | Verdict |
|---|---|
| "Talk to a Real Agent — Not an Inbox" | **Excellent** — names a frustration, positions against it |
| "Built on Trust, Not Hype" | **Strong** — concise, differentiating |
| "Built on Transparency in a Market Full of Noise" | **Strong** — acknowledges reality |
| "Why Clients Trust Meridian Over Others" | Good — competitive framing |
| "Port Harcourt's Most Trusted Property Agency" | Weak — unsupported superlative, used 3× |
| "Find Your Perfect Property in Port Harcourt" | Weak — generic, could be any agency |
| "Find Your Perfect Property in Port Harcourt Today" | Weak — duplicates the hero |

The pattern is clear: **the headlines that name a specific problem are strong; the headlines that describe the user's goal are generic.** "Find your perfect property" is what every property site says because it is what every property site does. It carries no information.

## 10.4 The education gap — the biggest content opportunity

**The site displays four title types and explains none of them:**

- C of O (Certificate of Occupancy)
- Deed of Assignment
- Governor's Consent
- Deed of Conveyance

**These are legally distinct instruments with materially different implications for a buyer.** A C of O is a direct government grant; a Deed of Assignment without Governor's Consent may be unperfected; the differences determine risk, resale, and mortgageability.

The site's differentiator is showing this information. It never explains what it means.

> **Displaying data the customer cannot interpret is not transparency — it is decoration.** The whole point of the badge is to let a buyer assess risk. A buyer who does not know what a Deed of Assignment implies gains nothing from being shown one.

**And note who is worst affected: the diaspora buyer** — the highest-value segment, most likely to have grown up outside the Nigerian property system, and least able to ask a friend.

**The fix is content, and it is the site's best-fit content opportunity:**

- An inline tooltip or "What does this mean?" link beside every title badge
- A glossary page covering title types, agency fees, legal fees, caution deposits, survey plans, and Governor's Consent
- A "How to verify a property title in Rivers State" guide — a genuine lead magnet, and exactly what a first-time or diaspora buyer searches for

This simultaneously proves expertise, serves the target audience, captures informational search traffic, and gives the site its first legitimate reason to ask for an email.

## 10.5 Missing content

| Content | Serves | Value |
|---|---|---|
| **FAQ** | All personas | Highest — objection handling |
| **Area guides** (×8) | Relocating, first-time, diaspora | Highest — proves the core claim, captures search intent |
| **Title-type glossary** | First-time, diaspora | High — makes the differentiator usable |
| **"How buying works"** | First-time, diaspora | High — process anxiety |
| **Sell Your Property** | Sellers | High — invisible revenue line |
| **Diaspora guide** | Diaspora | High — highest-value segment |
| Investment / yield content | Investors | Medium — data already exists |
| Blog | Organic search | Medium — long-term |
| Neighbourhood safety / infrastructure | Relocating | Medium |
| Video walkthroughs | Diaspora, luxury | Medium — already promised |

## 10.6 Does the content answer customer questions?

| Question | Answered? |
|---|---|
| What properties do you have? | **Yes** |
| What does it cost, all-in? | **Yes, for rentals** — best feature on the site |
| Where exactly is it? | **No** — text only, no map |
| What does this title type mean? | **No** |
| Which area suits me? | **No** |
| Who will I deal with? | **Partially** — a desk, not a person |
| Are you legitimate? | **No** — claims only, no registration or reviews |
| What happens after I enquire? | **No** |
| Do I pay an inspection fee? | **No** — despite being a listed differentiator |
| Can I buy from abroad? | **Barely** — mentioned, never explained |
| Can you sell my property? | **No** |
| What return will this produce? | **No** |
| Is it still available? | **No** |

**Four of thirteen.** The content is well written where it exists; the problem is coverage, not quality.

---

# PART 11 — DESIGN SYSTEM, COMPONENTS & CODE QUALITY

## 11.1 The two-palette problem

The most consequential design-system finding.

`globals.css` defines a full shadcn token set in OKLCH:

```css
--primary: oklch(0.205 0 0);        /* near-black — zero chroma */
--secondary: oklch(0.97 0 0);       /* near-white */
--muted-foreground: oklch(0.556 0 0);
```

**Every token has zero chroma. The design system is entirely greyscale.**

Meanwhile every component styles itself with hardcoded Tailwind utilities: `bg-blue-600`, `text-slate-900`, `border-slate-200`, `bg-green-500`.

**Two complete colour systems that never meet.**

The consequences are visible throughout:

- `<Button>` with no variant renders **near-black**, because `--primary` is near-black. So every button that should be blue carries `className="bg-blue-600 hover:bg-blue-700"`.
- `WhatsAppButton` hardcodes `bg-green-500 hover:bg-green-600` over whichever variant is passed.
- `CTABanner` fights the system explicitly: `variant="outline"` plus `border-slate-600 text-black hover:bg-slate-800 hover:text-white`.
- The loading skeleton uses `bg-gray-200` while everything else uses `slate` — two different neutral ramps.

**The fix is roughly ten lines:**

```css
:root {
  --primary: oklch(0.55 0.20 258);           /* the brand blue */
  --primary-foreground: oklch(0.99 0 0);
  --accent: oklch(0.72 0.19 149);            /* WhatsApp green */
}
```

Then `<Button>` is blue by default, `<Button variant="secondary">` works, and every `className="bg-blue-600"` override can be deleted.

> **A design system you override on every use is not a design system — it is dead weight plus a habit of fighting it.** The value of tokens is that changing one value updates everything. Here, changing `--primary` currently updates nothing, because nothing consumes it. Rebranding this site to green would mean editing 40+ files instead of one line.

**This is also the fix that unlocks dark mode.** The `.dark` block is fully defined and completely unused, because no component reads the tokens.

## 11.2 Design token audit

| Token | Consistency | Notes |
|---|---|---|
| **Spacing** | **Excellent** | `py-16` sections, `py-20` for the CTA banner, `gap-6` grids — a genuine rhythm |
| **Container** | **Excellent** but duplicated | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` in 15+ files |
| **Type scale** | Good | h1 `4xl/5xl/6xl`, h2 `3xl`, consistent sitewide |
| **Radius** | Inconsistent | Cards `rounded-xl` *and* `rounded-2xl`; buttons `rounded-lg`; badges `rounded-full` |
| **Shadows** | Inconsistent | `hover:shadow-lg` on PropertyCard, `hover:shadow-md` on every other card |
| **Colour** | **Two systems** | See above |
| **Icons** | **Mixed** | lucide + emoji |
| **Borders** | Good | `border-slate-200` on light, `border-slate-700` on dark |

**The spacing rhythm deserves credit.** Consistent `py-16` with `max-w-7xl` across 20 components written at different times is genuinely hard and it is the main reason the site reads as coherent despite the colour-system problem.

## 11.3 Component inventory

**Built and reusable:**

| Component | Reusability | Assessment |
|---|---|---|
| `WhatsAppButton` | **Excellent** | 20+ uses, well-typed props, sensible defaults, correct `asChild` usage |
| `PropertyCard` | **Excellent** | 2 pages, 18 renders, Server Component, single well-shaped prop |
| `PropertyGallery` | Good | Self-contained, minimal props, correct client boundary |
| `PropertyDetailClient` | Good | Textbook boundary extraction |
| `Navbar` / `Footer` | Good | Layout-owned, data-driven from arrays |
| `PropertiesClient` | Adequate | 340 lines — desktop and mobile filter UIs duplicated inline |
| `ContactForm` | Adequate | Self-contained; no submission layer |

**Should exist and does not — the duplication list:**

| Pattern | Occurrences | Files |
|---|---|---|
| **Section container** (`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`) | **15+** | Nearly every section |
| **Section header** (eyebrow + h2 + optional sub) | **8** | FeaturedProperties, WhyChooseUs, AgentSection, Testimonials, CompanyStory, WhyTrustUs, FullAgentProfiles, OfficeLocation |
| **Trust list** (icon + text loop) | **5** | WhyChooseUs, ContactInfo, OfficeLocation, detail sidebar, Footer |
| **Contact detail row** (icon + label + value) | **2 near-identical** | ContactInfo, OfficeLocation |
| **Agent card** | **2 variants** | AgentSection, FullAgentProfiles |
| `.replace("/year", "")` | **5** | Detail page — a `formatPrice` design flaw |
| Filter controls | **2** | PropertiesClient desktop + mobile |

**Extracting the top three would remove roughly 200 lines** and — more importantly — mean that changing section spacing or the trust-list style is a one-file edit.

```tsx
// components/shared/Section.tsx
export function Section({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <section className={cn("py-16", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

// components/shared/SectionHeader.tsx
export function SectionHeader({ eyebrow, title, description, align = "center" }) { ... }
```

> **The threshold for extraction is the third occurrence.** Twice can be coincidence; three times is a pattern, and patterns belong in one place. Extracting on the *first* repetition is premature — you do not yet know which parts vary.

**Missing components a real estate design system needs:**

`PropertyMap` · `SimilarProperties` · `ViewingRequestForm` · `FavouriteButton` · `SortControl` · `Breadcrumbs` · `FAQAccordion` · `TestimonialCard` · `StatCard` · `AreaCard` · `ProcessSteps` · `TitleTypeExplainer` · `PriceBreakdownTable` (currently inline in the detail page)

## 11.4 Code quality

**Strong:** strict TypeScript with meaningful union types; disciplined server/client boundary; consistent naming (two exceptions); the query-helper abstraction seam; correct Next 16 APIs throughout; a clean production build with no type errors; no `any` anywhere.

**Weak:**

1. **`formatPrice` fights itself** — five `.replace("/year", "")` calls undoing its own formatting. The signature is wrong: it should be `formatPrice(price)` plus a separate `formatPriceWithPeriod(price, type)`, so callers choose rather than strip.
2. **`PropertiesClient` is 340 lines** with the entire filter UI written twice — once for desktop, once for mobile. A single `<FilterControls layout="desktop" | "mobile">` would halve it.
3. **Module-scope data call** in `FeaturedProperties`.
4. **Magic numbers** — `pt-16` / `top-16` / `h-16` / `top-24` coupled by coincidence.
5. **Hardcoded business data in JSX** — "Minimum 2-night stay", the trust-signal arrays repeated in five components, the phone number `2340000000000` written literally in nine files.
6. **No tests.** For a portfolio piece, even three or four tests on `formatPrice` and the filter logic would signal engineering maturity disproportionate to the effort.
7. **No `.env` usage** — the phone number, WhatsApp number, email, and address are all hardcoded. `SITE_URL` (required by the owner's own deploy checklist for SEO files) does not exist.
8. **Dead code** (§1.14).

## 11.5 Is the design system scalable?

**No, in its current form** — because there is no system, only conventions applied by hand. Concretely:

- Changing the brand colour requires editing 40+ files
- Changing section spacing requires editing 20 files
- Dark mode is fully defined in CSS and cannot work
- Adding a new section means copying a container div and an eyebrow/heading block

**With the two-palette fix plus three extracted components, it becomes scalable in about half a day** — and that half-day is the difference between "a site" and "a design system," which is a meaningful distinction on a portfolio.

---

# PART 12 — PERFORMANCE & SEO

## 12.1 Performance — the baseline is genuinely strong

**What is right:** 19 fully static pages (best possible delivery model); 5 client components out of 30; automatic per-route code splitting; `next/font` self-hosting with zero layout shift; `next/image` with correct `sizes` and appropriate `priority`; no animation libraries, no carousel library, no date library; lucide tree-shakes per icon.

**Estimated Core Web Vitals:**

| Metric | Estimate | Assessment |
|---|---|---|
| **LCP** | 1.8–2.5s | Good, held back by external image hosting |
| **CLS** | < 0.05 | Excellent — `next/image` reserves space, fonts are size-adjusted |
| **INP** | < 100ms | Excellent — minimal JS, no heavy handlers |
| **TTFB** | < 200ms | Excellent — static from CDN |

**Bottlenecks, ranked:**

1. **External image host.** Every property image loads from `images.unsplash.com` — a separate DNS lookup, TLS handshake, and connection before the LCP image can even begin downloading. On a 3G connection in Port Harcourt this is easily 300–600ms of pure overhead. **Fix: self-host the images in `public/`.** For 12 properties this is trivial, removes the external dependency, eliminates the `remotePatterns` config, and directly improves LCP. A `<link rel="preconnect">` is the cheaper partial fix if remote hosting is kept.
2. **Source images capped at `?w=800`** — a quality problem before a performance one (§1.10).
3. **`Geist_Mono` preloaded and unused** — one wasted font request competing with the LCP image.
4. **12 images on `/properties` with no pagination** — mitigated by lazy loading below the fold, but it becomes a real problem at 50 listings.
5. **The 1.5s artificial delay** — build-time only, but real.
6. **Radix Select** on the listings page is the largest client-side dependency; justified by the filtering UI.

**No blocking issues.** This site would score roughly 90–95 on Lighthouse Performance without changes, and 95+ with self-hosted images.

## 12.2 SEO — the weakest category on the site

**Present:** unique title and description on all five routes; dynamic per-property metadata with a not-found guard and a 155-character slice; exactly one `<h1>` per page; correct heading hierarchy; descriptive `alt` text on content images; semantic HTML; static rendering (fully crawlable, no JS required for content).

**Absent — and this is the full list:**

| Item | Impact |
|---|---|
| **OpenGraph image + tags** | **Critical** — WhatsApp shares render as bare grey links, on a WhatsApp-first site with a Share button |
| **`metadataBase`** | Critical — relative OG/canonical URLs cannot resolve |
| Twitter card tags | High |
| **`app/sitemap.ts`** | High — nothing to submit to Search Console |
| **`app/robots.ts`** | High |
| **JSON-LD structured data** | High — no `RealEstateListing`, no `LocalBusiness`, no `BreadcrumbList` |
| Canonical URLs | Medium |
| `title.template` | Medium — every title repeats the brand manually |
| `viewport` / `themeColor` | Low |
| **`app/not-found.tsx`** | Medium — unbranded dead end |
| `app/opengraph-image.tsx` | Critical (see OG above) |
| **Slug URLs** | High — `/properties/prop-001` carries zero keyword value |
| **Area landing pages** | **Highest** — the actual search demand |
| Blog / informational content | High — long-tail |
| Internal linking | Medium — footer filter links are broken |

**Search intent analysis — what the site can currently rank for versus what people search:**

| Query type | Example | Can the site rank? |
|---|---|---|
| Brand | "Meridian Properties Port Harcourt" | Yes |
| **Transactional local** | **"3 bedroom flat for rent GRA Port Harcourt"** | **No — no area pages** |
| **Transactional local** | **"land for sale Port Harcourt"** | **No** |
| **Informational** | **"what is C of O vs Deed of Assignment"** | **No — no content** |
| **Informational** | **"how to verify property title Rivers State"** | **No** |
| Commercial | "estate agent Port Harcourt" | Weakly — homepage only |
| **Local pack** | "property agent near me" | **No — no LocalBusiness schema, no GBP signals** |

**The site can rank for its own name and almost nothing else.** Every high-value query is transactional-local or informational, and both categories require content the site does not have.

> **The pattern to internalise: technical SEO is table stakes; content SEO is where the traffic is.** The twelve missing technical items are half a day's work and necessary. But even perfectly implemented, they would not produce traffic, because there are no pages targeting what people actually search. **Eight area pages plus a title-type glossary would outperform every technical fix on this list combined.**

## 12.3 Priority order for SEO

1. **`metadataBase` + OG tags + `opengraph-image`** — fixes WhatsApp sharing, the site's primary channel *(2 hours)*
2. **`not-found.tsx`** *(30 min)*
3. **`sitemap.ts` + `robots.ts`** *(1 hour)*
4. **JSON-LD** — `RealEstateListing` per property, `RealEstateAgent` on the homepage *(3 hours)*
5. **Slug URLs** — before indexing, to avoid needing redirects *(2 hours)*
6. **URL-driven filters** — makes `/properties?area=gra` indexable *(4 hours)*
7. **Area landing pages ×8** — the actual traffic *(1–2 days)*
8. **Title-type glossary + guides** — informational capture *(1 day)*

---

# PART 13 — REAL ESTATE FEATURE MATRIX

Scored against the 27-item playbook checklist. **Necessity is judged for this specific business** — a Port Harcourt sales-and-rentals brokerage — not for real estate generically.

| # | Feature | Status | Necessity | Notes |
|---|---|---|---|---|
| 1 | Search | 🟡 | **Must** | Title/location only, and absent from the homepage |
| 2 | Filters | 🟡 | **Must** | Type/area/price; no beds, baths, or size |
| 3 | Property Categories | ✅ | **Must** | Type + area, well implemented |
| 4 | Property Comparison | ❌ | Nice | Low value below ~50 listings |
| 5 | Saved Properties | ❌ | Should | Needs accounts — defer |
| 6 | **Favourites** | ❌ | **Should** | **`localStorage` delivers this without accounts — quick win** |
| 7 | Agent Profiles | 🟡 | **Must** | Desks not people, no photos, one shared number |
| 8 | Property Inquiry | ✅ | **Must** | Best-executed feature on the site |
| 9 | WhatsApp | ✅ | **Must** | Excellent, market-correct |
| 10 | **Booking (viewing)** | ❌ | **Must** | The conversion that predicts revenue |
| 11 | Mortgage Calculator | ❌ | **Nice** | **Low value — Nigerian residential property is overwhelmingly cash. Resist the reflex to add it.** |
| 12 | Investment Calculator | ❌ | Should | Rental yield is computable from existing data |
| 13 | **Maps** | 🟡 | **Must** | Office page only, placeholder coords, **none on property pages** |
| 14 | Floor Plans | ❌ | Should | Expected at ₦95m–₦550m |
| 15 | Gallery | ✅ | **Must** | Works; no lightbox, no keyboard, no swipe |
| 16 | **Videos** | ❌ | **Should** | **The site promises video walkthroughs to diaspora buyers and has none** |
| 17 | Virtual Tours | ❌ | Nice | High production cost, low return at this scale |
| 18 | Download Brochure | ❌ | Should | The obvious lead magnet — the site has none |
| 19 | Payment Plans | ❌ | **N/A** | Developer feature, not brokerage |
| 20 | **FAQs** | ❌ | **Must** | Objection handling + SEO + future AI grounding |
| 21 | **Reviews** | ❌ | **Must** | Zero third-party validation anywhere |
| 22 | **Testimonials** | ❌ | **Must** | A component named for them contains none |
| 23 | **Similar Properties** | ❌ | **Must** | Trivial to build, high value, fixes the dead end |
| 24 | Property Status | ❌ | Should | Available / under offer / let — the only honest urgency mechanism |
| 25 | CRM Integration | ❌ | N/A (portfolio) | Essential for a real client |
| 26 | CMS | ❌ | N/A (portfolio) | Essential for a real client |
| 27 | Dashboards | ❌ | N/A | — |

**Totals: 4 ✅ · 4 🟡 · 19 ❌**

**Must-have gaps: viewing booking, property maps, FAQ, reviews, testimonials, similar properties** — six items, none of which require a backend.

**Page inventory:**

| Page | Status |
|---|---|
| Home | ✅ |
| About | ✅ |
| Services | ❌ |
| Properties | ✅ |
| Projects | N/A (developer feature) |
| Agents | 🟡 Section only |
| Contact | ✅ |
| FAQs | ❌ |
| Blog | ❌ |
| Resources | ❌ |

**Two features worth explicitly declining:**

**Mortgage calculator** — the default recommendation in every real estate audit template, and wrong here. Nigerian residential property is predominantly a cash market; mortgage penetration is very low. Adding one would occupy prime detail-page space to serve a small fraction of buyers. **An investment/yield calculator serves this market better and uses data the site already has.**

**Property comparison** — genuinely useful above roughly 50 listings, meaningless at 12, and expensive to build well.

> **The skill being demonstrated here is declining features.** Every audit template lists comparison tools, virtual tours, and mortgage calculators. A senior consultant asks which of them this specific business, in this specific market, at this specific scale, will actually benefit from. **Recommending everything is the same as recommending nothing.**

---

# PART 14 — AI OPPORTUNITIES

Included per the playbook. The current build has no AI, and the decision to keep it that way for now is noted — this section is a specification for when it is wanted.

Ranked by business value, with implementation weight.

## 14.1 High value

**1. Natural-language property search**

*"3 bed in GRA under ₦5m a year with a generator"* → parsed into structured filters.

**Why it is first:** it solves a real, documented gap. The current filter set has no bedroom, bathroom, size, or feature filters, and the text search covers only title and location — so "generator" returns nothing despite appearing in most listings. An LLM parsing free text into the existing filter state closes that gap without building six more dropdowns.

**Weight:** one API call, a structured-output schema matching the existing filter shape, wired to the state already in `PropertiesClient`. Small, and it becomes far more valuable once filters live in the URL.

**2. WhatsApp lead qualification**

An agent that receives the enquiry, asks two or three qualifying questions (budget, timeline, area, financing), and routes to the right desk with a summary.

**Why:** this is the direct implementation of the *friction proportional to lead value* principle (§2.3). It costs a ₦550m buyer thirty seconds and saves an agent an hour of unqualified conversations. It is also the only intervention that creates a **lead record** — which fixes the site's largest business gap (§2.8) as a side effect.

**Weight:** requires a WhatsApp Business API integration and a backend. The heaviest item on this list and the highest business value.

**3. Property assistant on the detail page**

Grounded question-answering over the listing data plus area context. *"Is this suitable for a family with young children?"* *"How far is the airport?"* *"What does Deed of Assignment mean for me as a buyer?"*

**Why:** it directly closes the education gap (§10.4) and answers the persona questions the site currently ignores. Grounding it in the property record keeps it honest and demoable.

**Weight:** moderate. The property data is already well-structured, which makes grounding straightforward — one of the genuine payoffs of the existing type discipline.

## 14.2 Medium value

**4. AI FAQ / support** — answers title, fee, and process questions. Best built *after* a written FAQ exists, so there is a corpus to ground against.

**5. Listing description generation** — specs in, structured description out. An internal tool that would have prevented the prop-001 title contradiction (§10.2) by deriving prose from data rather than writing both by hand.

**6. Property recommendations** — "similar properties" powered by embeddings rather than rules. **Build the rule-based version first**; at 12 listings, `getPropertiesByArea` + `getPropertiesByType` produces results as good as any model, at zero cost.

## 14.3 Lower value at current scale

**7. AI follow-up sequences** — high value in principle, but requires a lead database that does not exist yet.

**8. Internal agent assistant** — inventory queries, client history. Needs a CRM first.

## 14.4 Recommended sequence

| Order | Feature | Why this order |
|---|---|---|
| 1 | Natural-language search | Self-contained, fixes a real gap, most demoable |
| 2 | Property assistant | Data already structured; closes the education gap |
| 3 | FAQ (written) → AI FAQ | Content first, then grounding |
| 4 | Lead capture (plain) → WhatsApp qualification | Cannot qualify leads you do not store |
| 5 | Description generation | Internal tooling |

> **The sequencing principle: AI features are only as good as the data and content beneath them.** Natural-language search works because the property schema is well typed. An AI FAQ needs an FAQ. Lead qualification needs somewhere to put leads. **Every AI feature on this list is gated by a non-AI prerequisite, and building the prerequisite first is what separates a working feature from a demo.**

---

# PART 15 — SCORECARD, PRIORITY ROADMAP & FINAL VERDICT

## 15.1 Scorecard

| Category | Score | One-line rationale |
|---|---|---|
| Information Architecture | **6/10** | Clean and logical for 5 pages; missing 4 pages the business needs; opaque URLs |
| UX | **6/10** | Solid patterns and a genuinely good empty state; mobile CTA ordering and no-sort hurt |
| Visual Design | **5/10** | Consistent spacing rhythm; entirely default colour, type, and imagery |
| Accessibility | **4/10** | Good alt text and semantics; five Level A failures |
| Performance | **8/10** | Static, well-optimized; external images and an unused font hold it back |
| SEO | **3/10** | Titles and descriptions only; 12 baseline items missing; no content targeting real queries |
| Conversion Optimization | **5/10** | One excellent path; no capture, no booking, no retention |
| Real Estate Best Practices | **4/10** | 4 of 27 features complete; no map, no similar properties, no reviews |
| Frontend Engineering | **7/10** | Correct Next 16 APIs, disciplined RSC boundary, strict TS |
| Scalability | **6/10** | Code scales; content architecture does not |
| Code Quality | **7/10** | Clean, typed, consistent; some duplication and dead code |
| Maintainability | **7/10** | Well organised; hardcoded values and a non-functional token layer |
| Trust | **3/10** | The central failure — zero external evidence |
| Business Strategy | **6/10** | Excellent positioning, incomplete service coverage |
| Content Strategy | **5/10** | What exists is well written; coverage answers 4 of 13 customer questions |
| Future Readiness | **6/10** | Good foundation; no CMS, no data layer, no lead storage |
| Overall Professionalism | **6/10** | Reads as competent; default styling undersells the thinking |
| **Overall Client Readiness** | **4/10** | Placeholder data, broken links, no lead capture, no legal pages |

### **Overall: 5.5 / 10**

**As a portfolio piece specifically: 6/10** — the engineering is above average for the level and the strategic thinking is well above it, but the default visual language, the broken footer links, and the boilerplate README undersell both.

## 15.2 Priority roadmap

### MUST HAVE — before showing this to anyone

| # | Fix | Why | Impact | Difficulty | Time |
|---|---|---|---|---|---|
| 1 | **Rewrite the README** | The repo is the portfolio; the front door is create-next-app boilerplate | High | Trivial | 30 min |
| 2 | **URL-driven filters** | Four footer links are silently broken; a reviewer finds it in 60 seconds | High | Medium | 4 h |
| 3 | **OG tags + `opengraph-image` + `metadataBase`** | WhatsApp shares are grey rectangles on a WhatsApp-first site | High | Low | 2 h |
| 4 | **Fix the prop-001 title contradiction** | The one error the differentiator cannot survive | High | Trivial | 5 min |
| 5 | **`app/not-found.tsx`** | 404s are an unbranded dead end | Medium | Trivial | 30 min |
| 6 | **Remove the 1.5s delay + `Geist_Mono` + starter SVGs** | Debug scaffolding in committed code | Medium | Trivial | 15 min |
| 7 | **Five Level A accessibility fixes** | `aria-label`s, Select label, skip link, focus rings | High | Low | 2 h |
| 8 | **Mobile sticky CTA on detail pages** | Highest-ROI conversion fix on the site | High | Low | 2 h |
| 9 | **Real stats + real testimonials** | The site's central credibility gap; content only | High | Low | 3 h |
| 10 | **Remove `min-h-screen` from About/Contact heroes** | Pushes the form below the fold on the conversion page | Medium | Trivial | 10 min |

**Total: roughly two days.** This is the set that turns the project from "a good learning build" into "a piece I would show."

### SHOULD HAVE — makes it genuinely strong

| # | Fix | Why | Time |
|---|---|---|---|
| 11 | Property maps | Location is the primary decision variable | 3 h |
| 12 | Similar properties | Fixes the dead end; uses existing helpers | 2 h |
| 13 | Sort + bedroom filter | Table stakes on any listings page | 3 h |
| 14 | Named agents with photographs | "Not a faceless inbox" made true | 2 h |
| 15 | Fix the two-palette problem | Makes the design system real; unlocks dark mode | 3 h |
| 16 | Extract `Section` / `SectionHeader` / `TrustList` | ~200 lines removed, one-file changes | 3 h |
| 17 | Working form submission + honest success state | Stops the site lying about succeeding | 4 h |
| 18 | Contrast fixes | Two token changes, several AA failures resolved | 1 h |
| 19 | 44px touch targets | Theme-level fix | 1 h |
| 20 | Slug URLs | SEO + shareability, cheapest before indexing | 2 h |
| 21 | `sitemap.ts` + `robots.ts` + JSON-LD | Technical SEO baseline | 4 h |
| 22 | Gallery: lightbox, keyboard, swipe | The product is photographs | 4 h |
| 23 | FAQ page | Objection handling + SEO + future AI grounding | 4 h |
| 24 | Favourites via `localStorage` | Retention without accounts | 3 h |
| 25 | Distinctive colour + type system | The highest visual-credibility-per-hour change | 4 h |

### NICE TO HAVE

Area landing pages ×8 · Sell Your Property page · Diaspora guide · Title-type glossary · Viewing booking · Property status badges · Floor plans · Investment/yield indicators · Video walkthroughs · Blog · Tests · CMS integration

### DECLINE

Mortgage calculator (wrong market) · Property comparison (wrong scale) · Virtual tours (wrong cost/return) · User accounts (no need) · Payment plans (wrong business model)

## 15.3 Final verdict — the ten questions

**1. What does this website do exceptionally well?**

Three things. The **move-in cost breakdown** is a genuine differentiator, properly executed, and the only place the positioning is demonstrated rather than asserted. The **WhatsApp integration** is market-correct and better implemented than most agency sites, with context-aware prefills that remove friction on both sides. And the **positioning strategy** — four pillars, each answering a specific customer fear — is well above the level of most agency sites, which sell virtues instead of answering anxieties.

**2. What are its biggest weaknesses?**

**The proof gap.** A site whose entire argument is trustworthiness, with zero external evidence — no reviews, no testimonials, no statistics, no registration, no photographs of the people or the office it insists are real. Three components are *named* for proof and contain none.

Second: **nothing is captured.** Every conversion path leaves the site with no record, so the business has no owned audience, no attribution, and no ability to follow up — in a category where most buyers are months from transacting.

Third: **no local knowledge.** The site claims local expertise as a core differentiator and contains no map on any property, no area guides, and no explanation of the title types it displays as its headline feature.

**3. What business opportunities are being missed?**

The **diaspora segment** — highest value, best product fit, currently 40 words and no page. The **seller side** — invisible, despite being the supply that a brokerage runs on. **Investors** — the yield data already exists in the codebase and is never surfaced. **Area-based organic search** — the highest-intent traffic in this market, uncapturable without area pages. And **every visitor who is not ready today**, which is most of them.

**4. If rebuilding from scratch, what would you keep?**

The App Router structure and feature-based colocation. The server/client boundary discipline and the `…Client` extraction pattern. The query-helper abstraction seam. The union types. The `WhatsAppButton` and `PropertyCard` components essentially as-is. The move-in cost breakdown. The positioning strategy and most of the copy — particularly the About page. The spacing rhythm.

**5. What would you redesign completely?**

The **`Property` type** — into a discriminated union, which is the root cause of the shortlet gaps, the empty land/commercial spec rows, and the `.replace("/year", "")` awkwardness. The **colour system** — one palette consuming real tokens instead of two systems that never meet. The **homepage section order** — search in the hero, real proof in the proof slots, area browsing and process added. The **mobile detail page** — price and CTA above the fold, sticky action bar. And the **visual identity** — colour, type, and photography that do not read as framework defaults.

**6. Which components should become part of a Real Estate Design System?**

**Ready now:** `WhatsAppButton`, `PropertyCard`, `PropertyGallery`, `PriceBreakdown` (extracted from the detail page).
**Extract next:** `Section`, `SectionHeader`, `TrustList`, `AgentCard`, `ContactDetailRow`, `FilterControls`.
**Build:** `PropertyMap`, `SimilarProperties`, `ViewingRequestForm`, `FavouriteButton`, `SortControl`, `Breadcrumbs`, `FAQAccordion`, `TestimonialCard`, `StatCard`, `AreaCard`, `ProcessSteps`, `TitleTypeExplainer`.

**7. Which architectural decisions are excellent?**

Static generation with `generateStaticParams`. The five-of-thirty client component ratio and the surgical `PropertyDetailClient` extraction. The query-helper seam over the data. Union types over stringly-typed fields. Correct Next 16 async `params` — read from the version's own docs rather than trusted from tutorials. Correct `next/image` `sizes` and `priority` placement. `next/font` self-hosting. The `error.tsx` using `unstable_retry` rather than the older `reset`.

**8. Which architectural decisions should change?**

Filter state from `useState` to URL search params — one change fixing five problems. `Property` from a single interface to a discriminated union. The colour system from hardcoded utilities to consumed tokens. `formatPrice` split so callers do not strip its output. The module-scope data call moved into render. Magic layout numbers into a `--nav-height` token. And, for any real client, the hardcoded data array into a CMS.

**9. How would you redesign the information architecture?**

```
/                        Home (with hero search)
/properties              All listings (URL-driven filters, sort)
/properties/[slug]       Detail (map, similar, viewing request)
/areas                   Area index
/areas/[area]            8 area guides — the SEO engine
/sell                    Sell Your Property — the invisible revenue line
/diaspora                Buying from abroad — the highest-value segment
/about                   About (WhyTrustUs moves to the homepage)
/agents                  Agent profiles (when >5 agents)
/faq                     Objection handling
/guides                  Title types, buying process, fees glossary
/contact                 Contact
/privacy · /terms        Legal
/not-found               Branded 404
```

Navigation becomes: **Properties · Areas · Sell · About · Contact** — with Areas and Sell being the two additions that unlock organic traffic and the supply side respectively.

**10. If this were your client, what would the redesign strategy be?**

**Phase 1 — Credibility (week 1).** Nothing else matters while the trust claims are unbacked. Real statistics, five testimonials with names and photographs, agent profiles with faces and individual numbers, an office photograph, CAC and NIESV registration, and a Google Business Profile. This is content work, not engineering, and it moves the trust score from 3 to 7.

**Phase 2 — Conversion (week 2).** Mobile sticky CTA, working lead capture with an honest success state, viewing booking, property maps, similar properties, favourites. Every one of these closes a documented drop-off point.

**Phase 3 — Discovery (weeks 3–4).** URL-driven filters, slug URLs, eight area pages, FAQ, title-type glossary, the full technical SEO baseline. This is where traffic starts arriving.

**Phase 4 — Differentiation (week 5+).** The diaspora experience built properly — process, escrow explanation, video walkthroughs, timezone-aware contact. This is the segment where the positioning and the highest-value customer align, and it is where the business should be competing.

**Phase 5 — Operations.** CMS so the agency can self-serve, and a CRM so leads stop evaporating.

> **The strategic through-line: this business has chosen exactly the right thing to be known for and has not yet proved it.** Every phase above is, in some form, the same project — converting an assertion into evidence. Phase 1 proves the agency is real. Phase 2 proves it is easy to deal with. Phase 3 proves it knows the market. Phase 4 proves it can serve the customer nobody else can. **The positioning is already correct; the work is making it true on the page.**

---

*End of audit.*
