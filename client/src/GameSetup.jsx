import React, { useEffect } from "react";
import Game from "./Components/Game";
import GameControls from "./Components/GameControls";
import { useParams } from "react-router-dom";

function GameSetup() {

  const {roomid} = useParams()

  return (
    <div className="bg-zinc-950 h-screen text-white">
      <div>
        Game Room
      </div>
      <Game screenWidth={1600} screenHeight={900} tileHeight={48} tileWidth={48} roomId = {roomid}/>
      {/* <GameControls/> */}
    </div>
  )
}

export default GameSetup;