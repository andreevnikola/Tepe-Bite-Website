"use client";
import { IconShop } from "@/components/icons";
import { langAtom } from "@/store/lang";
import { useAtomValue } from "jotai";
import Link from "next/link";

export default function OrderOnlineStrip() {
  const lang = useAtomValue(langAtom);

  return (
    <section
      style={{
        background: "var(--bg)",
        paddingBottom: "clamp(48px, 7vw, 96px)",
      }}
    >
      <div className="section-inner">
        <div
          className="order-online-strip"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            padding: "clamp(20px, 3vw, 32px) clamp(24px, 4vw, 44px)",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-lg)",
            boxShadow: "var(--shadow)",
          }}
        >
          <div className="order-online-copy" style={{ minWidth: 0 }}>
            <div
              className="label-tag"
              style={{ color: "var(--caramel)", marginBottom: 8 }}
            >
              {lang === "bg" ? "…или поръчай онлайн" : "…or order online"}
            </div>
            <p
              style={{
                fontSize: "1rem",
                color: "var(--text-mid)",
                margin: 0,
                lineHeight: 1.6,
                maxWidth: 520,
              }}
            >
              {lang === "bg"
                ? "Не можеш да стигнеш до обект? Доставяме ТЕПЕ bite из цял Пловдив."
                : "Can't make it to a store? We deliver ТЕПЕ bite across Plovdiv."}
            </p>
          </div>

          <Link
            href="/order"
            className="btn btn-caramel order-online-btn"
            style={{ flexShrink: 0 }}
          >
            <IconShop />
            {lang === "bg" ? "Поръчай сега" : "Order Now"}
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .order-online-strip {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 18px !important;
          }
          .order-online-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
