import React, { useState } from "react";
import Link from "next/link";
import "./animations.css";

interface OverlayProps {
  sentTheme: string;
}

function Overlay({ sentTheme }: OverlayProps) {
  const [isRealMenuVisible, setIsRealMenuVisible] = useState(false);

  function toggleRealMenu() {
    setIsRealMenuVisible(!isRealMenuVisible);
  }

  return (
    <>
      <div className="absolute w-11/12 lg:w-fit overlay-element -translate-x-1/2 bg-opacity-50 bg-black top-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl font-bold z-10">
        Clique em: {sentTheme}
      </div>

      <div
        className={`${
          isRealMenuVisible ? "visible-div" : "hidden-div"
        } absolute -translate-x-1/2 w-fit top-1/2 left-1/2 z-10`}
      >
        <div className="relative">
          <div className="overlay-element select-none bg-black bg-opacity-100 top-1/2 -translate-y-1/2 z-20">
            <div onClick={toggleRealMenu} className="block-item-close">
              Fechar
            </div>

            <Link href="/ranking">
              <div className="block-item">Ranking</div>
            </Link>
          </div>
        </div>
      </div>

      <div
        onClick={toggleRealMenu}
        className={`${
          isRealMenuVisible ? "hidden-div-menu" : "visible-div-menu"
        } overlay-element cursor-pointer absolute rounded-xl z-10 select-none bg-black bg-opacity-50 bottom-1/2 -translate-x-1/2 translate-y-1/2 md:bottom-5 md:translate-y-0`}
      >
        Menu
      </div>
    </>
  );
}

export default Overlay;
