import { Scene } from "phaser";

export interface GObject {

    scene: Scene;
    create(): void;
    amination(): void;
    moviment(): void;
}