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
  { id: "controller", labelBg: "Администратор", labelEn: "Controller" },
  { id: "what-we-collect", labelBg: "Какви данни събираме", labelEn: "What We Collect" },
  { id: "legal-basis", labelBg: "Правно основание", labelEn: "Legal Basis" },
  { id: "recipients", labelBg: "Получатели", labelEn: "Recipients" },
  { id: "retention", labelBg: "Съхранение", labelEn: "Retention" },
  { id: "rights", labelBg: "Вашите права", labelEn: "Your Rights" },
  { id: "security", labelBg: "Сигурност", labelEn: "Security" },
  { id: "cookies-ref", labelBg: "Бисквитки", labelEn: "Cookies" },
  { id: "contact-privacy", labelBg: "Контакт", labelEn: "Contact" },
];

export default function PrivacyPage() {
  const lang = useAtomValue(langAtom);
  const bg = lang === "bg";

  return (
    <>
      <LegalPageLayout
        titleBg="Политика за поверителност"
        titleEn="Privacy Policy"
        subtitleBg="Как събираме, използваме и защитаваме вашите лични данни при използване на сайта и при поръчка."
        subtitleEn="How we collect, use and protect your personal data when using the website and placing an order."
        sections={sections}
      >
        {/* 1. Controller */}
        <LegalSectionCard id="controller" title={bg ? "1. Администратор на лични данни" : "1. Data Controller"}>
          <p style={bodyText}>
            {bg
              ? "Администратор на лични данни по смисъла на GDPR е:"
              : "The data controller within the meaning of the GDPR is:"}
          </p>
          <ul style={{ ...bodyText, paddingLeft: 20 }}>
            <li><strong>„Баир" ЕООД</strong> ({bg ? "търговска марка: " : "trading as "}<strong>ТЕПЕ bite</strong>)</li>
            <li>ЕИК / UIC: <LegalTodo label="TODO_EIK // TODO business owner confirmation" /></li>
            <li>{bg ? "Адрес: " : "Address: "}<LegalTodo label="TODO_REGISTERED_OFFICE_ADDRESS // TODO business owner confirmation" /></li>
            <li>{bg ? "Имейл: " : "Email: "}<a href="mailto:tepe@mail.bg" style={{ color: "var(--plum)" }}>tepe@mail.bg</a></li>
          </ul>
          <LegalNote>
            {bg
              ? "Нямаме назначено длъжностно лице по защита на данните (DPO), тъй като не сме задължени по закон. Въпроси по поверителността можете да отправяте директно на горния имейл."
              : "We do not have a designated Data Protection Officer (DPO) as we are not legally required to appoint one. Privacy questions can be addressed directly to the email above."}
          </LegalNote>
        </LegalSectionCard>

        {/* 2. What we collect */}
        <LegalSectionCard id="what-we-collect" title={bg ? "2. Какви данни събираме и защо" : "2. What Data We Collect and Why"}>
          <p style={bodyText}>
            {bg ? "Събираме само данните, необходими за обработка на поръчките. Нямаме потребителски акаунти. Нямаме контактна форма." : "We collect only the data necessary to process orders. We have no user accounts. We have no contact form."}
          </p>

          <h3 style={{ fontFamily: "var(--font-head)", color: "var(--plum)", fontSize: "0.95rem", fontWeight: 700, margin: "18px 0 8px" }}>
            {bg ? "2.1 Данни от поръчката" : "2.1 Order data"}
          </h3>
          <p style={bodyText}>
            {bg
              ? "При поръчка събираме: имейл адрес, имена, адрес за доставка, избраният начин на доставка, информация за поръчаните продукти и статус на потвърждение. Тези данни са необходими за изпълнение на поръчката."
              : "When an order is placed we collect: email address, names, delivery address, chosen delivery method, information about ordered products and confirmation status. This data is necessary to fulfil the order."}
          </p>

          <h3 style={{ fontFamily: "var(--font-head)", color: "var(--plum)", fontSize: "0.95rem", fontWeight: 700, margin: "18px 0 8px" }}>
            {bg ? "2.2 Имейл комуникация" : "2.2 Email communication"}
          </h3>
          <p style={bodyText}>
            {bg
              ? "Имейл адресът се използва за изпращане на линк за потвърждение на поръчката и на имейл за статус на обработката. Не изпращаме маркетингови имейли без изрично съгласие."
              : "The email address is used to send the order confirmation link and a processing status email. We do not send marketing emails without explicit consent."}
          </p>
          <LegalTodo label="If a newsletter is added later, update this section and add consent mechanism. // TODO business owner confirmation" />

          <h3 style={{ fontFamily: "var(--font-head)", color: "var(--plum)", fontSize: "0.95rem", fontWeight: 700, margin: "18px 0 8px" }}>
            {bg ? "2.3 Данни за доставката" : "2.3 Delivery data"}
          </h3>
          <p style={bodyText}>
            {bg
              ? "Данните за адрес и имена се предоставят на Speedy за изпълнение на доставката. Speedy действа като обработващ данни в контекста на доставката."
              : "Name and address data is shared with Speedy to fulfil delivery. Speedy acts as a data processor in the context of delivery."}
          </p>

          <h3 style={{ fontFamily: "var(--font-head)", color: "var(--plum)", fontSize: "0.95rem", fontWeight: 700, margin: "18px 0 8px" }}>
            {bg ? "2.4 Данни за плащане" : "2.4 Payment data"}
          </h3>
          <p style={bodyText}>
            {bg
              ? "Плащането се извършва чрез наложен платеж. Не съхраняваме данни за банкови карти. Касовият бон се издава от Speedy."
              : "Payment is made via cash on delivery. We do not store bank card data. The cash/fiscal receipt is issued by Speedy."}
          </p>

          <h3 style={{ fontFamily: "var(--font-head)", color: "var(--plum)", fontSize: "0.95rem", fontWeight: 700, margin: "18px 0 8px" }}>
            {bg ? "2.5 Технически данни и бисквитки" : "2.5 Technical data and cookies"}
          </h3>
          <p style={bodyText}>
            {bg
              ? "Сайтът използва само функционална бисквитка за запазване на езиковите предпочитания (tepe-bite-lang). Не използваме аналитични или маркетингови бисквитки."
              : "The website uses only a functional cookie to store language preferences (tepe-bite-lang). We do not use analytics or marketing cookies."}
          </p>
          <LegalTodo label="TODO_ANALYTICS_PROVIDER / TODO_MARKETING_PIXELS — if analytics or pixels are added, update this section and add consent. // TODO business owner confirmation" />
          <LegalTodo label="TODO_HOSTING_PROVIDER — identify and document hosting provider as processor. // TODO business owner / accountant" />
        </LegalSectionCard>

        {/* 3. Legal basis */}
        <LegalSectionCard id="legal-basis" title={bg ? "3. Правно основание за обработка" : "3. Legal Basis for Processing"}>
          <ul style={{ ...bodyText, paddingLeft: 20 }}>
            <li style={{ marginBottom: 8 }}>
              <strong>{bg ? "Изпълнение на договор (чл. 6, пар. 1, б. б GDPR):" : "Contract performance (Art. 6(1)(b) GDPR):"}</strong>{" "}
              {bg ? "Обработката на данните за поръчка, доставка и имейл потвърждение е необходима за изпълнение на договора за продажба." : "Processing of order, delivery and email confirmation data is necessary to perform the sales contract."}
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>{bg ? "Законово задължение (чл. 6, пар. 1, б. в GDPR):" : "Legal obligation (Art. 6(1)(c) GDPR):"}</strong>{" "}
              {bg ? "Данни могат да се съхраняват за счетоводни и данъчни цели." : "Data may be retained for accounting and tax purposes."}
            </li>
          </ul>
          <LegalTodo label="Legal review: confirm legal basis mapping and retention periods. // TODO legal review" />
        </LegalSectionCard>

        {/* 4. Recipients */}
        <LegalSectionCard id="recipients" title={bg ? "4. Получатели на данни" : "4. Data Recipients / Processors"}>
          <p style={bodyText}>
            {bg ? "Данните ви могат да бъдат предоставени на следните страни:" : "Your data may be shared with the following parties:"}
          </p>
          <ul style={{ ...bodyText, paddingLeft: 20 }}>
            <li style={{ marginBottom: 10 }}>
              <strong>Speedy</strong> — {bg ? "куриерска компания, изпълняваща доставката и обработваща наложения платеж. " : "courier company handling delivery and COD payment processing. "}
              <LegalTodo label="TODO_SPEEDY_PROCESSOR_DETAILS — add Speedy DPA/processor agreement details. // TODO legal review" />
            </li>
            <li style={{ marginBottom: 10 }}>
              <strong>{bg ? "Хостинг доставчик" : "Hosting provider"}</strong> — <LegalTodo label="TODO_HOSTING_PROVIDER // TODO business owner confirmation" />
            </li>
            <li style={{ marginBottom: 10 }}>
              <strong>{bg ? "База данни" : "Database provider"}</strong> — <LegalTodo label="TODO_DATABASE_PROVIDER // TODO business owner confirmation" />
            </li>
            <li style={{ marginBottom: 10 }}>
              <strong>{bg ? "Имейл доставчик" : "Email provider"}</strong> — <LegalTodo label="TODO_EMAIL_PROVIDER — used for order confirmation emails. // TODO business owner confirmation" />
            </li>
          </ul>
          <p style={bodyText}>
            {bg
              ? "Данните не се предоставят на трети страни за маркетингови цели без изрично съгласие."
              : "Data is not shared with third parties for marketing purposes without explicit consent."}
          </p>
        </LegalSectionCard>

        {/* 5. Retention */}
        <LegalSectionCard id="retention" title={bg ? "5. Срок за съхранение на данните" : "5. Data Retention Periods"}>
          <p style={bodyText}>
            {bg
              ? "Данните от поръчки се съхраняват за срока, необходим за изпълнение на поръчката, и допълнително за счетоводни/данъчни цели според приложимото законодателство."
              : "Order data is retained for the period necessary to fulfil the order and additionally for accounting/tax purposes as required by applicable law."}
          </p>
          <LegalTodo label="TODO_ORDER_DATA_RETENTION_PERIOD — confirm exact retention period with accountant. // TODO accountant review" />
          <LegalTodo label="TODO_ACCOUNTING_RETENTION_PERIOD — confirm statutory retention period for fiscal documents. // TODO accountant review" />
        </LegalSectionCard>

        {/* 6. Rights */}
        <LegalSectionCard id="rights" title={bg ? "6. Вашите права по GDPR" : "6. Your Rights Under GDPR"}>
          <p style={bodyText}>
            {bg ? "Имате следните права по отношение на личните си данни:" : "You have the following rights regarding your personal data:"}
          </p>
          <ul style={{ ...bodyText, paddingLeft: 20 }}>
            {(bg
              ? [
                  "Право на достъп до личните ви данни.",
                  "Право на коригиране на неточни данни.",
                  'Право на изтриване („право да бъдете забравени“).',
                  "Право на ограничаване на обработката.",
                  "Право на преносимост на данните.",
                  "Право на възражение срещу обработката.",
                  "Право на жалба до надзорен орган.",
                ]
              : [
                  "Right of access to your personal data.",
                  "Right to rectification of inaccurate data.",
                  "Right to erasure ('right to be forgotten').",
                  "Right to restriction of processing.",
                  "Right to data portability.",
                  "Right to object to processing.",
                  "Right to lodge a complaint with a supervisory authority.",
                ]
            ).map((r, i) => (
              <li key={i} style={{ marginBottom: 6 }}>{r}</li>
            ))}
          </ul>
          <p style={bodyText}>
            {bg
              ? "За упражняване на правата си изпратете имейл на tepe@mail.bg. Ще отговорим в срок от 30 дни."
              : "To exercise your rights, send an email to tepe@mail.bg. We will respond within 30 days."}
          </p>
          <p style={bodyText}>
            {bg
              ? "Имате право да подадете жалба до Комисия за защита на личните данни (КЗЛД) — cpdp.bg."
              : "You have the right to lodge a complaint with the Commission for Personal Data Protection (CPDP) — cpdp.bg."}
          </p>
        </LegalSectionCard>

        {/* 7. Security */}
        <LegalSectionCard id="security" title={bg ? "7. Сигурност" : "7. Security"}>
          <p style={bodyText}>
            {bg
              ? "Прилагаме разумни технически и организационни мерки за защита на личните данни от неоторизиран достъп, загуба или унищожаване."
              : "We apply reasonable technical and organisational measures to protect personal data from unauthorised access, loss or destruction."}
          </p>
          <LegalTodo label="TODO_SECURITY_MEASURES — document specific security measures before launch. // TODO business owner / legal review" />
          <LegalTodo label="TODO_DATA_BACKUP_POLICY — confirm backup and recovery policy. // TODO business owner confirmation" />
        </LegalSectionCard>

        {/* 8. Cookies ref */}
        <LegalSectionCard id="cookies-ref" title={bg ? "8. Бисквитки" : "8. Cookies"}>
          <p style={bodyText}>
            {bg
              ? "За информация относно бисквитките, използвани на сайта, вижте нашата Политика за бисквитки."
              : "For information about cookies used on the website, see our Cookie Policy."}
          </p>
          <LegalNote>
            <Link href="/legal/cookies" style={{ color: "var(--plum)", fontWeight: 600 }}>
              {bg ? "Политика за бисквитки →" : "Cookie Policy →"}
            </Link>
          </LegalNote>
        </LegalSectionCard>

        {/* 9. Contact */}
        <LegalSectionCard id="contact-privacy" title={bg ? "9. Контакт по поверителността" : "9. Privacy Contact"}>
          <p style={{ ...bodyText, margin: 0 }}>
            <strong>ТЕПЕ bite / „Баир" ЕООД</strong><br />
            {bg ? "За въпроси, свързани с поверителността: " : "For privacy-related questions: "}
            <a href="mailto:tepe@mail.bg" style={{ color: "var(--plum)" }}>tepe@mail.bg</a>
          </p>
        </LegalSectionCard>

        <LegalTodo label="Full legal review of this Privacy Policy required before launch. GDPR compliance check recommended. // TODO legal review" />
      </LegalPageLayout>
      <Footer />
    </>
  );
}
