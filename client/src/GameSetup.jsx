import React, { useEffect } from "react";
import Game from "./Components/Game";
import GameControls from "./Components/GameControls";

function GameSetup() {

  // game()

  return (
    <div className="bg-zinc-950 h-screen text-white">
      <div>
        Game Room
      </div>
      <Game screenWidth={1600} screenHeight={900} tileHeight={48} tileWidth={48}/>
      {/* <GameControls/> */}
    </div>
  )
}

export default GameSetup;
