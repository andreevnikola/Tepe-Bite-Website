"use client";
import ImpactWord from "@/components/about/ImpactWord";
import YouthPartnerCarousel from "@/components/about/YouthPartnerCarousel";
import { PledgeHeart } from "@/components/ImpactPledge";
import type { PartnerCarouselItem } from "@/lib/public/initiatives";
import { langAtom } from "@/store/lang";
import { useAtomValue } from "jotai";
import Link from "next/link";

export default function PartnersImpactSection({
  youthPartners,
}: {
  youthPartners: PartnerCarouselItem[];
}) {
  const lang = useAtomValue(langAtom);
  const bg = lang === "bg";

  const benefits: [string, string][] = bg
    ? [
        ["Реални инициативи", "Работят по истински инициативи на терен, а не на хартия."],
        ["Досег до партньори", "Срещат потенциални партньори през нашите."],
        ["Видимост", "Печелят видимост в социалните мрежи чрез дейността си."],
      ]
    : [
        ["Real initiatives", "They work on real initiatives on the ground, not on paper."],
        ["Reach to partners", "They meet potential partners through ours."],
        ["Visibility", "They gain social-media visibility through their activity."],
      ];

  return (
    <section className="section-spacing" style={{ background: "var(--bg)" }}>
      <div className="section-inner">
        <header style={{ textAlign: "center", marginBottom: "clamp(32px, 5vw, 52px)" }}>
          <div className="section-divider" />
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {bg ? "Силата на младите" : "Youth power"}
          </div>
          <h2 className="heading-lg" style={{ margin: "0 auto", maxWidth: 760 }}>
            {bg ? "Подкрепиш ли нас, подкрепяш младежката активност" : "Support us, and you support youth activity"}
          </h2>
          <p style={{ maxWidth: 660, margin: "16px auto 0" }}>
            {bg
              ? "Ние сме млади хора от Пловдив — и вярваме в силата на младите. Затова организираме всяка инициатива заедно с младежки организации, които реализират на терен. Когато купиш барче, задвижваш и тяхната работа."
              : "We're young people from Plovdiv — and we believe in the strength of the young. That's why we organise every initiative together with youth-led organisations that make it happen on the ground. When you buy a bar, you set their work in motion too."}
          </p>
        </header>

        {/* how we multiply the pledge through youth partners */}
        <div
          className="card"
          style={{
            padding: "clamp(24px, 4vw, 44px)",
            marginBottom: "clamp(36px, 5vw, 56px)",
            display: "flex",
            flexDirection: "column",
            gap: "clamp(24px, 3vw, 32px)",
          }}
        >
          <div className="pi-lead">
            <PledgeHeart size={56} />
            <p style={{ margin: 0, fontSize: "1.05rem", lineHeight: 1.6 }}>
              {bg ? (
                <>
                  Всяко барче добавя <strong style={{ color: "var(--plum)" }}>0.15 €</strong> към фонд{" "}
                  <ImpactWord />. <strong style={{ color: "var(--plum)" }}>Умножаваме</strong> стойността на тези 0.15 €,
                  като партнираме с младежки организации за всяка инициатива.
                </>
              ) : (
                <>
                  Every bar adds <strong style={{ color: "var(--plum)" }}>0.15 €</strong> to the <ImpactWord /> fund. We{" "}
                  <strong style={{ color: "var(--plum)" }}>multiply</strong> the value of those 0.15 € by partnering with
                  youth-led organisations on every initiative.
                </>
              )}
            </p>
          </div>

          <div>
            <div className="label-tag" style={{ marginBottom: 16 }}>
              {bg ? "Какво получават те" : "What they gain"}
            </div>
            <div className="pi-benefits">
              {benefits.map(([title, desc], i) => (
                <div key={title} style={{ borderLeft: "3px solid var(--caramel)", paddingLeft: 16 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-head)",
                      fontWeight: 800,
                      fontSize: "0.82rem",
                      color: "var(--caramel)",
                      marginBottom: 6,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div style={{ fontWeight: 700, color: "var(--plum)", fontSize: "1rem", marginBottom: 4 }}>{title}</div>
                  <p style={{ margin: 0, fontSize: "0.88rem", lineHeight: 1.55 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <p
            style={{
              margin: 0,
              paddingTop: "clamp(20px, 2.5vw, 28px)",
              borderTop: "1px solid var(--border)",
              fontSize: "1.02rem",
              color: "var(--text-mid)",
            }}
          >
            {bg
              ? "Подкрепяме младите — точно както ти подкрепяш нас, младите, купувайки барче."
              : "We support the young — just as you support us, the young, by buying a bar."}
          </p>

          <Link
            href="/impact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              color: "var(--caramel)",
              fontWeight: 600,
              fontSize: "0.9rem",
              textDecoration: "none",
            }}
          >
            {bg ? "Виж целия модел на въздействие" : "See the full impact model"} →
          </Link>
        </div>

        {/* youth partner carousel */}
        {youthPartners.length > 0 ? (
          <>
            <h3 className="heading-md" style={{ textAlign: "center", marginBottom: 24 }}>
              {bg ? "Нашите младежки партньори" : "Our youth-led partners"}
            </h3>
            <YouthPartnerCarousel items={youthPartners} lang={lang} />
          </>
        ) : (
          <p style={{ textAlign: "center", color: "var(--text-soft)", fontSize: "0.95rem" }}>
            {bg
              ? "Скоро тук ще представим младежките организации, с които работим."
              : "We'll introduce the youth-led organisations we work with here soon."}
          </p>
        )}
      </div>

      <style>{`
        .pi-lead { display: flex; align-items: center; gap: 20px; }
        .pi-benefits { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(20px, 3vw, 32px); }
        @media (max-width: 680px) {
          .pi-lead { flex-direction: column; text-align: center; gap: 14px; }
          .pi-benefits { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
