import { Scene, Physics } from "phaser";

export class LoadScene extends Scene {

    private assets_folder: string = '../assets';

    constructor() {
        super({ key: "LoadScene" });
    }

    preload() {
        console.log("Load Scene");

        this.load.image('block', `${this.assets_folder}/block.png`);
        this.load.spritesheet('player', `${this.assets_folder}/blockboy.png`,
            {
                frameWidth: 16,
                frameHeight: 16
            });
        this.load.image('spikes', `${this.assets_folder}/spikes.png`);

    }

    create() {
        this.scene.start("MenuScene");
    }
}