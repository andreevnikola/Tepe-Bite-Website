"use client";
import Footer from "@/components/Footer";
import LegalPageLayout, {
  LegalNote,
  LegalSectionCard,
  LegalTodo,
  bodyText,
} from "@/components/legal/LegalPageLayout";
import { langAtom } from "@/store/lang";
import { useAtomValue } from "jotai";
import Link from "next/link";

const sections = [
  { id: "why", labelBg: "Защо инициативи", labelEn: "Why Initiatives" },
  { id: "first-initiative", labelBg: "Първата инициатива", labelEn: "First Initiative" },
  { id: "funding", labelBg: "Модел на финансиране", labelEn: "Funding Model" },
  { id: "transparency-promise", labelBg: "Обещание за прозрачност", labelEn: "Transparency Promise" },
  { id: "no-promises", labelBg: "Честни граници", labelEn: "Honest Limits" },
];

export default function InitiativeTransparencyPage() {
  const lang = useAtomValue(langAtom);
  const bg = lang === "bg";

  return (
    <>
      <LegalPageLayout
        titleBg="Прозрачност на инициативите"
        titleEn="Initiative Transparency"
        subtitleBg="Как ТЕПЕ bite подкрепя градски инициативи и какво обещаваме за прозрачност."
        subtitleEn="How ТЕПЕ bite supports local urban initiatives and what we promise on transparency."
        sections={sections}
      >
        {/* 1. Why */}
        <LegalSectionCard id="why" title={bg ? "1. Защо са важни инициативите" : "1. Why Initiatives Matter"}>
          <p style={bodyText}>
            {bg
              ? "ТЕПЕ bite е бранд, вдъхновен от Пловдив и неговите тепета. Вярваме, че бизнесът може да има реален принос за местната общност — не само като продава продукти, но и като реализира конкретни проекти за града."
              : "ТЕПЕ bite is a brand inspired by Plovdiv and its hills. We believe that business can have a real contribution to the local community — not just by selling products, but by implementing concrete projects for the city."}
          </p>
          <p style={bodyText}>
            {bg
              ? "Инициативите са начинът, по който свързваме покупката на продукта с нещо по-голямо."
              : "Initiatives are the way we connect the purchase of the product to something bigger."}
          </p>
        </LegalSectionCard>

        {/* 2. First initiative */}
        <LegalSectionCard id="first-initiative" title={bg ? "2. Първата инициатива: RE-CONNECT Бунарджика" : "2. First Initiative: RE-CONNECT Bunardzhika"}>
          <p style={bodyText}>
            {bg
              ? 'Нашата пилотна инициатива е RE-CONNECT Бунарджика — проект за облагородяване на зона около тепетата в Пловдив, конкретно около чешмичката на „Кръгчето".'
              : "Our pilot initiative is RE-CONNECT Bunardzhika — a project to improve an area around the Plovdiv hills, specifically around the fountain at 'Krugcheto'."}
          </p>
          <p style={bodyText}>
            {bg
              ? "Инициативата се реализира и движи от екипа на ТЕПЕ bite."
              : "The initiative is implemented and driven by the ТЕПЕ bite team."}
          </p>
          <LegalTodo label="TODO — confirm whether partners, municipality or foundation must be mentioned for RE-CONNECT Бунарджика, and align wording accordingly. // TODO business owner confirmation" />
          <LegalNote>
            <Link href="/impact" style={{ color: "var(--plum)", fontWeight: 600 }}>
              {bg ? "Вижте подробности за инициативата →" : "See initiative details →"}
            </Link>
          </LegalNote>
        </LegalSectionCard>

        {/* 3. Funding model */}
        <LegalSectionCard id="funding" title={bg ? "3. Модел на финансиране" : "3. Funding Model"}>
          <p style={bodyText}>
            {bg
              ? "За всяко продадено барче ТЕПЕ bite заделяме фиксирани 0.15 € във фонд ТЕПЕ bite Impact. Това е обвързващо обещание — не зависи от промоции или отделни кампании."
              : "For every ТЕПЕ bite bar sold, we set aside a fixed 0.15 € into the ТЕПЕ bite Impact fund. This is a binding commitment — it does not depend on promotions or individual campaigns."}
          </p>
          <p style={bodyText}>
            {bg
              ? "Засега — като малка фирма — водим средствата като ясно обособено и внимателно проследявано перо в сметката на фирмата и ги използваме точно както е обявено. С разрастването ни планираме напълно отделна сметка. Публично обявяваме събраните до момента средства."
              : "For now — as a small company — we track the funds as a clearly ring-fenced, carefully monitored line within the company's account and use them exactly as stated. As we grow, we plan a fully separate account. We publicly announce the amount collected to date."}
          </p>
          <p style={bodyText}>
            {bg
              ? "Към момента не приемаме директни дарения — работим единствено чрез партньорства. Приемането на дарения е в плановете ни, но все още не е възможно поради правни усложнения; ще го въведем веднага щом законово можем."
              : "For now we don't accept direct donations — we work solely through partnerships. Accepting donations is part of our plans, but is not yet possible due to legal complications; we'll introduce it the moment we legally can."}
          </p>
          <p style={bodyText}>
            {bg
              ? "Не спираме до дарение: избираме каузата, координираме партньори, търсим съфинансиране и спонсори и участваме в реализацията, за да извлечем максимума от всеки лев във фонда."
              : "We don't stop at a donation: we choose the cause, coordinate partners, seek co-funding and sponsors, and take part in delivery — to get the most out of every lev in the fund."}
          </p>
          <LegalNote>
            {bg
              ? "Търговската дейност на ТЕПЕ bite и ТЕПЕ bite Impact се осъществяват в рамките на едно юридическо лице — БАИР ЕООД. Управлението на две отделни организации носи правна и административна сложност, несъразмерна с настоящия ни мащаб. В близко бъдеще планираме да регистрираме НПО."
              : "The commercial activity of ТЕПЕ bite and ТЕПЕ bite Impact operate under one legal entity — БАИР ЕООД. Running two separate organisations carries legal and administrative complexity disproportionate to our current scale. We plan to register an NGO (НПО) in the near future."}
          </LegalNote>
        </LegalSectionCard>

        {/* 4. Transparency promise */}
        <LegalSectionCard id="transparency-promise" title={bg ? "4. Нашето обещание за прозрачност" : "4. Our Transparency Promise"}>
          <p style={bodyText}>
            {bg
              ? "Ще споделяме ясно какви инициативи реализираме или подпомагаме, какъв е техният обхват и как клиентите ни са допринесли за тях чрез подкрепата си към бранда."
              : "We will clearly share which initiatives we implement or support, their scope, and how our customers have contributed through their support for the brand."}
          </p>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", margin: "20px 0" }}>
            {[
              {
                icon: "✅",
                titleBg: "Ясно комуникираме",
                titleEn: "We communicate clearly",
                descBg: "Кои инициативи реализираме или подпомагаме.",
                descEn: "Which initiatives we implement or support.",
              },
              {
                icon: "✅",
                titleBg: "Показваме напредъка",
                titleEn: "We show progress",
                descBg: "Споделяме конкретен напредък и резултати.",
                descEn: "We share concrete progress and results.",
              },
              {
                icon: "✅",
                titleBg: "Фиксиран ангажимент",
                titleEn: "A fixed commitment",
                descBg: "0.15 € от всяко барче — ясно и обвързващо.",
                descEn: "0.15 € from every bar — clear and binding.",
              },
            ].map((c, i) => (
              <div
                key={i}
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--r-md)",
                  padding: "16px",
                }}
              >
                <div style={{ fontSize: "1.4rem", marginBottom: 8 }}>{c.icon}</div>
                <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, color: "var(--plum)", marginBottom: 6, fontSize: "0.95rem" }}>
                  {bg ? c.titleBg : c.titleEn}
                </div>
                <p style={{ margin: 0, fontSize: "0.84rem", color: "var(--text-soft)", lineHeight: 1.6 }}>
                  {bg ? c.descBg : c.descEn}
                </p>
              </div>
            ))}
          </div>
        </LegalSectionCard>

        {/* 5. Honest limits */}
        <LegalSectionCard id="no-promises" title={bg ? "5. Честни граници" : "5. Honest Limits"}>
          <ul style={{ ...bodyText, paddingLeft: 22 }}>
            <li style={{ marginBottom: 8 }}>
              {bg
                ? "0.15 € от всяко барче е обвързващо обещание. Над тази основа не гарантираме конкретна крайна сума — тя зависи от обема продажби, кампаниите и външното финансиране от партньори."
                : "The 0.15 € from every bar is a binding commitment. Above that base we don't guarantee a specific final amount — it depends on sales volume, campaigns and outside funding from partners."}
            </li>
            <li style={{ marginBottom: 8 }}>
              {bg
                ? "Публикуваме събрания баланс на фонда, но не издаваме официални одитирани финансови отчети."
                : "We publish the fund's collected balance, but do not issue formal audited financial statements."}
            </li>
            <li style={{ marginBottom: 8 }}>
              {bg
                ? "Не гарантираме конкретен резултат или срок за всяка инициатива — те зависят и от партньори и институции. Показваме реалния напредък."
                : "We don't guarantee a specific outcome or timeline for each initiative — these also depend on partners and institutions. We show the real progress."}
            </li>
          </ul>
          <LegalNote>
            {bg
              ? "Ако имате въпроси относно инициативите, пишете ни на tepe@mail.bg."
              : "If you have questions about the initiatives, write to us at tepe@mail.bg."}
          </LegalNote>
        </LegalSectionCard>
      </LegalPageLayout>
      <Footer />
    </>
  );
}
