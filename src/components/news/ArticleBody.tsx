"use client";
import { langAtom } from "@/store/lang";
import { useAtomValue } from "jotai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ArticleBody({
  bodyBg,
  bodyEn,
}: {
  bodyBg?: string;
  bodyEn?: string;
}) {
  const lang = useAtomValue(langAtom);
  const body = lang === "bg" ? bodyBg : (bodyEn || bodyBg);

  if (!body?.trim()) return null;

  return (
    <>
      <style>{`
        .article-body { margin-top: 40px; font-size: 1.05rem; line-height: 1.8; color: var(--text); }
        .article-body p { margin-bottom: 1.4em; }
        .article-body h2 { font-family: var(--font-head); font-size: clamp(1.4rem, 3vw, 1.9rem); font-weight: 700; color: var(--plum); margin-top: 2em; margin-bottom: 0.6em; line-height: 1.25; }
        .article-body h3 { font-family: var(--font-head); font-size: clamp(1.1rem, 2.5vw, 1.4rem); font-weight: 600; color: var(--plum); margin-top: 1.8em; margin-bottom: 0.5em; line-height: 1.3; }
        .article-body h4 { font-family: var(--font-head); font-size: 1.1rem; font-weight: 600; color: var(--plum); margin-top: 1.5em; margin-bottom: 0.4em; }
        .article-body blockquote { border-left: 4px solid var(--caramel); background: var(--plum-lt); padding: 16px 24px; border-radius: 0 var(--r-sm) var(--r-sm) 0; font-style: italic; color: var(--text-mid); margin: 1.6em 0; }
        .article-body blockquote p { margin-bottom: 0; }
        .article-body strong { font-weight: 700; color: var(--text); }
        .article-body em { font-style: italic; }
        .article-body a { color: var(--caramel); text-decoration: underline; text-underline-offset: 3px; }
        .article-body a:hover { opacity: 0.8; }
        .article-body ul { list-style: disc; padding-left: 1.5em; margin-bottom: 1.4em; }
        .article-body ol { list-style: decimal; padding-left: 1.5em; margin-bottom: 1.4em; }
        .article-body li { margin-bottom: 0.4em; }
        .article-body hr { border: none; border-top: 2px solid var(--border); margin: 2em 0; }
        .article-body code { background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-size: 0.92em; font-family: monospace; }
        .article-body pre { background: var(--surface2); padding: 16px 20px; border-radius: var(--r-sm); overflow-x: auto; margin-bottom: 1.4em; }
        .article-body pre code { background: none; padding: 0; }
      `}</style>
      <div className="article-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
      </div>
    </>
  );
}
