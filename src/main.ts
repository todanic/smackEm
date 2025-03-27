import Phaser from "phaser";
import { registerAnimations } from "./utils/animations";
import { preloadAssets, playerConfig, enemyConfig } from "./utils/assets";
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
  private playerHealthBar!: Phaser.GameObjects.Graphics;
  private enemyHealthBar!: Phaser.GameObjects.Graphics;
  private gameOver: boolean = false;

  private timerText!: Phaser.GameObjects.Text;
  private timeRemaining: number = 5; // 60 seconds
  private timerEvent!: Phaser.Time.TimerEvent;
  private timerExpired: boolean = false;

  preload() {
    preloadAssets(this);
  }

  create() {
    this.add
      .image(this.cameras.main.width / 2, this.cameras.main.height / 2, "background")
      .setOrigin(0.5, 0.5);

    registerAnimations(this);

    const floor = this.physics.add.staticGroup();
    floor.create(this.cameras.main.width / 2, 600).setSize(this.cameras.main.width, 180);
    floor.setVisible(false);

    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.keys = this.input.keyboard.addKeys({
        A: Phaser.Input.Keyboard.KeyCodes.A,
        D: Phaser.Input.Keyboard.KeyCodes.D,
        W: Phaser.Input.Keyboard.KeyCodes.W,
        SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE
      }) as KeyMap;
    }

    this.player = new Sprite(this, 100, 0, "player", playerConfig, this.cursors, this.keys); // Player
    this.enemy = new Sprite(this, 500, 100, "enemy", enemyConfig, this.cursors, this.keys); // Enemy

    this.player.setOpponent(this.enemy);
    this.enemy.setOpponent(this.player);

    this.physics.add.collider(this.player, floor);
    this.physics.add.collider(this.enemy, floor);

    this.createHealthBars();
    // this.createTimer();
    this.player.on("died", (data: { isPlayer: boolean }) => this.handleDeath(data.isPlayer));
    this.enemy.on("died", (data: { isPlayer: boolean }) => this.handleDeath(data.isPlayer));
  }

  private createTimer() {
    // Create timer text
    this.timerText = this.add
      .text(
        this.cameras.main.centerX,
        30, // Position below health bars
        this.formatTime(this.timeRemaining),
        {
          fontSize: "32px",
          color: "#ffffff",
          fontStyle: "bold",
          stroke: "#000000",
          strokeThickness: 4
        }
      )
      .setOrigin(0.5);

    // Create timer event
    this.timerEvent = this.time.addEvent({
      delay: 1000, // 1 second
      callback: this.updateTimer,
      callbackScope: this,
      loop: true
    });
  }
  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }
  private updateTimer() {
    this.timeRemaining--;
    this.timerText.setText(this.formatTime(this.timeRemaining));

    if (this.timeRemaining <= 0) {
      // this.timerExpired = true;
      this.handleTimeout();
    }
  }

  private handleTimeout() {
    if (this.gameOver) return;
    console.log(this.timerEvent);
    const playerWins = this.player.health > this.enemy.health;
    if (this.player.health === this.enemy.health) {
      this.timerText.setText("DRAW!");
    } else {
      this.timerText.setText(playerWins ? "PLAYER 1 WINS!" : "PLAYER 2 WINS!");
    }
    this.timerEvent.remove();
    this.handleDeath(playerWins ? true : false);
  }
  private handleDeath(isPlayerDied: boolean) {
    if (this.gameOver) return;
    this.gameOver = true;
    // setTimeout(() => {
    //   this.scene.pause();
    // }, 500);
    // Stop physics and input
    this.physics.pause();
    this.input.keyboard!.enabled = false;

    // Show game over text
    const text = isPlayerDied ? "PLAYER 2 WINS!" : "PLAYER 1 WINS!";
    const gameOverText = this.add
      .text(this.cameras.main.centerX, this.cameras.main.centerY, text, {
        fontSize: "48px",
        color: "#ff0000",
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 4
      })
      .setOrigin(0.5);

    // Add restart option (optional)
    gameOverText.setInteractive();
    gameOverText.on("pointerdown", () => {
      this.scene.restart();
    });
  }
  private createHealthBars() {
    // Player health bar (top-left)
    this.playerHealthBar = this.add.graphics();
    this.playerHealthBar.setPosition(10, 10);

    // Enemy health bar (top-right)
    this.enemyHealthBar = this.add.graphics();
    this.enemyHealthBar.setPosition(this.cameras.main.width - 360, 10);

    // Set initial health bars
    this.drawHealthBar(this.playerHealthBar, 100, 0x00ff00);
    this.drawHealthBar(this.enemyHealthBar, 100, 0xff0000);
  }
  private drawHealthBar(bar: Phaser.GameObjects.Graphics, health: number, color: number) {
    const width = 350; // Increased from 100
    const height = 30; // Increased from 15
    const borderWidth = 4; // Thicker border

    bar.clear();

    // Background (black border)
    bar.fillStyle(0x000000);
    bar.fillRoundedRect(0, 0, width, height, 0); // Rounded corners

    // Health fill (colored portion)
    bar.fillStyle(color);
    const calculatedWidth = Math.max(0, (width - borderWidth * 2) * (health / 100));
    bar.fillRoundedRect(
      borderWidth,
      borderWidth,
      calculatedWidth,
      height - borderWidth * 2,
      0 // Slightly smaller radius for inner rect
    );
  }

  update() {
    this.player.update();
    this.enemy.update();
    if (this.gameOver) return;
    if (this.player.isAttacking) {
      this.physics.overlap(this.player.attackBox, this.enemy, () => {
        // When attack box overlaps with the enemy, apply damage
        this.player.isAttacking = false;
        this.enemy.takeDamage(50); // Reduce health by 10 (you can adjust this value)
      });
    }
    if (this.enemy.isAttacking) {
      this.physics.overlap(this.player.attackBox, this.enemy, () => {
        // When attack box overlaps with the enemy, apply damage
        this.enemy.isAttacking = false;
        this.player.takeDamage(50); // Reduce health by 10 (you can adjust this value)
      });
    }
    this.drawHealthBar(this.playerHealthBar, this.player.health, 0x00ff00);
    this.drawHealthBar(this.enemyHealthBar, this.enemy.health, 0xff0000);
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
      debug: true
    }
  }
};

const game = new Phaser.Game(config);
