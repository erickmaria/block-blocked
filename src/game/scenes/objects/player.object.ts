import { Scene } from "phaser";
import { GObject } from "./object";

interface PlayerMoves {
    shift: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    // cursor: Phaser.Types.Input.Keyboard.CursorKeys;

}

export class PlayerObject extends Phaser.Physics.Arcade.Sprite implements GObject {

    scene: Scene;
    private moves: PlayerMoves;

    // private stamine: number;
    // private health: number;

    private readonly INIT_SPEED: number = (this.scene.sys.game.config.physics.arcade.gravity.y as number)/4;
    private readonly RELATIVE_SPEED: number = 100

    private speed: {
        init: {
            walk: number,
            jump: number
        },
        walk: number,
        jump: number,
        run: number
    };

    constructor(scene: Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        this.scene = scene;
        this.moves = <PlayerMoves>{
            shift: this.scene.input.keyboard.addKey('SHIFT'),
            left: this.scene.input.keyboard.addKey('A'),
            right: this.scene.input.keyboard.addKey('D'),
            up: this.scene.input.keyboard.addKey('W'),
            down: this.scene.input.keyboard.addKey('S'),
            // cursor: this.scene.input.keyboard.createCursorKeys()
        }

        this.speed = {
            init: {
                walk: this.INIT_SPEED,
                jump: this.INIT_SPEED + this.RELATIVE_SPEED,
            },
            walk: this.INIT_SPEED,
            jump: this.INIT_SPEED + this.RELATIVE_SPEED,
            run: this.INIT_SPEED + this.RELATIVE_SPEED,
        }


    }

    create(): void {
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setBounceY(0.2);
        this.setScale(2, 2);
    }

    animation(): void {
        console.log(this.texture.getFrameNames());
        this.scene.anims.create({
            key: 'walk',
            repeat: -1,
            frameRate: 8,
            frames: this.scene.anims.generateFrameNames('player', {
                start: 0,
                end: 2
            })
        });
        this.scene.anims.create({
            key: 'jump',
            repeat: 0,
            frameRate: 6,
            frames: this.scene.anims.generateFrameNames('player', {
                start: 3,
                end: 5
            })
        });
        this.scene.anims.create({
            key: 'idle',
            repeat: -1,
            frameRate: 3,
            frames: this.scene.anims.generateFrameNames('player', {
                start: 0,
                end: 0
            })
        });
    }

    moviment(): void {

        // walk when A or W keyboard key has pressed 
        if (this.moves.right.isDown && !this.moves.left.isDown) {

            console.log('key right pressed');

            this.setVelocityX(this.speed.walk);
            this.setFlipX(false);
            this.anims.play('walk', true);

        }
        if (this.moves.left.isDown && !this.moves.right.isDown) {

            console.log('key left pressed');

            this.setVelocityX(-this.speed.walk);
            this.setFlipX(true);
            this.anims.play('walk', true);


        } 
        
        // Jump if touching on Floor
        if (this.moves.up.isDown && this.body.touching.down) {

            console.log('key up pressed');
            this.setVelocityY(-this.speed.jump);
            this.anims.play('jump', true);

        } else if (this.moves.down.isDown) {

            console.log('key down pressed');

            this.setVelocityY(this.speed.walk);

        } 
        
        // stop when no key pressed
        if (!this.moves.right.isDown && !this.moves.left.isDown && !this.moves.up.isDown && !this.moves.down.isDown){
            console.log('not key pressed');

            this.setVelocityX(0);
            this.anims.play('idle', true);
        }

        // decrease velocity in x when player is not on floor
        if ((!this.body.touching.down && this.moves.right.isDown) && !this.moves.left.isDown) {
            this.setVelocityX(this.speed.walk / 1.5);
        }

        if ((!this.body.touching.down && this.moves.left.isDown) && !this.moves.right.isDown) {
            this.setVelocityX(-this.speed.walk / 1.5);
        }

        // increase speed when shitf keyboard key has pressed
        if (this.moves.shift.isDown) {
            console.log('key shit pressed');
            this.speed.walk = this.speed.run;
            this.speed.jump = this.speed.run * 1.2;
        } else {
            this.speed.walk = this.speed.init.walk;
            this.speed.jump = this.speed.init.jump;
        }

    }

}
