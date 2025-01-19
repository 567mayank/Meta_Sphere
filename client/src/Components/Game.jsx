import React, { useEffect, useState } from "react";
import Phaser from "phaser";
import { preloadAssets } from "../preloadAssets";
import { createObjects } from "../Objects";
import { createPlayer } from "../character";
import { createBackground } from "../background";
import { playerMovement } from "../playerMovement";
import { useSocket } from "../SocketContext";

function Game({ screenWidth, screenHeight, tileWidth, tileHeight }) {
  const [posX, setX] = useState(screenWidth / 2);
  const [posY, setY] = useState(screenHeight);
  const socket = useSocket();
  const [totalPlayers, setTotalPlayers] = useState([]);
  const [phaserGame, setPhaserGame] = useState(null);

  useEffect(() => {
    if (socket) {
      // updating other players
      socket.emit("sprite-move", { x: posX, y: posY });

      // updates from other players
      socket.on("sprite-update", (data) => {
        console.log(data);
      });

      socket.on("newDeviceUpdate", (msg) => {
        setTotalPlayers((prev) => {
          const updatedPlayers = new Set([...prev, msg.socketId]);
          return Array.from(updatedPlayers);
        });
      });

      return () => {
        socket.off("sprite-update");
      };
    }
  }, []);

  useEffect(() => {
    let objects, cursors, player;

    class Example extends Phaser.Scene {
      preload() {
        preloadAssets(this);
      }

      create() {
        createBackground(
          this,
          screenWidth,
          screenHeight,
          tileWidth,
          tileHeight,
          "background"
        );

        objects = this.physics.add.staticGroup();
        createObjects(this, screenWidth, screenHeight, tileHeight, objects);

        player = this.physics.add
          .sprite(screenWidth / 2, screenHeight, "char1")
          .setDisplaySize(tileHeight * 1.3, tileHeight * 1.7)
          .setSize(tileHeight * 2, tileHeight * 1.3)
          .setOffset(tileHeight, tileHeight * 4.5)
          .refreshBody();

        createPlayer(this, player, "char1");
        this.physics.add.collider(player, objects);

        cursors = this.input.keyboard.createCursorKeys();

        socket.on("newDeviceUpdate", (msg) => {
          console.log("new player coming")
          this.createSecondPlayer()
        });

      }

      createSecondPlayer() {
        // Create the second player
        const secondPlayer = this.physics.add
          .sprite(screenWidth * Math.random(), screenHeight / 2, "char1")
          .setDisplaySize(tileHeight * 1.3, tileHeight * 1.7)
          .setSize(tileHeight * 2, tileHeight * 1.3)
          .setOffset(tileHeight, tileHeight * 4.5)
          .refreshBody();

        this.physics.add.collider(secondPlayer, objects);
      }

      update() {
        playerMovement(player, cursors, 500);

        setX(player.x);
        setY(player.y);
      }
    }

    const config = {
      type: Phaser.AUTO,
      width: 1600,
      height: 900,
      scale: {
        mode: Phaser.Scale.FIT,
      },
      scene: Example,
      parent: "game-container",
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },
    };

    const phaserGameInstance = new Phaser.Game(config);
    setPhaserGame(phaserGameInstance); // Save the Phaser game instance

    return () => {
      phaserGameInstance.destroy(true);
    };
  }, []);

  const createSecondPlayerExternally = () => {
    
  };

  return (
    <div>
      <div>
        {posX} {posY}
      </div>
      <div
        id="game-container"
        className="border border-black scale-90 flex bg-zinc-800 max-w-fit m-auto"
      />
      <button onClick={createSecondPlayerExternally}>Create Second Player</button>
    </div>
  );
}

export default Game;
