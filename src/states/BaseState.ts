import { Sprite } from "../coomponents/Sprite";

export abstract class BaseState {
  protected sprite: Sprite;

  constructor(sprite: Sprite) {
    this.sprite = sprite;
  }

  abstract enter(): void; // Called when entering the state
  update?(): void;
  abstract exit(): void; // Called when exiting the state
}
