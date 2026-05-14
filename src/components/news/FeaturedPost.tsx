"use client";
import { urlFor } from "@/sanity/image";
import type { NewsPost } from "@/sanity/types";
import { langAtom } from "@/store/lang";
import { useAtomValue } from "jotai";
import Image from "next/image";
import Link from "next/link";

export default function FeaturedPost({ post }: { post: NewsPost }) {
  const lang = useAtomValue(langAtom);

  const title = lang === "bg" ? post.titleBg : post.titleEn || post.titleBg;
  const excerpt =
    lang === "bg" ? post.excerptBg : post.excerptEn || post.excerptBg;
  const alt =
    lang === "bg" ? post.image.altBg : post.image.altEn || post.image.altBg;
  const date = new Date(post.publishedAt).toLocaleDateString(
    lang === "bg" ? "bg-BG" : "en-GB",
    { day: "numeric", month: "long", year: "numeric" },
  );
  const isNew =
    Date.now() - new Date(post.publishedAt).getTime() <
    14 * 24 * 60 * 60 * 1000;

  return (
    <>
      <style>{`
        .featured-card {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 0;
          overflow: hidden;
          border-radius: var(--r-lg);
        }
        .featured-image {
          position: relative;
          overflow: hidden;
        }
        @media (max-width: 900px) {
          .featured-card {
            grid-template-columns: 1fr;
          }
          .featured-image {
            height: 280px;
          }
        }
      `}</style>

      <section className="section-spacing -mt-20">
        <div className="section-inner">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "3px",
                background: "var(--caramel)",
                borderRadius: "2px",
                flexShrink: 0,
              }}
            />
            <span className="label-tag">
              {lang === "bg" ? "ПОСЛЕДНА НОВИНА" : "LATEST NEWS"}
            </span>
            <div
              style={{
                width: "32px",
                height: "3px",
                background: "var(--caramel)",
                borderRadius: "2px",
                flexShrink: 0,
              }}
            />
          </div>

          <div className="card featured-card">
            <div className="featured-image">
              <Image
                src={urlFor(post.image).width(900).url()}
                alt={alt || title}
                fill
                style={{ objectFit: "cover", height: "100%", width: "100%" }}
                sizes="auto"
              />
              {isNew && (
                <span
                  style={{
                    position: "absolute",
                    top: "16px",
                    left: "16px",
                    zIndex: 2,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "var(--caramel)",
                    color: "white",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "5px 12px",
                    borderRadius: "100px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.18)",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
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
                padding: "40px 44px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "16px",
                background: "var(--surface)",
              }}
            >
              <span className="label-tag">{date}</span>

              <h2 className="heading-lg" style={{ marginTop: "4px" }}>
                {title}
              </h2>

              {excerpt && (
                <p
                  style={{
                    color: "var(--text-mid)",
                    lineHeight: 1.75,
                    fontSize: "1rem",
                    flexGrow: 1,
                  }}
                >
                  {excerpt}
                </p>
              )}

              <Link
                href={`/news/${post.slug.current}`}
                className="btn btn-primary"
                style={{ marginTop: "8px", alignSelf: "flex-start" }}
              >
                {lang === "bg" ? "Прочети повече →" : "Read more →"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
