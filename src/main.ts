import Phaser from "phaser";
import { registerAnimations } from "./utils/animations";
import { preloadAssets } from "./utils/assets";
import { KeyMap } from "./utils/animation.types";
import { Sprite } from "./Sprite/Sprite";

class Example extends Phaser.Scene {
  private player!: Sprite;
  private enemy!: Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: {
    A: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
    W: Phaser.Input.Keyboard.Key;
    SPACE: Phaser.Input.Keyboard.Key;
  };

  preload() {
    preloadAssets(this);
  }

  create() {
    this.add
      .image(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2,
        "background"
      )
      .setOrigin(0.5, 0.5);

    registerAnimations(this);

    const floor = this.physics.add.staticGroup();
    floor
      .create(this.cameras.main.width / 2, 600)
      .setSize(this.cameras.main.width, 180);
    floor.setVisible(false);

    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.keys = this.input.keyboard.addKeys({
        A: Phaser.Input.Keyboard.KeyCodes.A,
        D: Phaser.Input.Keyboard.KeyCodes.D,
        W: Phaser.Input.Keyboard.KeyCodes.W,
        SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
      }) as KeyMap;
    }

    this.player = new Sprite(
      this,
      100,
      0,
      this.keys,
      this.cursors,
      true,
      "player"
    ); // Player
    this.enemy = new Sprite(
      this,
      500,
      100,
      this.keys,
      this.cursors,
      false,
      "enemy"
    ); // Enemy

    this.physics.add.collider(this.player, floor);
    this.physics.add.collider(this.enemy, floor);
  }

  update() {
    this.player.update();
    this.enemy.update();

    if (this.player.isAttacking) {
      this.physics.overlap(this.player.attackBox, this.enemy, () => {
        // When attack box overlaps with the enemy, apply damage
        console.log("Attack hit!");
        this.player.isAttacking = false;
        this.enemy.takeDamage(10); // Reduce health by 10 (you can adjust this value)
      });
    }
    if (this.enemy.isAttacking) {
      this.physics.overlap(this.player.attackBox, this.enemy, () => {
        // When attack box overlaps with the enemy, apply damage
        console.log("Attack hit!");
        this.enemy.isAttacking = false;
        this.player.takeDamage(10); // Reduce health by 10 (you can adjust this value)
      });
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 576,
  scene: Example,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 800 },
      debug: true,
    },
  },
};

const game = new Phaser.Game(config);
