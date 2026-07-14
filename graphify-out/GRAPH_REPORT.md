# Graph Report - Tepe Bite Website  (2026-07-14)

## Corpus Check
- 210 files · ~156,356 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1176 nodes · 2287 edges · 99 communities (57 shown, 42 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d3d17f44`
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
- InitiativesOverview.tsx
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
- Hero.tsx
- langAtom
- constants.ts
- bcryptjs
- page.tsx
- jotai
- FirstInitiative.tsx

## God Nodes (most connected - your core abstractions)
1. `getMongoose()` - 45 edges
2. `langAtom` - 41 edges
3. `Partner` - 30 edges
4. `Initiative` - 25 edges
5. `serializePartner()` - 21 edges
6. `Order` - 21 edges
7. `POST()` - 19 edges
8. `serializeInitiative()` - 18 edges
9. `formatMoneyEUR()` - 18 edges
10. `compilerOptions` - 18 edges

## Surprising Connections (you probably didn't know these)
- `loadImage()` --indirect_call--> `img()`  [INFERRED]
  src/lib/image/compress.ts → scripts/seed-impact-data.ts
- `proxy()` --calls--> `verifySessionTokenEdge()`  [EXTRACTED]
  proxy.ts → src/lib/auth/session-edge.ts
- `main()` --calls--> `getMongoose()`  [EXTRACTED]
  scripts/admin-create.ts → src/lib/mongo/index.ts
- `main()` --calls--> `hashPassword()`  [EXTRACTED]
  scripts/hash.ts → src/lib/auth/password.ts
- `main()` --calls--> `hashPassword()`  [EXTRACTED]
  scripts/admin-create.ts → src/lib/auth/password.ts

## Import Cycles
- None detected.

## Communities (99 total, 42 thin omitted)

### Community 0 - "InitiativeEditor.tsx"
Cohesion: 0.09
Nodes (24): ARRANGED_TYPES, INFLOW_PHASES, INFLOW_SOURCES, INITIATIVE_CATEGORIES, INITIATIVE_STATUSES, PARTNERSHIP_TYPES, ExpenseInputSchema, GalleryItemInputSchema (+16 more)

### Community 1 - "session.ts"
Cohesion: 0.07
Nodes (29): main(), main(), DashboardLayout(), getIp(), LoginSchema, POST(), POST(), GET() (+21 more)

### Community 2 - "route.ts"
Cohesion: 0.12
Nodes (33): CartItemSchema, DeliverySchema, getIp(), normalizeDelivery(), OrderCreateSchema, POST(), validateDelivery(), getIp() (+25 more)

### Community 3 - "scripts"
Cohesion: 0.05
Nodes (37): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, prettier, tailwindcss, @tailwindcss/postcss (+29 more)

### Community 4 - "route.ts"
Cohesion: 0.07
Nodes (78): main(), slugify(), uniqueSlug(), euro(), img(), main(), PARTNERS, PartnerSpec (+70 more)

### Community 5 - "Footer.tsx"
Cohesion: 0.13
Nodes (15): sections, sections, cards, sections, sections, sections, sections, bodyText (+7 more)

### Community 6 - "index.ts"
Cohesion: 0.11
Nodes (20): AdminAuditLog, Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, AdminInviteToken (+12 more)

### Community 7 - "Initiative.ts"
Cohesion: 0.12
Nodes (8): expenseTotalCents(), Finances(), financeSubHeading, Intro(), Partners(), partnerTotals(), PHASE_ACCENT, SOURCE_ACCENT

### Community 8 - "types.ts"
Cohesion: 0.12
Nodes (15): metadata, LocationCard(), formatDate(), LocationDetail(), LocationMiniMap, ptComponents, LocationsMap, LocationsMapSection() (+7 more)

### Community 9 - "compilerOptions"
Cohesion: 0.06
Nodes (32): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, ./src/* (+24 more)

### Community 10 - "OrderInventoryAllocation"
Cohesion: 0.10
Nodes (26): InventoryBatch, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, InventoryMovement, InventoryMovementType (+18 more)

### Community 11 - "impactUi.tsx"
Cohesion: 0.11
Nodes (20): IconInfo(), CompactSteps(), FocusDeepDive(), Gallery(), CategoryChip(), CompletedDateBadge(), formatDate(), FreezeNote() (+12 more)

### Community 12 - "getMongoose"
Cohesion: 0.17
Nodes (11): Assumptions, Commands, Completion, graphify, Implementation, **IMPORTANT — Core rules**, Orchestration, Product context (+3 more)

### Community 13 - "lang.ts"
Cohesion: 0.16
Nodes (11): CartToast(), addToCartAtom, cartItemCountAtom, cartStorageAtom, cartSubtotalCentsAtom, cartToastAtom, CartToastState, clearCartAtom (+3 more)

### Community 14 - "manual.provider.ts"
Cohesion: 0.16
Nodes (16): GET(), VALID_TYPES, ALL_PLOVDIV_POINTS, PLOVDIV_SPEEDY_LOCKERS, PLOVDIV_SPEEDY_OFFICES, CourierProviderName, getCourierProvider(), ManualCourierProvider (+8 more)

### Community 15 - "page.tsx"
Cohesion: 0.18
Nodes (13): CartPage(), T, CheckoutPage(), CheckoutStatus, generateCheckoutId(), T, Props, T (+5 more)

### Community 16 - "create.ts"
Cohesion: 0.11
Nodes (23): DeliveryMethod, Order, OrderStatus, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn (+15 more)

### Community 17 - "ImpactPageContent.tsx"
Cohesion: 0.06
Nodes (3): HERO_EYEBROW, ImpactPageContent(), orderedInitiatives()

### Community 20 - "InitiativeDetail.tsx"
Cohesion: 0.15
Nodes (13): OrderItem, Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, ProductPlan (+5 more)

### Community 21 - "PartnerDetail.tsx"
Cohesion: 0.12
Nodes (12): YouthBadge(), PartnersCarousel(), FundingSplitBar(), ORDER, PHASE_COLOR, PHASE_INFO, PhaseBarMini(), PhaseBreakdown() (+4 more)

### Community 22 - "InitiativesClient.tsx"
Cohesion: 0.19
Nodes (17): Props, StickyOrderSummary(), SummaryItem, available(), PackCard(), Props, PackDetailClient(), Props (+9 more)

### Community 23 - "LinksClient.tsx"
Cohesion: 0.18
Nodes (5): BackTarget, Copy, LinksClient(), ROUTE_NAMES, routeName()

### Community 24 - "index.tsx"
Cohesion: 0.09
Nodes (19): CartNavIcon(), socials, IconArrow(), IconCart(), IconCheck(), IconFb(), IconHeart(), IconInsta() (+11 more)

### Community 25 - "formatDualMoney"
Cohesion: 0.25
Nodes (4): caveat, dmSans, metadata, playfair

### Community 27 - "ProductPageContent.tsx"
Cohesion: 0.11
Nodes (3): jsonLd, metadata, Lang

### Community 28 - "Partner"
Cohesion: 0.22
Nodes (7): CURRENCY, DeliveryPricingConfig, parseCentsEnv(), ParseErr, ParseOk, ParseResult, PricingConfig

### Community 29 - "typeorm.config.ts"
Cohesion: 0.14
Nodes (9): NewsletterSubscriber, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, InitialSchema1747008000001, SeedProductPlans1747008000002 (+1 more)

### Community 30 - "product-plans.ts"
Cohesion: 0.19
Nodes (10): generateMetadata(), PackDetailPage(), Props, metadata, OrderPage(), T, getAllProductPlans(), getProductPlanBySlug() (+2 more)

### Community 31 - "SystemLog"
Cohesion: 0.18
Nodes (13): SystemLogOptions, LogSeverity, SystemLog, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn (+5 more)

### Community 32 - "EmailLog"
Cohesion: 0.15
Nodes (13): DeliveryStatus, EmailLog, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, TelegramNotificationLog (+5 more)

### Community 33 - "lang.ts"
Cohesion: 0.12
Nodes (6): metadata, NotFound(), steps, Props, isLang(), normalizeLang()

### Community 34 - "cart.ts"
Cohesion: 0.40
Nodes (3): badges, HERO_HEADLINE_BG, HERO_HEADLINE_EN

### Community 35 - "StepReview.tsx"
Cohesion: 0.18
Nodes (10): HoneypotField(), Props, DeliveryFields, Props, T, deliveryDescription(), Props, StepReview() (+2 more)

### Community 36 - "FirstInitiative.tsx"
Cohesion: 0.21
Nodes (14): metadata, NewsPage(), Home(), PartneringLocationsPage(), generateMetadata(), generateStaticParams(), LocationPage(), StoresSection() (+6 more)

### Community 37 - "ProofUploader.tsx"
Cohesion: 0.18
Nodes (11): { GET, POST }, extract(), ProofUploader(), UploadResult, compressToBW(), loadImage(), UploadButton, UploadDropzone (+3 more)

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
Cohesion: 0.29
Nodes (7): OrderAdminNote, Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn

### Community 44 - "StepCustomerInfo.tsx"
Cohesion: 0.28
Nodes (8): CustomerInfoFields, FieldErrors, Props, StepCustomerInfo(), T, Touched, validate(), validatePhone()

### Community 45 - "InitiativeEditor.tsx"
Cohesion: 0.10
Nodes (24): extract(), ImageUploader(), UploadResult, centsToStr(), EditExpense, EditGallery, EditInflow, EditPartner (+16 more)

### Community 46 - "PartnerForm.tsx"
Cohesion: 0.33
Nodes (4): PickupPoint, Props, SpeedyMap, T

### Community 47 - "pricing.ts"
Cohesion: 0.50
Nodes (4): EMPTY_OVERVIEW, ImpactPage(), metadata, pickHeroInitiative()

### Community 48 - "proxy.ts"
Cohesion: 0.48
Nodes (5): config, proxy(), base64urlToBuffer(), stringToBuffer(), verifySessionTokenEdge()

### Community 49 - "SpeedyMap.tsx"
Cohesion: 0.29
Nodes (4): Point, Props, RecenterProps, selectedIcon

### Community 51 - "courier.config.ts"
Cohesion: 0.50
Nodes (4): ALLOWED_PROVIDERS, CourierConfigResult, CourierProvider, validateCourierConfig()

### Community 73 - "sanity"
Cohesion: 0.50
Nodes (3): IMPACT, ImpactConfig, ImpactDonor

### Community 76 - "@sanity/vision"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 91 - "Hero.tsx"
Cohesion: 0.20
Nodes (4): fmt(), ImpactPledge(), PledgeHeart(), Variant

### Community 92 - "langAtom"
Cohesion: 0.16
Nodes (14): ArticlePage(), generateMetadata(), generateStaticParams(), ArticleBody(), FeaturedPost(), PostCard(), NewsStrip(), sanityClient (+6 more)

### Community 93 - "constants.ts"
Cohesion: 0.23
Nodes (11): AdminRole, ArrangedType, EXPENSE_LABELS, InflowPhase, InflowSource, InitiativeCategory, InitiativeStatus, PartnershipType (+3 more)

## Knowledge Gaps
- **316 isolated node(s):** `nextConfig`, `metadata`, `EMPTY_OVERVIEW`, `metadata`, `EMPTY_OVERVIEW` (+311 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **42 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getMongoose()` connect `route.ts` to `session.ts`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `RateLimiter` connect `session.ts` to `route.ts`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `langAtom` connect `Footer.tsx` to `lang.ts`, `types.ts`, `impactUi.tsx`, `lang.ts`, `page.tsx`, `SpeedyLocationSelector.tsx`, `InitiativesClient.tsx`, `index.tsx`, `langAtom`, `product-plans.ts`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **What connects `nextConfig`, `metadata`, `EMPTY_OVERVIEW` to the rest of the system?**
  _316 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `InitiativeEditor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09230769230769231 - nodes in this community are weakly interconnected._
- **Should `session.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.070578231292517 - nodes in this community are weakly interconnected._
- **Should `route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11538461538461539 - nodes in this community are weakly interconnected._