import { BaseState } from "./BaseState";
import { Sprite } from "../coomponents/Sprite";

export class IdleState extends BaseState {
  protected sprite: Sprite;

  constructor(sprite: Sprite) {
    super(sprite);
    this.sprite = sprite;
  }
  enter(): void {
    this.sprite.play(this.sprite.config.animations.idle, true);
  }
  exit(): void {
    // Cleanup if needed
  }
}
