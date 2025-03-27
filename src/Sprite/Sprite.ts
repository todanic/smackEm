import Phaser from "phaser";
import { KeyMap } from "../utils/animation.types";
import { BaseState } from "../states/BaseState";
import { IdleState } from "../states/IdleState";
import { RunState } from "../states/RunState";
import { JumpState } from "../states/JumpState";
import { FallState } from "../states/FallState";
import { AttackState } from "../states/AttackState";
import { GetHitState } from "../states/GetHitState";
import { DeathState } from "../states/DeathState";

export interface SpriteConfig {
  animations: { [key: string]: string }; // Animation keys (e.g., idle, run, attack)
  spriteIndex: number; // Use arrow keys for movement
}

export class Sprite extends Phaser.Physics.Arcade.Sprite {
  public config: SpriteConfig;
  private keys: KeyMap;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  public isAnimationInProgress: boolean = false;
  public health: number;
  public isAttacking: boolean = false;
  public attackBox: Phaser.Physics.Arcade.Body;
  public isDead: boolean = false;
  private currentState!: BaseState;
  private states: { [key: string]: BaseState } = {};
  public opponent!: Sprite; // 🔹 Add this property

  setOpponent(opponent: Sprite) {
    this.opponent = opponent;
  }

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    config: SpriteConfig,
    cursors: Phaser.Types.Input.Keyboard.CursorKeys,
    keys: KeyMap
  ) {
    super(scene, x, y, texture); // Define sprite key, could be parameterized later if needed
    this.config = config;
    this.keys = keys;
    this.cursors = cursors;
    this.health = 100;

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.setScale(2, 2);
    this.body!.setSize(40, 70); // Adjust body size and offset
    this.setCollideWorldBounds(true);

    // Create the attack box as a physics-enabled sprite
    const attackBoxRectangle = scene.add.rectangle(0, 0, 120, 50);
    scene.physics.add.existing(attackBoxRectangle, true); // true means it is a static body
    this.attackBox = attackBoxRectangle.body as Phaser.Physics.Arcade.Body;
    attackBoxRectangle.setVisible(false);

    this.initializeStates();
    this.setActiveState(this.config.animations.idle);
  }

  public setActiveState(stateName: string) {
    if (this.isAnimationInProgress) return;

    this.currentState = this.states[stateName];
    this.currentState.enter();
  }
  private initializeStates() {
    this.states[this.config.animations.idle] = new IdleState(this);
    this.states[this.config.animations.run] = new RunState(this);
    this.states[this.config.animations.jump] = new JumpState(this);
    this.states[this.config.animations.fall] = new FallState(this);
    this.states[this.config.animations.attack] = new AttackState(this);
    this.states[this.config.animations.getHit] = new GetHitState(this);
    this.states[this.config.animations.death] = new DeathState(this);
  }
  public getInputStates() {
    return {
      attack:
        this.config.spriteIndex === 0
          ? Phaser.Input.Keyboard.JustDown(this.keys.SPACE)
          : this.cursors.down.isDown,
      jump:
        this.config.spriteIndex === 0
          ? Phaser.Input.Keyboard.JustDown(this.keys.W)
          : this.cursors.up.isDown,
      left: this.config.spriteIndex === 0 ? this.keys.A.isDown : this.cursors.left.isDown,
      right: this.config.spriteIndex === 0 ? this.keys.D.isDown : this.cursors.right.isDown
    };
  }
  // Method to handle animation and movement updates
  update() {
    if (this.isDead) return;

    const input = this.getInputStates();

    if (input.left || input.right) {
      if (!(this.currentState instanceof RunState)) {
        this.setActiveState(this.config.animations.run);
      }
    } else if (input.jump && this.body!.blocked.down) {
      if (!(this.currentState instanceof JumpState)) {
        this.setActiveState(this.config.animations.jump);
      }
    } else if (input.attack) {
      if (!(this.currentState instanceof AttackState)) {
        this.setActiveState(this.config.animations.attack);
      }
    } else {
      if (!(this.currentState instanceof IdleState)) {
        this.setActiveState(this.config.animations.idle);
      }
    }

    if (this.currentState.update) {
      this.currentState.update(); // Only call update() if it exists
    }

    const xOffset = this.config.spriteIndex === 0 ? 50 : -150;
    this.attackBox.x = this.x + xOffset;
    this.attackBox.y = this.y;
  }
  takeDamage(amount: number) {
    this.health -= amount;
    console.log(this.health);
    if (this.health <= 0) {
      this.die();
    } else {
      this.setActiveState(this.config.animations.getHit); // Switch to GetHitState
    }
  }
  die() {
    this.setActiveState(this.config.animations.death); // Switch to GetHitState
  }
}
