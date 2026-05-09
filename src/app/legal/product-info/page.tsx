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

const sections = [
  { id: "identity", labelBg: "Идентичност", labelEn: "Product Identity" },
  { id: "ingredients", labelBg: "Съставки", labelEn: "Ingredients" },
  { id: "allergens", labelBg: "Алергени", labelEn: "Allergens" },
  { id: "nutrition", labelBg: "Хранителна информация", labelEn: "Nutrition" },
  { id: "storage", labelBg: "Съхранение", labelEn: "Storage" },
  { id: "producer", labelBg: "Производител", labelEn: "Producer" },
  { id: "claims", labelBg: "Декларации", labelEn: "Claims" },
  { id: "no-medical", labelBg: "Медицинска бележка", labelEn: "Medical Note" },
];

export default function ProductInfoPage() {
  const lang = useAtomValue(langAtom);
  const bg = lang === "bg";

  const allergenStyle: React.CSSProperties = {
    fontWeight: 700,
    textDecoration: "underline",
  };

  return (
    <>
      <LegalPageLayout
        titleBg="Информация за продукта и безопасност на храните"
        titleEn="Product Information and Food Safety Notice"
        subtitleBg="Пълна информация за ТЕПЕ bite барчето — съставки, алергени, хранителни стойности и условия за съхранение."
        subtitleEn="Full information for the ТЕПЕ bite bar — ingredients, allergens, nutritional values and storage conditions."
        sections={sections}
      >
        <LegalNote>
          {bg
            ? "Тази страница отразява информацията от опаковката. Проверете съставките, алергените, условията за съхранение, срока на годност и партидния номер върху опаковката преди консумация."
            : "This page reflects the information from the packaging. Please check the ingredients, allergens, storage instructions, best-before date and batch number on the package before consumption."}
        </LegalNote>

        {/* 1. Identity */}
        <LegalSectionCard id="identity" title={bg ? "1. Идентичност на продукта" : "1. Product Identity"}>
          <div style={{ display: "grid", gap: 10 }}>
            {[
              {
                label: bg ? "Официално наименование (BG)" : "Official name (BG)",
                value: "ТЕПЕ bite – здравословно хранително барче със солен карамел",
              },
              {
                label: bg ? "Техническо наименование (BG)" : "Technical name (BG)",
                value: "Био нисковъглехидратен бар солен карамел с подсладител",
              },
              {
                label: bg ? "Официално наименование (EN)" : "Official name (EN)",
                value: "ТЕПЕ bite – healthy snack bar with salted caramel",
              },
              {
                label: bg ? "Техническо наименование (EN)" : "Technical name (EN)",
                value: "Organic low carb bar salted caramel with sweetener",
              },
              { label: bg ? "Вид продукт" : "Product type", value: bg ? "Хранително барче" : "Food bar" },
              { label: bg ? "Нетно количество" : "Net quantity", value: "40 g / 1.4 oz" },
              { label: bg ? "Вкус" : "Flavour", value: bg ? "Солен карамел" : "Salted caramel" },
            ].map((r, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "220px 1fr",
                  gap: 12,
                  paddingBottom: 8,
                  borderBottom: "1px solid var(--border)",
                  alignItems: "start",
                }}
                className="product-row"
              >
                <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-mid)" }}>{r.label}</span>
                <span style={{ fontSize: "0.92rem", color: "var(--text)" }}>{r.value}</span>
              </div>
            ))}
          </div>
        </LegalSectionCard>

        {/* 2. Ingredients */}
        <LegalSectionCard id="ingredients" title={bg ? "2. Съставки" : "2. Ingredients"}>
          {bg ? (
            <p style={{ ...bodyText, lineHeight: 1.85 }}>
              <strong style={allergenStyle}>Бадеми</strong>*, фибри от корен от цикория*, слънчогледови семки*, тиквени семки*, натурален подсладител: еритритол*, оризови криспи със слънчогледов протеин* (<strong>слънчогледов протеин</strong>*, оризово брашно*), лукума*, овлажнител: глицерол*, натурален аромат карамел (1,7%), морска сол, натурален антиоксидант: екстракт от розмарин*.
              <br />
              <span style={{ fontSize: "0.85rem", color: "var(--text-soft)" }}>
                *Съставки от биологично земеделие
              </span>
            </p>
          ) : (
            <p style={{ ...bodyText, lineHeight: 1.85 }}>
              <strong style={allergenStyle}>Almonds</strong>*, chicory root fiber*, sunflower seeds*, pumpkin seeds*, natural sweetener: erythritol*, sunflower protein rice crispies* (<strong>sunflower protein</strong>*, rice flour*), lucuma*, humectant: glycerol*, natural caramel flavouring (1.7%), sea salt, natural antioxidant: rosemary extract*.
              <br />
              <span style={{ fontSize: "0.85rem", color: "var(--text-soft)" }}>
                *From organic farming
              </span>
            </p>
          )}
          <LegalNote>
            {bg ? "Алергените са изписани в удебелен шрифт в списъка на съставките." : "Allergens are shown in bold in the ingredients list."}
          </LegalNote>
        </LegalSectionCard>

        {/* 3. Allergens */}
        <LegalSectionCard id="allergens" title={bg ? "3. Алергени" : "3. Allergens"}>
          <div
            style={{
              background: "oklch(97% 0.025 50)",
              border: "2px solid var(--caramel)",
              borderRadius: "var(--r-md)",
              padding: "18px 20px",
              marginBottom: 14,
            }}
          >
            <div style={{ fontWeight: 700, color: "var(--plum)", marginBottom: 8 }}>
              ⚠ {bg ? "Алергени" : "Allergens"}
            </div>
            <p style={{ margin: "0 0 10px", ...bodyText }}>
              {bg
                ? "Алергени: вижте съставките в удебелен шрифт."
                : "Allergens: see ingredients in bold."}
            </p>
            <p style={{ margin: 0, ...bodyText }}>
              {bg
                ? "Може да съдържа следи от ядки, фъстъци и сусам."
                : "May contain traces of other nuts, peanuts and sesame."}
            </p>
          </div>
          <p style={{ fontSize: "0.84rem", color: "var(--text-soft)", margin: 0, lineHeight: 1.6 }}>
            {bg
              ? "Продуктът съдържа бадеми. Хората с алергия към ядки, фъстъци или сусам трябва да проверят опаковката преди консумация."
              : "The product contains almonds. People with allergies to nuts, peanuts or sesame should check the packaging before consumption."}
          </p>
        </LegalSectionCard>

        {/* 4. Nutrition */}
        <LegalSectionCard id="nutrition" title={bg ? "4. Хранителна информация" : "4. Nutritional Information"}>
          <div style={{ overflowX: "auto" }}>
            <table
              className="nutr-table"
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.9rem",
                marginBottom: 8,
              }}
            >
              <thead>
                <tr style={{ background: "var(--plum)", color: "white" }}>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>
                    {bg ? "Хранително вещество" : "Nutrient"}
                  </th>
                  <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600 }}>
                    {bg ? "На 100 г" : "Per 100 g"}
                  </th>
                  <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600 }}>
                    {bg ? "На 1 барче (40 г)" : "Per 1 bar (40 g)"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { nutrient: bg ? "Енергийна стойност" : "Energy", per100: "1853 kJ / 448 kcal", perBar: "741 kJ / 179 kcal", bold: true },
                  { nutrient: bg ? "Мазнини" : "Fat", per100: "30 g", perBar: "12 g", bold: true },
                  { nutrient: bg ? "от които наситени мастни киселини" : "of which saturated fatty acids", per100: "3.8 g", perBar: "1.5 g", indent: true },
                  { nutrient: bg ? "Въглехидрати" : "Carbohydrate", per100: "24 g", perBar: "9.6 g", bold: true },
                  { nutrient: bg ? "от които захари" : "of which sugars", per100: "3.4 g", perBar: "1.4 g", indent: true },
                  { nutrient: bg ? "от които полиоли" : "of which polyols", per100: "9.9 g", perBar: "3.9 g", indent: true },
                  { nutrient: bg ? "Фибри" : "Fibre", per100: "22 g", perBar: "8.8 g", bold: true },
                  { nutrient: bg ? "Протеини" : "Protein", per100: "17 g", perBar: "6.8 g", bold: true },
                  { nutrient: bg ? "Сол" : "Salt", per100: "0.61 g", perBar: "0.24 g", bold: true },
                ].map((row, i) => (
                  <tr
                    key={i}
                    style={{
                      background: i % 2 === 0 ? "var(--surface)" : "var(--bg)",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <td
                      style={{
                        padding: "9px 14px",
                        paddingLeft: row.indent ? 28 : 14,
                        fontWeight: row.bold ? 600 : 400,
                        color: row.indent ? "var(--text-mid)" : "var(--text)",
                        fontSize: row.indent ? "0.84rem" : "0.9rem",
                      }}
                    >
                      {row.nutrient}
                    </td>
                    <td style={{ padding: "9px 14px", textAlign: "right", color: "var(--text-mid)" }}>{row.per100}</td>
                    <td style={{ padding: "9px 14px", textAlign: "right", color: "var(--text-mid)" }}>{row.perBar}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <LegalTodo label="TODO_VERIFY_POLYOLS_WARNING_IF_REQUIRED — check whether a polyols warning is required under applicable EU food labelling law. // TODO legal review" />
        </LegalSectionCard>

        {/* 5. Storage */}
        <LegalSectionCard id="storage" title={bg ? "5. Условия за съхранение и срок на годност" : "5. Storage and Best Before"}>
          <p style={bodyText}>
            {bg
              ? "Да се съхранява на сухо и хладно място, без пряк достъп на слънчева светлина."
              : "Store in a cool, dry and dark place."}
          </p>
          <p style={bodyText}>
            {bg
              ? "Най-добър до / Партида L: виж маркировката върху опаковката."
              : "Best before and batch/lot number: see imprint on the packaging."}
          </p>
        </LegalSectionCard>

        {/* 6. Producer */}
        <LegalSectionCard id="producer" title={bg ? "6. Производител" : "6. Producer"}>
          <p style={bodyText}>
            <strong>{bg ? "Произведено от:" : "Produced by:"}</strong> Biostyle Ltd.<br />
            {bg ? "Адрес: " : "Address: "}ул. „Светлина" № 8, с. Брестовица 4224, България<br />
            {bg ? "Тел: " : "Tel: "}+359 894 383 772<br />
            {bg ? "Имейл: " : "Email: "}
            <a href="mailto:sales@biostyle.bg" style={{ color: "var(--plum)" }}>sales@biostyle.bg</a>
          </p>
          <p style={{ ...bodyText, margin: 0 }}>
            <strong>{bg ? "Произведено за:" : "Produced for:"}</strong> „Баир" ЕООД (ТЕПЕ bite)
          </p>
        </LegalSectionCard>

        {/* 7. Claims */}
        <LegalSectionCard id="claims" title={bg ? "7. Декларации върху опаковката" : "7. Packaging Claims"}>
          <p style={{ ...bodyText, marginBottom: 12 }}>
            {bg
              ? "Следните декларации са видими върху опаковката. Всяка декларация подлежи на проверка и потвърждение преди пускане в продукция:"
              : "The following claims are visible on the packaging. Each claim is subject to verification and confirmation before launch:"}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
            {[
              { label: "Vegan / Веган", todo: "TODO_VERIFY_VEGAN_CLAIM" },
              { label: bg ? "Без глутен / Gluten free" : "Gluten free", todo: "TODO_VERIFY_GLUTEN_FREE_CLAIM" },
              { label: bg ? "Биологичен / Organic (BG-BIO-02)" : "Organic (BG-BIO-02)", todo: "TODO_VERIFY_ORGANIC_CERTIFICATION" },
              { label: bg ? "Нисковъглехидратен / Low carb" : "Low carb", todo: "TODO_VERIFY_LOW_CARB_CLAIM" },
              { label: bg ? "С подсладител / With sweetener" : "With sweetener", todo: "TODO_VERIFY_ALLOWED_NUTRITION_CLAIMS" },
            ].map((c, i) => (
              <div
                key={i}
                style={{
                  background: "oklch(94% 0.04 150)",
                  border: "1px solid oklch(80% 0.08 150)",
                  borderRadius: "var(--r-sm)",
                  padding: "6px 12px",
                  fontSize: "0.82rem",
                  color: "oklch(30% 0.1 150)",
                  fontWeight: 600,
                }}
              >
                ✓ {c.label}
              </div>
            ))}
          </div>
          <LegalTodo label="TODO_VERIFY_ORGANIC_CERTIFICATION, TODO_VERIFY_GLUTEN_FREE_CLAIM, TODO_VERIFY_LOW_CARB_CLAIM, TODO_VERIFY_VEGAN_CLAIM, TODO_VERIFY_ALLOWED_NUTRITION_CLAIMS — verify all packaging claims before launch. // TODO business owner / legal review" />
          <LegalTodo label="TODO_VERIFY_POLYOLS_WARNING_IF_REQUIRED — erythritol and glycerol are polyols; check if a consumer warning is needed. // TODO legal review" />
        </LegalSectionCard>

        {/* 8. No medical claims */}
        <LegalSectionCard id="no-medical" title={bg ? "8. Бележка — не е лекарствен продукт" : "8. Note — Not a Medicinal Product"}>
          <div
            style={{
              background: "oklch(97% 0.02 315)",
              border: "1px solid oklch(82% 0.05 315)",
              borderRadius: "var(--r-md)",
              padding: "18px 20px",
            }}
          >
            <p style={{ ...bodyText, margin: "0 0 10px", fontWeight: 600 }}>
              {bg
                ? "Продуктът не е лекарствен продукт и не е предназначен за диагностика, лечение или превенция на заболявания."
                : "This product is not a medicinal product and is not intended to diagnose, treat, or prevent any disease."}
            </p>
            <p style={{ ...bodyText, margin: 0 }}>
              {bg
                ? "Проверете съставките, алергените, условията за съхранение, срока на годност и партидния номер върху опаковката преди консумация."
                : "Please check the ingredients, allergens, storage instructions, best-before date and batch number on the package before consumption."}
            </p>
          </div>
          <p style={{ fontSize: "0.84rem", color: "var(--text-soft)", margin: "12px 0 0", lineHeight: 1.6 }}>
            {bg
              ? "За въпроси относно продукта се свържете с нас на tepe@mail.bg."
              : "For questions about the product, contact us at tepe@mail.bg."}
          </p>
        </LegalSectionCard>

        <LegalTodo label="Cross-check this product information page against the live product page to ensure no conflicts. // TODO business owner confirmation" />

        <style>{`
          @media (max-width: 560px) {
            .product-row { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </LegalPageLayout>
      <Footer />
    </>
  );
}
