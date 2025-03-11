import React from "react";
import Image from "next/image";

interface PersonItemProps {
  name: string;
  place: number;
  elo?: number;
  url: string;
}

export default function PersonItem({
  name,
  place,
  url,
  elo = -1,
}: PersonItemProps) {
  return (
    <>
      <div className="flex min-w-[75%] p-4 mx-auto text-center bg-gray-700 rounded-md m-1">
        <div className="border-4 rounded-sm">
          <Image src={url} width={150} height={150} alt="test" />
        </div>

        <div className="text-left ml-5">
          <div className="font-bold">{place}° Lugar!</div>

          <div className="mt-12">{name}</div>
          <div className="mt-4">{elo === -1 ? "" : elo}</div>
        </div>
      </div>
    </>
  );
}
