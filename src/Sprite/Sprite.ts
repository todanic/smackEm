import Phaser from "phaser";
import { KeyMap } from "../utils/animation.types";
import { updateAnimation, handleDeathAnimation } from "../utils/animations"; // Assuming this handles animation updates
import { type AnimationProps } from "../utils/animation.types";
export class Sprite extends Phaser.Physics.Arcade.Sprite {
  private keys: KeyMap;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private isPlayer: boolean;
  public health: number;
  public isAttacking: boolean = false;
  public attackBox: Phaser.Physics.Arcade.Body;
  public isDead: boolean = false;
  // public animations: AnimationProps = [];
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

    this.setScale(2, 2);
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
    if (this.isDead) return;
    // Use updateAnimation function to handle animations and movemednt
    updateAnimation({
      cursors: this.cursors,
      sprite: this,
      keys: this.keys,
      isPlayer: this.isPlayer
    });
    const xOffset = this.isPlayer ? 50 : -150;
    this.attackBox.x = this.x + xOffset;
    this.attackBox.y = this.y;
  }
  takeDamage(amount: number) {
    this.health -= amount;
    console.log(this.health);
    if (this.health <= 0) {
      this.die();
    }
  }
  die() {
    if (this.isDead) return;

    this.isDead = true;

    handleDeathAnimation(this, this.isPlayer);

    // this.anims.stop();
    // this.setTint(0xff0000); // Red tint when dead
    this.body!.checkCollision.none = true; // Disable collisions
    this.setVelocity(0, 0); // Stop all movement

    // Emit death event with player identification
    this.emit("died", { isPlayer: this.isPlayer });
  }
}
