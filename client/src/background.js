export function createBackground(scene, screenWidth, screenHeight, tileWidth, tileHeight, background) {
  for (let y = 0; y < screenHeight; y += tileHeight) {
      for (let x = 0; x < screenWidth; x += tileWidth) {
          scene.add.image(x, y, background).setOrigin(0, 0);
      }
  }
}
