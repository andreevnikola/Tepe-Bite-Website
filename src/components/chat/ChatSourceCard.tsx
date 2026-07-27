"use client";

import Image from "next/image";
import Link from "next/link";
import { SITE_URL } from "@/lib/config/site-info";
import type { SourceCard } from "@/lib/chat/types";
import type { Lang } from "@/store/lang";
import { CHAT_COPY, PAGE_TYPE_LABELS, say } from "./copy";
import { HillMark } from "./ChatLauncher";

/**
 * One trusted source, rendered in the ТЕПЕ bite card language.
 *
 * The only URL this component will ever render is `card.url`, which the server
 * resolved from an application-assigned source id. Nothing is ever derived from
 * the answer text, so a hallucinated citation cannot become a clickable link.
 */

/** Hosts `next/image` is configured for, plus our own. Anything else is dropped. */
const OPTIMISABLE_HOSTS = /(^|\.)(sanity\.io|ufs\.sh|utfs\.io|picsum\.photos)$/;

let siteHost = "";
try {
  siteHost = new URL(SITE_URL).host;
} catch {
  siteHost = "";
}

type Target =
  | { internal: true; href: string }
  | { internal: false; href: string };

/** Splits a server-supplied URL into a same-site path or an external link. */
function resolveTarget(rawUrl: string): Target | null {
  try {
    const url = new URL(rawUrl, SITE_URL);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (url.host === siteHost) {
      // Same-site links stay in-tab and keep working on any deployment host,
      // including local development where the indexed URL is the live domain.
      return { internal: true, href: `${url.pathname}${url.search}` };
    }
    return { internal: false, href: url.toString() };
  } catch {
    return null;
  }
}

/**
 * `next/image` throws on an unconfigured remote host, which would take the whole
 * chat down. Only a host we know the config allows earns an image.
 */
function resolveImage(raw: string | null): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw, SITE_URL);
    if (url.host === siteHost) return `${url.pathname}${url.search}`;
    if (OPTIMISABLE_HOSTS.test(url.host)) return url.toString();
    return null;
  } catch {
    return null;
  }
}

export default function ChatSourceCard({
  card,
  lang,
}: {
  card: SourceCard;
  lang: Lang;
}) {
  const target = resolveTarget(card.url);
  if (!target) return null;

  const image = resolveImage(card.image);
  const typeLabel = card.pageType ? PAGE_TYPE_LABELS[card.pageType] : null;
  const cta =
    card.role === "cited" ? CHAT_COPY.sourceCited : CHAT_COPY.sourceLearnMore;

  const inner = (
    <>
      <span className="tb-src-thumb" aria-hidden="true">
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            sizes="60px"
            style={{ objectFit: "cover" }}
          />
        ) : (
          // Style-guide placeholder: plum → caramel gradient with the hill mark.
          <span className="tb-src-thumb-fallback">
            <HillMark size={22} />
          </span>
        )}
      </span>

      <span className="tb-src-body">
        {typeLabel ? (
          <span className="label-tag tb-src-type">{say(lang, typeLabel)}</span>
        ) : null}
        <span className="tb-src-title">{card.title}</span>
        {card.description ? (
          <span className="tb-src-desc">{card.description}</span>
        ) : null}
        <span className="tb-src-cta">
          {say(lang, cta)}
          <span aria-hidden="true">{target.internal ? " →" : " ↗"}</span>
        </span>
      </span>
    </>
  );

  const className = "card card-hover tb-src";

  return (
    <>
      {target.internal ? (
        <Link href={target.href} className={className}>
          {inner}
        </Link>
      ) : (
        <a
          href={target.href}
          className={className}
          target="_blank"
          rel="noopener noreferrer"
        >
          {inner}
        </a>
      )}

      <style>{`
        .tb-src {
          display: flex;
          align-items: stretch;
          gap: 12px;
          padding: 10px;
          border-radius: var(--r-md);
          text-decoration: none;
          overflow: hidden;
        }
        .tb-src:focus-visible {
          outline: 3px solid var(--caramel);
          outline-offset: 2px;
        }
        .tb-src-thumb {
          position: relative;
          flex: 0 0 60px;
          width: 60px;
          height: 60px;
          border-radius: var(--r-sm);
          overflow: hidden;
          background: var(--surface2);
        }
        .tb-src-thumb-fallback {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(140deg, var(--plum), var(--caramel));
          color: #fff;
          opacity: 0.9;
        }
        .tb-src-body {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
          flex: 1;
        }
        .tb-src-type {
          font-size: 0.62rem;
          letter-spacing: 0.1em;
          line-height: 1.4;
        }
        .tb-src-title {
          font-family: var(--font-head);
          font-size: 0.95rem;
          font-weight: 600;
          line-height: 1.25;
          color: var(--plum);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .tb-src-desc {
          font-size: 0.78rem;
          line-height: 1.45;
          color: var(--text-soft);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .tb-src-cta {
          margin-top: 3px;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--caramel);
        }
        @media (prefers-reduced-motion: reduce) {
          .tb-src { transition: none; }
        }
      `}</style>
    </>
  );
}
