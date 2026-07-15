"use client";
import { IconArrow, IconFb, IconInsta, IconLink, IconTiktok } from "@/components/icons";
import { SITE_INFO } from "@/lib/config/site-info";
import { langAtom } from "@/store/lang";
import { useAtomValue } from "jotai";
import Link from "next/link";

const socials = [
  {
    icon: <IconInsta />,
    label: "Instagram",
    handle: "@tepe.bite",
    href: SITE_INFO.social.instagram,
    hoverBg:
      "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
    disabled: false,
  },
  {
    icon: <IconTiktok />,
    label: "TikTok",
    handle: "@tepe.bite",
    href: SITE_INFO.social.tiktok,
    hoverBg: "#010101",
    disabled: false,
  },
  {
    icon: <IconFb />,
    label: "Facebook",
    handle: "ТЕПЕ bite",
    href: "",
    hoverBg: "#1877F2",
    disabled: true,
  },
];

export default function Community() {
  const lang = useAtomValue(langAtom);
  const bg = lang === "bg";

  return (
    <section
      className="section-spacing"
      style={{ background: "var(--surface2)" }}
    >
      <div className="section-inner">
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="section-divider" />
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {bg ? "Последвай ни" : "Follow Us"}
          </div>
          <h2 className="heading-lg" style={{ marginBottom: 0 }}>
            {bg ? "Следи пътя ни" : "Follow Our Journey"}
          </h2>
        </div>

        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          {/* Primary — the link hub */}
          <Link href="/links" className="community-hub">
            <span className="community-hub-icon">
              <IconLink />
            </span>
            <span className="community-hub-copy">
              <span className="community-hub-title">
                {bg ? "Всички наши връзки" : "All our links"}
              </span>
              <span className="community-hub-sub">
                {bg
                  ? "Поръчки, социални мрежи и инициативи — на едно място"
                  : "Orders, socials and initiatives — all in one place"}
              </span>
            </span>
            <span className="community-hub-arrow">
              <IconArrow />
            </span>
          </Link>

          {/* Secondary — individual socials */}
          <div className="socials-grid">
            {socials.map((s, i) => (
              <SocialChip key={i} {...s} bg={bg} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .community-hub {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 22px 24px;
          border-radius: var(--r-lg);
          background: linear-gradient(135deg, var(--plum), oklch(38% 0.1 320));
          color: #fff;
          text-decoration: none;
          box-shadow: 0 14px 40px oklch(32% 0.09 315 / 0.28);
          transition: transform 0.22s ease, box-shadow 0.22s ease;
          margin-bottom: 18px;
          position: relative;
          overflow: hidden;
        }
        .community-hub::after {
          content: "";
          position: absolute;
          top: -40%;
          right: -10%;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: oklch(66% 0.16 52 / 0.16);
          filter: blur(30px);
          pointer-events: none;
        }
        .community-hub:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 52px oklch(32% 0.09 315 / 0.36);
        }
        .community-hub-icon {
          width: 54px;
          height: 54px;
          flex-shrink: 0;
          border-radius: 16px;
          background: oklch(100% 0 0 / 0.14);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1;
        }
        .community-hub-icon svg { width: 24px; height: 24px; }
        .community-hub-copy { flex: 1; min-width: 0; line-height: 1.35; position: relative; z-index: 1; }
        .community-hub-title {
          display: block;
          font-family: var(--font-head);
          font-weight: 700;
          font-size: 1.25rem;
        }
        .community-hub-sub {
          display: block;
          font-size: 0.85rem;
          color: oklch(100% 0 0 / 0.82);
          margin-top: 2px;
        }
        .community-hub-arrow {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          border-radius: 50%;
          background: var(--caramel);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.22s ease;
          position: relative;
          z-index: 1;
        }
        .community-hub:hover .community-hub-arrow { transform: translateX(4px); }

        .socials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        @media (max-width: 560px) {
          .community-hub-sub { font-size: 0.8rem; }
          .community-hub-arrow { display: none; }
        }
      `}</style>
    </section>
  );
}

function SocialChip({
  icon,
  label,
  handle,
  href,
  hoverBg,
  disabled,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  handle: string;
  href: string;
  hoverBg: string;
  disabled: boolean;
  bg: boolean;
}) {
  return (
    <a
      href={disabled ? undefined : href}
      target={disabled ? undefined : "_blank"}
      rel={disabled ? undefined : "noopener noreferrer"}
      aria-disabled={disabled}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        padding: "18px 12px 14px",
        borderRadius: 20,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow)",
        textDecoration: "none",
        color: "var(--text)",
        transition: "transform 0.22s ease, box-shadow 0.22s ease",
        position: "relative",
        opacity: disabled ? 0.55 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        const el = e.currentTarget;
        el.style.transform = "translateY(-4px)";
        el.style.boxShadow = "var(--shadow-lg)";
        const wrap = el.querySelector(".social-icon-wrap") as HTMLElement;
        if (wrap) {
          wrap.style.background = hoverBg;
          wrap.style.color = "white";
        }
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = "";
        el.style.boxShadow = "var(--shadow)";
        const wrap = el.querySelector(".social-icon-wrap") as HTMLElement;
        if (wrap) {
          wrap.style.background = "var(--plum-lt)";
          wrap.style.color = "var(--plum)";
        }
      }}
    >
      <div
        className="social-icon-wrap"
        style={{
          width: 44,
          height: 44,
          borderRadius: 13,
          background: "var(--plum-lt)",
          color: "var(--plum)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.25s ease",
        }}
      >
        {icon}
      </div>
      <div style={{ textAlign: "center", lineHeight: 1.25 }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: "0.9rem",
            color: "var(--plum)",
            fontFamily: "var(--font-head)",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: "0.72rem",
            color: "var(--text-soft)",
            marginTop: 2,
          }}
        >
          {disabled ? (bg ? "Очаквайте" : "Soon") : handle}
        </div>
      </div>
    </a>
  );
}
