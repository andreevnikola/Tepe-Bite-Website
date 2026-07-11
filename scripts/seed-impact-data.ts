/**
 * Seed rich test data for the public Initiatives pages so every UI path can be
 * exercised: partners (star + regular, varied descriptions), initiatives in all
 * four statuses, a featured spotlight, a frozen reason, galleries, step
 * completion dates, and inflows across all phases + sources.
 *
 * Idempotent: upserts partners by nameBg and initiatives by slug.
 * Run: TS_NODE_TRANSPILE_ONLY=1 TS_NODE_PROJECT=tsconfig.typeorm.json \
 *      NODE_OPTIONS=--max-old-space-size=4096 npx ts-node scripts/seed-impact-data.ts
 */
import mongoose from 'mongoose'
import { getMongoose } from '../src/lib/mongo'
import { Partner } from '../src/lib/mongo/models/Partner'
import { Initiative } from '../src/lib/mongo/models/Initiative'

const euro = (n: number) => Math.round(n * 100)
const img = (seed: string, w: number, h: number) => ({
  url: `https://picsum.photos/seed/${seed}/${w}/${h}`,
  key: `seed-${seed}`,
})

function slugify(input: string): string {
  return (
    input.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'x'
  )
}

type PartnerSpec = {
  nameBg: string
  nameEn: string
  descBg: string
  descEn: string
  star: boolean
  links: Record<string, string>
  imgSeed?: string
}

const PARTNERS: PartnerSpec[] = [
  {
    nameBg: 'Оргахим',
    nameEn: 'Orgachim',
    descBg:
      'Оргахим е водещ производител на бои, лакове и покрития в България с над 100 години история. Компанията подкрепя редица инициативи за облагородяване на публични пространства с материали и експертиза.',
    descEn:
      'Orgachim is a leading Bulgarian manufacturer of paints, varnishes and coatings with over 100 years of history. The company supports numerous public-space improvement initiatives with materials and expertise.',
    star: false,
    links: { website: 'https://www.orgachim.bg/bg/' },
    imgSeed: 'orgachim',
  },
  {
    nameBg: 'Фондация Пловдив 2019',
    nameEn: 'Plovdiv 2019 Foundation',
    descBg:
      'Наследникът на Европейската столица на културата Пловдив 2019. Фондацията развива културни и градски проекти, свързва артисти, институции и общности и е дългосрочен партньор в облагородяването на града.',
    descEn:
      'The legacy body of Plovdiv 2019 European Capital of Culture. The foundation develops cultural and urban projects, connects artists, institutions and communities, and is a long-term partner in improving the city.',
    star: true,
    links: { website: 'https://plovdiv2019.eu/', instagram: 'https://instagram.com/plovdiv2019' },
    imgSeed: 'plovdiv2019',
  },
  {
    nameBg: 'Кауфланд България',
    nameEn: 'Kaufland Bulgaria',
    descBg:
      'Кауфланд е дългогодишен корпоративен партньор, който подкрепя зелени и социални проекти в цялата страна чрез финансиране и доброволчески инициативи на служителите си.',
    descEn:
      'Kaufland is a long-standing corporate partner supporting green and social projects across the country through funding and employee volunteering initiatives.',
    star: true,
    links: { website: 'https://www.kaufland.bg/', facebook: 'https://facebook.com/kaufland.bg' },
    imgSeed: 'kaufland',
  },
  {
    nameBg: 'Местна младежка мрежа',
    nameEn: 'Local Youth Network',
    descBg: 'Неформална мрежа от млади доброволци от Пловдив, които организират акции на терен.',
    descEn: 'An informal network of young volunteers from Plovdiv who organise on-the-ground actions.',
    star: false,
    links: { instagram: 'https://instagram.com/' },
    imgSeed: 'youthnet',
  },
  {
    nameBg: 'Артистично студио Мазилка',
    nameEn: 'Mazilka Art Studio',
    descBg: 'Студио за съвременно графично изкуство и стенописи, работещо по градски арт намеси.',
    descEn: 'A studio for contemporary graphic art and murals, working on urban art interventions.',
    star: false,
    links: { website: 'https://example.com', tiktok: 'https://tiktok.com/@mazilka' },
    imgSeed: 'mazilka',
  },
  {
    nameBg: 'Читалище Съгласие 1869',
    nameEn: 'Saglasie 1869 Community Centre',
    descBg: 'Едно от най-старите читалища в Пловдив, институционален партньор за младежки дейности.',
    descEn: 'One of the oldest community centres in Plovdiv, an institutional partner for youth activities.',
    star: false,
    links: { website: 'https://example.org' },
    imgSeed: 'saglasie',
  },
]

async function upsertPartners(): Promise<Record<string, mongoose.Types.ObjectId>> {
  const ids: Record<string, mongoose.Types.ObjectId> = {}
  for (const p of PARTNERS) {
    const existing = await Partner.findOne({ nameBg: p.nameBg })
    const doc =
      existing ??
      new Partner({ nameBg: p.nameBg })
    doc.nameBg = p.nameBg
    doc.nameEn = p.nameEn
    doc.descriptionBg = p.descBg
    doc.descriptionEn = p.descEn
    doc.isStarPartner = p.star
    doc.set('links', p.links)
    if (p.imgSeed) doc.set('image', img(p.imgSeed, 240, 240))
    if (!doc.slug) doc.slug = slugify(p.nameEn)
    await doc.save()
    ids[p.nameBg] = doc._id
    console.log(`✓ partner ${p.nameBg} (${doc.slug})`)
  }
  return ids
}

async function upsertInitiatives(pid: Record<string, mongoose.Types.ObjectId>) {
  const specs = [
    {
      slug: 're-connect-bunardzhika',
      titleBg: 'RE-CONNECT БУНАРДЖИКА',
      titleEn: 'RE-CONNECT BUNARDZHIKA',
      descriptionBg:
        'Пилотна инициатива за облагородяване на зоната около чешмичката на „Кръгчето" в парк Бунарджика чрез съвременно графично изкуство. Превръщаме транзитна точка в място, което хората забелязват и използват.',
      descriptionEn:
        'A pilot initiative to improve the area around the fountain at "Krugcheto" in Bunardzhika Park through contemporary graphic art. We turn a transit point into a place people notice and use.',
      status: 'in_progress',
      category: 'improve',
      isPublished: true,
      isFeatured: true,
      locationBg: 'Парк Бунарджика, Пловдив',
      locationEn: 'Bunardzhika Park, Plovdiv',
      cover: 'reconnect-cover',
      galleryCount: 5,
      expectedCostCents: euro(3000),
      spentCents: 0,
      currentStepIndex: 3,
      steps: [
        { bg: 'Идентифицирахме каузата', en: 'We identified the cause', done: true, date: '2025-11-10' },
        { bg: 'Проверихме осъществимостта', en: 'We assessed feasibility', done: true, date: '2025-12-02' },
        { bg: 'Осигурихме техническо партньорство с Оргахим', en: 'Secured technical partnership with Orgachim', done: true, date: '2026-01-20' },
        { bg: 'Реализация на арт намесата', en: 'Executing the art intervention', done: false, date: '' },
      ],
      partners: [
        { name: 'Оргахим', type: 'technical', bg: 'Осигурява бои и материали за изпълнението.', en: 'Provides paints and materials for the execution.' },
        { name: 'Артистично студио Мазилка', type: 'executional', bg: 'Разработва и рисува графичната намеса.', en: 'Designs and paints the graphic intervention.' },
        { name: 'Фондация Пловдив 2019', type: 'institutional', bg: 'Съдейства за съгласуванията и видимостта на проекта.', en: 'Helps with approvals and project visibility.' },
      ],
      inflows: [
        { source: 'impact_fund', amount: euro(800), phase: 'available', date: '2026-02-01', noteBg: 'Средства от фонда за първи материали.', noteEn: 'Fund money for first materials.' },
        { source: 'impact_fund', amount: euro(400), phase: 'arranged', arrangedType: 'awaiting_transfer', date: '2026-03-01', noteBg: '', noteEn: '' },
        { source: 'partner', partner: 'Фондация Пловдив 2019', amount: euro(600), phase: 'arranged', arrangedType: 'on_hold', date: '2026-03-10', noteBg: 'Договорено съфинансиране.', noteEn: 'Agreed co-funding.' },
        { source: 'partner', partner: 'Оргахим', amount: euro(500), phase: 'available', date: '2026-02-15', noteBg: 'Дарени материали (остойностени).', noteEn: 'Donated materials (valued).' },
        { source: 'external_other', sourceBg: 'Частен дарител', sourceEn: 'Private donor', amount: euro(300), phase: 'planned', date: '2026-04-01', noteBg: 'Обещано дарение.', noteEn: 'Promised donation.' },
      ],
    },
    {
      slug: 'zelena-klasna-staya',
      titleBg: 'Зелена класна стая на Сахат тепе',
      titleEn: 'Green Classroom on Sahat Tepe',
      descriptionBg:
        'Създадохме открита „зелена класна стая" за училищни групи и доброволци — с пейки, сенник и образователни табели за местната флора. Завършен проект с видим и траен резултат.',
      descriptionEn:
        'We built an open-air "green classroom" for school groups and volunteers — with benches, shade and educational signage about local flora. A completed project with a visible, lasting result.',
      status: 'done',
      category: 'youth',
      isPublished: true,
      isFeatured: false,
      locationBg: 'Сахат тепе, Пловдив',
      locationEn: 'Sahat Tepe, Plovdiv',
      cover: 'green-cover',
      galleryCount: 6,
      expectedCostCents: euro(2500),
      spentCents: euro(2450),
      currentStepIndex: 3,
      steps: [
        { bg: 'Проектиране и съгласуване', en: 'Design and approval', done: true, date: '2025-06-15' },
        { bg: 'Набиране на средства', en: 'Fundraising', done: true, date: '2025-08-01' },
        { bg: 'Изграждане на място', en: 'On-site construction', done: true, date: '2025-09-20' },
        { bg: 'Откриване с училища', en: 'Opening with schools', done: true, date: '2025-10-05' },
      ],
      partners: [
        { name: 'Кауфланд България', type: 'sponsor', bg: 'Основен финансов спонсор на проекта.', en: 'Main financial sponsor of the project.' },
        { name: 'Местна младежка мрежа', type: 'executional', bg: 'Доброволци за изграждането и засаждането.', en: 'Volunteers for construction and planting.' },
        { name: 'Читалище Съгласие 1869', type: 'institutional', bg: 'Организира образователната програма.', en: 'Runs the educational programme.' },
      ],
      inflows: [
        { source: 'impact_fund', amount: euro(900), phase: 'available', date: '2025-07-10', noteBg: 'Основно финансиране от фонда.', noteEn: 'Core funding from the fund.' },
        { source: 'partner', partner: 'Кауфланд България', amount: euro(1200), phase: 'available', date: '2025-08-05', noteBg: 'Корпоративно дарение.', noteEn: 'Corporate donation.' },
        { source: 'external_other', sourceBg: 'Родителски клуб', sourceEn: 'Parents club', amount: euro(350), phase: 'available', date: '2025-08-20', noteBg: 'Дарения от родители.', noteEn: 'Donations from parents.' },
      ],
    },
    {
      slug: 'svetla-aleya-mladezhki-halm',
      titleBg: 'Светла алея на Младежкия хълм',
      titleEn: 'Lit Alley on the Youth Hill',
      descriptionBg:
        'Проект за поставяне на соларно осветление по алея на Младежкия хълм за по-безопасни вечерни разходки. Замразен към момента поради нужда от допълнителни институционални съгласувания.',
      descriptionEn:
        'A project to install solar lighting along an alley on the Youth Hill for safer evening walks. Currently frozen pending additional institutional approvals.',
      status: 'frozen',
      category: 'preserve',
      isPublished: true,
      isFeatured: false,
      frozenReasonBg: 'Изчакваме становище от общинската администрация за трасето на осветлението.',
      frozenReasonEn: 'We are awaiting the municipal administration\'s opinion on the lighting route.',
      locationBg: 'Младежки хълм, Пловдив',
      locationEn: 'Youth Hill, Plovdiv',
      cover: 'alley-cover',
      galleryCount: 3,
      expectedCostCents: euro(4200),
      spentCents: 0,
      currentStepIndex: 1,
      steps: [
        { bg: 'Идейна концепция', en: 'Concept design', done: true, date: '2026-01-15' },
        { bg: 'Съгласуване с общината', en: 'Coordination with the municipality', done: false, date: '' },
        { bg: 'Монтаж на осветлението', en: 'Lighting installation', done: false, date: '' },
      ],
      partners: [
        { name: 'Фондация Пловдив 2019', type: 'institutional', bg: 'Подпомага комуникацията с институциите.', en: 'Assists communication with institutions.' },
      ],
      inflows: [
        { source: 'impact_fund', amount: euro(1000), phase: 'arranged', arrangedType: 'on_hold', date: '2026-02-20', noteBg: 'Заделено, изчаква размразяване.', noteEn: 'Set aside, awaiting unfreeze.' },
        { source: 'impact_fund', amount: euro(1500), phase: 'planned', date: '2026-05-01', noteBg: '', noteEn: '' },
      ],
    },
    {
      slug: 'detska-ploshtadka-dzhendem',
      titleBg: 'Обновена детска площадка в Джендем тепе',
      titleEn: 'Renewed Playground on Dzhendem Tepe',
      descriptionBg:
        'Планирана инициатива за обновяване на занемарена детска площадка в подножието на Джендем тепе — нови съоръжения, настилка и озеленяване. Изпълнението предстои.',
      descriptionEn:
        'A planned initiative to renew a neglected playground at the foot of Dzhendem Tepe — new equipment, surfacing and greenery. Execution is upcoming.',
      status: 'planned',
      category: 'improve',
      isPublished: true,
      isFeatured: false,
      locationBg: 'Джендем тепе (Младежки хълм), Пловдив',
      locationEn: 'Dzhendem Tepe (Youth Hill), Plovdiv',
      cover: 'playground-cover',
      galleryCount: 0,
      expectedCostCents: euro(6000),
      spentCents: 0,
      currentStepIndex: 0,
      steps: [
        { bg: 'Оценка на терена', en: 'Site assessment', done: false, date: '' },
        { bg: 'Избор на съоръжения', en: 'Equipment selection', done: false, date: '' },
      ],
      partners: [
        { name: 'Кауфланд България', type: 'sponsor', bg: 'Заявен интерес за финансиране.', en: 'Expressed interest in funding.' },
      ],
      inflows: [
        { source: 'impact_fund', amount: euro(500), phase: 'planned', date: '2026-06-01', noteBg: 'Начален транш от фонда.', noteEn: 'Initial tranche from the fund.' },
        { source: 'partner', partner: 'Кауфланд България', amount: euro(2000), phase: 'planned', date: '2026-06-15', noteBg: 'Обещано спонсорство.', noteEn: 'Pledged sponsorship.' },
      ],
    },
  ] as const

  for (const s of specs) {
    const existing = await Initiative.findOne({ slug: s.slug })
    const doc = existing ?? new Initiative({ slug: s.slug })

    doc.slug = s.slug
    doc.titleBg = s.titleBg
    doc.titleEn = s.titleEn
    doc.descriptionBg = s.descriptionBg
    doc.descriptionEn = s.descriptionEn
    doc.status = s.status
    doc.category = s.category
    doc.isPublished = s.isPublished
    doc.isFeatured = s.isFeatured
    doc.set('frozenReasonBg', (s as { frozenReasonBg?: string }).frozenReasonBg ?? '')
    doc.set('frozenReasonEn', (s as { frozenReasonEn?: string }).frozenReasonEn ?? '')
    doc.locationBg = s.locationBg
    doc.locationEn = s.locationEn
    doc.set('coverImage', img(s.cover, 1200, 675))
    doc.set(
      'gallery',
      Array.from({ length: s.galleryCount }, (_, k) => ({
        ...img(`${s.slug}-g${k + 1}`, 1200, 900),
        captionBg: `Снимка ${k + 1} от терена`,
        captionEn: `Photo ${k + 1} from the ground`,
      })),
    )
    doc.expectedCostCents = s.expectedCostCents
    doc.spentCents = s.spentCents
    doc.currentStepIndex = s.currentStepIndex
    doc.set(
      'steps',
      s.steps.map((st, k) => ({
        order: k,
        labelBg: st.bg,
        labelEn: st.en,
        detailBg: '',
        detailEn: '',
        done: st.done,
        completedDateISO: st.done ? st.date : '',
      })),
    )
    doc.set(
      'partners',
      s.partners.map((p) => ({
        partnerId: pid[p.name],
        partnershipType: p.type,
        contributionBg: p.bg,
        contributionEn: p.en,
      })),
    )
    doc.set(
      'inflows',
      s.inflows.map((f) => {
        const anyF = f as {
          source: string
          partner?: string
          sourceBg?: string
          sourceEn?: string
          amount: number
          phase: string
          arrangedType?: string
          date: string
          noteBg?: string
          noteEn?: string
        }
        return {
          source: anyF.source,
          partnerId: anyF.source === 'partner' && anyF.partner ? pid[anyF.partner] : null,
          sourceLabelBg: anyF.sourceBg ?? '',
          sourceLabelEn: anyF.sourceEn ?? '',
          amountCents: anyF.amount,
          dateISO: anyF.date,
          phase: anyF.phase,
          arrangedType: anyF.phase === 'arranged' ? (anyF.arrangedType ?? 'awaiting_transfer') : null,
          noteBg: anyF.noteBg ?? '',
          noteEn: anyF.noteEn ?? '',
        }
      }),
    )

    await doc.save()
    console.log(`✓ initiative ${s.titleBg} (${s.slug})`)
  }

  // Enforce single spotlight.
  await Initiative.updateMany(
    { slug: { $ne: 're-connect-bunardzhika' }, isFeatured: true },
    { $set: { isFeatured: false } },
  )
}

async function main() {
  await getMongoose()
  const pid = await upsertPartners()
  await upsertInitiatives(pid)
  console.log('\nDone seeding impact test data.')
  await mongoose.disconnect()
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
