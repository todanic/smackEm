import { type animationProps } from "./animation.types";

export function createAnimation(arg: animationProps) {
  const { scene, key, start, end, frameRate = 10, repeat = -1, imgKey } = arg;

  scene.anims.create({
    key,
    frames: scene.anims.generateFrameNumbers(imgKey, { start, end }),
    frameRate,
    repeat
  });
}
