import { Scene, Geom, GameObjects, Physics } from "phaser";
import { PlayerObject } from "../../objects/player.object";

export class Stage01Scene extends Scene {

    private ground: any;
    private player: any;
    private pg: any;

    constructor() {
        super({ key: 'Stage01Scene' });
    }

    preload() {
        console.log('Stage 01 Scene');
    }

    create() {
        this.player = new PlayerObject(this, 50, Number(this.game.config.width) - 300, 'player');
        this.player.create();
        this.player.animation();

        this.ground = this.add.rectangle(0, Number(this.game.config.height) - 20, Number(this.game.config.width) * 2, 40, 0x00000, 1);
        this.pg = this.physics.add.existing(this.ground, true);

        this.physics.add.collider(this.player, this.ground);
        // this.physics.overlap(this.player, this.ground, null, (e) => {
        //     console.log('touching');       
        // }, null);
    }
    
    update () {
        this.player.moviment();
    }

}