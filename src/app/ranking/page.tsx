"use client";
import React, { useEffect, useState } from "react";
import PersonItem from "./components/PersonItem";
import Link from "next/link";
import internalApi from "../api/apiContract";
import { GetRankingData } from "@/templates/myApi";

export default function Ranking() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<GetRankingData>([]);

  async function fetchPersonList() {
    const response = await internalApi.ranking.getRanking();

    const postList = response.data;

    postList.forEach(async (item, index) => {
      let base64Image = item.image;

      const uint8Array = new Uint8Array(
        atob(base64Image)
          .split("")
          .map((char) => char.charCodeAt(0))
      );

      const imageBlob = new Blob([uint8Array], { type: "image/jpeg" });

      item.image = URL.createObjectURL(imageBlob);
    });

    postList.sort((a, b) => {
      return b.points - a.points;
    });

    setPosts(postList);
    setLoading(false);
  }

  useEffect(() => {
    fetchPersonList();
  }, []);

  return (
    <>
      <body>
        <div className="bg-gray-900 mx-auto h-full">
          <Link href="/" className="m-5">
            <div className="p-1 border-2 w-fit rounded-md">Voltar</div>
          </Link>
          <div className="text-4xl text-bold text-center mb-4">Ranking!</div>
          <div className="flex flex-col">
            {loading &&
              Array.from({ length: 5 }, (_, index) => (
                <PersonItem
                  key={index}
                  name="Loading..."
                  place={index + 1}
                  url="/loading.webp"
                />
              ))}
            {posts.map((post, index) => (
              <PersonItem
                key={index}
                name={post.name}
                elo={post.points}
                place={index + 1}
                url={post.image}
              />
            ))}
          </div>
        </div>
      </body>
    </>
  );
}
