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

export default function TraderInfoPage() {
  const lang = useAtomValue(langAtom);
  const bg = lang === "bg";

  const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "200px 1fr",
        gap: 12,
        padding: "12px 0",
        borderBottom: "1px solid var(--border)",
        alignItems: "start",
      }}
      className="trader-row"
    >
      <span style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--text-mid)" }}>
        {label}
      </span>
      <span style={{ fontSize: "0.92rem", color: "var(--text)", lineHeight: 1.6 }}>
        {value}
      </span>
    </div>
  );

  return (
    <>
      <LegalPageLayout
        titleBg="Данни за търговеца"
        titleEn="Trader Information / Legal Notice"
        subtitleBg={'Идентификационни и регистрационни данни на „Баир" ЕООД — търговска марка ТЕПЕ bite.'}
        subtitleEn="Identification and registration details of Баир ЕООД — trading as ТЕПЕ bite."
      >
        {/* Identity */}
        <LegalSectionCard title={bg ? "Идентификация на търговеца" : "Trader Identity"}>
          <Row label={bg ? "Търговска марка" : "Brand"} value={<strong>ТЕПЕ bite</strong>} />
          <Row label={bg ? "Правен субект" : "Legal entity"} value={<strong>„Баир" ЕООД</strong>} />
          <Row
            label={bg ? "ЕИК / UIC" : "EIK / UIC"}
            value={<LegalTodo label="TODO_EIK // TODO business owner confirmation" />}
          />
          <Row
            label={bg ? "ДДС регистрация" : "VAT registration"}
            value={
              <>
                {bg ? "Дружеството е регистрирано по ДДС." : "The company is VAT registered."}
                {" "}<LegalTodo label="TODO_VAT_NUMBER // TODO accountant review" />
              </>
            }
          />
          <Row
            label={bg ? "Управител" : "Manager / Representative"}
            value={<strong>Маргарита Стоичкова</strong>}
          />
          <Row
            label={bg ? "Контакт за клиенти" : "Customer contact"}
            value={<strong>Никола Андреев</strong>}
          />
        </LegalSectionCard>

        {/* Contact */}
        <LegalSectionCard title={bg ? "Контакт" : "Contact"}>
          <Row
            label={bg ? "Имейл" : "Email"}
            value={<a href="mailto:tepe@mail.bg" style={{ color: "var(--plum)", fontWeight: 600 }}>tepe@mail.bg</a>}
          />
          <Row
            label={bg ? "Телефон" : "Phone"}
            value={
              <>
                {bg ? "Не публикуваме публичен телефонен номер." : "We do not display a public phone number."}
                {" "}<LegalTodo label="Legal review: confirm whether email-only public contact is sufficient under Bulgarian law. // TODO legal review" />
              </>
            }
          />
          <Row
            label={bg ? "Уебсайт" : "Website"}
            value={<LegalTodo label="TODO_DOMAIN // TODO business owner confirmation" />}
          />
        </LegalSectionCard>

        {/* Addresses */}
        <LegalSectionCard title={bg ? "Адреси" : "Addresses"}>
          <Row
            label={bg ? "Седалище и адрес на управление" : "Registered office address"}
            value={<LegalTodo label="TODO_REGISTERED_OFFICE_ADDRESS // TODO business owner confirmation" />}
          />
          <Row
            label={bg ? "Кореспондентски адрес" : "Correspondence address"}
            value={<LegalTodo label="TODO_CORRESPONDENCE_ADDRESS // TODO business owner confirmation" />}
          />
          <Row
            label={bg ? "Адрес за връщане" : "Returns address"}
            value={<LegalTodo label="TODO_RETURNS_ADDRESS // TODO business owner confirmation" />}
          />
        </LegalSectionCard>

        {/* Regulatory */}
        <LegalSectionCard title={bg ? "Регулаторни регистрации" : "Regulatory Registrations"}>
          <Row
            label={bg ? "Регистрация БАБХ / ОДБХ за дистанционна търговия с храни" : "BABH/ODBH distance food trade registration"}
            value={<LegalTodo label="TODO_BABH_DISTANCE_SELLING_REGISTRATION_STATUS and TODO_BABH_REGISTRATION_NUMBER_OR_DETAILS // TODO business owner / legal review" />}
          />
          <Row
            label={bg ? "Регистрация НАП (Заявление 33) за е-търговия" : "NRA/NAP e-commerce registration (Application 33)"}
            value={<LegalTodo label="TODO_NRA_ECOMMERCE_REGISTRATION_STATUS and TODO_NRA_APPLICATION_33_DETAILS // TODO accountant / business owner confirmation" />}
          />
        </LegalSectionCard>

        {/* Payment */}
        <LegalSectionCard title={bg ? "Плащане и документи" : "Payment and Documents"}>
          <p style={bodyText}>
            {bg
              ? "Плащането се извършва чрез наложен платеж. Касовият/фискалният бон за наложен платеж се издава от Speedy."
              : "Payment is made via cash on delivery. The cash/fiscal receipt for the COD amount is issued by Speedy."}
          </p>
          <p style={bodyText}>
            {bg
              ? "За стандартни онлайн поръчки към крайни клиенти документът за плащане се издава чрез Speedy при наложен платеж. За бизнес/едрови заявки можете да се свържете с нас на tepe@mail.bg."
              : "For standard online orders to end consumers, the payment document is issued through Speedy upon cash on delivery. For business or bulk requests, please contact us at tepe@mail.bg."}
          </p>
          <LegalTodo label="Invoice-on-request wording and VAT treatment for business orders. // TODO accountant review" />
        </LegalSectionCard>

        <LegalNote>
          {bg
            ? "Данните в тази страница подлежат на потвърждение от собственика на бизнеса, счетоводителя и юриста преди пускане в продукция."
            : "The information on this page is subject to confirmation by the business owner, accountant and lawyer before launch."}
        </LegalNote>

        <LegalTodo label="Full review of this trader information page required before launch. // TODO legal review / TODO accountant review / TODO business owner confirmation" />

        <style>{`
          @media (max-width: 560px) {
            .trader-row { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </LegalPageLayout>
      <Footer />
    </>
  );
}
