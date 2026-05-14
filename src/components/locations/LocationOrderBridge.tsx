"use client";
import { IconShop } from "@/components/icons";
import { langAtom } from "@/store/lang";
import { useAtomValue } from "jotai";
import Image from "next/image";
import Link from "next/link";

export default function LocationOrderBridge() {
  const lang = useAtomValue(langAtom);

  return (
    <section
      style={{
        background: `linear-gradient(160deg, oklch(95% 0.03 55) 0%, oklch(93% 0.05 315 / 0.5) 100%)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative top wave from surface2 */}
      <svg
        style={{
          display: "block",
          width: "100%",
          height: 64,
          marginBottom: -1,
        }}
        viewBox="0 0 1200 64"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 0 L0 64 Q300 20 600 44 Q900 68 1200 28 L1200 0 Z"
          fill="var(--surface2)"
        />
      </svg>

      {/* Bridge header */}
      <div
        style={{
          paddingLeft: "clamp(20px, 5vw, 80px)",
          paddingRight: "clamp(20px, 5vw, 80px)",
          paddingTop: 52,
          paddingBottom: 8,
          textAlign: "center",
        }}
      >
        <div className="section-inner">
          <div
            className="label-tag"
            style={{ color: "var(--caramel)", marginBottom: 18 }}
          >
            {lang === "bg" ? "Поръчай онлайн" : "Order online"}
          </div>
          <h2
            className="heading-lg loc-bridge-heading"
            style={{ maxWidth: 900, margin: "0 auto 16px" }}
          >
            {lang === "bg" ? (
              <>
                Не можете да стигнете{" "}
                <span style={{ color: "var(--caramel)", fontStyle: "italic" }}>
                  до обекта?
                </span>
              </>
            ) : (
              <>
                Can&apos;t make it{" "}
                <span style={{ color: "var(--caramel)", fontStyle: "italic" }}>
                  to the store?
                </span>
              </>
            )}
          </h2>
          <p
            style={{
              fontSize: "1.08rem",
              color: "var(--text-mid)",
              maxWidth: 600,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            {lang === "bg"
              ? "Поръчайте ТЕПЕ bite да дойде при вас — доставяме из цял Пловдив."
              : "Order ТЕПЕ bite to come to you — we deliver across Plovdiv."}
          </p>
        </div>
      </div>

      {/* Order content */}
      <div className="section-spacing" style={{ paddingTop: 48 }}>
        <div className="section-inner">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: "clamp(40px, 6vw, 80px)",
              alignItems: "center",
            }}
            className="loc-order-grid"
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Image
                src="/bar-product.png"
                alt="ТЕПЕ bite — Солен карамел"
                width={260}
                height={260}
                className="loc-order-bar-image"
                style={{
                  width: "clamp(160px, 22vw, 260px)",
                  height: "auto",
                  display: "block",
                  filter: "drop-shadow(0 16px 32px oklch(32% 0.09 315 / 0.22))",
                  transform: "rotate(8deg)",
                }}
              />
            </div>

            <div className="loc-order-content">
              <div className="label-tag" style={{ marginBottom: 14 }}>
                {lang === "bg" ? "Поръчай" : "Order"}
              </div>
              <h3 className="heading-lg" style={{ marginBottom: 16 }}>
                {lang === "bg"
                  ? "Готов ли си да опиташ ТЕПЕ bite?"
                  : "Ready to try ТЕПЕ bite?"}
              </h3>
              <p
                className="loc-order-desc"
                style={{ fontSize: "1.05rem", maxWidth: 680, marginBottom: 32 }}
              >
                {lang === "bg"
                  ? "Поръчай барчето със солен карамел и подкрепи първите ни инициативи още сега."
                  : "Order the salted caramel bar and support our first initiatives right now."}
              </p>
              <Link
                href="/order"
                className="btn btn-caramel loc-order-button"
                style={{ fontSize: "1.05rem", padding: "16px 36px" }}
              >
                <IconShop />
                {lang === "bg" ? "Поръчай сега" : "Order Now"}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .loc-bridge-heading {
            white-space: nowrap;
          }
        }
        @media (max-width: 900px) {
          .loc-order-grid {
            grid-template-columns: 1fr !important;
          }
          .loc-order-grid > div:first-child {
            display: flex !important;
          }
          .loc-order-content {
            background: var(--surface);
            border-radius: var(--r-lg);
            box-shadow: var(--shadow);
            border: 1px solid var(--border);
            padding: 28px;
            margin: 0 auto;
            max-width: 560px;
            width: 100%;
          }
          .loc-order-bar-image {
            width: 50vw !important;
            min-width: 300px !important;
            max-width: 370px;
            height: auto !important;
          }
          .loc-order-desc {
            text-align: justify;
          }
          .loc-order-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
