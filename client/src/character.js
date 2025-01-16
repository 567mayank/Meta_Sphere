export function createPlayer(scene, player, name) {
  player.setCollideWorldBounds(true);

  scene.anims.create({
    key: "left",
    frames: scene.anims.generateFrameNumbers(name, { start: 24, end: 27 }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: "turn",
    frames: [
      { key: name, frame: 0 },
      { key: name, frame: 7 },
      { key: name, frame: 3 },
      { key: name, frame: 20 },
      { key: name, frame: 21 },
    ],
    frameRate: 1,
    repeat: -1, 
  });

  scene.anims.create({
    key: "right",
    frames: scene.anims.generateFrameNumbers(name, { start: 24, end: 27 }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: "up",
    frames: scene.anims.generateFrameNumbers(name, { start: 5, end: 6 }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: "down",
    frames: scene.anims.generateFrameNumbers(name, { start: 12, end: 14 }),
    frameRate: 10,
    repeat: -1,
  });
}
