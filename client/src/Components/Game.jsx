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
  const [players, setPlayers] = useState({});
  const [phaserGame, setPhaserGame] = useState(null);


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

        // for spawning of new player on board
        socket.on("newDeviceUpdate", (msg) => {
          // console.log("new player coming");
          const newPlayer = this.createSecondPlayer();
          setPlayers((prev) => ({
            ...prev,
            [msg]: newPlayer,
          }));
        });


        // run this function only one time when player gets live
        socket.on("infoOfLivePlayers", (msg) => {
          msg.map((player) => {
            const newPlayer = this.createSecondPlayer(
              player.x,
              player.y,
              "char1"
            );

            setPlayers((prev) => ({
              ...prev,
              [player.socketId]: newPlayer, 
            }));
          });

          console.log(msg)


          
        });

        socket.emit("creation-complete" , "done");

      }

      // function for adding new player
      createSecondPlayer(
        charHeight = screenHeight / 2,
        charWidth = screenWidth * Math.random(),
        charName = "char1"
      ) {
        // Create the second player
        const secondPlayer = this.physics.add
          .sprite(charWidth, charHeight, charName)
          .setDisplaySize(tileHeight * 1.3, tileHeight * 1.7)
          .setSize(tileHeight * 2, tileHeight * 1.3)
          .setOffset(tileHeight, tileHeight * 4.5)
          .refreshBody();

        this.physics.add.collider(secondPlayer, objects);
        return secondPlayer;
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

  return (
    <div>
      <div>
        {posX} {posY}
      </div>
      <div
        id="game-container"
        className="border border-black scale-90 flex bg-zinc-800 max-w-fit m-auto"
      />
    </div>
  );
}

export default Game;