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
  { id: "withdrawal", labelBg: "Право на отказ", labelEn: "Right of Withdrawal" },
  { id: "food-exception", labelBg: "Хранителни продукти", labelEn: "Food Products" },
  { id: "return-shipping", labelBg: "Разходи за връщане", labelEn: "Return Shipping" },
  { id: "refund", labelBg: "Възстановяване", labelEn: "Refund" },
  { id: "complaints", labelBg: "Рекламации", labelEn: "Complaints" },
  { id: "how-to-return", labelBg: "Как да върнете", labelEn: "How to Return" },
];

export default function ReturnsComplaintsPage() {
  const lang = useAtomValue(langAtom);
  const bg = lang === "bg";

  return (
    <>
      <LegalPageLayout
        titleBg="Връщане, отказ и рекламации"
        titleEn="Returns, Withdrawal and Complaints"
        subtitleBg="Вашите права при отказ от договор, условия за връщане и процедура за рекламации."
        subtitleEn="Your rights on withdrawal from contract, return conditions and complaints procedure."
        sections={sections}
      >
        {/* 1. Withdrawal */}
        <LegalSectionCard id="withdrawal" title={bg ? "1. Право на отказ от договор от разстояние" : "1. Right of Withdrawal from a Distance Contract"}>
          <p style={bodyText}>
            {bg
              ? "Имате право да се откажете от договора за покупка без да посочвате причина, в срок от 14 дни от получаване на продукта, при условие че законовите изисквания за упражняване на това право са изпълнени."
              : "You have the right to withdraw from the purchase contract without stating a reason, within 14 days of receiving the product, provided the legal requirements for exercising this right are met."}
          </p>
          <p style={bodyText}>
            {bg
              ? "За упражняване на правото на отказ можете да използвате нашия стандартен формуляр или да изпратите ясно писмено съобщение на tepe@mail.bg."
              : "To exercise the right of withdrawal, you may use our standard form or send a clear written statement to tepe@mail.bg."}
          </p>
          <LegalNote>
            <Link href="/legal/withdrawal-form" style={{ color: "var(--plum)", fontWeight: 600 }}>
              {bg ? "Формуляр за отказ →" : "Withdrawal Form →"}
            </Link>
          </LegalNote>
        </LegalSectionCard>

        {/* 2. Food exception */}
        <LegalSectionCard id="food-exception" title={bg ? "2. Специфика на хранителните продукти" : "2. Food Product Specifics"}>
          <div
            style={{
              background: "oklch(98% 0.02 50)",
              border: "2px solid var(--caramel)",
              borderRadius: "var(--r-md)",
              padding: "18px 20px",
              marginBottom: 16,
            }}
          >
            <p style={{ ...bodyText, margin: 0, fontWeight: 500 }}>
              {bg
                ? "Поради естеството на продукта като предварително пакетирано хранително барче, връщане при отказ се приема само за неотворени продукти с ненарушена опаковка, когато са изпълнени законовите условия за отказ от договор от разстояние. При отворена или нарушена опаковка връщането може да бъде отказано по хигиенни и здравни съображения, освен ако продуктът е дефектен, грешен или несъответстващ."
                : "Because the product is a pre-packaged food bar, withdrawal returns are accepted only for unopened products with intact packaging, where the legal conditions for withdrawal from a distance contract are met. If the package is opened or damaged, the return may be refused for hygiene and health-protection reasons, unless the product is defective, incorrect or non-conforming."}
            </p>
          </div>
          {/* TODO legal review */}
          <LegalTodo label="Legal review: confirm food-specific withdrawal exception wording under Bulgarian ZZPUP / EU Consumer Rights Directive. // TODO legal review" />
          <LegalTodo label="Legal review: partial returns policy — e.g. one opened bar in a pack of 10. // TODO legal review" />
        </LegalSectionCard>

        {/* 3. Return shipping */}
        <LegalSectionCard id="return-shipping" title={bg ? "3. Разходи за обратна доставка" : "3. Return Shipping Costs"}>
          <p style={bodyText}>
            {bg
              ? "При стандартен отказ от поръчка разходите за обратна доставка са за сметка на клиента, освен ако приложимото законодателство или конкретният случай не изискват друго."
              : "For standard withdrawal returns, return-shipping costs are borne by the customer, unless applicable law or the specific case requires otherwise."}
          </p>
          <p style={bodyText}>
            {bg
              ? "При грешен, дефектен или несъответстващ продукт разходите за обратна доставка са за наша сметка."
              : "In the case of an incorrect, defective or non-conforming product, return-shipping costs are borne by us."}
          </p>
          <LegalTodo label="Legal review: confirm return-shipping responsibility wording. // TODO legal review" />
        </LegalSectionCard>

        {/* 4. Refund */}
        <LegalSectionCard id="refund" title={bg ? "4. Възстановяване на сумата" : "4. Refund"}>
          <p style={bodyText}>
            {bg
              ? "При одобрено връщане ще направим всичко възможно да възстановим дължимата сума в разумен срок. Начинът на възстановяване зависи от конкретния случай и се уточнява индивидуално."
              : "Upon an approved return, we will make every reasonable effort to process the refund within a reasonable time. The refund method depends on the specific case and is agreed individually."}
          </p>
          <LegalTodo label="Confirm refund method and timing (e.g. bank transfer, COD amount not yet transferred to merchant). // TODO accountant / legal review" />
        </LegalSectionCard>

        {/* 5. Complaints */}
        <LegalSectionCard id="complaints" title={bg ? "5. Рекламации" : "5. Complaints"}>
          <p style={bodyText}>
            {bg
              ? "При грешен, повреден, дефектен или несъответстващ продукт, моля свържете се с нас на tepe@mail.bg възможно най-скоро и не по-късно от 14 дни след получаване, като приложите:"
              : "If you receive an incorrect, damaged, defective or non-conforming product, please contact us at tepe@mail.bg as soon as possible and no later than 14 days after receipt, including:"}
          </p>
          <ul style={{ ...bodyText, paddingLeft: 22 }}>
            <li style={{ marginBottom: 6 }}>{bg ? "Снимки на продукта и опаковката" : "Photos of the product and packaging"}</li>
            <li style={{ marginBottom: 6 }}>{bg ? "Номер на партида (отпечатан върху опаковката)" : "Batch/lot number (printed on the packaging)"}</li>
            <li style={{ marginBottom: 6 }}>{bg ? "Касов бон от Speedy" : "Cash/fiscal receipt from Speedy"}</li>
            <li style={{ marginBottom: 6 }}>{bg ? "Номер на поръчка (ако е наличен)" : "Order number (if available)"}</li>
            <li style={{ marginBottom: 6 }}>{bg ? "Описание на проблема" : "Description of the issue"}</li>
          </ul>
          {/* TODO legal review — 14-day complaint wording */}
          <LegalTodo label="Legal review: confirm that the 14-day complaint wording does not unlawfully limit statutory rights (e.g. 2-year statutory guarantee). // TODO legal review" />
        </LegalSectionCard>

        {/* 6. How to return */}
        <LegalSectionCard id="how-to-return" title={bg ? "6. Как да заявите връщане или рекламация" : "6. How to Request a Return or Complaint"}>
          <ol style={{ ...bodyText, paddingLeft: 22 }}>
            <li style={{ marginBottom: 8 }}>
              {bg
                ? 'Изпратете имейл на tepe@mail.bg с темата „Връщане" или „Рекламация".'
                : "Send an email to tepe@mail.bg with the subject 'Return' or 'Complaint'."}
            </li>
            <li style={{ marginBottom: 8 }}>
              {bg
                ? "Приложете необходимите документи и снимки (виж раздел 5)."
                : "Attach the required documents and photos (see section 5)."}
            </li>
            <li style={{ marginBottom: 8 }}>
              {bg
                ? "Ще се свържем с вас в рамките на 2 работни дни с указания."
                : "We will contact you within 2 working days with instructions."}
            </li>
            <li style={{ marginBottom: 8 }}>
              {bg
                ? "При одобрено връщане ще уточним логистиката на обратната доставка."
                : "Upon an approved return, we will coordinate the return shipment logistics."}
            </li>
          </ol>
          <p style={{ ...bodyText, marginTop: 16 }}>
            {bg ? "Имейл: " : "Email: "}
            <a href="mailto:tepe@mail.bg" style={{ color: "var(--plum)", fontWeight: 600 }}>tepe@mail.bg</a>
          </p>
          <p style={bodyText}>
            {bg ? "Адрес за връщане: " : "Return address: "}
            <LegalTodo label="TODO_RETURNS_ADDRESS — confirm returns address before launch. // TODO business owner confirmation" />
          </p>
          <LegalNote>
            {bg ? "За формуляра за отказ: " : "For the withdrawal form: "}
            <Link href="/legal/withdrawal-form" style={{ color: "var(--plum)", fontWeight: 600 }}>
              {bg ? "Формуляр за отказ →" : "Withdrawal Form →"}
            </Link>
          </LegalNote>
        </LegalSectionCard>

        <LegalTodo label="Full legal review of this returns policy required before launch. // TODO legal review" />
      </LegalPageLayout>
      <Footer />
    </>
  );
}
