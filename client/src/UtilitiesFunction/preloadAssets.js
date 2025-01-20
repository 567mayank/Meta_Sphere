export function preloadAssets(scene) {
  scene.load.setBaseURL('/');
  scene.load.image('background', '../assets/tile.png');
  scene.load.image('star', '../assets/star.png');
  scene.load.image('wall', '../assets/wall.jpeg');
  scene.load.image('couch', '../assets/couch.PNG');
  scene.load.image('couch2', '../assets/couch2.PNG');
  scene.load.image('clock', '../assets/clock.PNG');
  scene.load.image('table', '../assets/table.png');
  scene.load.image('table2', '../assets/studyTable.png');
  scene.load.image('chair', '../assets/chair.png');
  scene.load.image('pool', '../assets/pool.png');
  scene.load.spritesheet('dude', 
      '../assets/dude.png',
      { frameWidth: 32, frameHeight: 48 }
  );

  scene.load.spritesheet('char1', '../assets/char1.png', {
      frameWidth: 192,  
      frameHeight: 256 
  });

}
