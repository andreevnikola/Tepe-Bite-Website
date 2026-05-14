"use client";
import { urlFor } from "@/sanity/image";
import type { NewsPost } from "@/sanity/types";
import { langAtom } from "@/store/lang";
import { useAtomValue } from "jotai";
import Image from "next/image";
import Link from "next/link";

export default function NewsStrip({ posts }: { posts: NewsPost[] }) {
  const lang = useAtomValue(langAtom);

  return (
    <>
      <style>{`
        .news-strip-scroll {
          overflow-x: auto;
          overflow-y: visible;
          padding: 8px clamp(20px, 5vw, 80px) 12px;
          scrollbar-width: thin;
          scrollbar-color: oklch(66% 0.16 52 / 0.1) transparent;
        }
        .news-strip-scroll::-webkit-scrollbar {
          height: 3px;
        }
        .news-strip-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .news-strip-scroll::-webkit-scrollbar-thumb {
          background: oklch(66% 0.16 52 / 0.1);
          border-radius: 10px;
        }
        .news-strip-row {
          display: flex;
          flex-wrap: nowrap;
          gap: 14px;
          align-items: stretch;
          width: max-content;
        }
        .news-strip-card-img {
          position: relative;
          padding-top: 60%;
          overflow: hidden;
          background: var(--surface2);
          border-radius: var(--r-sm) var(--r-sm) 0 0;
        }
      `}</style>

      <section
        style={{
          padding: "clamp(24px, 3.5vw, 40px) 0",
          background: "var(--plum-lt)",
        }}
      >
        <div className="news-strip-scroll">
          <div className="news-strip-row">
            {/* Heading */}
            <div
              style={{
                flexShrink: 0,
                width: "160px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingRight: "8px",
                overflow: "visible",
                position: "relative",
              }}
            >
              <span className="label-tag">
                {lang === "bg" ? "НОВИНИ" : "NEWS"}
              </span>
              <div
                style={{
                  width: "32px",
                  height: "3px",
                  background: "var(--caramel)",
                  borderRadius: "2px",
                  margin: "10px 0 12px",
                }}
              />
              <p
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "var(--plum)",
                  lineHeight: 1.3,
                }}
              >
                {lang === "bg" ? "Последно от нас:" : "Latest from us:"}
              </p>
            </div>

            {/* News cards */}
            {posts.map((post) => {
              const title =
                lang === "bg" ? post.titleBg : post.titleEn || post.titleBg;
              const alt =
                lang === "bg"
                  ? post.image.altBg
                  : post.image.altEn || post.image.altBg;
              const date = new Date(post.publishedAt).toLocaleDateString(
                lang === "bg" ? "bg-BG" : "en-GB",
                { day: "numeric", month: "short", year: "numeric" },
              );
              const isNew =
                Date.now() - new Date(post.publishedAt).getTime() <
                14 * 24 * 60 * 60 * 1000;

              return (
                <Link
                  key={post._id}
                  href={`/news/${post.slug.current}`}
                  className="card card-hover shadow-none!"
                  style={{
                    flexShrink: 0,
                    width: "310px",
                    maxWidth: "65vw",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <div className="news-strip-card-img">
                    <Image
                      src={urlFor(post.image).width(420).url()}
                      alt={alt || title}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="210px"
                    />
                    {isNew && (
                      <span
                        style={{
                          position: "absolute",
                          top: "10px",
                          left: "10px",
                          zIndex: 2,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          background: "var(--caramel)",
                          color: "white",
                          fontSize: "0.62rem",
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          padding: "3px 9px",
                          borderRadius: "100px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        }}
                      >
                        <span
                          style={{
                            width: "5px",
                            height: "5px",
                            borderRadius: "50%",
                            background: "white",
                            flexShrink: 0,
                          }}
                        />
                        {lang === "bg" ? "Ново" : "New"}
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      padding: "12px 14px 14px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      flexGrow: 1,
                    }}
                  >
                    <span className="label-tag" style={{ fontSize: "0.65rem" }}>
                      {date}
                    </span>
                    <p
                      style={{
                        fontFamily: "var(--font-head)",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        color: "var(--plum)",
                        lineHeight: 1.35,
                        marginTop: "2px",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {title}
                    </p>
                  </div>
                </Link>
              );
            })}

            {/* View all */}
            <Link
              href="/news"
              className="card card-hover"
              style={{
                flexShrink: 0,
                width: "120px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                gap: "10px",
                padding: "16px 12px",
                background: "var(--plum)",
                border: "none",
                textAlign: "center",
              }}
            >
              <span
                style={{
                  fontSize: "1.4rem",
                  color: "var(--caramel)",
                  lineHeight: 1,
                }}
              >
                →
              </span>
              <span
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "white",
                  lineHeight: 1.3,
                }}
              >
                {lang === "bg" ? "Всички новини" : "All news"}
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
