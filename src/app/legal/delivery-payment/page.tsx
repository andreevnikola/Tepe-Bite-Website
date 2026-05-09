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
  { id: "area", labelBg: "Зона на доставка", labelEn: "Delivery Area" },
  { id: "options", labelBg: "Опции", labelEn: "Delivery Options" },
  { id: "prices", labelBg: "Цени", labelEn: "Prices" },
  { id: "timing", labelBg: "Срокове", labelEn: "Timing" },
  { id: "payment", labelBg: "Плащане", labelEn: "Payment" },
  { id: "receipt", labelBg: "Касов бон", labelEn: "Receipt" },
  { id: "uncollected", labelBg: "Непотърсени пратки", labelEn: "Uncollected Shipments" },
  { id: "cancel", labelBg: "Отказ преди доставка", labelEn: "Cancel Before Dispatch" },
  { id: "business-orders", labelBg: "Бизнес заявки", labelEn: "Business Orders" },
];

export default function DeliveryPaymentPage() {
  const lang = useAtomValue(langAtom);
  const bg = lang === "bg";

  return (
    <>
      <LegalPageLayout
        titleBg="Доставка и плащане"
        titleEn="Delivery and Payment"
        subtitleBg="Информация за доставка чрез Speedy, цени, срокове и наложен платеж."
        subtitleEn="Information about delivery via Speedy, prices, timelines and cash on delivery."
        sections={sections}
      >
        {/* 1. Area */}
        <LegalSectionCard id="area" title={bg ? "1. Зона на доставка" : "1. Delivery Area"}>
          <p style={bodyText}>
            {bg
              ? "Доставяме само в България. Международни поръчки не се приемат към момента."
              : "We deliver only in Bulgaria. International orders are not accepted at this time."}
          </p>
        </LegalSectionCard>

        {/* 2. Options */}
        <LegalSectionCard id="options" title={bg ? "2. Опции за доставка" : "2. Delivery Options"}>
          <p style={bodyText}>
            {bg ? "Доставките се извършват чрез куриерска компания Speedy." : "Deliveries are handled by Speedy courier company."}
          </p>

          <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", margin: "16px 0" }}>
            {/* Option 1 */}
            <div
              style={{
                background: "var(--bg)",
                border: "2px solid var(--caramel)",
                borderRadius: "var(--r-md)",
                padding: "18px 20px",
              }}
            >
              <div style={{ fontFamily: "var(--font-head)", color: "var(--plum)", fontWeight: 700, marginBottom: 6 }}>
                {bg ? "📍 До Speedy автомат / офис" : "📍 To Speedy locker / office"}
              </div>
              <p style={{ margin: "0 0 8px", fontSize: "0.88rem", color: "var(--text-mid)", lineHeight: 1.6 }}>
                {bg
                  ? "Основната и по-евтина опция. Пратката се доставя до избран от вас Speedy автомат или офис."
                  : "The main and lower-cost option. The shipment is delivered to a Speedy locker or office of your choice."}
              </p>
              <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, color: "var(--caramel)", fontSize: "1.1rem" }}>
                4.49 лв. / BGN 4.49
              </div>
            </div>

            {/* Option 2 */}
            <div
              style={{
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-md)",
                padding: "18px 20px",
              }}
            >
              <div style={{ fontFamily: "var(--font-head)", color: "var(--plum)", fontWeight: 700, marginBottom: 6 }}>
                {bg ? "🏠 До адрес" : "🏠 To address"}
              </div>
              <p style={{ margin: "0 0 8px", fontSize: "0.88rem", color: "var(--text-mid)", lineHeight: 1.6 }}>
                {bg
                  ? "Доставка до посочен от вас адрес с допълнителна такса."
                  : "Delivery to your specified address for an additional fee."}
              </p>
              <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, color: "var(--plum)", fontSize: "1.1rem" }}>
                9.90 лв. / BGN 9.90
              </div>
            </div>
          </div>
        </LegalSectionCard>

        {/* 3. Prices */}
        <LegalSectionCard id="prices" title={bg ? "3. Цени на доставка" : "3. Delivery Prices"}>
          <ul style={{ ...bodyText, paddingLeft: 20 }}>
            <li style={{ marginBottom: 6 }}>{bg ? "Доставка до Speedy автомат/офис — " : "Delivery to Speedy locker/office — "}<strong>4.49 лв. (BGN 4.49)</strong></li>
            <li style={{ marginBottom: 6 }}>{bg ? "Доставка до адрес — " : "Delivery to address — "}<strong>9.90 лв. (BGN 9.90)</strong></li>
            <li style={{ marginBottom: 6 }}>
              {bg ? "Безплатна доставка при поръчка над 30 EUR." : "Free delivery for orders over EUR 30."}
              {" "}<LegalTodo label="TODO_CONFIRM_CURRENCY_DISPLAY and BGN equivalent of free-delivery threshold. // TODO business owner / accountant confirmation" />
            </li>
          </ul>
          <p style={bodyText}>
            {bg
              ? "Разходите за доставка се показват преди финалното потвърждение на поръчката."
              : "Delivery costs are shown before the final order confirmation."}
          </p>
        </LegalSectionCard>

        {/* 4. Timing */}
        <LegalSectionCard id="timing" title={bg ? "4. Срокове за обработка и доставка" : "4. Processing and Delivery Timelines"}>
          <p style={{ ...bodyText, fontWeight: 600 }}>
            {bg ? "Обработка на поръчки:" : "Order processing:"}
          </p>
          <ul style={{ ...bodyText, paddingLeft: 20 }}>
            <li style={{ marginBottom: 6 }}>{bg ? "Поръчки, направени преди 19:00 в работен ден — обработват се в същия работен ден." : "Orders placed before 19:00 on a working day — processed on the same working day."}</li>
            <li style={{ marginBottom: 6 }}>{bg ? "Поръчки след 19:00 или в неработни дни — обработват се на следващия работен ден." : "Orders after 19:00 or on non-working days — processed on the next working day."}</li>
          </ul>
          <LegalTodo label="Confirm exact policy for national public holidays. // TODO business owner confirmation" />

          <p style={{ ...bodyText, fontWeight: 600, marginTop: 16 }}>
            {bg ? "Срок на доставка:" : "Delivery time:"}
          </p>
          <p style={bodyText}>
            {bg
              ? "Доставката обикновено се извършва на следващия работен ден след предаване на пратката на Speedy, но може да отнеме до 2 работни дни."
              : "Delivery is usually completed on the next working day after handing the shipment to Speedy, but may take up to 2 working days."}
          </p>
          <LegalNote>
            {bg
              ? "Сроковете са ориентировъчни. Speedy носи отговорност за сроковете на доставка съгласно своите условия."
              : "Timelines are indicative. Speedy is responsible for delivery timelines according to their terms."}
          </LegalNote>
        </LegalSectionCard>

        {/* 5. Payment */}
        <LegalSectionCard id="payment" title={bg ? "5. Начин на плащане" : "5. Payment Method"}>
          <p style={bodyText}>
            {bg
              ? "Единственият наличен начин на плащане към момента е наложен платеж (НП). Плащате в брой при получаване на пратката от Speedy автомат, офис или куриер."
              : "The only available payment method at this time is cash on delivery (COD). You pay in cash upon receiving the shipment from the Speedy locker, office or courier."}
          </p>
          <p style={bodyText}>
            {bg
              ? "Не приемаме банкови преводи, плащания с карта или наложен платеж чрез банкова карта към момента."
              : "We do not currently accept bank transfers, card payments or COD by card."}
          </p>
        </LegalSectionCard>

        {/* 6. Receipt */}
        <LegalSectionCard id="receipt" title={bg ? "6. Касов бон и документ за плащане" : "6. Cash Receipt and Payment Document"}>
          <p style={bodyText}>
            {bg
              ? 'Касовият бон / фискалният документ за платения наложен платеж се издава от Speedy чрез тяхната услуга „Касов бон за наложен платеж" (или еквивалентна).'
              : "The cash receipt / fiscal document for the COD amount is issued by Speedy through their 'Cash receipt for COD amount' service (or equivalent)."}
          </p>
          <p style={bodyText}>
            {bg
              ? "За стандартни онлайн поръчки към крайни клиенти документът за плащане се издава чрез Speedy при наложен платеж. За бизнес/едрови заявки можете да се свържете с нас на tepe@mail.bg."
              : "For standard online orders to end consumers, the payment document is issued through Speedy upon cash on delivery. For business or bulk requests, please contact us at tepe@mail.bg."}
          </p>
          {/* TODO accountant/business confirmation */}
          <LegalTodo label="Verify active Speedy contract and cash-receipt service before launch. // TODO accountant/business confirmation" />
          <LegalTodo label="Invoice-on-request wording and VAT treatment. // TODO accountant review" />
        </LegalSectionCard>

        {/* 7. Uncollected */}
        <LegalSectionCard id="uncollected" title={bg ? "7. Непотърсени пратки" : "7. Uncollected Shipments"}>
          <p style={bodyText}>
            {bg
              ? "Ако поръчка бъде предадена на Speedy и не бъде получена, разходите за обратна доставка може да бъдат начислени на клиента."
              : "If an order is handed to Speedy and is not collected, the return-delivery cost may be charged to the customer."}
          </p>
          {/* TODO legal review */}
          <LegalTodo label="Legal review: enforceability and exact wording for charging return delivery on uncollected shipments. // TODO legal review" />
        </LegalSectionCard>

        {/* 8. Cancel before dispatch */}
        <LegalSectionCard id="cancel" title={bg ? "8. Отказ преди предаване на куриера" : "8. Cancellation Before Courier Handoff"}>
          <p style={bodyText}>
            {bg
              ? "Ако клиентът се откаже от поръчката, преди тя да е предадена на Speedy, не дължи нищо."
              : "If the customer cancels the order before it is handed to Speedy, the customer owes nothing."}
          </p>
          <p style={bodyText}>
            {bg
              ? "За анулиране пишете възможно най-скоро на tepe@mail.bg с посочен номер на поръчка."
              : "To cancel, write as soon as possible to tepe@mail.bg with your order number."}
          </p>
        </LegalSectionCard>

        {/* 9. Business orders */}
        <LegalSectionCard id="business-orders" title={bg ? "9. Бизнес и едрови поръчки" : "9. Business and Bulk Orders"}>
          <p style={bodyText}>
            {bg
              ? "Онлайн поръчките са предназначени за крайни потребители (B2C). За бизнес заявки, препродажба или едрови количества, моля свържете се с нас:"
              : "Online orders are for end consumers (B2C). For business requests, resale or bulk quantities, please contact us:"}
          </p>
          <p style={{ ...bodyText, margin: 0 }}>
            <a href="mailto:tepe@mail.bg" style={{ color: "var(--plum)", fontWeight: 600 }}>tepe@mail.bg</a>
          </p>
        </LegalSectionCard>

        <LegalNote>
          {bg ? "Пълна информация за поръчките и правата на потребителите: " : "Full information on orders and consumer rights: "}
          <Link href="/legal/terms" style={{ color: "var(--plum)", fontWeight: 600 }}>
            {bg ? "Общи условия →" : "Terms and Conditions →"}
          </Link>
          {" · "}
          <Link href="/legal/returns-complaints" style={{ color: "var(--plum)", fontWeight: 600 }}>
            {bg ? "Връщане и рекламации →" : "Returns and Complaints →"}
          </Link>
        </LegalNote>
      </LegalPageLayout>
      <Footer />
    </>
  );
}
