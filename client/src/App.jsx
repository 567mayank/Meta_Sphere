import React, { useEffect } from 'react'
import Phaser from 'phaser'

function App() {
  var cursors;
  var player;
  class Example extends Phaser.Scene {
    preload () {
      this.load.setBaseURL('/');
      this.load.image('sky', '../assets/sky.png');
      this.load.image('star', '../assets/star.png');
      this.load.image('ground', '../assets/platform.png');
      this.load.spritesheet('dude', 
        '../assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
    }
    
    create () {
      var platforms;
      this.add.image(400, 300, 'sky');
      this.add.image(200, 150, 'star');

      platforms = this.physics.add.staticGroup();

      platforms.create(400, 568, 'ground').setScale(2).refreshBody();

      platforms.create(600, 400, 'ground');
      platforms.create(50, 250, 'ground');
      platforms.create(750, 220, 'ground');

      // player code
      
      player = this.physics.add.sprite(100, 450, 'dude');

      player.setBounce(0.2);
      player.setCollideWorldBounds(true);
      // player.body.setGravityY(200);

      this.physics.add.collider(player, platforms);

      this.anims.create({
          key: 'left',
          frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
          frameRate: 10,
          repeat: -1
      });
      

      // player.setFrame(4);

      this.anims.create({
          key: 'turn',
          frames: [ { key: 'dude', frame: 4 } ],
          frameRate: 20
      });

      this.anims.create({
          key: 'right',
          frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
          frameRate: 10,
          repeat: -1
      });

      cursors = this.input.keyboard.createCursorKeys();


    }

    update () {
      if (cursors.left.isDown)
        {
            player.setVelocityX(-160);
        
            player.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {
            player.setVelocityX(160);
        
            player.anims.play('right', true);
        }
        else
        {
            player.setVelocityX(0);
        
            player.anims.play('turn');
        }
        
        if (cursors.up.isDown && player.body.touching.down)
        {
            player.setVelocityY(-330);
        }        
    }

  }

    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        scene: Example,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 200 },
                debug : false
            }
        }
    };

    useEffect(() => {
      const game = new Phaser.Game(config);

    }, [])

  return (
    <div>App</div>
  )
}

export default App