import React, { useEffect } from "react";
// import game from "./game";
import Game from "./Game.jsx";

function GameSetup() {

  // game()

  return (
    <div className="bg-zinc-950 h-screen text-white">
      <div>
        Game Room
      </div>
      <Game screenWidth={1600} screenHeight={900} tileHeight={48} tileWidth={48}/>
      <div>
        Members
      </div>
    </div>
  )
}

export default GameSetup;
