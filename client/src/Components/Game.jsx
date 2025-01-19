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
  // const [players, setPlayers] = useState({});
  const [phaserGame, setPhaserGame] = useState(null);

  useEffect(() => {
    socket.emit("sprite-move", { x: posX, y: posY });
  }, [posX, posY]);

  useEffect(() => {
    let objects, cursors, player;
    let players = new Map();

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
          const newPlayer = this.createSecondPlayer();
          players.set(msg, newPlayer);
        });

        // run this function only one time when player gets live
        socket.on("infoOfLivePlayers", (msg) => {
          console.log("message recieved : " + msg)
          msg.map((player) => {
            const newPlayer = this.createSecondPlayer(
              player.x,
              player.y,
              "char1"
            );

            this.movePlayerTo(newPlayer, player.x, player.y);
            players.set(player.id, newPlayer);
          });
        });
        // calling this function to inform server about completeion of creation of scene just one time
        socket.emit("creation-complete", "done");

        // for updating other players position
        socket.on("sprite-update", (msg) => {
          this.movePlayerTo(players.get(msg.id), msg.x, msg.y);
        });

        socket.on('sprite-disconnect', (msg) => {
          this.deletePlayer(players.get(msg.id))
          players.delete(msg.id)
        })
      }

      // function for adding new player
      createSecondPlayer(
        charHeight = screenHeight / 2,
        charWidth = screenWidth,
        charName = "char1"
      ) {
        const secondPlayer = this.physics.add
          .sprite(charWidth, charHeight, charName)
          .setDisplaySize(tileHeight * 1.3, tileHeight * 1.7)
          .setSize(tileHeight * 2, tileHeight * 1.3)
          .setOffset(tileHeight, tileHeight * 4.5)
          .refreshBody();

        this.physics.add.collider(secondPlayer, objects);
        return secondPlayer;
      }

      // function for removing player
      deletePlayer(player) {
        if (player) {
          player.destroy();  
        }
      }

      // function for moving player to target position
      movePlayerTo(player, targetX, targetY, speed = 1000) {
        // Start walking animation (assuming you have a walking animation)
        // player.anims.play("walk", true); // Replace 'walk' with your walking animation key

        // Create the tween to move the player to the target position
        this.tweens.add({
          targets: player, // The object to tween
          x: targetX, // Final x coordinate
          y: targetY, // Final y coordinate
          duration: speed, // Duration of the movement (in milliseconds)
          ease: "Power2", // Easing function for smooth movement
          onComplete: () => {
            // console.log("Movement complete!");
            // player.anims.stop(); // Stop the walking animation when movement is complete
            // Optionally, play an idle animation or stop the animation
            // player.anims.play("idle", true);
          },
        });
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
