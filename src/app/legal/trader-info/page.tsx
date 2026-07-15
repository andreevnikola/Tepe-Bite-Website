"use client";
import Footer from "@/components/Footer";
import LegalPageLayout, {
  LegalNote,
  LegalSectionCard,
  LegalTodo,
  bodyText,
} from "@/components/legal/LegalPageLayout";
import { SITE_INFO } from "@/lib/config/site-info";
import { langAtom } from "@/store/lang";
import { useAtomValue } from "jotai";

// Static presentational row — defined at module scope (it closes over nothing
// from render) so it isn't recreated on every render.
function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
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
}

export default function TraderInfoPage() {
  const lang = useAtomValue(langAtom);
  const bg = lang === "bg";

  return (
    <>
      <LegalPageLayout
        titleBg="Данни за търговеца"
        titleEn="Trader Information / Legal Notice"
        subtitleBg={`Идентификационни и регистрационни данни на ${SITE_INFO.brand.legalEntity} — търговска марка ТЕПЕ bite.`}
        subtitleEn={`Identification and registration details of ${SITE_INFO.brand.legalEntity} — trading as ТЕПЕ bite.`}
      >
        {/* Identity */}
        <LegalSectionCard title={bg ? "Идентификация на търговеца" : "Trader Identity"}>
          <Row label={bg ? "Търговска марка" : "Brand"} value={<strong>{SITE_INFO.brand.name}</strong>} />
          <Row label={bg ? "Юридическо лице" : "Legal entity"} value={<strong>{SITE_INFO.brand.legalEntity}</strong>} />
          <Row
            label={bg ? "ЕИК / UIC" : "EIK / UIC"}
            value={<LegalTodo label={SITE_INFO.trader.eik} />}
          />
          <Row
            label={bg ? "ДДС регистрация" : "VAT registration"}
            value={
              <>
                {bg ? "Дружеството е регистрирано по ДДС." : "The company is VAT registered."}
                {" "}<LegalTodo label={SITE_INFO.trader.vatNumber} />
              </>
            }
          />
          <Row
            label={bg ? "Управител" : "Manager / Representative"}
            value={<strong>{SITE_INFO.brand.manager}</strong>}
          />
          <Row
            label={bg ? "Контакт за клиенти" : "Customer contact"}
            value={<strong>{SITE_INFO.brand.customerContact}</strong>}
          />
        </LegalSectionCard>

        {/* Contact */}
        <LegalSectionCard title={bg ? "Контакт" : "Contact"}>
          <Row
            label={bg ? "Имейл" : "Email"}
            value={<a href={`mailto:${SITE_INFO.contact.generalEmail}`} style={{ color: "var(--plum)", fontWeight: 600 }}>{SITE_INFO.contact.generalEmail}</a>}
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
            value={<a href={SITE_INFO.website.url} style={{ color: "var(--plum)", fontWeight: 600 }}>{SITE_INFO.website.url}</a>}
          />
        </LegalSectionCard>

        {/* Addresses */}
        <LegalSectionCard title={bg ? "Адреси" : "Addresses"}>
          <Row
            label={bg ? "Седалище и адрес на управление" : "Registered office address"}
            value={<LegalTodo label={SITE_INFO.trader.registeredOfficeAddress} />}
          />
          <Row
            label={bg ? "Кореспондентски адрес" : "Correspondence address"}
            value={<LegalTodo label={SITE_INFO.trader.correspondenceAddress} />}
          />
          <Row
            label={bg ? "Адрес за връщане" : "Returns address"}
            value={<LegalTodo label={SITE_INFO.trader.returnsAddress} />}
          />
        </LegalSectionCard>

        {/* Regulatory */}
        <LegalSectionCard title={bg ? "Регулаторни регистрации" : "Regulatory Registrations"}>
          <Row
            label={bg ? "Регистрация БАБХ / ОДБХ за дистанционна търговия с храни" : "BABH/ODBH distance food trade registration"}
            value={<LegalTodo label={SITE_INFO.trader.babhRegistration} />}
          />
          <Row
            label={bg ? "Регистрация НАП (Заявление 33) за е-търговия" : "NRA/NAP e-commerce registration (Application 33)"}
            value={<LegalTodo label={SITE_INFO.trader.napRegistration} />}
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
              ? `За стандартни онлайн поръчки към крайни клиенти документът за плащане се издава чрез Speedy при наложен платеж. За бизнес/едрови заявки можете да се свържете с нас на ${SITE_INFO.contact.generalEmail}.`
              : `For standard online orders to end consumers, the payment document is issued through Speedy upon cash on delivery. For business or bulk requests, please contact us at ${SITE_INFO.contact.generalEmail}.`}
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
