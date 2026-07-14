# Graph Report - Tepe Bite Website  (2026-07-14)

## Corpus Check
- 211 files · ~199,399 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1173 nodes · 2456 edges · 83 communities (44 shown, 39 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `877a7f09`
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
- cart.ts
- StepReview.tsx
- FirstInitiative.tsx
- ImpactPledge.tsx
- index.ts
- compilerOptions
- dependencies
- StepCustomerInfo.tsx
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
1. `langAtom` - 54 edges
2. `getMongoose()` - 45 edges
3. `Partner` - 30 edges
4. `formatMoneyEUR()` - 27 edges
5. `Initiative` - 25 edges
6. `serializePartner()` - 21 edges
7. `Order` - 21 edges
8. `formatDualMoney()` - 20 edges
9. `POST()` - 19 edges
10. `pick()` - 19 edges

## Surprising Connections (you probably didn't know these)
- `proxy()` --calls--> `verifySessionTokenEdge()`  [EXTRACTED]
  proxy.ts → src/lib/auth/session-edge.ts
- `main()` --calls--> `getMongoose()`  [EXTRACTED]
  scripts/admin-create.ts → src/lib/mongo/index.ts
- `main()` --calls--> `hashPassword()`  [EXTRACTED]
  scripts/hash.ts → src/lib/auth/password.ts
- `main()` --calls--> `hashPassword()`  [EXTRACTED]
  scripts/admin-create.ts → src/lib/auth/password.ts
- `main()` --references--> `Admin`  [EXTRACTED]
  scripts/admin-create.ts → src/lib/mongo/models/Admin.ts

## Import Cycles
- None detected.

## Communities (83 total, 39 thin omitted)

### Community 0 - "InitiativeEditor.tsx"
Cohesion: 0.05
Nodes (62): extract(), ImageUploader(), UploadResult, centsToStr(), EditGallery, EditInflow, EditPartner, EditStep (+54 more)

### Community 1 - "session.ts"
Cohesion: 0.08
Nodes (29): main(), main(), DashboardLayout(), getIp(), LoginSchema, POST(), POST(), GET() (+21 more)

### Community 2 - "route.ts"
Cohesion: 0.13
Nodes (26): CartItemSchema, DeliverySchema, getIp(), normalizeDelivery(), OrderCreateSchema, POST(), validateDelivery(), getIp() (+18 more)

### Community 3 - "scripts"
Cohesion: 0.05
Nodes (36): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, prettier, tailwindcss, @tailwindcss/postcss (+28 more)

### Community 4 - "route.ts"
Cohesion: 0.06
Nodes (82): main(), slugify(), uniqueSlug(), euro(), img(), main(), PARTNERS, PartnerSpec (+74 more)

### Community 5 - "Footer.tsx"
Cohesion: 0.05
Nodes (32): dmSans, metadata, playfair, RootLayout(), sections, sections, sections, cards (+24 more)

### Community 6 - "index.ts"
Cohesion: 0.08
Nodes (31): AdminAuditLog, Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, AdminInviteToken (+23 more)

### Community 7 - "Initiative.ts"
Cohesion: 0.19
Nodes (16): Props, StickyOrderSummary(), SummaryItem, ImpactVehicleSection(), PartnerDetail(), PRICING, buildConfirmationEmail(), ConfirmationEmailData (+8 more)

### Community 8 - "types.ts"
Cohesion: 0.06
Nodes (45): metadata, NewsPage(), ArticlePage(), generateMetadata(), generateStaticParams(), metadata, OrderPage(), Home() (+37 more)

### Community 9 - "compilerOptions"
Cohesion: 0.06
Nodes (32): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, ./src/* (+24 more)

### Community 10 - "OrderInventoryAllocation"
Cohesion: 0.13
Nodes (17): InventoryBatch, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, InventoryMovement, InventoryMovementType (+9 more)

### Community 11 - "impactUi.tsx"
Cohesion: 0.07
Nodes (21): IconInfo(), HERO_EYEBROW, HeroFocusCard(), HeroFocusCard(), CompactSteps(), FocusDeepDive(), Gallery(), CategoryChip() (+13 more)

### Community 12 - "getMongoose"
Cohesion: 0.17
Nodes (11): Assumptions, Commands, Completion, graphify, Implementation, **IMPORTANT — Core rules**, Orchestration, Product context (+3 more)

### Community 14 - "manual.provider.ts"
Cohesion: 0.16
Nodes (16): GET(), VALID_TYPES, ALL_PLOVDIV_POINTS, PLOVDIV_SPEEDY_LOCKERS, PLOVDIV_SPEEDY_OFFICES, CourierProviderName, getCourierProvider(), ManualCourierProvider (+8 more)

### Community 15 - "page.tsx"
Cohesion: 0.18
Nodes (13): CartPage(), T, CheckoutPage(), CheckoutStatus, generateCheckoutId(), T, Props, T (+5 more)

### Community 16 - "create.ts"
Cohesion: 0.08
Nodes (38): DeliveryMethod, Order, OrderStatus, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn (+30 more)

### Community 17 - "ImpactPageContent.tsx"
Cohesion: 0.08
Nodes (6): metadata, DashboardSection(), DonateSection(), IMPACT, ImpactConfig, ImpactDonor

### Community 20 - "InitiativeDetail.tsx"
Cohesion: 0.12
Nodes (5): financeSubHeading, Partners(), partnerTotals(), PHASE_ACCENT, SOURCE_ACCENT

### Community 21 - "PartnerDetail.tsx"
Cohesion: 0.15
Nodes (10): FundingSplitBar(), ORDER, PHASE_COLOR, PHASE_INFO, PhaseBarMini(), PhaseBreakdown(), PhaseTotals, InflowDTO (+2 more)

### Community 22 - "InitiativesClient.tsx"
Cohesion: 0.09
Nodes (5): HERO_EYEBROW, ImpactMiniSplit(), ImpactVehicleSection(), InitiativesClient(), orderedInitiatives()

### Community 23 - "LinksClient.tsx"
Cohesion: 0.18
Nodes (5): BackTarget, Copy, LinksClient(), ROUTE_NAMES, routeName()

### Community 24 - "index.tsx"
Cohesion: 0.11
Nodes (19): CartNavIcon(), socials, IconArrow(), IconCart(), IconClose(), IconFb(), IconHeart(), IconInsta() (+11 more)

### Community 25 - "formatDualMoney"
Cohesion: 0.27
Nodes (9): available(), PackCard(), Props, PackDetailClient(), Props, T, SafeProductPlan, useAddToCart() (+1 more)

### Community 27 - "ProductPageContent.tsx"
Cohesion: 0.09
Nodes (5): IconCheck(), IconShop(), Lang, highlights, nutr

### Community 29 - "typeorm.config.ts"
Cohesion: 0.14
Nodes (9): NewsletterSubscriber, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, InitialSchema1747008000001, SeedProductPlans1747008000002 (+1 more)

### Community 30 - "product-plans.ts"
Cohesion: 0.19
Nodes (13): generateMetadata(), PackDetailPage(), Props, ProductPlan, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn (+5 more)

### Community 31 - "SystemLog"
Cohesion: 0.18
Nodes (13): SystemLogOptions, LogSeverity, SystemLog, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn (+5 more)

### Community 32 - "EmailLog"
Cohesion: 0.15
Nodes (13): DeliveryStatus, EmailLog, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, TelegramNotificationLog (+5 more)

### Community 34 - "cart.ts"
Cohesion: 0.16
Nodes (11): CartToast(), addToCartAtom, cartItemCountAtom, cartStorageAtom, cartSubtotalCentsAtom, cartToastAtom, CartToastState, clearCartAtom (+3 more)

### Community 35 - "StepReview.tsx"
Cohesion: 0.18
Nodes (11): HoneypotField(), Props, DeliveryFields, Props, StepDelivery(), T, deliveryDescription(), Props (+3 more)

### Community 38 - "ImpactPledge.tsx"
Cohesion: 0.13
Nodes (7): badges, HERO_HEADLINE_BG, HERO_HEADLINE_EN, fmt(), ImpactPledge(), PledgeHeart(), Variant

### Community 40 - "index.ts"
Cohesion: 0.24
Nodes (5): NextStudio, schema, LINK_ICONS, locationSchema, newsPostSchema

### Community 41 - "compilerOptions"
Cohesion: 0.20
Nodes (9): ./tsconfig.json, compilerOptions, isolatedModules, module, moduleResolution, noEmit, exclude, extends (+1 more)

### Community 42 - "dependencies"
Cohesion: 0.22
Nodes (9): dependencies, reflect-metadata, remark-gfm, resend, @uploadthing/react, reflect-metadata, remark-gfm, resend (+1 more)

### Community 44 - "StepCustomerInfo.tsx"
Cohesion: 0.28
Nodes (8): CustomerInfoFields, FieldErrors, Props, StepCustomerInfo(), T, Touched, validate(), validatePhone()

### Community 47 - "pricing.ts"
Cohesion: 0.22
Nodes (7): CURRENCY, DeliveryPricingConfig, parseCentsEnv(), ParseErr, ParseOk, ParseResult, PricingConfig

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

## Knowledge Gaps
- **290 isolated node(s):** `UI work`, `Orchestration`, `Assumptions`, `Product context`, `Tech stack` (+285 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **39 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `langAtom` connect `Footer.tsx` to `cart.ts`, `FirstInitiative.tsx`, `ImpactPledge.tsx`, `Initiative.ts`, `types.ts`, `impactUi.tsx`, `page.tsx`, `ImpactPageContent.tsx`, `InitiativesClient.tsx`, `LinksClient.tsx`, `index.tsx`, `formatDualMoney`, `ProductPageContent.tsx`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Why does `getMongoose()` connect `route.ts` to `session.ts`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Why does `formatMoneyEUR()` connect `Initiative.ts` to `StepReview.tsx`, `impactUi.tsx`, `page.tsx`, `PartnerDetail.tsx`, `InitiativesClient.tsx`, `index.tsx`, `formatDualMoney`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `UI work`, `Orchestration`, `Assumptions` to the rest of the system?**
  _290 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `InitiativeEditor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05009009009009009 - nodes in this community are weakly interconnected._
- **Should `session.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08139534883720931 - nodes in this community are weakly interconnected._
- **Should `route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12773109243697478 - nodes in this community are weakly interconnected._