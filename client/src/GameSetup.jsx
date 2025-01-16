import React, { useEffect } from "react";
import Phaser from "phaser";
import { preloadAssets } from "./preloadAssets";
import { createObjects } from "./Objects";
import { createPlayer } from "./character";
import { createBackground } from "./background";

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
        .setDisplaySize(tileHeight * 1.3, tileHeight * 1.7);
      createPlayer(this, player, "char1");
      this.physics.add.collider(player, objects);

      cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
      player.setVelocityX(0);
      player.setVelocityY(0); 

      // Horizontal movement (left and right)
      if (cursors.left.isDown) {
        player.setVelocityX(-160); 
        player.setFlipX(true); 
        player.anims.play("left", true); 
      } else if (cursors.right.isDown) {
        player.setVelocityX(160); 
        player.setFlipX(false); 
        player.anims.play("right", true); 
      }

      // Vertical movement (up and down)
      if (cursors.up.isDown) {
        player.setVelocityY(-160); 
        player.anims.play("up", true); 
      } else if (cursors.down.isDown) {
        player.setVelocityY(160); 
        player.anims.play("down", true); 
      }

      if (
        !cursors.left.isDown &&
        !cursors.right.isDown &&
        !cursors.up.isDown &&
        !cursors.down.isDown
      ) {
        if (
          !player.anims.isPlaying ||
          player.anims.currentAnim.key !== "turn"
        ) {
          player.anims.play("turn", true); 
        }
      }
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
