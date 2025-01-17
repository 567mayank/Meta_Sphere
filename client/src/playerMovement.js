export const playerMovement = (player, cursors, speed) => {
  player.setVelocityX(0);
  player.setVelocityY(0);

  // Horizontal movement (left and right)
  if (cursors.left.isDown) {
    player.setVelocityX(-speed); 
    player.setFlipX(true); 
    player.anims.play("left", true); 
  } else if (cursors.right.isDown) {
    player.setVelocityX(speed); 
    player.setFlipX(false); 
    player.anims.play("right", true); 
  }

  // Vertical movement (up and down)
  if (cursors.up.isDown) {
    player.setVelocityY(-speed); 
    player.anims.play("up", true); 
  } else if (cursors.down.isDown) {
    player.setVelocityY(speed); 
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