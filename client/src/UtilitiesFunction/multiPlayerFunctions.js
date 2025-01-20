// function for removing player
export function deletePlayer(player) {
  if (player) {
    player.destroy();
    player.playerNameText.destroy();
  }
}


// function for moving player to target position
export function movePlayerTo(player, targetX, targetY, animation, scene,speed = 1000) {
  if (animation === 'left') 
    player.setFlipX(true); 
  player?.anims?.play(String(animation), true); 

  scene.tweens.add({
    targets: player,
    x: targetX,
    y: targetY,
    duration: speed,
    ease: "Power2",
    onComplete: () => {
      player?.anims?.play("turn", true);
      if (animation === 'left') 
        player.setFlipX(false); 
    },
  });
}