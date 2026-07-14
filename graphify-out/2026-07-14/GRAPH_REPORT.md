# Graph Report - .  (2026-07-14)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1161 nodes · 2522 edges · 91 communities (55 shown, 36 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6a000c7d`
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
- OrderItem
- cart.ts
- StepReview.tsx
- FirstInitiative.tsx
- langAtom
- ImpactPledge.tsx
- page.tsx
- index.ts
- compilerOptions
- dependencies
- seed-impact-data.ts
- StepCustomerInfo.tsx
- IconArrow
- page.tsx
- pricing.ts
- proxy.ts
- SpeedyMap.tsx
- SpeedyLocationSelector.tsx
- courier.config.ts
- audit.ts
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
- resend
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
1. `langAtom` - 56 edges
2. `getMongoose()` - 45 edges
3. `formatMoneyEUR()` - 34 edges
4. `Partner` - 30 edges
5. `pick()` - 29 edges
6. `Initiative` - 25 edges
7. `formatDualMoney()` - 22 edges
8. `serializePartner()` - 21 edges
9. `Order` - 21 edges
10. `POST()` - 19 edges

## Surprising Connections (you probably didn't know these)
- `proxy()` --calls--> `verifySessionTokenEdge()`  [EXTRACTED]
  proxy.ts → src/lib/auth/session-edge.ts
- `main()` --calls--> `getMongoose()`  [EXTRACTED]
  scripts/admin-create.ts → src/lib/mongo/index.ts
- `main()` --calls--> `getMongoose()`  [EXTRACTED]
  scripts/backfill-partner-slugs.ts → src/lib/mongo/index.ts
- `main()` --calls--> `hashPassword()`  [EXTRACTED]
  scripts/hash.ts → src/lib/auth/password.ts
- `upsertPartners()` --references--> `Partner`  [EXTRACTED]
  scripts/seed-impact-data.ts → src/lib/mongo/models/Partner.ts

## Import Cycles
- None detected.

## Communities (91 total, 36 thin omitted)

### Community 0 - "InitiativeEditor.tsx"
Cohesion: 0.08
Nodes (38): extract(), ImageUploader(), UploadResult, centsToStr(), EditGallery, EditInflow, EditPartner, EditStep (+30 more)

### Community 1 - "session.ts"
Cohesion: 0.07
Nodes (28): main(), main(), DashboardLayout(), getIp(), LoginSchema, POST(), POST(), GET() (+20 more)

### Community 2 - "route.ts"
Cohesion: 0.12
Nodes (31): CartItemSchema, DeliverySchema, getIp(), normalizeDelivery(), OrderCreateSchema, POST(), validateDelivery(), getIp() (+23 more)

### Community 3 - "scripts"
Cohesion: 0.05
Nodes (36): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, prettier, tailwindcss, @tailwindcss/postcss (+28 more)

### Community 4 - "route.ts"
Cohesion: 0.18
Nodes (27): DELETE(), imageKeys(), isValidId(), PATCH(), POST(), uniqueSlug(), DELETE(), GET() (+19 more)

### Community 5 - "Footer.tsx"
Cohesion: 0.13
Nodes (14): sections, sections, sections, sections, sections, sections, sections, bodyText (+6 more)

### Community 6 - "index.ts"
Cohesion: 0.08
Nodes (31): AdminAuditLog, Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, AdminInviteToken (+23 more)

### Community 7 - "Initiative.ts"
Cohesion: 0.08
Nodes (27): ARRANGED_TYPES, INFLOW_PHASES, INFLOW_SOURCES, INITIATIVE_CATEGORIES, INITIATIVE_STATUS_LABELS, INITIATIVE_STATUSES, PARTNERSHIP_TYPES, GalleryItemInputSchema (+19 more)

### Community 8 - "types.ts"
Cohesion: 0.10
Nodes (19): metadata, LocationCard(), formatDate(), LocationDetail(), LocationMiniMap, ptComponents, pinIcon, PLOVDIV (+11 more)

### Community 9 - "compilerOptions"
Cohesion: 0.06
Nodes (32): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, ./src/* (+24 more)

### Community 10 - "OrderInventoryAllocation"
Cohesion: 0.09
Nodes (25): InventoryBatch, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, InventoryMovement, InventoryMovementType (+17 more)

### Community 11 - "impactUi.tsx"
Cohesion: 0.13
Nodes (21): HeroFocusCard(), HeroFocusCard(), CompactSteps(), FocusDeepDive(), Gallery(), CategoryChip(), CompletedDateBadge(), formatDate() (+13 more)

### Community 12 - "getMongoose"
Cohesion: 0.18
Nodes (23): EditInitiativePage(), InitiativesPage(), OverviewPage(), GET(), GET(), generateMetadata(), PartnerDetailPage(), generateMetadata() (+15 more)

### Community 13 - "lang.ts"
Cohesion: 0.09
Nodes (12): dmSans, metadata, playfair, RootLayout(), cards, metadata, NotFound(), steps (+4 more)

### Community 14 - "manual.provider.ts"
Cohesion: 0.16
Nodes (16): GET(), VALID_TYPES, ALL_PLOVDIV_POINTS, PLOVDIV_SPEEDY_LOCKERS, PLOVDIV_SPEEDY_OFFICES, CourierProviderName, getCourierProvider(), ManualCourierProvider (+8 more)

### Community 15 - "page.tsx"
Cohesion: 0.11
Nodes (17): CartPage(), T, CheckoutPage(), CheckoutStatus, generateCheckoutId(), T, Props, STEPS (+9 more)

### Community 16 - "create.ts"
Cohesion: 0.12
Nodes (23): DeliveryMethod, Order, OrderStatus, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn (+15 more)

### Community 17 - "ImpactPageContent.tsx"
Cohesion: 0.08
Nodes (4): metadata, IMPACT, ImpactConfig, ImpactDonor

### Community 18 - "InitiativesOverview.tsx"
Cohesion: 0.10
Nodes (7): EMPTY_OVERVIEW, InitiativesOverviewPage(), metadata, IconExternal(), formatMoneyBGN(), GROUPED, OverviewData

### Community 19 - "queries.ts"
Cohesion: 0.17
Nodes (14): metadata, NewsPage(), Home(), PartneringLocationsPage(), generateMetadata(), generateStaticParams(), LocationPage(), StoresSection() (+6 more)

### Community 20 - "InitiativeDetail.tsx"
Cohesion: 0.13
Nodes (16): ImpactVehicleSection(), ImpactMiniSplit(), ImpactVehicleSection(), StarBadge(), Finances(), financeSubHeading, FundingGapInvite(), Intro() (+8 more)

### Community 21 - "PartnerDetail.tsx"
Cohesion: 0.11
Nodes (15): IconInfo(), YouthBadge(), LINK_META, PartnerDetail(), PartnersCarousel(), ORDER, PHASE_COLOR, PHASE_INFO (+7 more)

### Community 22 - "InitiativesClient.tsx"
Cohesion: 0.10
Nodes (3): HERO_EYEBROW, InitiativesClient(), orderedInitiatives()

### Community 23 - "LinksClient.tsx"
Cohesion: 0.12
Nodes (9): socials, IconFb(), IconInsta(), IconTiktok(), BackTarget, Copy, LinksClient(), ROUTE_NAMES (+1 more)

### Community 24 - "index.tsx"
Cohesion: 0.18
Nodes (11): CartNavIcon(), IconCart(), IconClose(), IconHeart(), IconLeaf(), IconMap(), IconMenu(), IconStar() (+3 more)

### Community 25 - "formatDualMoney"
Cohesion: 0.17
Nodes (16): Props, StickyOrderSummary(), SummaryItem, DashboardSection(), DonateSection(), available(), PackCard(), Props (+8 more)

### Community 27 - "ProductPageContent.tsx"
Cohesion: 0.11
Nodes (3): jsonLd, metadata, Lang

### Community 28 - "Partner"
Cohesion: 0.26
Nodes (11): main(), slugify(), uniqueSlug(), NewInitiativePage(), EditPartnerPage(), PartnersPage(), PartnerDTO, idStr() (+3 more)

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

### Community 33 - "OrderItem"
Cohesion: 0.15
Nodes (13): OrderItem, Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, ProductPlan (+5 more)

### Community 34 - "cart.ts"
Cohesion: 0.16
Nodes (11): CartToast(), addToCartAtom, cartItemCountAtom, cartStorageAtom, cartSubtotalCentsAtom, cartToastAtom, CartToastState, clearCartAtom (+3 more)

### Community 35 - "StepReview.tsx"
Cohesion: 0.18
Nodes (11): HoneypotField(), Props, DeliveryFields, Props, StepDelivery(), T, deliveryDescription(), Props (+3 more)

### Community 36 - "FirstInitiative.tsx"
Cohesion: 0.17
Nodes (6): milestones, PCT, IconCheck(), IconLink(), highlights, nutr

### Community 37 - "langAtom"
Cohesion: 0.32
Nodes (7): FeaturedPost(), PostCard(), NewsStrip(), builder, urlFor(), NewsPost, langAtom

### Community 38 - "ImpactPledge.tsx"
Cohesion: 0.20
Nodes (4): fmt(), ImpactPledge(), PledgeHeart(), Variant

### Community 39 - "page.tsx"
Cohesion: 0.20
Nodes (8): EMPTY_OVERVIEW, InitiativesPage(), metadata, pickHeroInitiative(), LinksPage(), metadata, InitiativeDTO, InitiativeDetail

### Community 40 - "index.ts"
Cohesion: 0.24
Nodes (5): NextStudio, schema, LINK_ICONS, locationSchema, newsPostSchema

### Community 41 - "compilerOptions"
Cohesion: 0.20
Nodes (9): ./tsconfig.json, compilerOptions, isolatedModules, module, moduleResolution, noEmit, exclude, extends (+1 more)

### Community 42 - "dependencies"
Cohesion: 0.22
Nodes (9): bcryptjs, dependencies, bcryptjs, reflect-metadata, remark-gfm, @uploadthing/react, reflect-metadata, remark-gfm (+1 more)

### Community 43 - "seed-impact-data.ts"
Cohesion: 0.39
Nodes (8): euro(), img(), main(), PARTNERS, PartnerSpec, slugify(), upsertInitiatives(), upsertPartners()

### Community 44 - "StepCustomerInfo.tsx"
Cohesion: 0.28
Nodes (8): CustomerInfoFields, FieldErrors, Props, StepCustomerInfo(), T, Touched, validate(), validatePhone()

### Community 45 - "IconArrow"
Cohesion: 0.22
Nodes (5): badges, HERO_HEADLINE_BG, HERO_HEADLINE_EN, IconArrow(), IconShop()

### Community 46 - "page.tsx"
Cohesion: 0.39
Nodes (6): ArticlePage(), generateMetadata(), generateStaticParams(), ArticleBody(), getAllNewsSlugs(), getNewsPostBySlug()

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

### Community 52 - "audit.ts"
Cohesion: 0.50
Nodes (3): AdminAuditLog, AdminAuditLogDoc, AdminAuditLogSchema

## Knowledge Gaps
- **280 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+275 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **36 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `langAtom` connect `langAtom` to `Footer.tsx`, `types.ts`, `lang.ts`, `page.tsx`, `ImpactPageContent.tsx`, `InitiativesOverview.tsx`, `queries.ts`, `InitiativeDetail.tsx`, `PartnerDetail.tsx`, `InitiativesClient.tsx`, `LinksClient.tsx`, `index.tsx`, `formatDualMoney`, `InitiativesClient 2.tsx`, `ProductPageContent.tsx`, `product-plans.ts`, `cart.ts`, `FirstInitiative.tsx`, `ImpactPledge.tsx`, `IconArrow`, `page.tsx`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Why does `getMongoose()` connect `getMongoose` to `session.ts`, `route.ts`, `Initiative.ts`, `seed-impact-data.ts`, `audit.ts`, `Partner`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Why does `formatMoneyEUR()` connect `InitiativeDetail.tsx` to `route.ts`, `StepReview.tsx`, `impactUi.tsx`, `page.tsx`, `InitiativesOverview.tsx`, `PartnerDetail.tsx`, `InitiativesClient.tsx`, `formatDualMoney`, `InitiativesClient 2.tsx`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _280 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `InitiativeEditor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07908163265306123 - nodes in this community are weakly interconnected._
- **Should `session.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0726950354609929 - nodes in this community are weakly interconnected._
- **Should `route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11806543385490754 - nodes in this community are weakly interconnected._