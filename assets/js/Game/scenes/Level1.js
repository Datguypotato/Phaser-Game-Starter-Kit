import { Scene } from 'phaser';
export default class Level1 extends Scene {
	constructor() {
		super({
			key: 'Level1'
		});
	}
	preload() {
		this.load.image('sky', '/assets/img/sky.png');
		this.load.image('ground', '/assets/img/platform.png');
		this.load.image('star', '/assets/img/star.png');
		this.load.image('bomb', '/assets/img/bomb.png');
		this.load.spritesheet('dude', '/assets/img/dude.png', {
			frameWidth: 32,
			frameHeight: 48
		});
		this.load.audio('coin_sound', ['assets/audio/sfx_coin_double4.wav']);

		// this.preloadBar = this.add.sprite(
		// 	this.game.world.centerX,
		// 	this.game.world.centerY + 128,
		// 	'preloadBar'
		// );
		// this.preloadBar.anchor.setTo(0.5);
	}
	create() {
		this.add.image(400, 300, 'sky');
		this.platforms = this.physics.add.staticGroup();
		this.platforms
			.create(0, 0, 'ground')
			.setOrigin(0, 0)
			.setScale(1)
			.refreshBody();
		this.platforms
			.create(300, 200, 'ground')
			.setOrigin(0, 0)
			.setScale(1)
			.refreshBody();
		this.platforms
			.create(500, 100, 'ground')
			.setOrigin(0, 0)
			.refreshBody();
		this.platforms
			.create(0, 340, 'ground')
			.setOrigin(0, 0)
			.setScale(2)
			.refreshBody();
		this.player = this.physics.add.sprite(100, 150, 'dude');

		this.player.setBounce(0.2);
		this.player.setCollideWorldBounds(true);

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('dude', {
				start: 0,
				end: 3
			}),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'turn',
			frames: [{ key: 'dude', frame: 4 }],
			frameRate: 20
		});

		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('dude', {
				start: 5,
				end: 8
			}),
			frameRate: 10,
			repeat: -1
		});
		this.player.body.setGravityY(300);
		this.physics.add.collider(this.player, this.platforms);

		// stars
		this.stars = this.physics.add.group({
			key: 'star',
			repeat: 11,
			setXY: { x: 12, y: 0, stepX: 70 }
		});

		this.stars.children.iterate(function(child) {
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
		});
		this.physics.add.collider(this.stars, this.platforms);
		this.physics.add.overlap(this.player, this.stars, collectStar, null, this);
		this.score = 0;

		function collectStar(player, star) {
			var coin_sound = this.sound.add('coin_sound');
			coin_sound.play();
			this.score += 1;
			console.log(this.score);
			star.disableBody(true, true);
		}
	}
	update(delta) {
		this.cursors = this.input.keyboard.createCursorKeys();
		if (this.cursors.left.isDown) {
			this.player.setVelocityX(-160);

			this.player.anims.play('left', true);
		} else if (this.cursors.right.isDown) {
			this.player.setVelocityX(160);

			this.player.anims.play('right', true);
		} else {
			this.player.setVelocityX(0);

			this.player.anims.play('turn');
		}

		if (this.cursors.up.isDown && this.player.body.touching.down) {
			this.player.setVelocityY(-500);
		}
	}
}