"use client";
import type { PortableTextBlock } from "@/sanity/types";
import { langAtom } from "@/store/lang";
import { PortableText } from "@portabletext/react";
import { useAtomValue } from "jotai";

const ptComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p style={{ marginBottom: "1.4em" }}>{children}</p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2
        style={{
          fontFamily: "var(--font-head)",
          fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
          fontWeight: 700,
          color: "var(--plum)",
          marginTop: "2em",
          marginBottom: "0.6em",
          lineHeight: 1.25,
        }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3
        style={{
          fontFamily: "var(--font-head)",
          fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
          fontWeight: 600,
          color: "var(--plum)",
          marginTop: "1.8em",
          marginBottom: "0.5em",
          lineHeight: 1.3,
        }}
      >
        {children}
      </h3>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote
        style={{
          borderLeft: "4px solid var(--caramel)",
          background: "var(--plum-lt)",
          padding: "16px 24px",
          borderRadius: "0 var(--r-sm) var(--r-sm) 0",
          fontStyle: "italic",
          color: "var(--text-mid)",
          margin: "1.6em 0",
        }}
      >
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong style={{ fontWeight: 700, color: "var(--text)" }}>{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em style={{ fontStyle: "italic" }}>{children}</em>
    ),
    link: ({
      value,
      children,
    }: {
      value?: { href?: string };
      children?: React.ReactNode;
    }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "var(--caramel)",
          textDecoration: "underline",
          textUnderlineOffset: "3px",
        }}
      >
        {children}
      </a>
    ),
  },
};

export default function ArticleBody({
  bodyBg,
  bodyEn,
}: {
  bodyBg?: PortableTextBlock[];
  bodyEn?: PortableTextBlock[];
}) {
  const lang = useAtomValue(langAtom);
  const body = lang === "bg" ? bodyBg : (bodyEn || bodyBg);

  if (!body?.length) return null;

  return (
    <div
      style={{
        marginTop: "40px",
        fontSize: "1.05rem",
        lineHeight: 1.8,
        color: "var(--text)",
      }}
    >
      <PortableText value={body} components={ptComponents} />
    </div>
  );
}
