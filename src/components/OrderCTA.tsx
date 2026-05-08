"use client";
import { IconShop } from "@/components/icons";
import { langAtom } from "@/store/lang";
import { useAtomValue } from "jotai";
import Image from "next/image";
import Link from "next/link";

export default function OrderCTA() {
  const lang = useAtomValue(langAtom);

  return (
    <section
      id="order"
      className="section-spacing"
      style={{
        background: `linear-gradient(135deg, oklch(95% 0.03 55) 0%, oklch(93% 0.05 315 / 0.5) 100%)`,
      }}
    >
      <div className="section-inner">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: "clamp(40px, 6vw, 80px)",
            alignItems: "center",
          }}
          className="order-grid"
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Image
              src="/bar-product.png"
              alt="ТЕПЕ bite — Солен карамел"
              width={260}
              height={260}
              className="order-bar-image"
              style={{
                width: "clamp(160px, 22vw, 260px)",
                height: "auto",
                display: "block",
                filter: "drop-shadow(0 16px 32px oklch(32% 0.09 315 / 0.22))",
                transform: "rotate(8deg)",
              }}
            />
          </div>

          <div className="order-content">
            <div className="label-tag" style={{ marginBottom: 14 }}>
              {lang === "bg" ? "Поръчай" : "Order"}
            </div>
            <h2 className="heading-lg" style={{ marginBottom: 16 }}>
              {lang === "bg"
                ? "Готов ли си да опиташ ТЕПЕ bite?"
                : "Ready to try ТЕПЕ bite?"}
            </h2>
            <p
              className="order-desc"
              style={{ fontSize: "1.05rem", maxWidth: 680, marginBottom: 32 }}
            >
              {lang === "bg"
                ? "Поръчай барчето със солен карамел и подкрепи първите ни инициативи още сега."
                : "Order the salted caramel bar and support our first initiatives right now."}
            </p>
            <Link
              href="/order"
              className="btn btn-caramel order-button"
              style={{ fontSize: "1.05rem", padding: "16px 36px" }}
            >
              <IconShop />
              {lang === "bg" ? "Поръчай сега" : "Order Now"}
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .order-grid {
            grid-template-columns: 1fr !important;
          }
          .order-grid > div:first-child {
            display: flex !important;
          }
          .order-content {
            background: var(--surface);
            border-radius: var(--r-lg);
            box-shadow: var(--shadow);
            border: 1px solid var(--border);
            padding: 28px;
            margin: 0 auto;
            max-width: 560px;
            width: 100%;
          }
          .order-bar-image {
            width: 50vw !important;
            min-width: 300px !important;
            max-width: 370px;
            height: auto !important;
          }
          .order-desc {
            text-align: justify;
          }
          .order-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
