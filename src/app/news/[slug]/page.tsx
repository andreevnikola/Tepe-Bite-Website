import ArticleBody from "@/components/news/ArticleBody";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { urlFor } from "@/sanity/image";
import { getAllNewsSlugs, getNewsPostBySlug } from "@/sanity/queries";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const slugs = await getAllNewsSlugs();
    return slugs.map((s) => ({ slug: s.slug.current }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getNewsPostBySlug(slug);
    if (!post) return {};
    return {
      title: `${post.titleBg} | ТЕПЕ bite`,
      description: post.excerptBg || post.titleBg,
      openGraph: {
        title: `${post.titleBg} | ТЕПЕ bite`,
        description: post.excerptBg || post.titleBg,
        images: post.image ? [{ url: urlFor(post.image).width(1200).url() }] : [],
        type: "article",
        publishedTime: post.publishedAt,
      },
    };
  } catch {
    return {};
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getNewsPostBySlug(slug);

  if (!post) notFound();

  const imageUrl = urlFor(post.image).width(1400).url();

  return (
    <>
      <Nav />
      <main>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "clamp(320px, 50vw, 560px)",
            overflow: "hidden",
            background: "var(--plum)",
          }}
        >
          <Image
            src={imageUrl}
            alt={post.image.altBg || post.titleBg}
            fill
            style={{ objectFit: "cover", opacity: 0.7 }}
            priority
            sizes="100vw"
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(32,22,42,0.85) 0%, rgba(32,22,42,0.2) 60%, transparent 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "100%",
              maxWidth: "720px",
              padding: "0 24px",
            }}
          >
            <span
              className="label-tag"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              {new Date(post.publishedAt).toLocaleDateString("bg-BG", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <h1
              className="heading-lg"
              style={{ color: "white", marginTop: "10px" }}
            >
              {post.titleBg}
            </h1>
          </div>
        </div>

        <div
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            padding: "clamp(32px, 5vw, 56px) clamp(20px, 5vw, 24px) clamp(64px, 8vw, 120px)",
          }}
        >
          <Link
            href="/news"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.88rem",
              fontWeight: 600,
              color: "var(--text-mid)",
              textDecoration: "none",
              marginBottom: "32px",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--caramel)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-mid)")
            }
          >
            ← Всички новини
          </Link>

          <ArticleBody bodyBg={post.bodyBg} bodyEn={post.bodyEn} />
        </div>
      </main>
      <Footer />
    </>
  );
}
