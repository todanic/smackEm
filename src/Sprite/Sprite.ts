import Phaser from "phaser";
import { KeyMap } from "../utils/animation.types";
import { updateAnimation } from "../utils/animations"; // Assuming this handles animation updates

export class Sprite extends Phaser.Physics.Arcade.Sprite {
  private keys: KeyMap;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private isPlayer: boolean;
  public health: number;
  public isAttacking: boolean = false;
  public attackBox: Phaser.Physics.Arcade.Body;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    keys: KeyMap,
    cursors: Phaser.Types.Input.Keyboard.CursorKeys,
    isPlayer: boolean = true,
    texture: string
  ) {
    super(scene, x, y, texture); // Define sprite key, could be parameterized later if needed
    this.keys = keys;
    this.cursors = cursors;
    this.isPlayer = isPlayer;
    this.health = 100;

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.setScale(2, 2); // Scaling to fit your requirement
    this.body!.setSize(40, 70); // Adjust body size and offset
    this.setCollideWorldBounds(true);

    // Create the attack box as a physics-enabled sprite
    const attackBoxRectangle = scene.add.rectangle(0, 0, 120, 50);
    scene.physics.add.existing(attackBoxRectangle, true); // true means it is a static body
    this.attackBox = attackBoxRectangle.body as Phaser.Physics.Arcade.Body;
    attackBoxRectangle.setVisible(false);
  }

  // Method to handle animation and movement updates
  update() {
    // Use updateAnimation function to handle animations and movemednt
    updateAnimation({
      cursors: this.cursors,
      sprite: this,
      keys: this.keys,
      isPlayer: this.isPlayer,
    });
    const xOffset = this.isPlayer ? 50 : -150;
    this.attackBox.x = this.x + xOffset;
    this.attackBox.y = this.y;

    console.log(this.health);
  }
  takeDamage(amount: number) {
    this.health -= amount;
    if (this.health <= 0) {
      this.die();
    }
  }
  die() {}
}

// triggerAttack() {

//   // Check overlap with opponent
//   this.scene.physics.overlap(this.attackArea, this.isPlayer ? this.scene.enemy : this.scene.player, (hitbox, target) => {
//     if (target && target.takeDamage) {
//       target.takeDamage(10); // Example: reduce 10 health on hit
//     }
//   });

//   // Deactivate the attack area after a short period
//   this.scene.time.delayedCall(200, () => {
//     this.attackArea.setAlpha(0); // Make it invisible again
//   });
// }
