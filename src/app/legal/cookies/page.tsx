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
  { id: "what-are-cookies", labelBg: "Какво са бисквитки", labelEn: "What Are Cookies" },
  { id: "essential-cookies", labelBg: "Необходими бисквитки", labelEn: "Essential Cookies" },
  { id: "no-tracking", labelBg: "Аналитика и маркетинг", labelEn: "Analytics & Marketing" },
  { id: "manage", labelBg: "Управление", labelEn: "Managing Cookies" },
];

export default function CookiesPage() {
  const lang = useAtomValue(langAtom);
  const bg = lang === "bg";

  return (
    <>
      <LegalPageLayout
        titleBg="Политика за бисквитки"
        titleEn="Cookie Policy"
        subtitleBg="Какви бисквитки и технологии за локално съхранение използваме и защо."
        subtitleEn="What cookies and local storage technologies we use and why."
        sections={sections}
      >
        {/* 1. What are cookies */}
        <LegalSectionCard id="what-are-cookies" title={bg ? "1. Какво са бисквитки?" : "1. What Are Cookies?"}>
          <p style={bodyText}>
            {bg
              ? "Бисквитките (cookies) са малки текстови файлове, съхранявани в браузъра ви при посещение на уебсайт. Те позволяват на сайта да запомни предпочитанията ви или техническа информация."
              : "Cookies are small text files stored in your browser when you visit a website. They allow the site to remember your preferences or technical information."}
          </p>
          <p style={bodyText}>
            {bg
              ? "Сайтът може да използва и localStorage — технология за съхранение на данни директно в браузъра, без дата на изтичане, освен ако не бъдат изчистени."
              : "The website may also use localStorage — a technology for storing data directly in the browser without an expiry date, unless cleared."}
          </p>
        </LegalSectionCard>

        {/* 2. Essential cookies */}
        <LegalSectionCard id="essential-cookies" title={bg ? "2. Необходими (функционални) бисквитки" : "2. Essential (Functional) Cookies"}>
          <p style={bodyText}>
            {bg
              ? "Към момента сайтът използва само следната бисквитка, която е необходима за правилното функциониране на сайта:"
              : "Currently the website uses only the following cookie, which is necessary for the proper functioning of the site:"}
          </p>

          {/* Cookie table */}
          <div style={{ overflowX: "auto", margin: "16px 0" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.87rem",
                background: "var(--bg)",
                borderRadius: "var(--r-sm)",
                overflow: "hidden",
              }}
            >
              <thead>
                <tr style={{ background: "var(--plum)", color: "white" }}>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>
                    {bg ? "Бисквитка" : "Cookie"}
                  </th>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>
                    {bg ? "Цел" : "Purpose"}
                  </th>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>
                    {bg ? "Продължителност" : "Duration"}
                  </th>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>
                    {bg ? "Вид" : "Type"}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "10px 14px", fontWeight: 600, fontFamily: "monospace" }}>tepe-bite-lang</td>
                  <td style={{ padding: "10px 14px", color: "var(--text-mid)" }}>
                    {bg ? "Запазва избрания език (BG/EN)" : "Stores selected language (BG/EN)"}
                  </td>
                  <td style={{ padding: "10px 14px", color: "var(--text-mid)" }}>
                    {bg ? "1 година" : "1 year"}
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <span
                      style={{
                        background: "oklch(92% 0.06 150)",
                        color: "oklch(35% 0.12 150)",
                        borderRadius: "var(--r-sm)",
                        padding: "2px 8px",
                        fontSize: "0.76rem",
                        fontWeight: 600,
                      }}
                    >
                      {bg ? "Необходима" : "Essential"}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p style={bodyText}>
            {bg
              ? "Тази бисквитка е необходима за функционирането на езиковия превключвател и не изисква вашето съгласие."
              : "This cookie is necessary for the language switcher to function and does not require your consent."}
          </p>
        </LegalSectionCard>

        {/* 3. Analytics / Marketing */}
        <LegalSectionCard id="no-tracking" title={bg ? "3. Аналитични и маркетингови бисквитки" : "3. Analytics and Marketing Cookies"}>
          <p style={bodyText}>
            {bg
              ? "Към момента не използваме аналитични или маркетингови бисквитки, пиксели или скриптове за проследяване."
              : "We currently do not use analytics or marketing cookies, pixels or tracking scripts."}
          </p>
          <LegalNote>
            {bg
              ? "Ако в бъдеще бъдат добавени аналитични или маркетингови инструменти, тази Политика за бисквитки и механизмът за съгласие ще бъдат актуализирани преди активирането им."
              : "If analytics or marketing tools are added in the future, this Cookie Policy and the cookie consent mechanism will be updated before activation."}
          </LegalNote>
          <LegalTodo label="TODO_ANALYTICS_PROVIDER / TODO_MARKETING_PIXELS — update this section before adding any tracking. // TODO business owner confirmation" />
        </LegalSectionCard>

        {/* 4. Manage */}
        <LegalSectionCard id="manage" title={bg ? "4. Управление на бисквитките" : "4. Managing Cookies"}>
          <p style={bodyText}>
            {bg
              ? "Можете да управлявате и изтривате бисквитките чрез настройките на вашия браузър. Изтриването на бисквитката tepe-bite-lang ще върне езика на сайта към настройката по подразбиране (български)."
              : "You can manage and delete cookies through your browser settings. Deleting the tepe-bite-lang cookie will reset the website language to the default (Bulgarian)."}
          </p>
          <p style={bodyText}>
            {bg
              ? "За повече информация относно управлението на бисквитките вижте документацията на вашия браузър."
              : "For more information on managing cookies, see your browser's documentation."}
          </p>
          <LegalNote>
            {bg ? "За информация за личните данни вижте нашата " : "For information on personal data, see our "}
            <Link href="/legal/privacy" style={{ color: "var(--plum)", fontWeight: 600 }}>
              {bg ? "Политика за поверителност →" : "Privacy Policy →"}
            </Link>
          </LegalNote>
        </LegalSectionCard>
      </LegalPageLayout>
      <Footer />
    </>
  );
}
