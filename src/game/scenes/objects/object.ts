import { Scene } from "phaser";

export interface GObject {

    scene: Scene;
    create(): void;
    animation(): void;
    moviment(): void;
}