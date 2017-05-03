import Phaser from 'phaser';

export class Menu extends Phaser.State {
    init(score) {
        var score = score || 0;
        this.highestScore = this.highestScore || 0;

        this.highestScore = Math.max(score, this.highestScore);

    }
    create() {
        console.log('main menu');

        // show the space tile, repeated 
        this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'space');
        // give it speed in x 
        this.background.autoScroll(-15, 0);


        let textStyle = { font: '45px Arial', alight: 'center', stroke: 'blue', fill: "#fff" };

        // Название игры
        let title = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 100, 'Space Trip', textStyle);
        title.anchor.set(0.5);

        textStyle.font = '36px Arial';

        // Инструкции
        let instructions = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'Tap to begin', textStyle);
        instructions.anchor.set(0.5);

        // Управление
        let controlMessage = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 150, 'use arrow keys to move', textStyle);
        controlMessage.anchor.set(0.5);

        // Лучший счет
        let highestScoreMessage = 'Highest score is ' + this.highestScore;
        let highestScoreText = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 225, highestScoreMessage, textStyle);
        highestScoreText.anchor.set(0.5);
    }
    update() {
        if (this.game.input.activePointer.justPressed()) {
            this.game.state.start('play');
            // console.log('in the play state');
        }
        
    }

}
