import { Sprite } from "../Sprite/Sprite";

export interface SceneProps {
  scene: Phaser.Scene;
}

export type AnimationProps = {
  imgKey: string;
  key: string;
  start: number;
  end: number;
  frameRate?: number;
  repeat?: number;
};

export enum KeyBindings {
  A = Phaser.Input.Keyboard.KeyCodes.A,
  D = Phaser.Input.Keyboard.KeyCodes.D,
  W = Phaser.Input.Keyboard.KeyCodes.W,
  SPACE = Phaser.Input.Keyboard.KeyCodes.SPACE
}
export type KeyMap = {
  [key in keyof typeof KeyBindings]: Phaser.Input.Keyboard.Key;
};
export type UpdateAnimationProps = {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  sprite: Sprite;
  keys: KeyMap;
  isPlayer?: boolean;
};

export enum AnimationType {
  Idle,
  Run,
  Jump,
  Fall,
  Attack
}
