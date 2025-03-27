import { BaseState } from "./BaseState";
import { Sprite } from "../Sprite/Sprite";

export class DeathState extends BaseState {
  constructor(sprite: Sprite) {
    super(sprite);
  }
  enter(): void {
    this.sprite.isAnimationInProgress = true;
    this.sprite.play(this.sprite.config.animations.death, true).once("animationcomplete", () => {
      this.sprite.isDead = true;
      this.exit();
    });
  }

  exit(): void {
    this.sprite.isAnimationInProgress = false;
  }
}
