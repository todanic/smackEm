import {
  type AnimationProps,
  type UpdateAnimationProps,
  KeyMap,
  SceneProps,
} from "./animation.types";

let isAnimationInProgress: boolean = false;

export function registerAnimations(scene: Phaser.Scene) {
  const animations: AnimationProps[] = [
    { key: "idle", start: 0, end: 7, imgKey: "player", repeat: -1 },
    { key: "run", start: 0, end: 7, imgKey: "playerRun" },
    { key: "jump", start: 0, end: 1, imgKey: "playerJump" },
    { key: "fall", start: 0, end: 1, imgKey: "playerFall" },
    { key: "attack", start: 0, end: 5, imgKey: "playerAttack" },
    { key: "idle-enemy", start: 0, end: 3, imgKey: "enemy", repeat: -1 },
    { key: "run-enemy", start: 0, end: 7, imgKey: "enemyRun" },
    { key: "jump-enemy", start: 0, end: 1, imgKey: "enemyJump" },
    { key: "fall-enemy", start: 0, end: 1, imgKey: "enemyFall" },
    { key: "attack-enemy", start: 0, end: 3, imgKey: "enemyAttack" },
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
    repeat,
  });
}

export function updateAnimation(args: UpdateAnimationProps) {
  const { cursors, sprite, keys, isPlayer } = args;

  // Determine key states based on whether it's the player or the enemy
  const inputStates = getInputStates({ cursors, keys, isPlayer });

  if (!cursors || isAnimationInProgress) {
    return;
  }

  if (handleAttackAnimation(sprite, inputStates, isPlayer)) return;
  if (handleJumpAnimation(sprite, inputStates, isPlayer)) return;
  if (handleFallAnimation(sprite, isPlayer)) return;
  if (handleRunAnimation(sprite, inputStates, isPlayer)) return;

  handleIdleAnimation(sprite, isPlayer);
}

function getInputStates({
  cursors,
  keys,
  isPlayer,
}: {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  keys: KeyMap;
  isPlayer?: boolean;
}) {
  return {
    attack: isPlayer
      ? Phaser.Input.Keyboard.JustDown(keys.SPACE)
      : cursors.down.isDown,
    jump: isPlayer ? Phaser.Input.Keyboard.JustDown(keys.W) : cursors.up.isDown,
    left: isPlayer ? keys.A.isDown : cursors.left.isDown,
    right: isPlayer ? keys.D.isDown : cursors.right.isDown,
  };
}

function handleAttackAnimation(
  sprite: Phaser.Physics.Arcade.Sprite & { isAttacking: boolean },
  inputStates: { attack: boolean },
  isPlayer?: boolean
) {
  if (!inputStates.attack) return false;
  isAnimationInProgress = true;
  sprite.isAttacking = true;
  console.log(11);
  sprite
    .play(isPlayer ? "attack" : "attack-enemy", true)
    .once("animationcomplete", () => {
      isAnimationInProgress = false;
      sprite.play(
        sprite.body!.touching.down
          ? isPlayer
            ? "idle"
            : "idle-enemy"
          : isPlayer
          ? "fall"
          : "fall-enemy",
        true
      );
      sprite.isAttacking = false;
    });

  return true;
}

function handleJumpAnimation(
  sprite: Phaser.Physics.Arcade.Sprite,
  inputStates: { jump: boolean },
  isPlayer?: boolean
) {
  if (!inputStates.jump || !sprite.body!.touching.down) return false;

  isAnimationInProgress = true;
  sprite.setVelocityY(-400);
  sprite
    .play(isPlayer ? "jump" : "jump-enemy", true)
    .once("animationcomplete", () => {
      isAnimationInProgress = false;
    });

  return true;
}

function handleFallAnimation(
  sprite: Phaser.Physics.Arcade.Sprite,
  isPlayer?: boolean
) {
  if (sprite.body!.touching.down || sprite.body!.velocity.y <= 0) return false;

  sprite.play(isPlayer ? "fall" : "fall-enemy", true);
  return true;
}

function handleRunAnimation(
  sprite: Phaser.Physics.Arcade.Sprite,
  inputStates: { left: boolean; right: boolean },
  isPlayer?: boolean
) {
  if (inputStates.left) {
    sprite.play(isPlayer ? "run" : "run-enemy", true);
    sprite.x -= 3;
    return true;
  }

  if (inputStates.right) {
    sprite.play(isPlayer ? "run" : "run-enemy", true);
    sprite.x += 3;
    return true;
  }

  return false;
}

function handleIdleAnimation(
  sprite: Phaser.Physics.Arcade.Sprite,
  isPlayer?: boolean
) {
  if (sprite.body!.touching.down) {
    sprite.play(isPlayer ? "idle" : "idle-enemy", true);
  }
}

// function checkAttackOverlap(sprite: Phaser.Physics.Arcade.Sprite, isPlayer?: boolean) {
//   this.physics.overlap(
//     sprite.attackBox,  // Assuming sprite has attackBox
//     this.enemy,        // The enemy you want to check the collision with
//     (attackBox, enemy) => {
//       if (sprite.isAttacking) {  // Only deal damage if the player is still attacking
//         console.log("Attack hit!");
//         enemy.takeDamage(10);  // Apply damage
//         sprite.isAttacking = false;  // Reset after damage
//       }
//     }
//   );
// }
