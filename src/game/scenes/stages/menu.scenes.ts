import { Scene } from "phaser";

export class MenuScene extends Scene {
    constructor(){
        super({key: "MenuScene"})
    }

    preload(){
        console.log("Menu Scene");
    }

    create() {
        this.scene.start('Stage01Scene');
    }
}