# Graph Report - Tepe Bite Website  (2026-07-14)

## Corpus Check
- 213 files · ~201,847 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1207 nodes · 2427 edges · 91 communities (54 shown, 37 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `71de2f05`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- InitiativeEditor.tsx
- session.ts
- route.ts
- scripts
- route.ts
- Footer.tsx
- index.ts
- Initiative.ts
- types.ts
- compilerOptions
- OrderInventoryAllocation
- impactUi.tsx
- getMongoose
- lang.ts
- manual.provider.ts
- page.tsx
- create.ts
- ImpactPageContent.tsx
- queries.ts
- InitiativeDetail.tsx
- PartnerDetail.tsx
- InitiativesClient.tsx
- LinksClient.tsx
- index.tsx
- formatDualMoney
- InitiativesClient 2.tsx
- ProductPageContent.tsx
- Partner
- typeorm.config.ts
- product-plans.ts
- SystemLog
- EmailLog
- lang.ts
- cart.ts
- StepReview.tsx
- FirstInitiative.tsx
- ProofUploader.tsx
- ImpactPledge.tsx
- ТЕПЕ bite — Style Guide
- index.ts
- compilerOptions
- dependencies
- queries.ts
- StepCustomerInfo.tsx
- InitiativeEditor.tsx
- PartnerForm.tsx
- pricing.ts
- proxy.ts
- SpeedyMap.tsx
- SpeedyLocationSelector.tsx
- courier.config.ts
- TrustSection.tsx
- LocationMiniMap.tsx
- admin.config.ts
- database.config.ts
- deepl-node
- dotenv
- eslint.config.mjs
- jotai
- leaflet
- mongoose
- next
- next.config.ts
- next-sanity
- nodemailer
- pg
- @portabletext/react
- react
- react-dom
- react-leaflet
- react-markdown
- LocationsMap.tsx
- sanity
- @sanity/client
- @sanity/image-url
- @sanity/vision
- styled-components
- ts-node
- typeorm
- typeorm-ts-node-commonjs
- @types/bcryptjs
- @types/leaflet
- @types/nodemailer
- @types/pg
- uploadthing
- zod
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `langAtom` - 52 edges
2. `getMongoose()` - 37 edges
3. `Initiative` - 25 edges
4. `Partner` - 23 edges
5. `formatMoneyEUR()` - 22 edges
6. `serializePartner()` - 21 edges
7. `Order` - 21 edges
8. `POST()` - 19 edges
9. `serializeInitiative()` - 18 edges
10. `formatDualMoney()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `loadImage()` --indirect_call--> `img()`  [INFERRED]
  src/lib/image/compress.ts → scripts/seed-impact-data.ts
- `upsertInitiatives()` --references--> `Initiative`  [EXTRACTED]
  scripts/seed-impact-data.ts → src/lib/mongo/models/Initiative.ts
- `proxy()` --calls--> `verifySessionTokenEdge()`  [EXTRACTED]
  proxy.ts → src/lib/auth/session-edge.ts
- `main()` --calls--> `getMongoose()`  [EXTRACTED]
  scripts/admin-create.ts → src/lib/mongo/index.ts
- `main()` --calls--> `hashPassword()`  [EXTRACTED]
  scripts/hash.ts → src/lib/auth/password.ts

## Import Cycles
- None detected.

## Communities (91 total, 37 thin omitted)

### Community 0 - "InitiativeEditor.tsx"
Cohesion: 0.10
Nodes (22): ARRANGED_TYPES, INFLOW_PHASES, INFLOW_SOURCES, INITIATIVE_CATEGORIES, PARTNERSHIP_TYPES, ExpenseInputSchema, GalleryItemInputSchema, ImageInputSchema (+14 more)

### Community 1 - "session.ts"
Cohesion: 0.10
Nodes (25): main(), main(), DashboardLayout(), getIp(), LoginSchema, POST(), POST(), GET() (+17 more)

### Community 2 - "route.ts"
Cohesion: 0.11
Nodes (33): CartItemSchema, DeliverySchema, getIp(), normalizeDelivery(), OrderCreateSchema, POST(), validateDelivery(), getIp() (+25 more)

### Community 3 - "scripts"
Cohesion: 0.05
Nodes (36): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, prettier, tailwindcss, @tailwindcss/postcss (+28 more)

### Community 4 - "route.ts"
Cohesion: 0.10
Nodes (54): main(), slugify(), uniqueSlug(), EditInitiativePage(), NewInitiativePage(), InitiativesPage(), OverviewPage(), EditPartnerPage() (+46 more)

### Community 5 - "Footer.tsx"
Cohesion: 0.12
Nodes (16): sections, sections, sections, cards, sections, sections, sections, sections (+8 more)

### Community 6 - "index.ts"
Cohesion: 0.08
Nodes (31): AdminAuditLog, Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, AdminInviteToken (+23 more)

### Community 7 - "Initiative.ts"
Cohesion: 0.11
Nodes (9): expenseTotalCents(), Finances(), financeSubHeading, Intro(), Partners(), partnerTotals(), PHASE_ACCENT, SOURCE_ACCENT (+1 more)

### Community 8 - "types.ts"
Cohesion: 0.06
Nodes (45): metadata, NewsPage(), ArticlePage(), generateMetadata(), generateStaticParams(), Home(), metadata, PartneringLocationsPage() (+37 more)

### Community 9 - "compilerOptions"
Cohesion: 0.06
Nodes (32): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, ./src/* (+24 more)

### Community 10 - "OrderInventoryAllocation"
Cohesion: 0.09
Nodes (26): InventoryBatch, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, InventoryMovement, InventoryMovementType (+18 more)

### Community 11 - "impactUi.tsx"
Cohesion: 0.06
Nodes (30): IconInfo(), IconMap(), HERO_EYEBROW, HeroFocusCard(), ImpactVehicleSection(), CompactSteps(), FocusDeepDive(), Gallery() (+22 more)

### Community 12 - "getMongoose"
Cohesion: 0.17
Nodes (11): Assumptions, Commands, Completion, graphify, Implementation, **IMPORTANT — Core rules**, Orchestration, Product context (+3 more)

### Community 13 - "lang.ts"
Cohesion: 0.24
Nodes (3): InMemoryRateLimiter, RateLimiter, WindowEntry

### Community 14 - "manual.provider.ts"
Cohesion: 0.16
Nodes (15): GET(), VALID_TYPES, ALL_PLOVDIV_POINTS, PLOVDIV_SPEEDY_LOCKERS, PLOVDIV_SPEEDY_OFFICES, CourierProviderName, getCourierProvider(), ManualCourierProvider (+7 more)

### Community 15 - "page.tsx"
Cohesion: 0.16
Nodes (14): CartPage(), T, CheckoutPage(), CheckoutStatus, generateCheckoutId(), T, Props, DeliveryFields (+6 more)

### Community 16 - "create.ts"
Cohesion: 0.08
Nodes (34): DeliveryMethod, Order, OrderStatus, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn (+26 more)

### Community 17 - "ImpactPageContent.tsx"
Cohesion: 0.08
Nodes (6): metadata, DashboardSection(), DonateSection(), IMPACT, ImpactConfig, ImpactDonor

### Community 20 - "InitiativeDetail.tsx"
Cohesion: 0.17
Nodes (13): AdminRole, ArrangedType, EXPENSE_LABELS, InflowPhase, InflowSource, INITIATIVE_STATUS_LABELS, INITIATIVE_STATUSES, InitiativeCategory (+5 more)

### Community 21 - "PartnerDetail.tsx"
Cohesion: 0.28
Nodes (5): generateMetadata(), PartnerDetailPage(), LINK_META, getPublicPartnerBySlug(), PartnerDetail

### Community 22 - "InitiativesClient.tsx"
Cohesion: 0.09
Nodes (3): HERO_EYEBROW, InitiativesClient(), orderedInitiatives()

### Community 23 - "LinksClient.tsx"
Cohesion: 0.10
Nodes (9): fmt(), ImpactPledge(), PledgeHeart(), Variant, BackTarget, Copy, LinksClient(), ROUTE_NAMES (+1 more)

### Community 24 - "index.tsx"
Cohesion: 0.08
Nodes (20): CartNavIcon(), socials, milestones, PCT, badges, HERO_HEADLINE_BG, HERO_HEADLINE_EN, IconArrow() (+12 more)

### Community 25 - "formatDualMoney"
Cohesion: 0.21
Nodes (9): available(), PackCard(), Props, PackDetailClient(), Props, T, Props, useAddToCart() (+1 more)

### Community 27 - "ProductPageContent.tsx"
Cohesion: 0.08
Nodes (8): jsonLd, metadata, IconHeart(), IconLeaf(), IconStar(), Lang, cards, pillars

### Community 29 - "typeorm.config.ts"
Cohesion: 0.14
Nodes (9): NewsletterSubscriber, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, InitialSchema1747008000001, SeedProductPlans1747008000002 (+1 more)

### Community 30 - "product-plans.ts"
Cohesion: 0.18
Nodes (11): generateMetadata(), PackDetailPage(), Props, metadata, OrderPage(), T, getAllProductPlans(), getProductPlanBySlug() (+3 more)

### Community 31 - "SystemLog"
Cohesion: 0.18
Nodes (13): SystemLogOptions, LogSeverity, SystemLog, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn (+5 more)

### Community 32 - "EmailLog"
Cohesion: 0.15
Nodes (13): DeliveryStatus, EmailLog, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, TelegramNotificationLog (+5 more)

### Community 33 - "lang.ts"
Cohesion: 0.11
Nodes (10): dmSans, metadata, playfair, RootLayout(), metadata, NotFound(), steps, Providers() (+2 more)

### Community 34 - "cart.ts"
Cohesion: 0.16
Nodes (11): CartToast(), addToCartAtom, cartItemCountAtom, cartStorageAtom, cartSubtotalCentsAtom, cartToastAtom, CartToastState, clearCartAtom (+3 more)

### Community 35 - "StepReview.tsx"
Cohesion: 0.16
Nodes (18): Props, StickyOrderSummary(), SummaryItem, HoneypotField(), Props, Props, StepDelivery(), T (+10 more)

### Community 36 - "FirstInitiative.tsx"
Cohesion: 0.17
Nodes (15): EMPTY_OVERVIEW, InitiativesOverviewPage(), metadata, LinksPage(), metadata, InitiativeDTO, getFeaturedInitiative(), getPublicOverviewData() (+7 more)

### Community 37 - "ProofUploader.tsx"
Cohesion: 0.19
Nodes (12): extract(), ImageUploader(), UploadResult, extract(), ProofUploader(), UploadResult, ImageDTO, compressToBW() (+4 more)

### Community 38 - "ImpactPledge.tsx"
Cohesion: 0.39
Nodes (8): euro(), img(), main(), PARTNERS, PartnerSpec, slugify(), upsertInitiatives(), upsertPartners()

### Community 39 - "ТЕПЕ bite — Style Guide"
Cohesion: 0.13
Nodes (14): Authoring, Bilingual (BG primary / EN), Breakpoints, Buttons, Cards, Colour tokens (OKLCH), Icons, Imagery (+6 more)

### Community 40 - "index.ts"
Cohesion: 0.24
Nodes (5): NextStudio, schema, LINK_ICONS, locationSchema, newsPostSchema

### Community 41 - "compilerOptions"
Cohesion: 0.20
Nodes (9): ./tsconfig.json, compilerOptions, isolatedModules, module, moduleResolution, noEmit, exclude, extends (+1 more)

### Community 42 - "dependencies"
Cohesion: 0.22
Nodes (9): dependencies, reflect-metadata, remark-gfm, resend, @uploadthing/react, reflect-metadata, remark-gfm, resend (+1 more)

### Community 43 - "queries.ts"
Cohesion: 0.33
Nodes (5): EMPTY_OVERVIEW, InitiativesPage(), metadata, pickHeroInitiative(), InitiativeDetail

### Community 44 - "StepCustomerInfo.tsx"
Cohesion: 0.28
Nodes (8): CustomerInfoFields, FieldErrors, Props, StepCustomerInfo(), T, Touched, validate(), validatePhone()

### Community 45 - "InitiativeEditor.tsx"
Cohesion: 0.14
Nodes (16): centsToStr(), EditExpense, EditGallery, EditInflow, EditPartner, EditStep, eur(), FIN_SUBTABS (+8 more)

### Community 46 - "PartnerForm.tsx"
Cohesion: 0.19
Nodes (8): LINK_LABELS, Card(), Field(), TextArea(), TextInput(), PARTNER_LINK_TYPES, PartnerLinkType, PartnerDTO

### Community 47 - "pricing.ts"
Cohesion: 0.25
Nodes (6): CURRENCY, DeliveryPricingConfig, ParseErr, ParseOk, ParseResult, PricingConfig

### Community 48 - "proxy.ts"
Cohesion: 0.48
Nodes (5): config, proxy(), base64urlToBuffer(), stringToBuffer(), verifySessionTokenEdge()

### Community 49 - "SpeedyMap.tsx"
Cohesion: 0.29
Nodes (4): Point, Props, RecenterProps, selectedIcon

### Community 50 - "SpeedyLocationSelector.tsx"
Cohesion: 0.33
Nodes (4): PickupPoint, Props, SpeedyMap, T

### Community 51 - "courier.config.ts"
Cohesion: 0.50
Nodes (4): ALLOWED_PROVIDERS, CourierConfigResult, CourierProvider, validateCourierConfig()

### Community 52 - "TrustSection.tsx"
Cohesion: 0.83
Nodes (3): generateMetadata(), InitiativeDetailPage(), getPublicInitiativeBySlug()

### Community 76 - "@sanity/vision"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **313 isolated node(s):** `PartnerSpec`, `PARTNERS`, `HERO_EYEBROW`, `EditStep`, `EditPartner` (+308 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **37 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `langAtom` connect `Footer.tsx` to `lang.ts`, `cart.ts`, `StepReview.tsx`, `types.ts`, `impactUi.tsx`, `page.tsx`, `ImpactPageContent.tsx`, `LinksClient.tsx`, `index.tsx`, `formatDualMoney`, `ProductPageContent.tsx`, `product-plans.ts`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Why does `formatMoneyEUR()` connect `StepReview.tsx` to `formatDualMoney`, `route.ts`, `impactUi.tsx`, `page.tsx`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `RateLimiter` connect `lang.ts` to `session.ts`, `route.ts`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `PartnerSpec`, `PARTNERS`, `HERO_EYEBROW` to the rest of the system?**
  _313 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `InitiativeEditor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09782608695652174 - nodes in this community are weakly interconnected._
- **Should `session.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09815078236130868 - nodes in this community are weakly interconnected._
- **Should `route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11282051282051282 - nodes in this community are weakly interconnected._