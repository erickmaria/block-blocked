import { Scene } from "phaser";

export class BootScene extends Scene {

    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        console.log("Boot Scene");
    }

    create() {
        this.scene.start("LoadScene");
    }


}