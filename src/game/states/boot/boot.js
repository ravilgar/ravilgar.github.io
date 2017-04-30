import Phaser from 'phaser';

export class Boot extends Phaser.State {
    preload() {
        // assets которые будут использоваться на странице загрузки  
        this.game.load.image('logo', 'assets/images/logo.png');
        this.game.load.image('preloadbar', 'assets/images/preloader-bar.png');
    }

    create() {
        // scaling options 
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.minWidth = 240;
        this.game.scale.minHeight = 170;
        this.game.scale.maxWidth = 2880;
        this.game.scale.maxHeight = 1920;

        // выравниваем по середине
        this.game.scale.pageAlignHorizontally = true;

        // размер экрана определять самостоятельно
        // this.game.scale.setScreenSize(true);

        // physics system для задания движения (самая простая)
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // далее запускаем следующий state
        this.game.state.start('load');
    }
}
