import { type AnimationProps, SceneProps } from "./animation.types";

export function registerAnimations(scene: Phaser.Scene) {
  const animations: AnimationProps[] = [
    { key: "shop", start: 0, end: 5, imgKey: "shop", repeat: -1 },
    { key: "idle", start: 0, end: 7, imgKey: "player", repeat: -1 },
    { key: "run", start: 0, end: 7, imgKey: "playerRun" },
    { key: "jump", start: 0, end: 1, imgKey: "playerJump" },
    { key: "fall", start: 0, end: 1, imgKey: "playerFall" },
    { key: "attack", start: 0, end: 5, imgKey: "playerAttack" },
    { key: "death", start: 0, end: 5, imgKey: "playerDeath" },
    { key: "take-hit", start: 0, end: 3, imgKey: "playerTakeHit" },

    { key: "idle-enemy", start: 0, end: 3, imgKey: "enemy", repeat: -1 },
    { key: "run-enemy", start: 0, end: 7, imgKey: "enemyRun" },
    { key: "jump-enemy", start: 0, end: 1, imgKey: "enemyJump" },
    { key: "fall-enemy", start: 0, end: 1, imgKey: "enemyFall" },
    { key: "attack-enemy", start: 0, end: 7, imgKey: "enemyAttack" },
    { key: "death-enemy", start: 0, end: 6, imgKey: "enemyDeath" },
    { key: "take-hit-enemy", start: 0, end: 3, imgKey: "enemyTakeHit" }
  ];

  // Loop through and create animations
  animations.forEach((animation) => createAnimation({ scene, ...animation }));
}

function createAnimation(arg: AnimationProps & SceneProps) {
  const { scene, key, start, end, frameRate = 10, repeat = 0, imgKey } = arg;

  scene.anims.create({
    key,
    frames: scene.anims.generateFrameNumbers(imgKey, { start, end }),
    frameRate,
    repeat
  });
}
