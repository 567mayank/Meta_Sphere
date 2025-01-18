import React, { useEffect, useState } from "react";
import Phaser from "phaser";
import { preloadAssets } from "../preloadAssets";
import { createObjects } from "../Objects";
import { createPlayer } from "../character";
import { createBackground } from "../background";
import { playerMovement } from "../playerMovement";

function Game({screenWidth, screenHeight, tileWidth, tileHeight}) {
  const [posX, setX] = useState(0)
  const [posY, setY] = useState(0)
  useEffect(() => {
    var objects;
    var cursors;
    var player;
  
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
  
        // objects i.e. walls, table, chair, couch
        objects = this.physics.add.staticGroup();
        createObjects(this, screenWidth, screenHeight, tileHeight, objects);
  
        // player part
        player = this.physics.add
          .sprite(screenWidth / 2, screenHeight, "char1")
          .setDisplaySize(tileHeight * 1.3, tileHeight * 1.7)
          .setSize(tileHeight * 2, tileHeight * 1.3)
          .setOffset(tileHeight, tileHeight * 4.5)
          .refreshBody();
  
        createPlayer(this, player, "char1");
        this.physics.add.collider(player, objects);
  
        cursors = this.input.keyboard.createCursorKeys();
      }
  
      update() {
        playerMovement(player, cursors, 500);
        
        setX(player.x)
        setY(player.y)
      }
    }
  
    const baseWidth = 1600; 
    const baseHeight = 900; 
  
    const config = {
      type: Phaser.AUTO,
      width: baseWidth,
      height: baseHeight,
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
  
    const phaserGame = new Phaser.Game(config);
        
    return () => {
      // Cleanup the Phaser game when the component unmounts
      phaserGame.destroy(true);
    };
  }, [])

  return (
    <div>
      <div>{posX} {posY}</div>
      <div id="game-container" className="border border-black scale-90 flex bg-zinc-800 max-w-fit m-auto"/>
    </div>
  )
}

export default Game;
