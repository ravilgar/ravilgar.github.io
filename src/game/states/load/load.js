import Phaser from 'phaser';

export class Load extends Phaser.State {
    preload() {
        this.splash = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        this.splash.anchor.setTo(0.5);

        this.preloadBar = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadbar');
        this.preloadBar.anchor.setTo(0.5);
        this.game.load.setPreloadSprite(this.preloadBar, 0);


        // load game assets

        // images
        this.game.load.image('space', 'assets/images/space3.png');
        this.game.load.image('meteorite', 'assets/images/meteorite.png');
        this.game.load.spritesheet('playership', 'assets/images/ship2.png', 91, 31, 2);
        this.game.load.image('protection', 'assets/images/protection.png');
        this.game.load.image('station', 'assets/images/gas-station.png');
        this.game.load.image('gem', 'assets/images/gem.png');
        this.game.load.image('explosion', 'assets/images/explosion.png');

        // audio
        this.game.load.audio('secretConversationsSound', ['assets/audio/secret-conversations.ogg', 'assets/sounds/secret-conversations.mp3']);
        this.game.load.audio('explosionSound', ['assets/audio/explosion.ogg', 'assets/sounds/explosion.mp3']);
        this.game.load.audio('collectSound', ['assets/audio/collect.ogg', 'assets/sounds/collect.mp3']);
    }

    create() {
        this.game.state.start('menu');
    }

}
