import Phaser from "phaser";
import { createAnimation } from "./utils/animations";

class Example extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private enemy!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: {
    A: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
    W: Phaser.Input.Keyboard.Key;
    SPACE: Phaser.Input.Keyboard.Key;
  };
  private isAttacking: boolean = false;

  preload() {
    this.load.image("sky", "/images/background.png");
    this.load.spritesheet("player", "/images/martial-hero/Sprites/Idle.png", {
      frameWidth: 200,
      frameHeight: 200
    });
    this.load.spritesheet("playerRun", "/images/martial-hero/Sprites/Run.png", {
      frameWidth: 200,
      frameHeight: 200
    });
    this.load.spritesheet("playerJump", "/images/martial-hero/Sprites/Jump.png", {
      frameWidth: 200,
      frameHeight: 200
    });
    this.load.spritesheet("playerAttack", "/images/martial-hero/Sprites/Attack1.png", {
      frameWidth: 200,
      frameHeight: 200
    });

    this.load.spritesheet("enemy", "/images/kenji/Idle.png", {
      frameWidth: 200,
      frameHeight: 200
    });
    this.load.spritesheet("enemyRun", "/images/kenji/Run.png", {
      frameWidth: 200,
      frameHeight: 200
    });
    this.load.spritesheet("enemyJump", "/images/kenji/Jump.png", {
      frameWidth: 200,
      frameHeight: 200
    });
  }

  create() {
    this.add
      .image(this.cameras.main.width / 2, this.cameras.main.height / 2, "sky")
      .setOrigin(0.5, 0.5);
    createAnimation({ scene: this, key: "idle", start: 0, end: 7, imgKey: "player" });
    createAnimation({ scene: this, key: "run", start: 0, end: 7, imgKey: "playerRun" });
    createAnimation({ scene: this, key: "jump", start: 0, end: 1, imgKey: "playerJump" });
    createAnimation({ scene: this, key: "attack", start: 0, end: 5, imgKey: "playerAttack" });

    createAnimation({ scene: this, key: "idle-enemy", start: 0, end: 3, imgKey: "enemy" });
    createAnimation({ scene: this, key: "run-enemy", start: 0, end: 7, imgKey: "enemyRun" });
    createAnimation({ scene: this, key: "jump-enemy", start: 0, end: 1, imgKey: "enemyJump" });

    this.player = this.physics.add.sprite(100, 0, "player").setScale(2, 2); // Start at the top (y=0)
    this.player.body!.setSize(50, 70); // Adjust body size and offset
    this.player.setCollideWorldBounds(true); // Prevent leaving the screen
    this.player.addListener(
      Phaser.Animations.Events.ANIMATION_COMPLETE,
      (anim: { key: string }, frame: any, gameObject: Phaser.Physics.Arcade.Sprite) => {
        console.log("Animation completed:", anim.key);
        if (anim.key === "attack" && gameObject === this.player) {
          this.player.play("idle", true);
        }
      }
    );

    this.enemy = this.physics.add.sprite(500, 100, "enemy").setScale(2, 2);
    this.enemy.body!.setSize(50, 80);
    this.enemy.setCollideWorldBounds(true); // Prevent leaving the screen

    const floor = this.physics.add.staticGroup();
    floor.create(this.cameras.main.width / 2, 600).setSize(this.cameras.main.width, 180);
    floor.setVisible(false);

    this.physics.add.collider(this.player, floor);
    this.physics.add.collider(this.enemy, floor);

    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.keys = this.input.keyboard.addKeys({
        A: Phaser.Input.Keyboard.KeyCodes.A,
        D: Phaser.Input.Keyboard.KeyCodes.D,
        W: Phaser.Input.Keyboard.KeyCodes.W,
        SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE
      }) as {
        A: Phaser.Input.Keyboard.Key;
        D: Phaser.Input.Keyboard.Key;
        W: Phaser.Input.Keyboard.Key;
        SPACE: Phaser.Input.Keyboard.Key;
      };
    }

    console.log("Attack Animation Details:", this.anims.get("attack"));
  }

  update() {
    if (this.cursors) {
      if (this.isAttacking) {
        // Do nothing while attacking
        return;
      }

      if (this.keys.A.isDown) {
        this.player.play("run", true).once("animationcomplete", () => {
          console.log(11);
        });
        this.player.x -= 3;
      } else if (this.keys.D.isDown) {
        this.player.play("run", true);
        this.player.x += 3;
      } else if (this.keys.W.isDown && this.player.body!.touching.down) {
        this.player.setVelocityY(-400);
        this.player.play("jump", true);
      } else if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) {
        this.isAttacking = true;
        this.player.play("attack", true).once("animationcomplete", () => {
          console.log(11);
          this.player.play("idle", true);
        });
      } else {
        if (this.player.anims.currentAnim?.key !== "attack") {
          this.player.play("idle", true);
        }
      }

      if (this.cursors.left.isDown) {
        this.enemy.play("run-enemy", true);
        this.enemy.x -= 3;
      } else if (this.cursors.right.isDown) {
        this.enemy.play("run-enemy", true);
        this.enemy.x += 3;
      } else if (this.cursors.up.isDown && this.enemy.body!.touching.down) {
        this.enemy.setVelocityY(-400);
        this.enemy.play("jump-enemy", true);
      } else {
        this.enemy.play("idle-enemy", true);
      }
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
      gravity: { x: 0, y: 500 },
      debug: true
    }
  }
};

const game = new Phaser.Game(config);
