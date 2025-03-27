import { BaseState } from "./BaseState";
import { Sprite } from "../Sprite/Sprite";

export class GetHitState extends BaseState {
  constructor(sprite: Sprite) {
    super(sprite);
  }
  enter(): void {
    this.sprite.isAnimationInProgress = true; // Prevent other state changes
    this.sprite.play(this.sprite.config.animations.getHit, true).once("animationcomplete", () => {
      this.exit();
    });
  }

  exit(): void {
    this.sprite.isAnimationInProgress = false;
  }
}
