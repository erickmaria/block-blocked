import { Scene, GameObjects, Cameras } from "phaser"
import { World } from "matter";

export class Stage01Scene extends Scene {

    constructor() {
        super({ key: 'Stage01Scene' });
    }
    
    preload(){
        console.log('Stage01 Scene');
    }

    create() {
        let player = this.add.sprite(400, 300, 'player');
        player.setScale(2, 2);
    }

}