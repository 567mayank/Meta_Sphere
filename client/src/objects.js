

export function createObjects(scene, screenWidth, screenHeight, tileHeight, objects) {
  
  // Walls
  objects.create(0, 0, 'wall').setDisplaySize(2 * screenWidth, tileHeight).refreshBody();  // Top wall
  objects.create(0, 0, 'wall').setDisplaySize(tileHeight, 2 * screenHeight).refreshBody(); // Left wall
  objects.create(screenWidth, 0, 'wall').setDisplaySize(tileHeight, 2 * screenHeight).refreshBody(); // Right wall
  objects.create(0, screenHeight, 'wall').setDisplaySize(screenWidth - 80, tileHeight).refreshBody(); // Bottom left wall
  objects.create(screenWidth, screenHeight, 'wall').setDisplaySize(screenWidth - 80, tileHeight).refreshBody();  // Bottom right wall
  objects.create(screenWidth / 2 + 40, screenHeight, 'wall').setDisplaySize(tileHeight / 2, screenHeight).refreshBody(); // Entrance wall
  objects.create(screenWidth / 4, screenHeight / 2, 'wall').setDisplaySize(screenWidth / 3, tileHeight / 2).refreshBody(); // Left middle wall
  objects.create(screenWidth - screenWidth / 4, screenHeight / 2, 'wall').setDisplaySize(tileHeight / 2, screenHeight / 2).refreshBody(); // Right middle wall

  // Sofa and table
  const gap = 170;
  for (let i = 4 * tileHeight; i < screenWidth / 2; i += 4 * tileHeight + gap) {
    objects.create(i, screenHeight - tileHeight * 1.05 - 30, 'couch2').setDisplaySize(tileHeight * 4, tileHeight).refreshBody().setRotation(-Phaser.Math.DegToRad(180));
    objects.create(i, screenHeight - tileHeight * 2.5 - 30, 'table').setDisplaySize(tileHeight * 4, tileHeight).refreshBody();
    objects.create(i, screenHeight - tileHeight * 3.9 - 30, 'couch2').setDisplaySize(tileHeight * 4, tileHeight).refreshBody();
  }

  // For tables and chairs
  const horizontalSpacing = 6 * tileHeight;
  for (let i = 0; i < 3; i++) {
    const offsetX = i * horizontalSpacing;

    // Chairs in the first column (left side)
    objects.create(2 * tileHeight + offsetX, tileHeight * 2.3, 'chair').setDisplaySize(tileHeight - 20, tileHeight - 5).refreshBody();
    objects.create(2 * tileHeight + offsetX, tileHeight * 3, 'chair').setDisplaySize(tileHeight - 20, tileHeight - 5).refreshBody();
    objects.create(2 * tileHeight + offsetX, tileHeight * 3.7, 'chair').setDisplaySize(tileHeight - 20, tileHeight - 5).refreshBody();

    // Table in the second column
    objects.create(3 * tileHeight + offsetX, tileHeight * 3.2, 'table2').setDisplaySize(tileHeight, 2.5 * tileHeight).refreshBody();

    // Chairs in the third column (right side)
    objects.create(4 * tileHeight + offsetX, tileHeight * 3.7, 'chair').setDisplaySize(tileHeight - 20, tileHeight - 5).setFlipX(true).refreshBody();
    objects.create(4 * tileHeight + offsetX, tileHeight * 3, 'chair').setDisplaySize(tileHeight - 20, tileHeight - 5).setFlipX(true).refreshBody();
    objects.create(4 * tileHeight + offsetX, tileHeight * 2.3, 'chair').setDisplaySize(tileHeight - 20, tileHeight - 5).setFlipX(true).refreshBody();
  }

  // Pools
  objects.create(screenWidth * 0.62, screenHeight * 0.8, 'pool').setDisplaySize(3 * tileHeight, tileHeight * 1.3).refreshBody();
  objects.create(screenWidth * 0.62, screenHeight * 0.6, 'pool').setDisplaySize(3 * tileHeight, tileHeight * 1.3).setFlipY(true).refreshBody();
}


