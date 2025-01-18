import React, { useEffect } from "react";

function Experiment() {
  useEffect(() => {
    class Example extends Phaser.Scene {
      preload() {
        this.load.setBaseURL("https://cdn.phaserfiles.com/v385");
        this.load.image("sky", "assets/skies/space3.png");
        this.load.image("logo", "assets/sprites/phaser3-logo.png");
        this.load.image("red", "assets/particles/red.png");
      }

      create() {
        this.add.image(400, 300, "sky");

        const particles = this.add.particles(0, 0, "red", {
          speed: 100,
          scale: { start: 1, end: 0 },
          blendMode: "ADD",
        });

        const logo = this.physics.add.image(400, 100, "logo");

        logo.setVelocity(100, 200);
        logo.setBounce(1, 1);
        logo.setCollideWorldBounds(true);

        particles.startFollow(logo);
      }
    }

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: Example,
      parent: "game-container", // This is where we attach the game
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 200 },
        },
      },
    };

    // Create a Phaser game instance and it will be added to the div with id 'game-container'
    const game = new Phaser.Game(config);

    return () => {
      // Cleanup the Phaser game when the component unmounts
      game.destroy(true);
    };
  }, []);

  return (
    <div className="bg-zinc-900 h-screen w-screen justify-center items-center text-white ">
      {/* This is the container div where the Phaser game will be rendered */}
      <div id="game-container" className="border border-white"/>
      <div>Hi</div>
    </div>
  );
}

export default Experiment;
