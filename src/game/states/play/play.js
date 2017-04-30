import Phaser from 'phaser';

import getDegrees from './lib/getDegrees';

export class Play extends Phaser.State {
    create() {
        // первоначальный счет равен 0
        this.playerScore = 0;

        // задаем размеры игрового поля
        this.game.world.setBounds(0, 0, this.game.width * 12, this.game.height);

        // показываем фоновое изображение космоса, с повторением
        this.background = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'space');
        // задаем движение космоса
        this.background.autoScroll(-2, 2);
        // загружаем фоновый звук
        this.secretConversationsSound = this.game.add.audio('secretConversationsSound');
        // звук проигрывается: play(marker, position, volume, loop, forceRestart) → {Phaser.Sound}; http://phaser.io/docs/2.3.0/Phaser.Sound.html
        this.secretConversationsSound.play('', 0, 1, true, false);

        // создаем игрока (космический корабль), задаем анимацию
        this.createAndAnimateShip(20);

        // добавляем звук, запустим дальше
        this.collectSound = this.game.add.audio('collectSound');

        // создаем драгоценности, которые дают бонусы и которые нужно собирать
        this.generateJewelries();

        // создаем астероиды
        this.generateAsteriods();

        // подключаем физику 
        this.playerPhysics()

        // выводим счет на экран
        this.showLabels();


        // кнопки управления
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.keys = this.game.input.keyboard.addKeys({
            'up': Phaser.KeyCode.W,
            'down': Phaser.KeyCode.S,
            'left': Phaser.KeyCode.A,
            'right': Phaser.KeyCode.D,
            'spacebar': Phaser.KeyCode.SPACEBAR
        });

        // создаем оружие
        this.createWeapon();
    }

    update() {

        // устанавливаем камеру
        this.game.camera.setPosition(this.player.x - this.game.width * 0.2, this.game.world.centerY);

        // движение вслед за нажатием (касанием); в мобильной версии отключить
        if (this.game.input.activePointer.justPressed() && (this.game.input.activePointer.worldX > this.player.x)) {
            // задаем значение угла между мышкой и ship
            let currentAngle = this.game.physics.arcade.angleToPointer(this.player);
            // меняем угол наклона корабля
            this.player.angle = getDegrees(currentAngle);

            // двигаемся на нажатие
            this.game.physics.arcade.moveToPointer(this.player, this.playerSpeed);
        }

        // кнопки вперед, назад, влево и вправо
        if (this.cursors.up.isDown || this.keys.up.isDown) {
            console.log("up!");
            if (this.speed <= (this.weapon.bulletSpeed / 2)) {
                this.speed += this.changeSpeed;
            }
            this.game.physics.arcade.velocityFromAngle(this.player.angle, this.speed, this.player.body.velocity);
        }
        if (this.cursors.down.isDown || this.keys.down.isDown) {
            console.log("down!");
            if (this.speed >= this.changeSpeed) {
                this.speed -= this.changeSpeed;
            } else {
                this.speed = 0;
            }
            this.game.physics.arcade.velocityFromAngle(this.player.angle, this.speed, this.player.body.velocity);
        }
        if (this.cursors.left.isDown || this.keys.left.isDown) {
            console.log("left!");
            if (this.player.body.rotation >= -60) {
                this.player.body.rotation -= 3;
            }
            this.game.physics.arcade.velocityFromAngle(this.player.angle, this.speed, this.player.body.velocity);
        }
        if (this.cursors.right.isDown || this.keys.right.isDown) {
            console.log("right!");
            if (this.player.body.rotation <= 60) {
                this.player.body.rotation += 3;
            }
            this.game.physics.arcade.velocityFromAngle(this.player.angle, this.speed, this.player.body.velocity);
        }
        if (this.keys.spacebar.downDuration(1)) {
            console.log("spacebar!")
            this.fireBullet();

        }



        // столкновение пули с астероидом
        this.game.physics.arcade.collide(this.weapon.bullets, this.asteroids, this.fireAsteroid, null, this);

        // столкновение корабля с астероидом
        this.game.physics.arcade.collide(this.player, this.asteroids, this.hitAsteroid, null, this);

        // сбор драгоценностей
        this.game.physics.arcade.overlap(this.player, this.jewelries, this.collect, null, this);
    }

    // создаем космический корабль, задаем его анимацию
    createAndAnimateShip(speed) {
        // создаем корабль
        this.player = this.game.add.sprite(this.game.width * 0.2, this.game.world.centerY, 'playership');
        this.player.anchor.setTo(0.5);
        // анимируем корабль
        this.player.animations.add('fly', [0, 1], speed, true);
        this.player.animations.play('fly');
    }

    playerPhysics() {
        this.game.physics.arcade.enable(this.player);
        this.playerSpeed = 200;
        // при нажатии кнопок вверх и вниз
        this.speed = 0;
        // меняем скорость на
        this.changeSpeed = 5;
        this.player.body.collideWorldBounds = true;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
    }

    // создаем драгоценности, которые дают бонусы и которые нужно собирать
    generateJewelries() {
        this.jewelries = this.game.add.group();
        // включаем физику
        this.jewelries.enableBody = true;
        this.jewelries.physicsBodyType = Phaser.Physics.ARCADE;

        // количество драгоценностей
        let numJewelries = 12;
        let jewelrie;

        for (let i = 0; i < numJewelries; i++) {
            //add sprite
            jewelrie = this.jewelries.create(((this.game.world.width / numJewelries) * i) + 400, this.game.world.randomY, 'gem');
        }

    }

    // сбор драгоценностей, увеличение счета
    collect(player, jewelrie) {
        //play collect sound 
        this.collectSound.play();
        //update score 
        this.playerScore++;
        //will add later: 
        this.scoreLabel.text = this.playerScore;
        //remove sprite
        jewelrie.destroy();

        // создаем оружие
        this.createWeapon();
    }
    showLabels() {
        //score text
        let text = "0";
        let style = { font: "20px Arial", fill: "#fff", align: "center" };
        this.scoreLabel = this.game.add.text(this.game.width - 50, this.game.height - 50, text, style);
        this.scoreLabel.fixedToCamera = true;
    }

    // генерируем астероиды
    generateAsteriods() {
        this.asteroids = this.game.add.group();
        // подключаем физику
        this.asteroids.enableBody = true;
        this.asteroids.physicsBodyType = Phaser.Physics.ARCADE;
        // получаем случайное число  (количество создаваемых астероидов)
        let numAsteroids = this.game.rnd.integerInRange(50, 100);
        let asteriod;

        for (let i = 0; i < numAsteroids; i++) {
            // добавляем sprites в случайном месте игрового поля 
            asteriod = this.asteroids.create(this.game.world.randomX + 500, this.game.world.randomY, 'meteorite');
            // меняем размеры астероидов
            asteriod.scale.setTo(this.game.rnd.integerInRange(5, 30) / 60);
            //physics properties
            asteriod.body.velocity.x = this.game.rnd.integerInRange(-40, 40);
            asteriod.body.velocity.y = this.game.rnd.integerInRange(-40, 40);
            // используем immovable = true, чтобы траектории метеоритов не менялись при столкновении с игроком
            asteriod.body.immovable = true;
            // чтобы астероиды не покидали игрового поля
            asteriod.body.collideWorldBounds = true;
        }
    }

    // создаем оружие
    createWeapon() {

        //  Creates bullets, using the 'bullet' graphic
        this.weapon = this.game.add.weapon(this.playerScore, 'bullet');

        //  The bullet will be automatically killed when it leaves the world bounds
        this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

        //  The speed at which the bullet is fired
        this.weapon.bulletSpeed = 800;

        //  Tell the Weapon to track the 'player' Sprite
        //  With no offsets from the position
        //  But the 'true' argument tells the weapon to track sprite rotation
        this.weapon.trackSprite(this.player, 50, 0, true);
    }
    fireBullet() {
        if (this.playerScore > 0) {
            this.weapon.fire();

            //update score 
            this.playerScore--;

            //will add later: 
            this.scoreLabel.text = this.playerScore;
        }
    }
    fireAsteroid(player, asteroid) {
        console.log('TRUEE!!!');
        this.weapon.killAll();
        asteroid.kill();
    }

    // при столкновении корабля с астероидом
    hitAsteroid() {
        // добавляем звук столкновения
        this.explosionSound = this.game.add.audio('explosionSound');
        // проигрываем звук столкновения
        this.explosionSound.play('', 0, 0.15);
        // останавливаем фоновый звук
        this.secretConversationsSound.stop();

        // создаем взрыв корабля 
        let emitter = this.game.add.emitter(this.player.x, this.player.y, 100);
        emitter.makeParticles('explosion');
        emitter.minParticleSpeed.setTo(-100, -200);
        emitter.maxParticleSpeed.setTo(300, 200);
        emitter.gravity = 0;
        emitter.start(true, 1000, null, 4);

        // игрок проигрывает
        this.player.kill();

        // заканчиваем игру через 820 мс после столкновения
        this.game.time.events.add(820, this.gameOver, this);
    }
    gameOver() {
        //pass it the score as a parameter 
        this.game.state.start('menu', true, false, this.playerScore);
    }

}
