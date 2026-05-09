"use client";
import Footer from "@/components/Footer";
import LegalPageLayout, {
  LegalNote,
  LegalSectionCard,
  LegalTodo,
  bodyText,
  subheading,
} from "@/components/legal/LegalPageLayout";
import { langAtom } from "@/store/lang";
import { useAtomValue } from "jotai";
import Link from "next/link";

const sections = [
  { id: "merchant", labelBg: "Данни за търговеца", labelEn: "Merchant" },
  { id: "scope", labelBg: "Обхват", labelEn: "Scope" },
  { id: "products", labelBg: "Продукти", labelEn: "Products" },
  { id: "orders", labelBg: "Поръчки", labelEn: "Orders" },
  { id: "contract", labelBg: "Договор", labelEn: "Contract" },
  { id: "prices", labelBg: "Цени", labelEn: "Prices" },
  { id: "delivery", labelBg: "Доставка", labelEn: "Delivery" },
  { id: "payment", labelBg: "Плащане", labelEn: "Payment" },
  { id: "returns", labelBg: "Връщане", labelEn: "Returns" },
  { id: "food-notes", labelBg: "Хранителни бележки", labelEn: "Food Notes" },
  { id: "initiatives", labelBg: "Инициативи", labelEn: "Initiatives" },
  { id: "liability", labelBg: "Отговорност", labelEn: "Liability" },
  { id: "changes", labelBg: "Промени", labelEn: "Changes" },
  { id: "contact", labelBg: "Контакт", labelEn: "Contact" },
];

export default function TermsPage() {
  const lang = useAtomValue(langAtom);
  const bg = lang === "bg";

  return (
    <>
      <LegalPageLayout
        titleBg="Общи условия"
        titleEn="Terms and Conditions"
        subtitleBg="Условия за използване на уебсайта tepebite.com и за поръчка на продуктите на ТЕПЕ bite."
        subtitleEn="Terms for using the ТЕПЕ bite website and ordering ТЕПЕ bite products."
        sections={sections}
      >
        {/* 1. Merchant */}
        <LegalSectionCard id="merchant" title={bg ? "1. Данни за търговеца" : "1. Merchant Identity"}>
          <p style={bodyText}>
            {bg
              ? "Уебсайтът се управлява от:"
              : "The website is operated by:"}
          </p>
          <ul style={{ ...bodyText, paddingLeft: 20, margin: 0 }}>
            <li>{bg ? "Търговска марка: " : "Brand: "}<strong>ТЕПЕ bite</strong></li>
            <li>{bg ? "Правен субект: " : "Legal entity: "}<strong>„Баир" ЕООД</strong></li>
            <li>ЕИК / UIC: <LegalTodo label="TODO_EIK — потвърди ЕИК пред пускане в продукция. // TODO business owner confirmation" /></li>
            <li>{bg ? "ДДС номер: " : "VAT number: "}<LegalTodo label="TODO_VAT_NUMBER — потвърди ДДС номер. // TODO accountant review" /></li>
            <li>{bg ? "Управител: " : "Manager: "}<strong>Маргарита Стоичкова</strong></li>
            <li>{bg ? "Контакт за клиенти: " : "Customer contact: "}<strong>Никола Андреев</strong></li>
            <li>{bg ? "Имейл: " : "Email: "}<a href="mailto:tepe@mail.bg" style={{ color: "var(--plum)" }}>tepe@mail.bg</a></li>
            <li>{bg ? "Уебсайт: " : "Website: "}<LegalTodo label="TODO_DOMAIN — потвърди домейн. // TODO business owner confirmation" /></li>
            <li>{bg ? "Седалище: " : "Registered office: "}<LegalTodo label="TODO_REGISTERED_OFFICE_ADDRESS — потвърди адрес на регистрация. // TODO business owner confirmation" /></li>
          </ul>
          <LegalNote>
            {bg
              ? "За пълни данни за търговеца вижте страницата Данни за търговеца."
              : "For full trader details see the Trader Information page."}
            {" "}<Link href="/legal/trader-info" style={{ color: "var(--plum)", fontWeight: 600 }}>{bg ? "Данни за търговеца →" : "Trader Information →"}</Link>
          </LegalNote>
        </LegalSectionCard>

        {/* 2. Scope */}
        <LegalSectionCard id="scope" title={bg ? "2. Обхват на уебсайта" : "2. Scope of the Website"}>
          <p style={bodyText}>
            {bg
              ? "Уебсайтът предоставя информация за продуктите на ТЕПЕ bite и дава възможност за поръчка онлайн. Продажбите са насочени изключително към крайни потребители (B2C) в България."
              : "The website provides information about ТЕПЕ bite products and allows online ordering. Sales are directed exclusively to end consumers (B2C) in Bulgaria."}
          </p>
          <p style={bodyText}>
            {bg
              ? "За бизнес или едрови заявки, моля свържете се с нас на tepe@mail.bg."
              : "For business or bulk orders, please contact us at tepe@mail.bg."}
          </p>
          <p style={bodyText}>
            {bg
              ? "Сайтът не поддържа потребителски акаунти. Поръчките се правят без регистрация."
              : "The website does not support user accounts. Orders are placed without registration."}
          </p>
        </LegalSectionCard>

        {/* 3. Products */}
        <LegalSectionCard id="products" title={bg ? "3. Продукти и информация за продуктите" : "3. Products and Product Information"}>
          <p style={bodyText}>
            {bg
              ? "ТЕПЕ bite предлага предварително пакетирано хранително барче — ТЕПЕ bite солен карамел, 40 г. Продуктът се продава онлайн само в пакети от 10, 20 или 35 бройки."
              : "ТЕПЕ bite offers a pre-packaged food bar — ТЕПЕ bite salted caramel, 40 g. The product is sold online only in packs of 10, 20 or 35 bars."}
          </p>
          <p style={bodyText}>
            {bg
              ? "Информацията за продукта, включително съставките, алергените, хранителните стойности и условията за съхранение, е достъпна на уебсайта и върху опаковката."
              : "Product information, including ingredients, allergens, nutritional values and storage conditions, is available on the website and on the packaging."}
          </p>
          <p style={bodyText}>
            {bg
              ? "Партидният номер и срокът на годност са отпечатани върху опаковката."
              : "The batch/lot number and best-before date are printed on the packaging."}
          </p>
          <LegalNote>
            {bg
              ? "Пълна информация за продукта:"
              : "Full product information: "}
            {" "}<Link href="/legal/product-info" style={{ color: "var(--plum)", fontWeight: 600 }}>{bg ? "Информация за продукта и безопасност →" : "Product Information and Food Safety →"}</Link>
          </LegalNote>
        </LegalSectionCard>

        {/* 4. Orders */}
        <LegalSectionCard id="orders" title={bg ? "4. Поръчки и процес на потвърждение" : "4. Orders and Confirmation Process"}>
          <p style={bodyText}>
            {bg
              ? "Поръчката се извършва чрез уебсайта, без да е необходима регистрация. Процесът е следният:"
              : "Orders are placed through the website without registration. The process is as follows:"}
          </p>
          <ol style={{ ...bodyText, paddingLeft: 22 }}>
            <li style={{ marginBottom: 8 }}>{bg ? "Клиентът попълва информацията за поръчката на уебсайта." : "The customer fills in the order information on the website."}</li>
            <li style={{ marginBottom: 8 }}>{bg ? "Клиентът получава имейл с линк за потвърждение." : "The customer receives an email with a confirmation link."}</li>
            <li style={{ marginBottom: 8 }}>{bg ? "Клиентът потвърждава поръчката чрез линка в имейла." : "The customer confirms the order via the link in the email."}</li>
            <li style={{ marginBottom: 8 }}>{bg ? "След потвърждение поръчката изчаква обработка." : "After confirmation, the order awaits processing."}</li>
            <li style={{ marginBottom: 8 }}>{bg ? "При обработка клиентът получава имейл за статуса." : "Upon processing, the customer receives a status email."}</li>
            <li style={{ marginBottom: 8 }}>{bg ? "Поръчката се предава на Speedy за доставка." : "The order is handed to Speedy for delivery."}</li>
            <li style={{ marginBottom: 8 }}>{bg ? "Клиентът плаща с наложен платеж при получаване. Касовият бон се издава от Speedy." : "The customer pays by cash on delivery. The cash/fiscal receipt is issued by Speedy."}</li>
          </ol>
          <p style={bodyText}>
            {bg
              ? "Поръчки, направени преди 19:00 в работен ден, се обработват в същия работен ден. Поръчки след 19:00 или в неработни дни се обработват на следващия работен ден."
              : "Orders placed before 19:00 on a working day are processed on the same working day. Orders placed after 19:00 or on non-working days are processed on the next working day."}
          </p>
          <LegalTodo label="Confirm exact policy for public holidays. // TODO business owner confirmation" />
        </LegalSectionCard>

        {/* 5. Contract formation */}
        <LegalSectionCard id="contract" title={bg ? "5. Сключване на договора" : "5. Contract Formation"}>
          <p style={bodyText}>
            {bg
              ? "Договорът за продажба от разстояние се счита за сключен в момента, в който клиентът потвърди поръчката чрез линка в потвърдителния имейл и търговецът потвърди, че е получил поръчката."
              : "The distance sales contract is considered concluded when the customer confirms the order through the link in the confirmation email and the merchant confirms receipt of the order."}
          </p>
          <p style={bodyText}>
            {bg
              ? "Преди финалното потвърждение на поръчката клиентът е длъжен да се съгласи с настоящите Общи условия и да е запознат с Политиката за поверителност."
              : "Before final order confirmation, the customer must agree to these Terms and Conditions and acknowledge the Privacy Policy."}
          </p>
          {/* TODO legal review */}
          <LegalTodo label="Legal review: confirm contract-formation wording complies with Bulgarian e-commerce law (ZZPUP / ZTPP). // TODO legal review" />
        </LegalSectionCard>

        {/* 6. Prices */}
        <LegalSectionCard id="prices" title={bg ? "6. Цени и валута" : "6. Prices and Currency"}>
          <p style={bodyText}>
            {bg
              ? "Всички цени са посочени в лева (BGN) с включен ДДС, освен ако изрично не е посочено друго."
              : "All prices are stated in Bulgarian leva (BGN) inclusive of VAT, unless explicitly stated otherwise."}
          </p>
          <LegalTodo label="TODO_CONFIRM_CURRENCY_DISPLAY — verify whether prices display in BGN, EUR or dual. // TODO business owner confirmation" />
          <p style={bodyText}>
            {bg
              ? "Крайната цена, включваща стоките и разходите за доставка, се показва преди финалното потвърждение на поръчката."
              : "The final price, including goods and delivery costs, is shown before the final order confirmation."}
          </p>
          <p style={bodyText}>
            {bg
              ? "Търговецът си запазва правото да актуализира цените. Цената, приложима за вашата поръчка, е тази, показана в момента на подаване на поръчката."
              : "The merchant reserves the right to update prices. The price applicable to your order is the one shown at the time of order submission."}
          </p>
        </LegalSectionCard>

        {/* 7. Delivery */}
        <LegalSectionCard id="delivery" title={bg ? "7. Доставка" : "7. Delivery"}>
          <p style={bodyText}>
            {bg ? "Доставяме само в България чрез Speedy." : "We deliver only in Bulgaria via Speedy."}
          </p>
          <ul style={{ ...bodyText, paddingLeft: 20 }}>
            <li>{bg ? "Доставка до Speedy автомат/офис — 4.49 лв." : "Delivery to a Speedy locker/office — BGN 4.49."}</li>
            <li>{bg ? "Доставка до адрес — 9.90 лв." : "Delivery to an address — BGN 9.90."}</li>
            <li>{bg ? "Безплатна доставка над 30 EUR." : "Free delivery over EUR 30."} <LegalTodo label="TODO_CONFIRM_FREE_DELIVERY_THRESHOLD_BGN_EQUIVALENT_IF_NEEDED // TODO business owner / accountant confirmation" /></li>
          </ul>
          <p style={bodyText}>
            {bg
              ? "Доставката обикновено се извършва на следващия работен ден, но може да отнеме до 2 работни дни."
              : "Delivery is usually completed on the next working day, but may take up to 2 working days."}
          </p>
          <p style={bodyText}>
            {bg
              ? "Ако пратката не бъде получена след предаването й на Speedy, клиентът може да бъде задължен да покрие разходите за обратна доставка."
              : "If a shipment is not collected after being handed to Speedy, the customer may be expected to cover the return-delivery cost."}
          </p>
          <LegalTodo label="Legal review: enforceability of charging return delivery on uncollected shipments. // TODO legal review" />
          <LegalNote>
            {bg ? "Пълна информация за доставката: " : "Full delivery information: "}
            <Link href="/legal/delivery-payment" style={{ color: "var(--plum)", fontWeight: 600 }}>
              {bg ? "Доставка и плащане →" : "Delivery and Payment →"}
            </Link>
          </LegalNote>
        </LegalSectionCard>

        {/* 8. Payment */}
        <LegalSectionCard id="payment" title={bg ? "8. Плащане" : "8. Payment"}>
          <p style={bodyText}>
            {bg
              ? "Към момента на пускане на сайта единственият начин на плащане е наложен платеж (НП). Плащането се извършва в брой при получаване на пратката."
              : "At the time of launch, the only available payment method is cash on delivery (COD). Payment is made in cash upon receipt of the shipment."}
          </p>
          <p style={bodyText}>
            {bg
              ? "Касовият/фискален бон за наложен платеж се издава от Speedy чрез съответната им услуга."
              : "The cash/fiscal receipt for the COD payment is issued by Speedy through their relevant service."}
          </p>
          {/* TODO accountant/business confirmation */}
          <LegalTodo label="Verify active Speedy contract and cash-receipt service before launch. // TODO accountant/business confirmation" />
          <p style={bodyText}>
            {bg
              ? "За стандартни онлайн поръчки към крайни клиенти документът за плащане се издава чрез Speedy при наложен платеж. За бизнес/едрови заявки можете да се свържете с нас на tepe@mail.bg."
              : "For standard online orders to end consumers, the payment document is issued through Speedy upon cash on delivery. For business or bulk requests, please contact us at tepe@mail.bg."}
          </p>
          <LegalTodo label="Invoice-on-request wording and VAT treatment for business orders. // TODO accountant review" />
        </LegalSectionCard>

        {/* 9. Returns */}
        <LegalSectionCard id="returns" title={bg ? "9. Връщане, отказ и рекламации" : "9. Returns, Withdrawal and Complaints"}>
          <p style={bodyText}>
            {bg
              ? "Клиентите имат право на отказ от договор от разстояние при условията на приложимото законодателство. Поради естеството на продукта като предварително пакетирано хранително барче, връщане при отказ се приема само за неотворени продукти с ненарушена опаковка, когато са изпълнени законовите условия. При отворена или нарушена опаковка връщането може да бъде отказано по хигиенни и здравни съображения, освен ако продуктът е дефектен, грешен или несъответстващ."
              : "Customers have the right of withdrawal from a distance contract under applicable law. Because the product is a pre-packaged food bar, withdrawal returns are accepted only for unopened products with intact packaging, where the legal conditions are met. If the package is opened or damaged, the return may be refused for hygiene and health-protection reasons, unless the product is defective, incorrect or non-conforming."}
          </p>
          <LegalTodo label="Confirm food-specific withdrawal exception wording with a lawyer. // TODO legal review" />
          <LegalNote>
            {bg ? "Пълна информация: " : "Full information: "}
            <Link href="/legal/returns-complaints" style={{ color: "var(--plum)", fontWeight: 600 }}>
              {bg ? "Връщане, отказ и рекламации →" : "Returns, Withdrawal and Complaints →"}
            </Link>
            {" · "}
            <Link href="/legal/withdrawal-form" style={{ color: "var(--plum)", fontWeight: 600 }}>
              {bg ? "Формуляр за отказ →" : "Withdrawal Form →"}
            </Link>
          </LegalNote>
        </LegalSectionCard>

        {/* 10. Food notes */}
        <LegalSectionCard id="food-notes" title={bg ? "10. Бележки за хранителния продукт" : "10. Food Product Notes"}>
          <p style={bodyText}>
            {bg
              ? "Продуктът не е лекарствен продукт и не е предназначен за диагностика, лечение или превенция на заболявания."
              : "This product is not a medicinal product and is not intended to diagnose, treat, or prevent any disease."}
          </p>
          <p style={bodyText}>
            {bg
              ? "Проверете съставките, алергените, условията за съхранение, срока на годност и партидния номер върху опаковката преди консумация."
              : "Check the ingredients, allergens, storage instructions, best-before date and batch number on the packaging before consumption."}
          </p>
          <LegalTodo label="TODO_VERIFY_BABH_DISTANCE_SELLING_REGISTRATION_STATUS — confirm BABH/ODBH registration for distance food trade. // TODO business owner / legal review" />
        </LegalSectionCard>

        {/* 11. Initiatives */}
        <LegalSectionCard id="initiatives" title={bg ? "11. Инициативи" : "11. Initiatives"}>
          <p style={bodyText}>
            {bg
              ? "ТЕПЕ bite подкрепя градски инициативи чрез част от печалбата на бранда и чрез конкретни кампании, реализирани или подпомогнати от екипа. Не обещаваме фиксиран процент от всяка продажба, освен ако това не е изрично обявено за конкретна кампания."
              : "ТЕПЕ bite supports local city initiatives through part of the brand's profit and through specific campaigns implemented or supported by the team. We do not promise a fixed percentage from each sale unless this is explicitly announced for a specific campaign."}
          </p>
          <LegalNote>
            <Link href="/legal/initiative-transparency" style={{ color: "var(--plum)", fontWeight: 600 }}>
              {bg ? "Прозрачност на инициативите →" : "Initiative Transparency →"}
            </Link>
          </LegalNote>
        </LegalSectionCard>

        {/* 12. Liability */}
        <LegalSectionCard id="liability" title={bg ? "12. Отговорност и наличност" : "12. Liability and Availability"}>
          <p style={bodyText}>
            {bg
              ? "Търговецът полага разумни усилия за поддържане на наличност на продуктите и точност на информацията. При изчерпване на наличността клиентът ще бъде уведомен и поръчката ще бъде анулирана без такса."
              : "The merchant makes reasonable efforts to maintain product availability and information accuracy. If a product is out of stock, the customer will be notified and the order cancelled without charge."}
          </p>
          <p style={bodyText}>
            {bg
              ? "Търговецът не носи отговорност за вреди, произтичащи от неизпълнение поради непредвидими обстоятелства извън неговия контрол."
              : "The merchant is not liable for damages resulting from non-performance due to unforeseeable circumstances beyond its control."}
          </p>
          <LegalTodo label="Legal review: limitation of liability clause wording. // TODO legal review" />
        </LegalSectionCard>

        {/* 13. Changes */}
        <LegalSectionCard id="changes" title={bg ? "13. Промени в Общите условия" : "13. Changes to Terms"}>
          <p style={bodyText}>
            {bg
              ? "Търговецът може да актуализира настоящите Общи условия. При съществени промени клиентите ще бъдат уведомени по подходящ начин. Продължаването на използването на сайта след публикуване на промените означава приемане на актуализираните условия."
              : "The merchant may update these Terms and Conditions. In case of material changes, customers will be notified appropriately. Continued use of the website after the changes are published constitutes acceptance of the updated terms."}
          </p>
        </LegalSectionCard>

        {/* 14. Contact */}
        <LegalSectionCard id="contact" title={bg ? "14. Контакт" : "14. Contact"}>
          <p style={bodyText}>
            {bg
              ? "За въпроси относно Общите условия, поръчки или потребителски права, моля свържете се с нас:"
              : "For questions about these Terms, orders or consumer rights, please contact us:"}
          </p>
          <p style={{ ...bodyText, margin: 0 }}>
            <strong>ТЕПЕ bite / „Баир" ЕООД</strong><br />
            {bg ? "Имейл: " : "Email: "}<a href="mailto:tepe@mail.bg" style={{ color: "var(--plum)" }}>tepe@mail.bg</a><br />
            {bg ? "Контакт за клиенти: " : "Customer contact: "}Никола Андреев
          </p>
          {/* TODO legal review */}
          <LegalTodo label="Confirm whether email-only public contact is sufficient for legal notice. // TODO legal review" />
        </LegalSectionCard>

        <p style={{ fontSize: "0.82rem", color: "var(--text-soft)", marginTop: 24 }}>
          {bg
            ? "Тези Общи условия са изготвени за целите на предстоящото пускане в продукция и подлежат на правен преглед преди публикуване."
            : "These Terms and Conditions are prepared for the upcoming production launch and are subject to legal review before publication."}
        </p>
        {/* TODO legal review */}
        <LegalTodo label="Full legal review of these Terms and Conditions required before launch. // TODO legal review" />
      </LegalPageLayout>
      <Footer />
    </>
  );
}
