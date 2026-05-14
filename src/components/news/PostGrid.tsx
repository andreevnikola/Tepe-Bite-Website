"use client";
import type { NewsPost } from "@/sanity/types";
import { langAtom } from "@/store/lang";
import { useAtomValue } from "jotai";
import { useState } from "react";
import PostCard from "./PostCard";

export default function PostGrid({ posts }: { posts: NewsPost[] }) {
  const lang = useAtomValue(langAtom);
  const [visible, setVisible] = useState(6);

  return (
    <>
      <style>{`
        .post-grid-card {
          flex: 1 1 calc((100% - 56px) / 3);
          min-width: 260px;
        }
        @media (max-width: 900px) {
          .post-grid-card {
            flex: 1 1 calc((100% - 28px) / 2);
          }
        }
        @media (max-width: 600px) {
          .post-grid-card {
            flex: 1 1 100%;
          }
        }
      `}</style>

      <section className="section-spacing">
        <div className="section-inner">
          <div style={{ marginBottom: "40px" }}>
            <span className="label-tag">
              {lang === "bg" ? "ПО-СТАРИ ПУБЛИКАЦИИ" : "OLDER POSTS"}
            </span>
            <h2 className="heading-md" style={{ marginTop: "8px" }}>
              {lang === "bg" ? "Архив" : "Archive"}
            </h2>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "28px" }}>
            {posts.slice(0, visible).map((post) => (
              <div key={post._id} className="post-grid-card">
                <PostCard post={post} />
              </div>
            ))}
          </div>

          {visible < posts.length && (
            <div style={{ textAlign: "center", marginTop: "48px" }}>
              <button
                className="btn btn-secondary"
                onClick={() => setVisible((v) => v + 6)}
              >
                {lang === "bg" ? "Зареди още →" : "Load more →"}
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
