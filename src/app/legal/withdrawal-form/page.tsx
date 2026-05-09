"use client";
import Footer from "@/components/Footer";
import LegalPageLayout, {
  LegalNote,
  LegalTodo,
  bodyText,
} from "@/components/legal/LegalPageLayout";
import { langAtom } from "@/store/lang";
import { useAtomValue } from "jotai";

export default function WithdrawalFormPage() {
  const lang = useAtomValue(langAtom);
  const bg = lang === "bg";

  return (
    <>
      <LegalPageLayout
        titleBg="Стандартен формуляр за отказ"
        titleEn="Standard Withdrawal Form"
        subtitleBg="Можете да копирате и изпратите този формуляр по имейл или да го разпечатате."
        subtitleEn="You may copy and send this form by email or print it."
      >
        <LegalNote>
          {bg
            ? "Връщането на продукт е предмет на условията за връщане и приложимите правила за хранителни/хигиенни продукти. Вижте нашата страница Връщане, отказ и рекламации."
            : "Product returns are subject to the returns conditions and applicable food/hygiene rules. See our Returns, Withdrawal and Complaints page."}
        </LegalNote>
        <LegalTodo label="Legal review: confirm this standard withdrawal form complies with Bulgarian ZZPUP / EU Directive 2011/83/EU Annex I. // TODO legal review" />

        {/* Print-friendly form */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-md)",
            padding: "clamp(28px, 4vw, 48px)",
            boxShadow: "var(--shadow)",
            marginTop: 24,
            fontFamily: "var(--font-body)",
          }}
          id="withdrawal-form"
        >
          <h2
            style={{
              fontFamily: "var(--font-head)",
              color: "var(--plum)",
              fontSize: "1.4rem",
              fontWeight: 700,
              margin: "0 0 8px",
              textAlign: "center",
            }}
          >
            {bg ? "ФОРМУЛЯР ЗА УПРАЖНЯВАНЕ НА ПРАВО НА ОТКАЗ" : "FORM FOR EXERCISING THE RIGHT OF WITHDRAWAL"}
          </h2>
          <p
            style={{
              fontSize: "0.82rem",
              color: "var(--text-soft)",
              textAlign: "center",
              margin: "0 0 32px",
            }}
          >
            {bg
              ? "(Попълнете и изпратете само ако желаете да се откажете от договора)"
              : "(Complete and send only if you wish to withdraw from the contract)"}
          </p>

          {/* To */}
          <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontWeight: 700, color: "var(--plum)", marginBottom: 8, fontSize: "0.9rem" }}>
              {bg ? "До:" : "To:"}
            </div>
            <div style={{ lineHeight: 1.8, color: "var(--text-mid)", fontSize: "0.9rem" }}>
              <strong>„Баир" ЕООД / ТЕПЕ bite</strong><br />
              {bg ? "Имейл: " : "Email: "}<strong>tepe@mail.bg</strong><br />
              {bg ? "Адрес: " : "Address: "}
              <LegalTodo label="TODO_CORRESPONDENCE_ADDRESS // TODO business owner confirmation" />
            </div>
          </div>

          {/* Statement */}
          <div style={{ marginBottom: 28 }}>
            <p style={{ ...bodyText, fontStyle: "italic" }}>
              {bg
                ? "С настоящото уведомявам, че се отказвам от договора за покупка на следните стоки:"
                : "I hereby notify that I withdraw from my contract for the purchase of the following goods:"}
            </p>
          </div>

          {/* Fields */}
          {[
            {
              labelBg: "Поръчани на (дата на поръчка):",
              labelEn: "Ordered on (date of order):",
              lines: 1,
            },
            {
              labelBg: "Получени на (дата на получаване):",
              labelEn: "Received on (date of receipt):",
              lines: 1,
            },
            {
              labelBg: "Продукти за връщане:",
              labelEn: "Products being returned:",
              lines: 2,
            },
            {
              labelBg: "Номер на поръчка (ако е наличен):",
              labelEn: "Order number (if available):",
              lines: 1,
            },
            {
              labelBg: "Имейл, използван за поръчката:",
              labelEn: "Email used for the order:",
              lines: 1,
            },
            {
              labelBg: "Имена на потребителя:",
              labelEn: "Customer name:",
              lines: 1,
            },
            {
              labelBg: "Адрес на потребителя:",
              labelEn: "Customer address:",
              lines: 2,
            },
          ].map((f, i) => (
            <div key={i} style={{ marginBottom: 20 }}>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  color: "var(--text)",
                  marginBottom: 6,
                }}
              >
                {bg ? f.labelBg : f.labelEn}
              </div>
              <div
                style={{
                  background: "transparent",
                  minHeight: f.lines > 1 ? `${f.lines * 32}px` : "28px",
                  border: f.lines > 1 ? "1px solid var(--border)" : "none",
                  borderBottom: "1px solid var(--text-mid)",
                  borderRadius: f.lines > 1 ? "var(--r-sm)" : undefined,
                  padding: f.lines > 1 ? "8px 10px" : "4px 0",
                }}
              />
            </div>
          ))}

          {/* Signature + date */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 32,
              marginTop: 32,
              paddingTop: 24,
              borderTop: "1px solid var(--border)",
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--text)", marginBottom: 8 }}>
                {bg ? "Подпис (при изпращане на хартия):" : "Signature (if submitted on paper):"}
              </div>
              <div style={{ borderBottom: "1px solid var(--text-mid)", minHeight: 48 }} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--text)", marginBottom: 8 }}>
                {bg ? "Дата:" : "Date:"}
              </div>
              <div style={{ borderBottom: "1px solid var(--text-mid)", minHeight: 48 }} />
            </div>
          </div>

          {/* Notes */}
          <div
            style={{
              marginTop: 32,
              paddingTop: 20,
              borderTop: "1px dashed var(--border)",
              fontSize: "0.82rem",
              color: "var(--text-soft)",
              lineHeight: 1.7,
            }}
          >
            <p style={{ margin: "0 0 8px" }}>
              {bg
                ? "• Формулярът може да бъде копиран и изпратен по имейл на tepe@mail.bg."
                : "• This form can be copied and sent by email to tepe@mail.bg."}
            </p>
            <p style={{ margin: "0 0 8px" }}>
              {bg
                ? "• Връщането е предмет на условията за продукта и приложимите правила за хранителни и хигиенни продукти."
                : "• Return is subject to product condition and applicable food and hygiene rules."}
            </p>
            <p style={{ margin: 0 }}>
              {bg
                ? "• За пълни условия вижте нашата страница Връщане, отказ и рекламации."
                : "• For full conditions see our Returns, Withdrawal and Complaints page."}
            </p>
          </div>
        </div>

        {/* Print button */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <button
            onClick={() => window.print()}
            style={{
              background: "var(--plum)",
              color: "white",
              border: "none",
              borderRadius: "var(--r-md)",
              padding: "12px 28px",
              fontWeight: 600,
              fontSize: "0.95rem",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
            }}
          >
            {bg ? "🖨 Разпечатай формуляра" : "🖨 Print the form"}
          </button>
        </div>

        <style>{`
          @media print {
            nav, .legal-toc, .print-hide, button, header, footer { display: none !important; }
            #withdrawal-form { box-shadow: none !important; border: 1px solid #ccc !important; }
            body { font-size: 11pt; }
          }
        `}</style>
      </LegalPageLayout>
      <Footer />
    </>
  );
}
