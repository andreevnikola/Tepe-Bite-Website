"use client";
import { IconFb, IconInsta, IconLink, IconTiktok } from "@/components/icons";
import { langAtom } from "@/store/lang";
import { useAtomValue } from "jotai";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const lang = useAtomValue(langAtom);

  const navLinks =
    lang === "bg"
      ? [
          ["/", "Начало"],
          ["/#produkt", "Продуктът"],
          ["/initiatives", "Нашите инициативи"],
          ["/#za-nas", "За нас"],
        ]
      : [
          ["/", "Home"],
          ["/#produkt", "The Product"],
          ["/initiatives", "Our Initiatives"],
          ["/#za-nas", "About"],
        ];

  const legalLinks: [string, string][] =
    lang === "bg"
      ? [
          ["/legal", "Правна информация"],
          ["/legal/terms", "Общи условия"],
          ["/legal/privacy", "Поверителност"],
          ["/legal/cookies", "Бисквитки"],
          ["/legal/delivery-payment", "Доставка и плащане"],
          ["/legal/returns-complaints", "Връщане и рекламации"],
          ["/legal/trader-info", "Данни за търговеца"],
        ]
      : [
          ["/legal", "Legal Center"],
          ["/legal/terms", "Terms"],
          ["/legal/privacy", "Privacy"],
          ["/legal/cookies", "Cookies"],
          ["/legal/delivery-payment", "Delivery & Payment"],
          ["/legal/returns-complaints", "Returns & Complaints"],
          ["/legal/trader-info", "Trader Info"],
        ];

  const linkStyle = {
    display: "block",
    color: "oklch(82% 0.04 310)",
    fontSize: "0.9rem",
    textDecoration: "none",
    marginBottom: 10,
    transition: "color 0.2s",
  } as React.CSSProperties;

  return (
    <footer
      style={{
        background: "var(--plum)",
        color: "white",
        padding: "clamp(48px, 6vw, 80px) clamp(20px, 5vw, 80px) 32px",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(200px, 2fr) repeat(2, minmax(140px, 1fr))",
            gap: "clamp(32px, 4vw, 60px)",
            marginBottom: 56,
          }}
          className="footer-grid"
        >
          {/* Brand column */}
          <div>
            <div style={{ marginBottom: 20 }}>
              <Image
                src="/logo-full.png"
                alt="ТЕПЕ bite"
                width={120}
                height={120}
                style={{
                  height: 120,
                  width: "auto",
                  display: "block",
                  filter: "brightness(0) invert(1)",
                  opacity: 0.9,
                  margin: "-26px -16px -10px -16px",
                }}
              />
            </div>
            <p
              style={{
                color: "oklch(78% 0.04 310)",
                fontSize: "0.9rem",
                maxWidth: 240,
                lineHeight: 1.65,
              }}
            >
              {lang === "bg"
                ? "Барче с характер, вдъхновено от Пловдив и създадено с мисия."
                : "A bar with character, inspired by Plovdiv and created with purpose."}
            </p>
            <div
              style={{
                marginTop: 20,
                fontSize: "0.82rem",
                color: "oklch(65% 0.04 310)",
              }}
            >
              <div style={{ marginBottom: 2, fontSize: "0.6rem" }}>
                {lang === "bg"
                  ? "Произведено в с. Брестовица,  обласат Пловдив"
                  : "Made in Brestovitsa, Plovdiv Region"}
              </div>
              <div>
                {lang === "bg" ? "Производител: " : "Manufacturer: "}
                <a
                  href="https://biostyle.bg/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--caramel)", textDecoration: "none" }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.textDecoration =
                      "underline")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.textDecoration = "none")
                  }
                >
                  BioStyle Ltd. ↗
                </a>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div
              style={{
                fontWeight: 600,
                fontSize: "0.8rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "oklch(65% 0.05 310)",
                marginBottom: 18,
              }}
            >
              {lang === "bg" ? "Навигация" : "Navigation"}
            </div>
            {navLinks.map(([href, label]) => (
              <a
                key={href + label}
                href={href}
                style={linkStyle}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = "white")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color =
                    "oklch(82% 0.04 310)")
                }
              >
                {label}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div
              style={{
                fontWeight: 600,
                fontSize: "0.8rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "oklch(65% 0.05 310)",
                marginBottom: 18,
              }}
            >
              {lang === "bg" ? "Контакт" : "Contact"}
            </div>
            <a
              href="mailto:tepe@mail.bg"
              style={{
                ...linkStyle,
                marginBottom: 15,
                marginTop: -5,
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color = "white")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color = "oklch(82% 0.04 310)")
              }
            >
              tepe@mail.bg
            </a>

            {/* Social icons */}
            <div
              className="min-w-fit"
              style={{ display: "flex", gap: 19, marginBottom: 24 }}
            >
              {[
                {
                  icon: <IconInsta />,
                  link: "https://www.instagram.com/tepe.bite/",
                  available: true,
                },
                {
                  icon: <IconTiktok />,
                  link: "https://www.tiktok.com/@tepe.bite",
                  available: true,
                },
                {
                  icon: <IconFb />,
                  link: "",
                  available: false,
                },
              ].map(({ icon, link, available }, i) => (
                <Link
                  key={i}
                  href={link}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "oklch(40% 0.07 315)",
                    color: "white",
                    transition: "background 0.2s",
                  }}
                  className={
                    available
                      ? "hover:bg-(--caramel)!"
                      : "cursor-not-allowed opacity-50"
                  }
                >
                  {icon}
                </Link>
              ))}
            </div>

            {/* Link tree */}
            <div
              className="w-fit"
              style={{
                paddingTop: 0,
                marginTop: -15,
              }}
            >
              <a
                href="https://tinyurl.com/tepebite"
                target="_blank"
                className="whitespace-nowrap"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  padding: "10px 0",
                  color: "var(--caramel)",
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "color 0.2s",
                  fontSize: 13,
                  gap: 4,
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color =
                    "oklch(75% 0.14 52)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color =
                    "var(--caramel)")
                }
              >
                <IconLink />
                {lang === "bg" ? "Разгледай още от нас" : "See more from us"}
              </a>
            </div>
          </div>
        </div>

        {/* Legal links row */}
        <div
          style={{
            borderTop: "1px solid oklch(38% 0.06 315)",
            paddingTop: 20,
            paddingBottom: 20,
            display: "flex",
            flexWrap: "wrap",
            gap: "8px 20px",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: "0.72rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "oklch(50% 0.04 315)",
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {lang === "bg" ? "Правна информация" : "Legal"}
          </span>
          {legalLinks.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              style={{
                color: "oklch(68% 0.04 310)",
                fontSize: "0.78rem",
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition: "color 0.2s",
              }}
              className="footer-legal-link"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid oklch(42% 0.06 315)",
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <span
            style={{
              fontSize: "0.82rem",
              color: "oklch(60% 0.04 310)",
              fontWeight: 600,
            }}
          >
            © 2026 ТЕПЕ bite · Баир ЕООД
          </span>
          <span
            style={{
              fontSize: "0.82rem",
              color: "oklch(60% 0.04 310)",
              fontWeight: 600,
            }}
          >
            {lang === "bg"
              ? "Направено с любов в Пловдив"
              : "Made with love in Plovdiv"}
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .footer-legal-link:hover {
          color: white !important;
        }
      `}</style>
    </footer>
  );
}
