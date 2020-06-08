import { Scene } from "phaser";
import { GObject } from "./object";

interface PlayerMoves {
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    cursor: Phaser.Types.Input.Keyboard.CursorKeys;

}

export class PlayerObject extends Phaser.Physics.Arcade.Sprite implements GObject {

    scene: Scene;
    private moves: PlayerMoves;
    private speed: number;

    constructor(scene: Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        this.scene = scene;
        this.moves = <PlayerMoves>{
            left: this.scene.input.keyboard.addKey('A'),
            right: this.scene.input.keyboard.addKey('D'),
            up: this.scene.input.keyboard.addKey('W'),
            down: this.scene.input.keyboard.addKey('S'),
            cursor: this.scene.input.keyboard.createCursorKeys()
        }
        this.speed = this.scene.sys.game.config.physics.arcade.gravity.y as number;
    }

    create(): void {
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setBounceY(0.2);
        this.setScale(2, 2);
    }

    amination(): void {

    }

    moviment(): void {
        if (this.moves.right.isDown || this.moves.cursor.right.isDown) {
            console.log('key right down');
            this.setVelocityX(this.speed);
        } else if (this.moves.left.isDown || this.moves.cursor.left.isDown) {
            console.log('key left down');
            this.setVelocityX(-this.speed);
        } else if ((this.moves.up.isDown || this.moves.cursor.up.isDown) && this.body.touching.down) {
            console.log('key up down');
            this.setVelocityY(-this.speed);
        } else if (this.moves.down.isDown || this.moves.cursor.down.isDown) {
            console.log('key up down');
            this.setVelocityY(this.speed);
        } else {
            this.setVelocityX(0);
        }
    }

}
