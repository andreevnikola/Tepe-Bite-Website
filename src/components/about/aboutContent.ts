/**
 * Static, bilingual copy for the /about page. Kept out of the component tree so
 * the narrative reads as one document and non-invented facts stay easy to audit
 * and edit. Everything here is either a fact the founders provided or clearly
 * flagged placeholder copy (team titles + motivations) for them to finalise.
 *
 * DB-driven content (the youth partners, the first initiative) is NOT here — it
 * is fetched live in `app/about/page.tsx` and passed to the components.
 */

export type TimelineStep = {
  /** Short heading for the step. */
  titleBg: string;
  titleEn: string;
  /** One elaborated paragraph. */
  bodyBg: string;
  bodyEn: string;
  /** Optional small meta line (date / count) shown above the title. */
  metaBg?: string;
  metaEn?: string;
  /** Optional inline logo rendered inside the step body. */
  logo?: { src: string; alt: string; maxH: number };
  /** Named render slot for live/DB-driven content (e.g. "first-initiative"). */
  slot?: string;
};

export type TimelineGroup = {
  id: string;
  phaseBg: string;
  phaseEn: string;
  titleBg: string;
  titleEn: string;
  introBg: string;
  introEn: string;
  steps: TimelineStep[];
};

/* ── Mentors (Teenovator) ──────────────────────────────────────────────────
   Expertise lines are PLACEHOLDER — to be replaced by the founders.          */
export type Mentor = {
  name: string;
  photo: string;
  expertiseBg: string;
  expertiseEn: string;
};

export const MENTORS: Mentor[] = [
  {
    name: "Маргарита Стойчкова",
    photo: "/mentors/margarita-stoichkova.jpg",
    expertiseBg: "Бизнес развитие и операции", // TODO: заменете с реалната експертиза
    expertiseEn: "Business development & operations", // TODO: replace with real expertise
  },
  {
    name: "Антон Чеплински",
    photo: "/mentors/anton-chepliski.jpg",
    expertiseBg: "Продукт и търговия", // TODO: заменете с реалната експертиза
    expertiseEn: "Product & commerce", // TODO: replace with real expertise
  },
];

/* ── Team ──────────────────────────────────────────────────────────────────
   Titles and motivation blurbs are PLACEHOLDER — to be finalised. Nikola is
   listed first by request; the order carries no hierarchy.                    */
export type TeamMember = {
  name: string;
  email: string;
  photo: string;
  titleBg: string;
  titleEn: string;
  motivationBg: string;
  motivationEn: string;
};

const TEAM_PHOTO = "/team/no-photo.png";

export const TEAM: TeamMember[] = [
  {
    name: "Никола Андреев",
    email: "nikola@tepebite.eu",
    photo: TEAM_PHOTO,
    titleBg: "Продукт и стратегия", // TODO: финална роля
    titleEn: "Product & strategy", // TODO: final role
    motivationBg:
      "Започнах ТЕПЕ bite, защото исках да докажа, че един местен бранд може да прави добро, което се вижда на улицата, а не само на хартия. Обичам да свързвам хора, идеи и партньори около нещо конкретно за Пловдив. За мен това не е ученически проект — това е първата ни истинска компания и се отнасям към нея точно така.", // TODO: заменете с реалния текст
    motivationEn:
      "I started ТЕПЕ bite to prove that a local brand can do good you actually see on the street, not just on paper. I love bringing people, ideas and partners together around something concrete for Plovdiv. To me this isn't a school project — it's our first real company, and I treat it that way.", // TODO: replace with the real text
  },
  {
    name: "Стоян Тошев",
    email: "stoyan@tepebite.eu",
    photo: TEAM_PHOTO,
    titleBg: "Продажби и партньорства", // TODO: финална роля
    titleEn: "Sales & partnerships", // TODO: final role
    motivationBg:
      "Влязох в екипа, защото исках да разбера как един продукт стига от идеята до рафта. Най-много ме мотивира моментът, в който човек купи барче не заради нас, а защото сам вижда смисъла зад него. Работя с обектите и партньорите ни и се грижа всяка продажба да означава още малко реална промяна за града.", // TODO: заменете с реалния текст
    motivationEn:
      "I joined because I wanted to understand how a product travels from an idea to the shelf. What drives me most is the moment someone buys a bar not because of us, but because they see the point behind it themselves. I work with our locations and partners and make sure every sale means a little more real change for the city.", // TODO: replace with the real text
  },
  {
    name: "Мария Иванова",
    email: "maria@tepebite.eu",
    photo: TEAM_PHOTO,
    titleBg: "Маркетинг и съдържание", // TODO: финална роля
    titleEn: "Marketing & content", // TODO: final role
    motivationBg:
      "За мен ТЕПЕ bite е начин да разказвам истинска история — за Пловдив, за тепетата и за хора на моята възраст, които не чакат разрешение да започнат нещо свое. Грижа се брандът да звучи топло и човешки, а не като поредната реклама. Вярвам, че когато историята е искрена, хората я усещат и стават част от нея.", // TODO: заменете с реалния текст
    motivationEn:
      "For me ТЕПЕ bite is a way to tell a real story — about Plovdiv, the hills, and people my age who don't wait for permission to start something of their own. I make sure the brand sounds warm and human, not like another ad. I believe that when the story is honest, people feel it and become part of it.", // TODO: replace with the real text
  },
  {
    name: "Габриела Иванова",
    email: "gabriela@tepebite.eu",
    photo: TEAM_PHOTO,
    titleBg: "Дизайн и опаковка", // TODO: финална роля
    titleEn: "Design & packaging", // TODO: final role
    motivationBg:
      "Обичам детайлите, които хората усещат, без да ги забелязват — формата на опаковката, цветовете, начина, по който барчето стои в ръката. Присъединих се, защото исках да видя как визуалната идея се превръща в нещо, което можеш да държиш. Всяка опаковка е малко обещание и държа то да изглежда толкова грижовно, колкото е и намерението зад него.", // TODO: заменете с реалния текст
    motivationEn:
      "I love the details people feel without noticing — the shape of the pack, the colours, the way the bar sits in your hand. I joined because I wanted to see a visual idea turn into something you can actually hold. Every wrapper is a small promise, and I want it to look as caring as the intention behind it.", // TODO: replace with the real text
  },
  {
    name: "Николай Иванов",
    email: "nikolay@tepebite.eu",
    photo: TEAM_PHOTO,
    titleBg: "Операции и логистика", // TODO: финална роля
    titleEn: "Operations & logistics", // TODO: final role
    motivationBg:
      "Мен ме увлича частта, която обикновено остава невидима — как барчетата стигат навреме, как всичко се връзва зад кулисите. Влязох в екипа, защото исках да поема отговорност за нещо реално, а не измислено. Харесва ми, че грешките ни струват истински, защото така и уроците са истински. Гордея се, че градим това толкова млади.", // TODO: заменете с реалния текст
    motivationEn:
      "I'm drawn to the part that usually stays invisible — how the bars arrive on time, how everything ties together behind the scenes. I joined because I wanted to own something real, not hypothetical. I like that our mistakes cost real things, because that makes the lessons real too. I'm proud we're building this so young.", // TODO: replace with the real text
  },
];

/* ── Timeline ─────────────────────────────────────────────────────────────── */
export const TIMELINE: TimelineGroup[] = [
  {
    id: "teenovator",
    phaseBg: "Първа глава",
    phaseEn: "Chapter one",
    titleBg: "ТЕПЕ bite в Teenovator",
    titleEn: "ТЕПЕ bite inside Teenovator",
    introBg:
      "Teenovator е национална предприемаческа програма, в която ученици от цялата страна се обединяват в екипи и работят рамо до рамо с местни ментори — хора с реален бизнес опит — за да изградят истинска компания. Идеята за ТЕПЕ bite се роди тук и тук направихме първите си истински стъпки. Благодарни сме на целия екип на Teenovator за подкрепата и рамката, която ни даде смелост да започнем.",
    introEn:
      "Teenovator is a national entrepreneurship programme where students from across the country form teams and work side by side with local mentors — people with real business experience — to build an actual company. The idea for ТЕПЕ bite was born here, and here we took our first real steps. We're grateful to the whole Teenovator team for the support and the framework that gave us the courage to begin.",
    steps: [
      {
        titleBg: "Кауза за Пловдив, търсеща форма",
        titleEn: "A cause for Plovdiv, looking for a form",
        bodyBg:
          "Първо мислехме само за социални инициативи с видим ефект за Пловдив. Бързо осъзнахме, че в чист вид това няма бизнес зад себе си — а бяхме в бизнес състезание. Затова насочихме енергията си към идея с истински продукт, без да изоставяме каузата.",
        bodyEn:
          "At first we thought only about social initiatives with a visible effect for Plovdiv. We quickly realised that on its own this had no business behind it — and we were in a business competition. So we turned our energy toward an idea with a real product, without abandoning the cause.",
      },
      {
        titleBg: "Идеята: барче от тепетата",
        titleEn: "The idea: a bar from the hills",
        bodyBg:
          "Антон подхвърли идеята за локално барче, продавано само по тепетата на Пловдив и около тях. Тогава свързахме двете посоки в една: локален бранд с кауза за Пловдив — продукт, който носи и смисъл, и място.",
        bodyEn:
          "Anton floated the idea of a local bar sold only on and around the hills of Plovdiv. That's when we joined our two directions into one: a local brand with a cause for Plovdiv — a product that carries both meaning and place.",
      },
      {
        titleBg: "Производителят: BioStyle",
        titleEn: "The maker: BioStyle",
        bodyBg:
          "За производството Маргарита се сети за свой приятел — собственика на BioStyle LTD, сертифициран производител на висококачествени био храни. Оттам започна партньорството, което и до днес стои в основата на продукта ни.",
        bodyEn:
          "For manufacturing, Margarita thought of a friend of hers — the owner of BioStyle LTD, a certified maker of high-quality organic foods. That's where the partnership began, and it still sits at the core of our product today.",
        logo: { src: "/partners/BioStyleLogo.png", alt: "BioStyle LTD", maxH: 34 },
      },
      {
        titleBg: "Опаковка и първо производство",
        titleEn: "Packaging & first production",
        bodyBg:
          "Проектирахме опаковката и се свързахме с BioStyle. Договорихме работа на кредит — те произвеждат сега, ние връщаме средствата, когато сме готови. Този жест ни позволи изобщо да започнем и сме им дълбоко благодарни. Все още работим заедно.",
        bodyEn:
          "We designed the packaging and reached out to BioStyle. We arranged to work on credit — they produce now, and we return the money once we're able. That gesture is the reason we could even start, and we're deeply grateful for it. We still work together to this day.",
      },
      {
        titleBg: "Юридически дом: Баир ЕООД",
        titleEn: "A legal home: Bair Ltd",
        bodyBg:
          "Започнахме дейност под Баир ЕООД — фирмата на нашия ментор Маргарита. Благодарни сме ѝ, че ни отвори вратата към реалната търговия, преди да имаме собствено дружество.",
        bodyEn:
          "We began operating under Bair Ltd — the company of our mentor Margarita. We're grateful to her for opening the door to real trade before we had a company of our own.",
      },
      {
        titleBg: "Първи обекти, първо събитие",
        titleEn: "First locations, first event",
        bodyBg:
          "Започнахме да продаваме през няколко партниращи обекта и излязохме на първото си събитие с продажби на живо — първите пъти, в които непознати хора избираха барчето заради самото него.",
        bodyEn:
          "We started selling through a handful of partnering locations and went to our first event with live sales — the first times strangers chose the bar for its own sake.",
      },
      {
        metaBg: "До 30 май",
        metaEn: "By 30 May",
        titleBg: "Над 2200 барчета до финала",
        titleEn: "Over 2,200 bars by the finale",
        bodyBg:
          "Докато дойде финалът на Teenovator на 30 май, вече имахме над 2200 реални продажби — не прогнози, а барчета, стигнали до истински хора.",
        bodyEn:
          "By the time the Teenovator finale arrived on 30 May, we already had over 2,200 real sales — not projections, but bars that reached actual people.",
      },
      {
        titleBg: "Финалът и Fantastico",
        titleEn: "The finale and Fantastico",
        bodyBg:
          "На финала направихме силен pitch. Питчът, идеята и продуктът привлякоха вниманието на висши представители на Fantastico, сред които Владимир Николов. Те заявиха намерението си да ни помогнат — и оттам започна следващата ни глава.",
        bodyEn:
          "At the finale we delivered a strong pitch. The pitch, the idea and the product caught the eye of senior representatives from Fantastico, among them Vladimir Nikolov. They stated their intention to help us — and that's where our next chapter began.",
      },
    ],
  },
  {
    id: "beyond",
    phaseBg: "Втора глава",
    phaseEn: "Chapter two",
    titleBg: "Пътят след програмата",
    titleEn: "The road beyond the programme",
    introBg:
      "Teenovator ни постави на пътя, но истинската компания започва след програмата. Ето какво се случи, откакто сме сами на пътя — и накъде вървим.",
    introEn:
      "Teenovator set us on the path, but the real company begins after the programme. Here's what has happened since we've been on our own — and where we're headed next.",
    steps: [
      {
        titleBg: "Срещата с Fantastico",
        titleEn: "The meeting with Fantastico",
        bodyBg:
          "Уредихме среща с висши представители на Fantastico. Благодарни сме им за отвореността и за времето — рядко голяма компания сяда срещу ученически екип като с равни.",
        bodyEn:
          "We arranged a meeting with senior representatives of Fantastico. We're grateful for their openness and their time — it's rare for a large company to sit across from a student team as equals.",
      },
      {
        titleBg: "Пълна подкрепа",
        titleEn: "Full backing",
        bodyBg:
          "Представихме плановете, нуждите и постигнатото дотогава. В отговор ни предложиха пълна подкрепа: маркетинг, дизайн материали, съдействие за продажби в обектите им в Пловдив и дарение от 4000 €, с което да произведем първата си пълномащабна партида.",
        bodyEn:
          "We presented our plans, our needs and what we'd achieved so far. In return they offered full support: marketing, design materials, help selling across their Plovdiv locations, and a €4,000 donation so we could produce our first full-scale batch.",
      },
      {
        titleBg: "Търговската марка е наша",
        titleEn: "The trademark is ours",
        bodyBg:
          "Регистрацията на търговската марка приключи — вече притежаваме марката ТЕПЕ bite. Едно тихо, но важно основание под всичко, което градим.",
        bodyEn:
          "The trademark registration is complete — we now own the ТЕПЕ bite mark. A quiet but important foundation under everything we're building.",
      },
      {
        slot: "first-initiative",
        titleBg: "Първата инициатива",
        titleEn: "The first initiative",
        bodyBg:
          "Финализирахме първата си социална инициатива през фонд ТЕПЕ bite Impact — от идея до готов резултат на терен.",
        bodyEn:
          "We finalised our first social initiative through the ТЕПЕ bite Impact fund — from idea to a finished result on the ground.",
      },
      {
        metaBg: "Сега",
        metaEn: "Now",
        titleBg: "Историята, която още пишем",
        titleEn: "The story we're still writing",
        bodyBg:
          "В момента подготвяме визуалните материали за опаковките, дисплей кутията и другите POS материали, и финализираме регистрацията на собствената си фирма. Очакваме производството да е готово до 1 август, а към средата на август да влезем във Fantastico. Планираме големи неща напред — още инициативи за Пловдив и стартирането на подобни брандове. Малък спойлер: SERDIKA bite.",
        bodyEn:
          "Right now we're preparing the visual materials for the wrappers, the display box and the other POS materials, and finalising the registration of our own company. We expect production to be ready by 1 August, and to enter Fantastico by mid-August. We're planning big things ahead — more initiatives for Plovdiv and the launch of similar brands. A small spoiler: SERDIKA bite.",
      },
    ],
  },
];
