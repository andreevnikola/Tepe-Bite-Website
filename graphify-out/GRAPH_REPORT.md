# Graph Report - Tepe Bite Website  (2026-07-14)

## Corpus Check
- 213 files · ~161,683 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1209 nodes · 2582 edges · 94 communities (55 shown, 39 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2275982e`
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
- page.tsx
- ImpactPledge.tsx
- FirstInitiative.tsx

## God Nodes (most connected - your core abstractions)
1. `langAtom` - 56 edges
2. `getMongoose()` - 45 edges
3. `formatMoneyEUR()` - 33 edges
4. `pick()` - 31 edges
5. `Partner` - 30 edges
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

## Communities (94 total, 39 thin omitted)

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
Nodes (67): main(), slugify(), uniqueSlug(), euro(), img(), main(), PARTNERS, PartnerSpec (+59 more)

### Community 5 - "Footer.tsx"
Cohesion: 0.12
Nodes (14): sections, sections, sections, sections, sections, sections, sections, bodyText (+6 more)

### Community 6 - "index.ts"
Cohesion: 0.07
Nodes (30): AdminAuditLog, Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, AdminInviteToken (+22 more)

### Community 7 - "Initiative.ts"
Cohesion: 0.12
Nodes (15): expenseTotalCents(), Finances(), financeSubHeading, Intro(), Partners(), partnerTotals(), PHASE_ACCENT, SOURCE_ACCENT (+7 more)

### Community 8 - "types.ts"
Cohesion: 0.06
Nodes (45): metadata, NewsPage(), ArticlePage(), generateMetadata(), generateStaticParams(), Home(), metadata, PartneringLocationsPage() (+37 more)

### Community 9 - "compilerOptions"
Cohesion: 0.06
Nodes (32): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, ./src/* (+24 more)

### Community 10 - "OrderInventoryAllocation"
Cohesion: 0.10
Nodes (26): InventoryBatch, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, InventoryMovement, InventoryMovementType (+18 more)

### Community 11 - "impactUi.tsx"
Cohesion: 0.10
Nodes (26): IconInfo(), IconStar(), HeroFocusCard(), HeroFocusCard(), CompactSteps(), FocusDeepDive(), Gallery(), CategoryChip() (+18 more)

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
Cohesion: 0.18
Nodes (13): CartPage(), T, CheckoutPage(), CheckoutStatus, generateCheckoutId(), T, Props, T (+5 more)

### Community 16 - "create.ts"
Cohesion: 0.08
Nodes (34): DeliveryMethod, Order, OrderStatus, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn (+26 more)

### Community 17 - "ImpactPageContent.tsx"
Cohesion: 0.08
Nodes (4): metadata, IMPACT, ImpactConfig, ImpactDonor

### Community 20 - "InitiativeDetail.tsx"
Cohesion: 0.15
Nodes (16): AdminRole, ARRANGED_TYPE_LABELS, ArrangedType, EXPENSE_LABELS, INFLOW_SOURCE_LABELS, InflowPhase, InflowSource, INITIATIVE_CATEGORIES (+8 more)

### Community 21 - "PartnerDetail.tsx"
Cohesion: 0.13
Nodes (19): DashboardSection(), DonateSection(), ImpactVehicleSection(), ImpactVehicleSection(), StatusBadge(), ExpenseRow(), FundingGapInvite(), InflowRow() (+11 more)

### Community 22 - "InitiativesClient.tsx"
Cohesion: 0.10
Nodes (3): HERO_EYEBROW, InitiativesClient(), orderedInitiatives()

### Community 23 - "LinksClient.tsx"
Cohesion: 0.18
Nodes (5): BackTarget, Copy, LinksClient(), ROUTE_NAMES, routeName()

### Community 24 - "index.tsx"
Cohesion: 0.16
Nodes (10): CartNavIcon(), badges, HERO_HEADLINE_BG, HERO_HEADLINE_EN, IconArrow(), IconCart(), IconClose(), IconMenu() (+2 more)

### Community 25 - "formatDualMoney"
Cohesion: 0.18
Nodes (14): metadata, OrderPage(), available(), PackCard(), Props, PackDetailClient(), Props, T (+6 more)

### Community 27 - "ProductPageContent.tsx"
Cohesion: 0.11
Nodes (3): jsonLd, metadata, Lang

### Community 29 - "typeorm.config.ts"
Cohesion: 0.29
Nodes (6): NewsletterSubscriber, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn

### Community 30 - "product-plans.ts"
Cohesion: 0.28
Nodes (5): generateMetadata(), PackDetailPage(), Props, T, getProductPlanBySlug()

### Community 31 - "SystemLog"
Cohesion: 0.18
Nodes (13): SystemLogOptions, LogSeverity, SystemLog, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn (+5 more)

### Community 32 - "EmailLog"
Cohesion: 0.13
Nodes (17): DeliveryStatus, EmailLog, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, TelegramNotificationLog (+9 more)

### Community 33 - "lang.ts"
Cohesion: 0.12
Nodes (11): dmSans, metadata, playfair, RootLayout(), metadata, NotFound(), Props, Providers() (+3 more)

### Community 34 - "cart.ts"
Cohesion: 0.16
Nodes (11): CartToast(), addToCartAtom, cartItemCountAtom, cartStorageAtom, cartSubtotalCentsAtom, cartToastAtom, CartToastState, clearCartAtom (+3 more)

### Community 35 - "StepReview.tsx"
Cohesion: 0.18
Nodes (11): HoneypotField(), Props, DeliveryFields, Props, StepDelivery(), T, deliveryDescription(), Props (+3 more)

### Community 36 - "FirstInitiative.tsx"
Cohesion: 0.15
Nodes (17): EMPTY_OVERVIEW, InitiativesOverviewPage(), metadata, EMPTY_OVERVIEW, InitiativesPage(), metadata, pickHeroInitiative(), InitiativeDTO (+9 more)

### Community 37 - "ProofUploader.tsx"
Cohesion: 0.19
Nodes (12): extract(), ImageUploader(), UploadResult, extract(), ProofUploader(), UploadResult, ImageDTO, compressToBW() (+4 more)

### Community 38 - "ImpactPledge.tsx"
Cohesion: 0.20
Nodes (5): cards, socials, IconFb(), IconInsta(), IconTiktok()

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
Nodes (9): bcryptjs, dependencies, bcryptjs, reflect-metadata, remark-gfm, @uploadthing/react, reflect-metadata, remark-gfm (+1 more)

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

### Community 93 - "page.tsx"
Cohesion: 0.16
Nodes (6): steps, IconHeart(), IconLeaf(), IconMap(), cards, pillars

### Community 95 - "ImpactPledge.tsx"
Cohesion: 0.20
Nodes (4): fmt(), ImpactPledge(), PledgeHeart(), Variant

### Community 98 - "FirstInitiative.tsx"
Cohesion: 0.17
Nodes (6): milestones, PCT, IconCheck(), IconLink(), highlights, nutr

## Knowledge Gaps
- **311 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+306 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **39 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `langAtom` connect `lang.ts` to `Footer.tsx`, `Initiative.ts`, `types.ts`, `page.tsx`, `ImpactPageContent.tsx`, `InitiativesOverview.tsx`, `PartnerDetail.tsx`, `InitiativesClient.tsx`, `LinksClient.tsx`, `index.tsx`, `formatDualMoney`, `ProductPageContent.tsx`, `Partner`, `product-plans.ts`, `cart.ts`, `ImpactPledge.tsx`, `pricing.ts`, `page.tsx`, `ImpactPledge.tsx`, `FirstInitiative.tsx`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Why does `getMongoose()` connect `route.ts` to `session.ts`, `FirstInitiative.tsx`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Why does `formatMoneyEUR()` connect `PartnerDetail.tsx` to `route.ts`, `StepReview.tsx`, `Initiative.ts`, `pricing.ts`, `page.tsx`, `InitiativesOverview.tsx`, `InitiativesClient.tsx`, `formatDualMoney`, `Partner`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _311 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `InitiativeEditor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09333333333333334 - nodes in this community are weakly interconnected._
- **Should `session.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08139534883720931 - nodes in this community are weakly interconnected._
- **Should `route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12091038406827881 - nodes in this community are weakly interconnected._