import React, { useEffect } from "react";
import Phaser from "phaser";
import { preloadAssets } from "./preloadAssets";
import { createObjects } from "./Objects";
import { createPlayer } from "./character";
import { createBackground } from "./background";
import { playerMovement } from "./playerMovement";

function GameSetup() {
  const screenHeight = 600;
  const screenWidth = 1500;
  const tileWidth = 48;
  const tileHeight = 48;

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

      // objects i.e. table chair couch
      objects = this.physics.add.staticGroup();
      createObjects(this, screenWidth, screenHeight, tileHeight, objects);

      // player part
      player = this.physics.add
      .sprite(1200, 20, "char1")
      .setDisplaySize(tileHeight * 1.3, tileHeight * 1.7) 
      .setSize(tileHeight * 2, tileHeight * 1.3)
      .setOffset(tileHeight, tileHeight * 4.5)
      .refreshBody();

      createPlayer(this, player, "char1");
      this.physics.add.collider(player, objects);

      // Debug Physics (optional, for troubleshooting)
      // this.physics.world.createDebugGraphic();
      // this.physics.world.drawDebug = true;  // This will draw debug lines showing the collision shapes

      cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
      playerMovement(player, cursors, 500)
    }
  }

  const config = {
    type: Phaser.AUTO,
    width: screenWidth,
    height: screenHeight,
    scene: Example,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 },
        debug: false,
      },
    },
  };

  useEffect(() => {
    const game = new Phaser.Game(config);
  }, []);

  return <div></div>;
}

export default GameSetup;
