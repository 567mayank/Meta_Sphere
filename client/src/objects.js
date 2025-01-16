export function createObjects(scene, screenWidth, screenHeight, tileHeight, objects) {

  // walls
  objects.create(0, 0, 'wall').setDisplaySize(2 * screenWidth, tileHeight);  // top wall
  objects.create(0, 0, 'wall').setDisplaySize(tileHeight, 2 * screenHeight); // left wall
  objects.create(screenWidth, 0, 'wall').setDisplaySize(tileHeight, 2 * screenHeight); // right wall
  objects.create(0, screenHeight, 'wall').setDisplaySize(screenWidth - 80, tileHeight); // bottom left wall
  objects.create(screenWidth, screenHeight, 'wall').setDisplaySize(screenWidth - 80, tileHeight);  // bottom right wall
  objects.create(screenWidth / 2 + 40, screenHeight, 'wall').setDisplaySize(tileHeight / 2, screenHeight); // entrance wall
  objects.create(screenWidth / 4, screenHeight / 2, 'wall').setDisplaySize(screenWidth / 3, tileHeight / 2); // left middle wall
  objects.create(screenWidth - screenWidth / 4, screenHeight / 2, 'wall').setDisplaySize(tileHeight / 2, screenHeight / 2); // left middle wall

  // Sofa and table
  const gap = 170;
  for (let i = 4 * tileHeight; i < screenWidth / 2; i += 4 * tileHeight + gap) {
      scene.add.image(i, screenHeight - tileHeight * 1.05 - 30, 'couch2').setDisplaySize(tileHeight * 4, tileHeight).setRotation(-Phaser.Math.DegToRad(180));
      scene.add.image(i, screenHeight - tileHeight * 2.5 - 30, 'table').setDisplaySize(tileHeight * 4, tileHeight);
      scene.add.image(i, screenHeight - tileHeight * 3.9 - 30, 'couch2').setDisplaySize(tileHeight * 4, tileHeight);
  }

  // For tables and chairs
  const horizontalSpacing = 6 * tileHeight; 
  for (let i = 0; i < 3; i++) {
      let offsetX = i * horizontalSpacing;

      // Chairs in the first column (left side)
      scene.add.image(2 * tileHeight + offsetX, tileHeight * 2.3, 'chair').setDisplaySize(tileHeight - 20, tileHeight - 5);
      scene.add.image(2 * tileHeight + offsetX, tileHeight * 3, 'chair').setDisplaySize(tileHeight - 20, tileHeight - 5);
      scene.add.image(2 * tileHeight + offsetX, tileHeight * 3.7, 'chair').setDisplaySize(tileHeight - 20, tileHeight - 5);

      // Table in the second column
      scene.add.image(3 * tileHeight + offsetX, tileHeight * 3.2, 'table2').setDisplaySize(tileHeight, 2.5 * tileHeight);

      // Chairs in the third column (right side)
      scene.add.image(4 * tileHeight + offsetX, tileHeight * 3.7, 'chair').setDisplaySize(tileHeight - 20, tileHeight - 5).setFlipX(true);
      scene.add.image(4 * tileHeight + offsetX, tileHeight * 3, 'chair').setDisplaySize(tileHeight - 20, tileHeight - 5).setFlipX(true);
      scene.add.image(4 * tileHeight + offsetX, tileHeight * 2.3, 'chair').setDisplaySize(tileHeight - 20, tileHeight - 5).setFlipX(true);
  }

  // Pools
  scene.add.image(screenWidth * 0.62, screenHeight * 0.8, 'pool').setDisplaySize(3 * tileHeight, tileHeight * 1.3);
  scene.add.image(screenWidth * 0.62, screenHeight * 0.6, 'pool').setDisplaySize(3 * tileHeight, tileHeight * 1.3).setFlipY(true);
}
