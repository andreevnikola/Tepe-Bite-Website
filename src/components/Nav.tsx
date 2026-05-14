"use client";
import CartNavIcon from "@/components/cart/CartNavIcon";
import { IconArrow, IconClose, IconMenu, IconShop } from "@/components/icons";
import { LANG_COOKIE, langAtom, type Lang } from "@/store/lang";
import { useAtom } from "jotai";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Nav() {
  const [lang, setLang] = useAtom(langAtom);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isLegal = pathname.startsWith("/legal");
  const isStudio = pathname.startsWith("/studio");
  const isLocationDetail = /^\/partnering-locations\/.+/.test(pathname);
  const isNewsDetail = /^\/news\/.+/.test(pathname);

  if (isStudio) return null;

  // Prefix for hash-anchor links: empty on home (stays on page), '/' on other pages
  const p = isHome ? "" : "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const setLangCookie = (value: Lang) => {
    if (typeof document === "undefined") return;
    document.cookie = `${LANG_COOKIE}=${encodeURIComponent(
      value,
    )}; path=/; max-age=31536000; samesite=lax`;
  };

  const handleLangChange = (value: Lang) => {
    setLang(value);
    setLangCookie(value);
  };

  const navLinks: [string, string][] =
    lang === "bg"
      ? [
          ["/", "Начало"],
          ["/product", "Продуктът"],
          ["/initiatives", "Нашите инициативи"],
          ["/partnering-locations", "Партниращи обекти"],
          ["/news", "Новини"],
        ]
      : [
          ["/", "Home"],
          ["/product", "The Product"],
          ["/initiatives", "Our Initiatives"],
          ["/partnering-locations", "Partnering Locations"],
          ["/news", "News"],
        ];

  const isActive = (href: string) => {
    if (href === "/") return isHome;
    if (href === "/product") return pathname === "/product";
    if (href === "/initiatives") return pathname === "/initiatives";
    if (href === "/partnering-locations")
      return pathname.startsWith("/partnering-locations");
    if (href === "/news") return pathname === "/news";
    return false;
  };

  return (
    <header
      id="nav-root"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        viewTransitionName: "site-header",
        background:
          scrolled || isLegal || isLocationDetail || isNewsDetail
            ? "oklch(99% 0.008 75 / 0.96)"
            : "transparent",
        backdropFilter:
          scrolled || isLegal || isLocationDetail || isNewsDetail ? "blur(16px)" : "none",
        WebkitBackdropFilter:
          scrolled || isLegal || isLocationDetail || isNewsDetail ? "blur(16px)" : "none",
        boxShadow:
          scrolled || isLegal || isLocationDetail || isNewsDetail
            ? "0 1px 0 oklch(90% 0.02 80)"
            : "none",
        transition: "all 0.3s ease",
      }}
    >
      <nav
        style={{ padding: "0 clamp(20px, 4vw, 60px)" }}
        aria-label="Главна навигация"
      >
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            height: 72,
            gap: 32,
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
            }}
          >
            <Image
              src="/logo-nav.png"
              alt="ТЕПЕ bite лого"
              width={38}
              height={38}
              style={{ height: 38, width: "auto", display: "block" }}
            />
            <span
              style={{
                display: "flex",
                flexDirection: "column",
                lineHeight: 1,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  fontSize: "0.62rem",
                  letterSpacing: "0.14em",
                  color: "var(--caramel)",
                  textTransform: "uppercase",
                }}
              >
                bite
              </span>
              <span
                style={{
                  fontFamily: "var(--font-head)",
                  fontWeight: 700,
                  fontSize: "1.25rem",
                  color: "var(--plum)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.05,
                }}
              >
                ТЕПЕ
              </span>
            </span>
          </Link>

          {/* Desktop links */}
          <div
            className="desktop-nav"
            style={{
              display: "flex",
              gap: 28,
              marginLeft: "auto",
              alignItems: "center",
            }}
          >
            {navLinks.map(([href, label]) => {
              const active = isActive(href);
              return (
                <Link
                  key={href + label}
                  href={href}
                  style={{
                    textDecoration: "none",
                    color: active ? "var(--plum)" : "var(--text-mid)",
                    fontSize: "0.9rem",
                    fontWeight: active ? 700 : 500,
                    transition: "color 0.2s",
                    position: "relative",
                    paddingBottom: 2,
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--plum)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = active
                      ? "var(--plum)"
                      : "var(--text-mid)")
                  }
                >
                  {label}
                  {active && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: -2,
                        left: 0,
                        right: 0,
                        height: 2,
                        background: "var(--caramel)",
                        borderRadius: 10,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right group: Lang switcher, Cart, CTA — desktop */}
          <div
            className="desktop-nav"
            style={{
              display: "flex",
              gap: 30,
              alignItems: "center",
            }}
          >
            {/* Lang switcher — desktop */}
            <div
              style={{
                display: "flex",
                gap: 4,
                padding: "4px 8px",
                background: "var(--surface2)",
                borderRadius: 100,
                fontSize: "0.8rem",
                fontWeight: 600,
              }}
            >
              {(["bg", "en"] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => handleLangChange(l)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 100,
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "0.78rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    background: lang === l ? "var(--plum)" : "transparent",
                    color: lang === l ? "white" : "var(--text-soft)",
                    transition: "all 0.2s",
                  }}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Cart icon — desktop */}
            <CartNavIcon />

            {/* CTA — desktop */}
            <Link
              href="/order"
              className="btn btn-primary"
              style={{
                fontSize: "0.88rem",
                padding: "11px 22px",
                cursor: "pointer",
              }}
            >
              {lang === "bg" ? "Поръчай" : "Order"} <IconArrow />
            </Link>
          </div>

          {/* Mobile right group */}
          <div
            style={{
              display: "none",
              marginLeft: "auto",
              alignItems: "center",
              gap: 12,
            }}
            className="hamburger"
          >
            {/* Lang switcher mobile */}
            <div
              style={{
                display: "flex",
                gap: 4,
                padding: "4px 8px",
                background: "var(--surface2)",
                borderRadius: 100,
              }}
            >
              {(["bg", "en"] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => handleLangChange(l)}
                  style={{
                    padding: "3px 8px",
                    borderRadius: 100,
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "0.72rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    background: lang === l ? "var(--plum)" : "transparent",
                    color: lang === l ? "white" : "var(--text-soft)",
                    transition: "all 0.2s",
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
            <CartNavIcon />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Затвори меню" : "Отвори меню"}
              aria-expanded={mobileOpen}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--plum)",
                padding: 4,
                display: "flex",
              }}
            >
              {mobileOpen ? <IconClose /> : <IconMenu />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            style={{
              background: "var(--surface)",
              padding: "20px clamp(20px, 4vw, 60px) 28px",
              borderTop: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {navLinks.map(([href, label]) => {
              const active = isActive(href);
              return (
                <Link
                  key={href + label}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    textDecoration: "none",
                    color: active ? "var(--plum)" : "var(--text-mid)",
                    fontSize: "1.1rem",
                    fontWeight: active ? 700 : 500,
                    padding: "8px 0",
                    cursor: "pointer",
                    position: "relative",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--plum)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = active
                      ? "var(--plum)"
                      : "var(--text-mid)")
                  }
                >
                  {label}
                </Link>
              );
            })}
            <Link
              href="/legal"
              onClick={() => setMobileOpen(false)}
              style={{
                textDecoration: "none",
                color: "var(--text-soft)",
                fontSize: "0.95rem",
                fontWeight: 500,
                padding: "8px 0",
                borderTop: "1px solid var(--border)",
                marginTop: 4,
                paddingTop: 16,
              }}
            >
              {lang === "bg" ? "Правна информация" : "Legal"}
            </Link>
            <Link
              href="/order"
              onClick={() => setMobileOpen(false)}
              className="btn btn-primary"
              style={{
                marginTop: 8,
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <IconShop />
              {lang === "bg" ? "Поръчай" : "Order"}
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
