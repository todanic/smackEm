export function preloadAssets(scene: Phaser.Scene) {
  // Load background image
  scene.load.image("background", "/images/background.png");

  // Load player spritesheets
  scene.load.spritesheet("player", "/images/martial-hero/Sprites/Idle.png", {
    frameWidth: 200,
    frameHeight: 200,
  });
  scene.load.spritesheet("playerRun", "/images/martial-hero/Sprites/Run.png", {
    frameWidth: 200,
    frameHeight: 200,
  });
  scene.load.spritesheet(
    "playerJump",
    "/images/martial-hero/Sprites/Jump.png",
    {
      frameWidth: 200,
      frameHeight: 200,
    }
  );
  scene.load.spritesheet(
    "playerFall",
    "/images/martial-hero/Sprites/Fall.png",
    {
      frameWidth: 200,
      frameHeight: 200,
    }
  );
  scene.load.spritesheet(
    "playerAttack",
    "/images/martial-hero/Sprites/Attack1.png",
    {
      frameWidth: 200,
      frameHeight: 200,
    }
  );

  // Load enemy spritesheets
  scene.load.spritesheet("enemy", "/images/kenji/Idle.png", {
    frameWidth: 200,
    frameHeight: 200,
  });
  scene.load.spritesheet("enemyRun", "/images/kenji/Run.png", {
    frameWidth: 200,
    frameHeight: 200,
  });
  scene.load.spritesheet("enemyJump", "/images/kenji/Jump.png", {
    frameWidth: 200,
    frameHeight: 200,
  });
  scene.load.spritesheet("enemyFall", "/images/kenji/Fall.png", {
    frameWidth: 200,
    frameHeight: 200,
  });
  scene.load.spritesheet("enemyAttack", "/images/kenji/Attack1.png", {
    frameWidth: 200,
    frameHeight: 200,
  });
}
