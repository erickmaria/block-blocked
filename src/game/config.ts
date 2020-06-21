import { BootScene } from './scenes/boot.scenes';
import { LoadScene } from './scenes/preload.scenes';
import { MenuScene } from './scenes/stages/menu.scenes';
import { Stage01Scene } from './scenes/stages/01/stage.01.scenes';

const GAME_BG = '#2F3234';
    // DEBUG_MODE = process.env.PROFILE == 'development' ? true : false;

let GameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    backgroundColor: GAME_BG,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: true
        },
    },
    scene: [
        BootScene,
        LoadScene,
        MenuScene,
        Stage01Scene
    ],
    render: {
        pixelArt: true,
        antialias: false
    }
};

export default GameConfig;