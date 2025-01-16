import React, { useEffect } from 'react'
import Phaser from 'phaser'

function GameSetup() {
  var cursors;
  var player;
  class Example extends Phaser.Scene {
    preload () {
      this.load.setBaseURL('/');
      this.load.image('background', '../assets/tile.png');
      this.load.image('star', '../assets/star.png');
      this.load.image('wall', '../assets/wall.png');
      // this.load.image('ground', '../assets/platform.png');
      this.load.spritesheet('dude', 
        '../assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
    }
    
     create () {
      var platforms;
      const tileWidth = 48; 
      const tileHeight = 48; 

      for (let y = 0; y < 600; y += tileHeight) {
          for (let x = 0; x < 1500; x += tileWidth) {
              this.add.image(x, y, 'background').setOrigin(0, 0); 
          }
      }

      // this.add.image(2 * tileWidth, 0, 'star').setOrigin(0, 0);
      this.add.image(50,0, 'wall').setDisplaySize(2000, 100);


      

      // player code
      
      player = this.physics.add.sprite(100, 450, 'dude');

      player.setBounce(0.2);
      player.setCollideWorldBounds(true);

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
        width: 1500,
        height: 600,
        scene: Example,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 },
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

export default GameSetup

