import { BaseState } from "./BaseState";
import { Sprite } from "../coomponents/Sprite";

export class FallState extends BaseState {
  constructor(sprite: Sprite) {
    super(sprite);
  }

  enter(): void {
    this.sprite.isAnimationInProgress = true;
    this.sprite.play(this.sprite.config.animations.fall, true);
  }

  update(): void {
    if (this.sprite.body!.touching.down || this.sprite.body!.velocity.y <= 0) {
      this.exit();
    }
  }

  exit(): void {
    this.sprite.isAnimationInProgress = false;
  }
}
