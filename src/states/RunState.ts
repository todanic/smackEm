import { BaseState } from "./BaseState";
import { Sprite } from "../Sprite/Sprite";

export class RunState extends BaseState {
  protected sprite: Sprite;

  constructor(sprite: Sprite) {
    super(sprite);
    this.sprite = sprite;
  }
  enter(): void {
    this.sprite.play(this.sprite.config.animations.run, true);
  }

  update(): void {
    const input = this.sprite.getInputStates();

    if (input.left) {
      this.sprite.x -= 3;
    }
    if (input.right) {
      this.sprite.x += 3;
    }
  }

  exit(): void {
    // this.sprite.setVelocityX(0);
  }
}
