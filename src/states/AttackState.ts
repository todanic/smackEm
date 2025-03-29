import { BaseState } from "./BaseState";
import { Sprite } from "../coomponents/Sprite";

export class AttackState extends BaseState {
  constructor(sprite: Sprite) {
    super(sprite);
  }
  enter(): void {
    this.sprite.isAnimationInProgress = true;
    this.sprite.play(this.sprite.config.animations.attack, true).once("animationcomplete", () => {
      this.sprite.attackBox.enable();
      this.checkForHit();
      this.exit();
    });
  }

  checkForHit(): void {
    const { scene } = this.sprite;

    scene.physics.overlap(
      this.sprite.attackBox.getBody(),
      this.sprite.opponent,
      (_attackBox, opponent) => {
        (opponent as Sprite).takeDamage(20);
      }
    );
  }

  exit(): void {
    this.sprite.attackBox.disable();
    this.sprite.isAnimationInProgress = false;
  }
}
