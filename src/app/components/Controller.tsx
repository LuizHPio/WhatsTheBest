"use client";
import React, { useEffect, useState } from "react";
import Overlay from "./Overlay";
import Person from "@/classes/Person";
import Image from "next/image";
import internalApi from "../api/apiContract";
import { StartDuelData } from "@/templates/myApi";

function Controller() {
  const [duelInfo, setDuelInfo] = useState<StartDuelData>();
  const [person1Id, setPerson1Id] = useState<number | null>(null);
  const [person2Id, setPerson2Id] = useState<number | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const refreshImages = async () => {
    try {
      setLoading(true);

      const duelInfo = await internalApi.duel.startDuel();

      setDuelInfo(duelInfo.data);

      const person1 = new Person(
        duelInfo.data.person1Id,
        Person.convertRawImageToBlob(duelInfo.data.image1b64)
      );

      const person2 = new Person(
        duelInfo.data.person2Id,
        Person.convertRawImageToBlob(duelInfo.data.image2b64)
      );

      setPerson1Id(person1.id);
      setPerson2Id(person2.id);

      setImages([
        URL.createObjectURL(person1.image),
        URL.createObjectURL(person2.image),
      ]);
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshImages();
  }, []);

  const handleClick = async (
    event: React.MouseEvent,
    personId: number | null
  ) => {
    if (loading || personId === null) return;

    setLoading(true);

    try {
      console.log(`Person clicked: ${personId}`);
      let loser;
      if (personId == person1Id) {
        loser = person2Id;
      } else {
        loser = person1Id;
      }

      if (!loser) {
        throw Error("Couldn't get duelist");
      }

      internalApi.duel.pickWinner({
        duelId: 0,
        winnerId: personId,
        loserId: loser,
      });

      await refreshImages();
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {duelInfo && <Overlay sentTheme={duelInfo.theme} />}
      {loading && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 text-4xl z-10 pointer-events-none">
          Carregando...
        </div>
      )}
      <div className="flex h-screen flex-col md:flex-row">
        {["left", "right"].map((id, index) => (
          <a
            key={id}
            id={id}
            onClick={(event) =>
              handleClick(event, index === 0 ? person1Id : person2Id)
            }
            className={`${
              loading ? "blur-sm" : ""
            } relative bg-gray-500 w-1/2 border border-white flex justify-center items-center cursor-pointer hover:brightness-75 w-screen h-screen`}
          >
            {images[index] && ( // Only render the Image component if there's a valid src
              <Image
                fill
                className="object-cover"
                src={images[index]}
                alt={`Pessoa${index + 1}`}
              />
            )}
          </a>
        ))}
      </div>
    </>
  );
}

export default Controller;
