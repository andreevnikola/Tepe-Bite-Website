"use client";
import { urlFor } from "@/sanity/image";
import type { NewsPost } from "@/sanity/types";
import { langAtom } from "@/store/lang";
import { useAtomValue } from "jotai";
import Image from "next/image";
import Link from "next/link";

export default function PostCard({ post }: { post: NewsPost }) {
  const lang = useAtomValue(langAtom);

  const title = lang === "bg" ? post.titleBg : (post.titleEn || post.titleBg);
  const excerpt = lang === "bg" ? post.excerptBg : (post.excerptEn || post.excerptBg);
  const alt = lang === "bg" ? post.image.altBg : (post.image.altEn || post.image.altBg);
  const date = new Date(post.publishedAt).toLocaleDateString(
    lang === "bg" ? "bg-BG" : "en-GB",
    { day: "numeric", month: "long", year: "numeric" }
  );
  const isNew =
    Date.now() - new Date(post.publishedAt).getTime() <
    14 * 24 * 60 * 60 * 1000;

  return (
    <Link
      href={`/news/${post.slug.current}`}
      className="card card-hover"
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          position: "relative",
          paddingTop: "56.25%",
          overflow: "hidden",
          background: "var(--surface2)",
        }}
      >
        <Image
          src={urlFor(post.image).width(600).url()}
          alt={alt || title}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
        />
        {isNew && (
          <span
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              zIndex: 2,
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              background: "var(--caramel)",
              color: "white",
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "4px 10px",
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
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          flexGrow: 1,
        }}
      >
        <span className="label-tag" style={{ fontSize: "0.7rem" }}>
          {date}
        </span>

        <p
          style={{
            fontFamily: "var(--font-head)",
            fontSize: "1.1rem",
            fontWeight: 600,
            color: "var(--plum)",
            lineHeight: 1.3,
            marginTop: "4px",
          }}
        >
          {title}
        </p>

        {excerpt && (
          <p
            style={{
              fontSize: "0.88rem",
              color: "var(--text-soft)",
              lineHeight: 1.65,
              marginTop: "4px",
              flexGrow: 1,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {excerpt}
          </p>
        )}

        <span
          style={{
            marginTop: "auto",
            paddingTop: "12px",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "var(--caramel)",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {lang === "bg" ? "Прочети →" : "Read →"}
        </span>
      </div>
    </Link>
  );
}
