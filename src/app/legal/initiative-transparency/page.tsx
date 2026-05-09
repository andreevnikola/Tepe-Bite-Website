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
  { id: "no-promises", labelBg: "Какво не обещаваме", labelEn: "What We Don't Promise" },
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
            <Link href="/initiatives" style={{ color: "var(--plum)", fontWeight: 600 }}>
              {bg ? "Вижте подробности за инициативата →" : "See initiative details →"}
            </Link>
          </LegalNote>
        </LegalSectionCard>

        {/* 3. Funding model */}
        <LegalSectionCard id="funding" title={bg ? "3. Модел на финансиране" : "3. Funding Model"}>
          <p style={bodyText}>
            {bg
              ? "ТЕПЕ bite подкрепя градски инициативи чрез част от печалбата на бранда и чрез конкретни кампании, реализирани или подпомогнати от екипа."
              : "ТЕПЕ bite supports local city initiatives through part of the brand's profit and through specific campaigns implemented or supported by the team."}
          </p>
          <p style={bodyText}>
            {bg
              ? "Не обещаваме фиксиран процент от всяка продажба, освен ако това не е изрично обявено за конкретна кампания."
              : "We do not promise a fixed percentage from each sale unless this is explicitly announced for a specific campaign."}
          </p>
          <LegalTodo label="Legal / business review: align website wording with packaging claim 'Част от всяка продажба подкрепя грижата за символа на Пловдив – тепетата.' Ensure no misleading financial promise. // TODO legal review / TODO business owner confirmation" />
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
                titleBg: "Не обещаваме повече",
                titleEn: "We don't over-promise",
                descBg: "Без фиктивни проценти или нереалистични ангажименти.",
                descEn: "No fake percentages or unrealistic commitments.",
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

        {/* 5. What we don't promise */}
        <LegalSectionCard id="no-promises" title={bg ? "5. Какво не обещаваме" : "5. What We Don't Promise"}>
          <ul style={{ ...bodyText, paddingLeft: 22 }}>
            <li style={{ marginBottom: 8 }}>
              {bg
                ? "Не обещаваме фиксиран процент от всяка продажба за дарения или инициативи, освен ако това не е изрично обявено."
                : "We do not promise a fixed percentage from each sale for donations or initiatives, unless explicitly announced."}
            </li>
            <li style={{ marginBottom: 8 }}>
              {bg
                ? "Не публикуваме формални финансови отчети за дарения."
                : "We do not publish formal financial donation reports."}
            </li>
            <li style={{ marginBottom: 8 }}>
              {bg
                ? "Не гарантираме конкретен резултат от инициативите — показваме реалния напредък."
                : "We do not guarantee a specific outcome from initiatives — we show real progress."}
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
