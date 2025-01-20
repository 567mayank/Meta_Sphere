import React, { useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom'
import Phaser from "phaser";
import { preloadAssets } from "../UtilitiesFunction/preloadAssets";
import { createObjects } from "../UtilitiesFunction/objects";
import { createPlayer } from "../UtilitiesFunction/character";
import { createBackground } from "../UtilitiesFunction/background";
import { playerMovement } from "../UtilitiesFunction/playerMovement";
import { useSocket } from "../SocketContext";
import {
  deletePlayer,
  movePlayerTo,
} from "../UtilitiesFunction/multiPlayerFunctions";

function Game({ screenWidth, screenHeight, tileWidth, tileHeight, roomId, name }) {
  const [posX, setX] = useState(screenWidth / 2);
  const [posY, setY] = useState(screenHeight);
  const socket = useSocket();
  const navigate = useNavigate()
  const [phaserGame, setPhaserGame] = useState(null);

  useEffect(() => {
    socket.emit("sprite-move", { x: posX, y: posY, roomId, name });
    socket.on('error', (msg) => {
      alert(msg)
      navigate("/")
      return
    })
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

        player = this.createSecondPlayer(name);

        createPlayer(this, player, "char1");
        this.physics.add.collider(player, objects);

        cursors = this.input.keyboard.createCursorKeys();

        // for spawning of new player on board
        socket.on("newDeviceUpdate", ({socketId, name}) => {
          const newPlayer = this.createSecondPlayer(name);
          players.set(socketId, newPlayer);
        });

        // for updating live players
        socket.on("infoOfLivePlayers", (msg) => {
          msg.map((playerData) => {
            const newPlayer = this.createSecondPlayer(
              playerData.name,
              playerData.x,
              playerData.y,
              "char1"
            );
            movePlayerTo(newPlayer, playerData.x, playerData.y, "turn", this);
            players.set(playerData.id, newPlayer);
          });
        });

        // Notify server of scene creation
        socket.emit("creation-complete", {roomId});

        // For updating other players' positions
        socket.on("sprite-update", (msg) => {
          const otherPlayer = players.get(msg.id);
          if (otherPlayer) {
            let x = otherPlayer.x;
            let y = otherPlayer.y;
            if (msg.x > x)
              movePlayerTo(otherPlayer, msg.x, msg.y, "right", this);
            else if (msg.x < x)
              movePlayerTo(otherPlayer, msg.x, msg.y, "left", this);
            else if (msg.y > y)
              movePlayerTo(otherPlayer, msg.x, msg.y, "down", this);
            else movePlayerTo(otherPlayer, msg.x, msg.y, "up", this);
          }
        });

        // Handle player disconnect
        socket.on("sprite-disconnect", (msg) => {
          const playerToRemove = players.get(msg.id);
          if (playerToRemove) {
            deletePlayer(playerToRemove);
            players.delete(msg.id);
          }
        });
      }

      // Create a new player with a name above their head
      createSecondPlayer(
        playerName = "char1",
        charHeight = screenHeight,
        charWidth = screenWidth / 2,
        charName = "char1"
      ) {
        const secondPlayer = this.physics.add
          .sprite(charWidth, charHeight, charName)
          .setDisplaySize(tileHeight * 1.3, tileHeight * 1.7)
          .setSize(tileHeight * 2, tileHeight * 1.3)
          .setOffset(tileHeight, tileHeight * 4.5)
          .refreshBody();

        const playerNameText = this.add
          .text(charWidth, charHeight - tileHeight, " " + playerName + " ", {
            font: "16px Arial",
            fill: "#000000",
            align: "center",
            backgroundColor: "#ffffff",
          })
          .setOrigin(0.5, 0.5);

        secondPlayer.playerNameText = playerNameText;

        this.physics.add.collider(secondPlayer, objects);
        return secondPlayer;
      }

      update() {
        // Update player movement
        playerMovement(player, cursors, 70);
        setX(player.x);
        setY(player.y);

        player.playerNameText.setPosition(player.x, player.y - tileHeight);

        // Update the positions of all players' name text
        players.forEach((playerSprite, id) => {
          playerSprite.playerNameText.setPosition(
            playerSprite.x,
            playerSprite.y - tileHeight
          );
        });
      }
    }

    // Phaser game configuration
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
    setPhaserGame(phaserGameInstance);

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
        className="border-4 border-red-400 scale-90 flex bg-zinc-800 max-w-fit m-auto rounded-md"
      />
    </div>
  );
}

export default Game;