// import React, { useEffect } from "react";
// import Game from "./Components/Game";
// import GameControls from "./Components/GameControls";

// function GameSetup() {

//   // game()

//   return (
//     <div className="bg-zinc-950 h-screen text-white">
//       <div>
//         Game Room
//       </div>
//       <Game screenWidth={1600} screenHeight={900} tileHeight={48} tileWidth={48}/>
//       {/* <GameControls/> */}
//     </div>
//   )
// }

// export default GameSetup;

import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Game from "./Components/Game";
import GameControls from "./Components/GameControls";
import { useSocket } from "./SocketContext";

function GameSetup() {
  const { roomId } = useParams(); // Extract roomId from the URL
  const socket = useSocket();

  useEffect(() => {
    if (socket && roomId) {
      // Join the room via socket
      socket.emit("join-room", { roomId });

      // Handle room-specific events if necessary
      socket.on("newPlayerJoined", (data) => {
        console.log(`Player joined room ${roomId}:`, data);
      });

      return () => {
        // Clean up listeners when component unmounts
        socket.off("newPlayerJoined");
      };
    }
  }, [socket, roomId]);

  return (
    <div className="bg-zinc-950 h-screen text-white">
      <div>
        Game Room: <strong >{roomId}</strong>
      </div>
      <Game screenWidth={1600} screenHeight={900} tileHeight={48} tileWidth={48} />
      {/* <GameControls/> */}
    </div>
  );
}

export default GameSetup;
