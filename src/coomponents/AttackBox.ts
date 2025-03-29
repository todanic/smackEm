import { Sprite } from "./Sprite";

export class AttackBox {
  private hitbox: Phaser.Physics.Arcade.Body;

  constructor(private sprite: Sprite, scene: Phaser.Scene) {
    const attackBoxRectangle = scene.add.rectangle(0, 0, 120, 50);
    scene.physics.add.existing(attackBoxRectangle, true); // Static body
    attackBoxRectangle.setVisible(false);

    this.hitbox = attackBoxRectangle.body as Phaser.Physics.Arcade.Body;
    this.hitbox.enable = false;
  }

  updatePosition() {
    const xOffset = this.sprite.config.spriteIndex === 1 ? 50 : -150; // Adjust position based on sprite facing direction
    this.hitbox.x = this.sprite.x + xOffset;
    this.hitbox.y = this.sprite.y;
  }

  getBody() {
    return this.hitbox;
  }

  enable() {
    this.hitbox.enable = true;
  }

  disable() {
    this.hitbox.enable = false;
  }
}
