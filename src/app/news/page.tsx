import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import FeaturedPost from "@/components/news/FeaturedPost";
import NewsHero from "@/components/news/NewsHero";
import PostGrid from "@/components/news/PostGrid";
import { getAllNewsPosts } from "@/sanity/queries";
import {
  contentMeta,
  getRequestLang,
  languageAlternates,
  ogLocale,
} from "@/lib/i18n/metadata";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getRequestLang();
  const en = lang === "en";
  const title = en ? "News | ТЕПЕ bite" : "Новини | ТЕПЕ bite";
  const description = en
    ? "Follow every step of our journey — campaign progress, event appearances and meeting the community. Transparency above all."
    : "Следете всяка стъпка от пътя ни — прогрес на кампанията, участия на събития и срещи с общността. Прозрачност преди всичко.";
  return {
    title,
    description,
    keywords: [
      "ТЕПЕ bite",
      en ? "news" : "новини",
      en ? "campaign" : "кампания",
      en ? "transparency" : "прозрачност",
      "Пловдив",
    ],
    alternates: languageAlternates("/news"),
    openGraph: {
      title,
      description: en
        ? "Follow every step of our journey — campaign progress, event appearances and meeting the community."
        : "Следете всяка стъпка от пътя ни — прогрес на кампанията, участия на събития и срещи с общността.",
      type: "website",
      locale: ogLocale(lang),
    },
    other: contentMeta(lang, "page", { topic: "news" }),
  };
}

export default async function NewsPage() {
  const posts = await getAllNewsPosts();

  return (
    <>
      <Nav />
      <main>
        <NewsHero />
        {posts.length > 0 && (
          <>
            <FeaturedPost post={posts[0]} />
            {posts.length > 1 && <PostGrid posts={posts.slice(1)} />}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
