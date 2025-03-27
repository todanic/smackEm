import { BaseState } from "./BaseState";
import { Sprite } from "../Sprite/Sprite";

export class JumpState extends BaseState {
  protected sprite: Sprite;

  constructor(sprite: Sprite) {
    super(sprite);
    this.sprite = sprite;
  }
  enter(): void {
    this.sprite.isAnimationInProgress = true;
    this.sprite.setVelocityY(-400); // Adjust jump height as needed
    this.sprite.play(this.sprite.config.animations.jump, true);
  }

  update(): void {
    if (this.sprite.body!.velocity.y > 0) {
      this.exit();
    }
  }

  exit(): void {
    this.sprite.isAnimationInProgress = false;
    this.sprite.setActiveState(this.sprite.config.animations.fall);
  }
}
