import Phaser from 'phaser';
import { Boot } from './states/boot/boot';
import { Load } from './states/load/load';
import { Menu } from './states/menu/menu';
import { Play } from './states/play/play';
import { GameOver } from './states/gameover/gameover';
// import { Victory } from './states/victory/victory';





export class Game extends Phaser.Game {
    constructor() {
        super(800, 600, Phaser.AUTO, 'phaser-canvas', {
            create: () => {
                this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

                this.state.add('boot', Boot);
                this.state.add('load', Load);
                this.state.add('menu', Menu);
                this.state.add('play', Play);
                this.state.add('gameover', GameOver);
                // this.state.add('victory', Victory);

                this.state.start('boot');
            }
        });
    }
}
