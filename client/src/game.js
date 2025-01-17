import Phaser from "phaser";
import { preloadAssets } from "./preloadAssets";
import { createObjects } from "./Objects";
import { createPlayer } from "./character";
import { createBackground } from "./background";
import { playerMovement } from "./playerMovement";

function game(screenWidth, screenHeight, tileWidth, tileHeight) {
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
        .sprite(1200, 20, "char1")
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
    }
  }

  const baseWidth = 1600; // Base width for 16:9 ratio
  const baseHeight = 900; // Base height for 16:9 ratio

  const config = {
    type: Phaser.AUTO,
    width: baseWidth, 
    height: baseHeight,
    scale: {
      mode: Phaser.Scale.FIT, // Fit game within the screen
      autoCenter: Phaser.Scale.CENTER_BOTH, // Center the game
    },
    scene: Example,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 },
        debug: false,
      },
    },
  };

  const phaserGame = new Phaser.Game(config);

  // Handle resizing dynamically
  window.addEventListener("resize", () => {
    const canvas = phaserGame.canvas;
    const parent = canvas.parentElement;

    if (parent) {
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      // console.log(w, h)

      const scaleFactor = Math.min(w / baseWidth, h / baseHeight);
      canvas.style.width = `${baseWidth * scaleFactor}px`;
      canvas.style.height = `${baseHeight * scaleFactor}px`;
    }
  });

  // Trigger an initial resize to ensure the game is correctly scaled on load
  window.dispatchEvent(new Event("resize"));
}

export default game;
