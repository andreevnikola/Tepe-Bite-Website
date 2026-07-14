# Graph Report - Tepe Bite Website  (2026-07-14)

## Corpus Check
- 213 files · ~201,847 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1207 nodes · 2422 edges · 100 communities (61 shown, 39 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.79)
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
- page.tsx
- queries.ts
- page.tsx
- Initiative.ts
- ImpactPledge.tsx
- ProductSection.tsx
- ProofUploader.tsx
- FirstInitiative.tsx
- Hero.tsx

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
- `upsertInitiatives()` --references--> `Initiative`  [EXTRACTED]
  scripts/seed-impact-data.ts → src/lib/mongo/models/Initiative.ts
- `proxy()` --calls--> `verifySessionTokenEdge()`  [EXTRACTED]
  proxy.ts → src/lib/auth/session-edge.ts
- `main()` --calls--> `getMongoose()`  [EXTRACTED]
  scripts/admin-create.ts → src/lib/mongo/index.ts
- `main()` --calls--> `hashPassword()`  [EXTRACTED]
  scripts/hash.ts → src/lib/auth/password.ts
- `getPublicOverviewData()` --indirect_call--> `serializePartner()`  [INFERRED]
  src/lib/public/initiatives.ts → src/lib/dashboard/serialize.ts

## Import Cycles
- None detected.

## Communities (100 total, 39 thin omitted)

### Community 0 - "InitiativeEditor.tsx"
Cohesion: 0.13
Nodes (14): ARRANGED_TYPES, INFLOW_PHASES, INFLOW_SOURCES, PARTNERSHIP_TYPES, ExpenseInputSchema, GalleryItemInputSchema, ImageInputSchema, InflowInputSchema (+6 more)

### Community 1 - "session.ts"
Cohesion: 0.10
Nodes (25): main(), main(), DashboardLayout(), getIp(), LoginSchema, POST(), POST(), GET() (+17 more)

### Community 2 - "route.ts"
Cohesion: 0.10
Nodes (34): CartItemSchema, DeliverySchema, getIp(), normalizeDelivery(), OrderCreateSchema, POST(), validateDelivery(), getIp() (+26 more)

### Community 3 - "scripts"
Cohesion: 0.05
Nodes (36): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, prettier, tailwindcss, @tailwindcss/postcss (+28 more)

### Community 4 - "route.ts"
Cohesion: 0.10
Nodes (54): main(), slugify(), uniqueSlug(), EditInitiativePage(), NewInitiativePage(), InitiativesPage(), OverviewPage(), EditPartnerPage() (+46 more)

### Community 5 - "Footer.tsx"
Cohesion: 0.13
Nodes (14): sections, sections, sections, sections, sections, sections, sections, bodyText (+6 more)

### Community 6 - "index.ts"
Cohesion: 0.08
Nodes (31): AdminAuditLog, Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, AdminInviteToken (+23 more)

### Community 7 - "Initiative.ts"
Cohesion: 0.11
Nodes (9): expenseTotalCents(), Finances(), financeSubHeading, Intro(), Partners(), partnerTotals(), PHASE_ACCENT, SOURCE_ACCENT (+1 more)

### Community 8 - "types.ts"
Cohesion: 0.14
Nodes (14): formatDate(), LocationDetail(), LocationMiniMap, ptComponents, FeaturedPost(), PostCard(), NewsStrip(), sanityClient (+6 more)

### Community 9 - "compilerOptions"
Cohesion: 0.06
Nodes (32): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, ./src/* (+24 more)

### Community 10 - "OrderInventoryAllocation"
Cohesion: 0.09
Nodes (25): InventoryBatch, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, InventoryMovement, InventoryMovementType (+17 more)

### Community 11 - "impactUi.tsx"
Cohesion: 0.06
Nodes (30): IconInfo(), IconMap(), HERO_EYEBROW, HeroFocusCard(), ImpactVehicleSection(), CompactSteps(), FocusDeepDive(), Gallery() (+22 more)

### Community 12 - "getMongoose"
Cohesion: 0.17
Nodes (11): Assumptions, Commands, Completion, graphify, Implementation, **IMPORTANT — Core rules**, Orchestration, Product context (+3 more)

### Community 14 - "manual.provider.ts"
Cohesion: 0.16
Nodes (15): GET(), VALID_TYPES, ALL_PLOVDIV_POINTS, PLOVDIV_SPEEDY_LOCKERS, PLOVDIV_SPEEDY_OFFICES, CourierProviderName, getCourierProvider(), ManualCourierProvider (+7 more)

### Community 15 - "page.tsx"
Cohesion: 0.16
Nodes (14): CartPage(), T, CheckoutPage(), CheckoutStatus, generateCheckoutId(), T, Props, DeliveryFields (+6 more)

### Community 16 - "create.ts"
Cohesion: 0.08
Nodes (36): DeliveryMethod, Order, OrderStatus, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn (+28 more)

### Community 17 - "ImpactPageContent.tsx"
Cohesion: 0.08
Nodes (6): metadata, DashboardSection(), DonateSection(), IMPACT, ImpactConfig, ImpactDonor

### Community 20 - "InitiativeDetail.tsx"
Cohesion: 0.15
Nodes (16): AdminRole, ARRANGED_TYPE_LABELS, ArrangedType, EXPENSE_LABELS, INFLOW_SOURCE_LABELS, InflowPhase, InflowSource, INITIATIVE_CATEGORIES (+8 more)

### Community 21 - "PartnerDetail.tsx"
Cohesion: 0.28
Nodes (5): generateMetadata(), PartnerDetailPage(), LINK_META, getPublicPartnerBySlug(), PartnerDetail

### Community 22 - "InitiativesClient.tsx"
Cohesion: 0.09
Nodes (3): HERO_EYEBROW, InitiativesClient(), orderedInitiatives()

### Community 23 - "LinksClient.tsx"
Cohesion: 0.18
Nodes (5): BackTarget, Copy, LinksClient(), ROUTE_NAMES, routeName()

### Community 24 - "index.tsx"
Cohesion: 0.18
Nodes (10): CartNavIcon(), socials, IconCart(), IconClose(), IconFb(), IconInsta(), IconLink(), IconMenu() (+2 more)

### Community 25 - "formatDualMoney"
Cohesion: 0.21
Nodes (9): available(), PackCard(), Props, PackDetailClient(), Props, T, Props, useAddToCart() (+1 more)

### Community 27 - "ProductPageContent.tsx"
Cohesion: 0.11
Nodes (3): jsonLd, metadata, Lang

### Community 29 - "typeorm.config.ts"
Cohesion: 0.29
Nodes (6): NewsletterSubscriber, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn

### Community 30 - "product-plans.ts"
Cohesion: 0.18
Nodes (11): generateMetadata(), PackDetailPage(), Props, metadata, OrderPage(), T, getAllProductPlans(), getProductPlanBySlug() (+3 more)

### Community 31 - "SystemLog"
Cohesion: 0.18
Nodes (13): SystemLogOptions, LogSeverity, SystemLog, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn (+5 more)

### Community 32 - "EmailLog"
Cohesion: 0.10
Nodes (16): DeliveryStatus, EmailLog, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, TelegramNotificationLog (+8 more)

### Community 33 - "lang.ts"
Cohesion: 0.09
Nodes (14): dmSans, metadata, playfair, RootLayout(), cards, metadata, NotFound(), steps (+6 more)

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
Cohesion: 0.28
Nodes (7): extract(), ImageUploader(), UploadResult, ImageDTO, UploadButton, UploadDropzone, { useUploadThing }

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
Cohesion: 0.19
Nodes (12): centsToStr(), EditExpense, EditGallery, EditInflow, EditPartner, EditStep, eur(), FIN_SUBTABS (+4 more)

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

### Community 91 - "page.tsx"
Cohesion: 0.16
Nodes (13): metadata, PartneringLocationsPage(), LocationCard(), LocationsMap, LocationsMapSection(), copy, StoreRow(), StoresSection() (+5 more)

### Community 92 - "queries.ts"
Cohesion: 0.25
Nodes (12): ArticlePage(), generateMetadata(), generateStaticParams(), generateMetadata(), generateStaticParams(), LocationPage(), ArticleBody(), getAllLocationSlugs() (+4 more)

### Community 93 - "page.tsx"
Cohesion: 0.16
Nodes (9): metadata, NewsPage(), Home(), IconHeart(), IconLeaf(), IconStar(), cards, pillars (+1 more)

### Community 94 - "Initiative.ts"
Cohesion: 0.17
Nodes (9): INITIATIVE_STATUS_LABELS, INITIATIVE_STATUSES, ExpenseSchema, GalleryItemSchema, InflowSchema, InitiativeDoc, InitiativePartnerSchema, InitiativeSchema (+1 more)

### Community 95 - "ImpactPledge.tsx"
Cohesion: 0.20
Nodes (4): fmt(), ImpactPledge(), PledgeHeart(), Variant

### Community 96 - "ProductSection.tsx"
Cohesion: 0.25
Nodes (4): IconCheck(), IconShop(), highlights, nutr

### Community 97 - "ProofUploader.tsx"
Cohesion: 0.48
Nodes (5): extract(), ProofUploader(), UploadResult, compressToBW(), loadImage()

### Community 99 - "Hero.tsx"
Cohesion: 0.33
Nodes (4): badges, HERO_HEADLINE_BG, HERO_HEADLINE_EN, IconArrow()

## Knowledge Gaps
- **313 isolated node(s):** `UploadResult`, `PartnerSpec`, `PARTNERS`, `HERO_EYEBROW`, `EditStep` (+308 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **39 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `langAtom` connect `lang.ts` to `Footer.tsx`, `types.ts`, `impactUi.tsx`, `page.tsx`, `ImpactPageContent.tsx`, `LinksClient.tsx`, `index.tsx`, `formatDualMoney`, `ProductPageContent.tsx`, `product-plans.ts`, `cart.ts`, `StepReview.tsx`, `page.tsx`, `queries.ts`, `page.tsx`, `ImpactPledge.tsx`, `ProductSection.tsx`, `FirstInitiative.tsx`, `Hero.tsx`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Why does `formatMoneyEUR()` connect `StepReview.tsx` to `formatDualMoney`, `route.ts`, `impactUi.tsx`, `page.tsx`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `RateLimiter` connect `route.ts` to `session.ts`, `lang.ts`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **What connects `UploadResult`, `PartnerSpec`, `PARTNERS` to the rest of the system?**
  _313 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `InitiativeEditor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `session.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09815078236130868 - nodes in this community are weakly interconnected._
- **Should `route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09830866807610994 - nodes in this community are weakly interconnected._