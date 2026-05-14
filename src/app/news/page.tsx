import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import FeaturedPost from "@/components/news/FeaturedPost";
import NewsHero from "@/components/news/NewsHero";
import PostGrid from "@/components/news/PostGrid";
import { getAllNewsPosts } from "@/sanity/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Новини | ТЕПЕ bite",
  description:
    "Следете всяка стъпка от пътя ни — прогрес на кампанията, участия на събития и срещи с общността. Прозрачност преди всичко.",
  keywords: ["ТЕПЕ bite", "новини", "кампания", "прозрачност", "Пловдив"],
  openGraph: {
    title: "Новини | ТЕПЕ bite",
    description:
      "Следете всяка стъпка от пътя ни — прогрес на кампанията, участия на събития и срещи с общността.",
    type: "website",
  },
  alternates: {
    languages: {
      bg: "/news",
      en: "/news",
    },
  },
};

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
