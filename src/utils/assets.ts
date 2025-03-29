// Preloads all necessary assets for the game, including background images,
// player and enemy spritesheets for various animations (idle, run, jump, attack, etc.).
export function preloadAssets(scene: Phaser.Scene) {
  scene.load.image("background", "/images/background.png");
  scene.load.spritesheet("shop", "/images/shop_anim.png", {
    frameWidth: 118,
    frameHeight: 118
  });
  // Load player spritesheets
  scene.load.spritesheet("player", "/images/martial-hero/Sprites/Idle.png", {
    frameWidth: 200,
    frameHeight: 200
  });
  scene.load.spritesheet("playerRun", "/images/martial-hero/Sprites/Run.png", {
    frameWidth: 200,
    frameHeight: 200
  });
  scene.load.spritesheet("playerJump", "/images/martial-hero/Sprites/Jump.png", {
    frameWidth: 200,
    frameHeight: 200
  });
  scene.load.spritesheet("playerFall", "/images/martial-hero/Sprites/Fall.png", {
    frameWidth: 200,
    frameHeight: 200
  });
  scene.load.spritesheet("playerAttack", "/images/martial-hero/Sprites/Attack2.png", {
    frameWidth: 200,
    frameHeight: 200
  });
  scene.load.spritesheet("playerDeath", "/images/martial-hero/Sprites/Death.png", {
    frameWidth: 200,
    frameHeight: 200
  });
  scene.load.spritesheet("playerTakeHit", "/images/martial-hero/Sprites/Take-Hit.png", {
    frameWidth: 200,
    frameHeight: 200
  });
  // Load enemy spritesheets
  scene.load.spritesheet("enemy", "/images/kenji/Idle.png", {
    frameWidth: 200,
    frameHeight: 200
  });
  scene.load.spritesheet("enemyRun", "/images/kenji/Run.png", {
    frameWidth: 200,
    frameHeight: 200
  });
  scene.load.spritesheet("enemyJump", "/images/kenji/Jump.png", {
    frameWidth: 200,
    frameHeight: 200
  });
  scene.load.spritesheet("enemyFall", "/images/kenji/Fall.png", {
    frameWidth: 200,
    frameHeight: 200
  });
  scene.load.spritesheet("enemyAttack", "/images/kenji/Attack2.png", {
    frameWidth: 200,
    frameHeight: 200
  });
  scene.load.spritesheet("enemyDeath", "/images/kenji/Death.png", {
    frameWidth: 200,
    frameHeight: 200
  });
  scene.load.spritesheet("enemyTakeHit", "/images/kenji/take-hit.png", {
    frameWidth: 200,
    frameHeight: 200
  });
}

export const playerConfig = {
  animations: {
    idle: "idle",
    run: "run",
    jump: "jump",
    attack: "attack",
    death: "death",
    fall: "fall",
    getHit: "take-hit"
  },
  spriteIndex: 1
};

export const enemyConfig = {
  animations: {
    idle: "idle-enemy",
    run: "run-enemy",
    jump: "jump-enemy",
    attack: "attack-enemy",
    death: "death-enemy",
    fall: "fall-enemy",
    getHit: "take-hit-enemy"
  },
  spriteIndex: 2
};
