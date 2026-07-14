# Graph Report - Tepe Bite Website  (2026-07-14)

## Corpus Check
- 213 files · ~161,701 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1209 nodes · 2546 edges · 96 communities (56 shown, 40 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `08024c65`
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
- InsufficientStockError.tsx
- page.tsx
- bcryptjs
- FirstInitiative.tsx

## God Nodes (most connected - your core abstractions)
1. `langAtom` - 53 edges
2. `getMongoose()` - 45 edges
3. `formatMoneyEUR()` - 31 edges
4. `Partner` - 30 edges
5. `pick()` - 29 edges
6. `Initiative` - 25 edges
7. `formatDualMoney()` - 23 edges
8. `serializePartner()` - 21 edges
9. `Order` - 21 edges
10. `POST()` - 19 edges

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

## Communities (96 total, 40 thin omitted)

### Community 0 - "InitiativeEditor.tsx"
Cohesion: 0.09
Nodes (23): ARRANGED_TYPES, INFLOW_PHASES, INFLOW_SOURCES, INITIATIVE_STATUSES, PARTNERSHIP_TYPES, ExpenseInputSchema, GalleryItemInputSchema, ImageInputSchema (+15 more)

### Community 1 - "session.ts"
Cohesion: 0.08
Nodes (29): main(), main(), DashboardLayout(), getIp(), LoginSchema, POST(), POST(), GET() (+21 more)

### Community 2 - "route.ts"
Cohesion: 0.12
Nodes (31): CartItemSchema, DeliverySchema, getIp(), normalizeDelivery(), OrderCreateSchema, POST(), validateDelivery(), getIp() (+23 more)

### Community 3 - "scripts"
Cohesion: 0.05
Nodes (36): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, prettier, tailwindcss, @tailwindcss/postcss (+28 more)

### Community 4 - "route.ts"
Cohesion: 0.08
Nodes (64): main(), slugify(), uniqueSlug(), euro(), img(), main(), PARTNERS, PartnerSpec (+56 more)

### Community 5 - "Footer.tsx"
Cohesion: 0.13
Nodes (14): sections, sections, sections, sections, sections, sections, sections, bodyText (+6 more)

### Community 6 - "index.ts"
Cohesion: 0.07
Nodes (30): AdminAuditLog, Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, AdminInviteToken (+22 more)

### Community 7 - "Initiative.ts"
Cohesion: 0.16
Nodes (11): StarBadge(), expenseTotalCents(), Finances(), financeSubHeading, FundingGapInvite(), Intro(), Partners(), partnerTotals() (+3 more)

### Community 8 - "types.ts"
Cohesion: 0.10
Nodes (19): metadata, LocationCard(), formatDate(), LocationDetail(), LocationMiniMap, ptComponents, pinIcon, PLOVDIV (+11 more)

### Community 9 - "compilerOptions"
Cohesion: 0.06
Nodes (32): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, ./src/* (+24 more)

### Community 10 - "OrderInventoryAllocation"
Cohesion: 0.10
Nodes (26): InventoryBatch, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, InventoryMovement, InventoryMovementType (+18 more)

### Community 11 - "impactUi.tsx"
Cohesion: 0.13
Nodes (21): HeroFocusCard(), HeroFocusCard(), CompactSteps(), FocusDeepDive(), Gallery(), CategoryChip(), CompletedDateBadge(), formatDate() (+13 more)

### Community 12 - "getMongoose"
Cohesion: 0.17
Nodes (11): Assumptions, Commands, Completion, graphify, Implementation, **IMPORTANT — Core rules**, Orchestration, Product context (+3 more)

### Community 13 - "lang.ts"
Cohesion: 0.24
Nodes (3): InMemoryRateLimiter, RateLimiter, WindowEntry

### Community 14 - "manual.provider.ts"
Cohesion: 0.16
Nodes (16): GET(), VALID_TYPES, ALL_PLOVDIV_POINTS, PLOVDIV_SPEEDY_LOCKERS, PLOVDIV_SPEEDY_OFFICES, CourierProviderName, getCourierProvider(), ManualCourierProvider (+8 more)

### Community 15 - "page.tsx"
Cohesion: 0.23
Nodes (12): CartPage(), T, CheckoutPage(), CheckoutStatus, generateCheckoutId(), T, T, useCart() (+4 more)

### Community 16 - "create.ts"
Cohesion: 0.08
Nodes (34): DeliveryMethod, Order, OrderStatus, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn (+26 more)

### Community 17 - "ImpactPageContent.tsx"
Cohesion: 0.06
Nodes (8): metadata, fmt(), ImpactPledge(), PledgeHeart(), Variant, IMPACT, ImpactConfig, ImpactDonor

### Community 18 - "InitiativesOverview.tsx"
Cohesion: 0.11
Nodes (5): IconStar(), YouthBadge(), FundsPanel(), PartnersCarousel(), PartnerCarouselItem

### Community 20 - "InitiativeDetail.tsx"
Cohesion: 0.15
Nodes (16): AdminRole, ARRANGED_TYPE_LABELS, ArrangedType, EXPENSE_LABELS, INFLOW_SOURCE_LABELS, InflowPhase, InflowSource, INITIATIVE_CATEGORIES (+8 more)

### Community 21 - "PartnerDetail.tsx"
Cohesion: 0.12
Nodes (20): IconInfo(), DashboardSection(), DonateSection(), ImpactVehicleSection(), ExpenseRow(), InflowRow(), LINK_META, PartnerDetail() (+12 more)

### Community 22 - "InitiativesClient.tsx"
Cohesion: 0.10
Nodes (3): HERO_EYEBROW, InitiativesClient(), orderedInitiatives()

### Community 23 - "LinksClient.tsx"
Cohesion: 0.14
Nodes (8): LinksPage(), metadata, BackTarget, Copy, LinksClient(), ROUTE_NAMES, routeName(), getFeaturedInitiative()

### Community 24 - "index.tsx"
Cohesion: 0.22
Nodes (3): IconClose(), IconMenu(), IconShop()

### Community 25 - "formatDualMoney"
Cohesion: 0.27
Nodes (9): available(), PackCard(), Props, PackDetailClient(), Props, T, SafeProductPlan, useAddToCart() (+1 more)

### Community 27 - "ProductPageContent.tsx"
Cohesion: 0.11
Nodes (3): jsonLd, metadata, Lang

### Community 29 - "typeorm.config.ts"
Cohesion: 0.29
Nodes (6): NewsletterSubscriber, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn

### Community 30 - "product-plans.ts"
Cohesion: 0.19
Nodes (10): generateMetadata(), PackDetailPage(), Props, metadata, OrderPage(), T, getAllProductPlans(), getProductPlanBySlug() (+2 more)

### Community 31 - "SystemLog"
Cohesion: 0.18
Nodes (13): SystemLogOptions, LogSeverity, SystemLog, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn (+5 more)

### Community 32 - "EmailLog"
Cohesion: 0.13
Nodes (17): DeliveryStatus, EmailLog, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, TelegramNotificationLog (+9 more)

### Community 33 - "lang.ts"
Cohesion: 0.08
Nodes (12): dmSans, metadata, playfair, RootLayout(), metadata, NotFound(), steps, Props (+4 more)

### Community 34 - "cart.ts"
Cohesion: 0.14
Nodes (14): CartNavIcon(), CartToast(), IconCart(), addToCartAtom, cartItemCountAtom, cartStorageAtom, cartSubtotalCentsAtom, cartToastAtom (+6 more)

### Community 35 - "StepReview.tsx"
Cohesion: 0.18
Nodes (10): HoneypotField(), Props, DeliveryFields, Props, T, deliveryDescription(), Props, StepReview() (+2 more)

### Community 36 - "FirstInitiative.tsx"
Cohesion: 0.13
Nodes (19): EMPTY_OVERVIEW, InitiativesOverviewPage(), metadata, EMPTY_OVERVIEW, InitiativesPage(), metadata, pickHeroInitiative(), InflowDTO (+11 more)

### Community 37 - "ProofUploader.tsx"
Cohesion: 0.19
Nodes (12): extract(), ImageUploader(), UploadResult, extract(), ProofUploader(), UploadResult, ImageDTO, compressToBW() (+4 more)

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
Cohesion: 0.22
Nodes (11): ArticlePage(), generateMetadata(), ArticleBody(), FeaturedPost(), PostCard(), NewsStrip(), builder, urlFor() (+3 more)

### Community 44 - "StepCustomerInfo.tsx"
Cohesion: 0.28
Nodes (8): CustomerInfoFields, FieldErrors, Props, StepCustomerInfo(), T, Touched, validate(), validatePhone()

### Community 45 - "InitiativeEditor.tsx"
Cohesion: 0.19
Nodes (12): centsToStr(), EditExpense, EditGallery, EditInflow, EditPartner, EditStep, eur(), FIN_SUBTABS (+4 more)

### Community 46 - "PartnerForm.tsx"
Cohesion: 0.19
Nodes (9): LINK_LABELS, Card(), Field(), Select(), TextArea(), TextInput(), PARTNER_LINK_TYPES, PartnerLinkType (+1 more)

### Community 47 - "pricing.ts"
Cohesion: 0.15
Nodes (11): Props, StickyOrderSummary(), SummaryItem, CURRENCY, DeliveryPricingConfig, parseCentsEnv(), ParseErr, ParseOk (+3 more)

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

### Community 76 - "@sanity/vision"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 91 - "Hero.tsx"
Cohesion: 0.40
Nodes (3): badges, HERO_HEADLINE_BG, HERO_HEADLINE_EN

### Community 93 - "page.tsx"
Cohesion: 0.17
Nodes (16): metadata, NewsPage(), generateStaticParams(), Home(), PartneringLocationsPage(), generateMetadata(), generateStaticParams(), LocationPage() (+8 more)

### Community 98 - "FirstInitiative.tsx"
Cohesion: 0.10
Nodes (16): socials, milestones, PCT, IconArrow(), IconCheck(), IconExternal(), IconFb(), IconHeart() (+8 more)

## Knowledge Gaps
- **311 isolated node(s):** `HERO_HEADLINE_BG`, `HERO_HEADLINE_EN`, `badges`, `Lang`, `Props` (+306 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **40 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `langAtom` connect `queries.ts` to `lang.ts`, `cart.ts`, `FirstInitiative.tsx`, `Footer.tsx`, `ImpactPledge.tsx`, `Initiative.ts`, `types.ts`, `pricing.ts`, `page.tsx`, `ImpactPageContent.tsx`, `InitiativesOverview.tsx`, `PartnerDetail.tsx`, `InitiativesClient.tsx`, `index.tsx`, `formatDualMoney`, `Partner`, `product-plans.ts`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `getMongoose()` connect `route.ts` to `session.ts`, `FirstInitiative.tsx`, `LinksClient.tsx`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `formatMoneyEUR()` connect `PartnerDetail.tsx` to `route.ts`, `StepReview.tsx`, `Initiative.ts`, `impactUi.tsx`, `pricing.ts`, `page.tsx`, `InitiativesOverview.tsx`, `InitiativesClient.tsx`, `formatDualMoney`, `Partner`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **What connects `HERO_HEADLINE_BG`, `HERO_HEADLINE_EN`, `badges` to the rest of the system?**
  _311 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `InitiativeEditor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09333333333333334 - nodes in this community are weakly interconnected._
- **Should `session.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08139534883720931 - nodes in this community are weakly interconnected._
- **Should `route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12091038406827881 - nodes in this community are weakly interconnected._