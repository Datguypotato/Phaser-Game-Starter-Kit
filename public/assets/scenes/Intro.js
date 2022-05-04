export default class Intro extends Phaser.Scene {
	constructor() {
		super({
			key: 'Intro'
		});
	}
	preload() {
		this.load.script(
			'webfont',
			'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js'
		);

		const titlescreenPath = '/assets/sprites/titlescreen/';
		this.load.image('background', titlescreenPath + 'background.png');
		this.load.image('bgBox', titlescreenPath + 'bgbox.png');
		this.load.image('champTitle', titlescreenPath + 'championshipstitle.png');
		this.load.image('startButton', titlescreenPath + 'startbutton.png');
		this.load.image('tictactoeTitle', titlescreenPath + 'tictactoetitle.png');
		this.load.image('title', titlescreenPath + 'title.png');

		this.load.audio('introMusic', '/assets/audio/01-Opening.ogg');
	}

	create() {
		/*
		========================================================================
			audio
		========================================================================
		*/

		this.introMusic = this.sound.add('introMusic', {
			loop: true
		});
		// uncomment this in the future
		//this.introMusic.play();

		/*
		========================================================================
			Creating images
		========================================================================
		*/
		this.background = this.add.image(0, 0, 'background').setOrigin(0);
		this.bgBox = this.add
			.image(0, 0, 'bgBox')
			.setOrigin(0)
			.setAlpha(0);
		this.title = this.add
			.image(this.game.config.width / 2, 80, 'title')
			.setAlpha(0);
		this.tictactoe = this.add
			.image(this.game.config.width / 2, 150, 'tictactoeTitle')
			.setAlpha(0);
		this.champTitle = this.add
			.image(this.game.config.width / 2, 175, 'champTitle')
			.setAlpha(0);
		this.startButton = this.add
			.image(this.game.config.width / 2, 250, 'startButton')
			.setAlpha(0);

		/*
		========================================================================
			Creating animations
		========================================================================
		*/

		this.tweens.add({
			targets: this.bgBox,
			ease: 'Linear',
			alpha: 0.5,
			delay: 1000,
			duration: 1000
		});

		this.tweens.timeline({
			targets: this.title,
			ease: 'Linear', // 'Cubic', 'Elastic', 'Bounce', 'Back'
			duration: 1000,
			loop: 0,

			tweens: [
				{
					targets: this.title,
					alpha: 1,
					y: 90,
					delay: 1000,
					duration: 1000
				},
				{
					targets: this.title,
					alpha: 1,
					y: 100,
					repeat: -1,
					yoyo: true,
					delay: 0,
					duration: 600
				}
			]
		});

		this.tweens.add({
			targets: this.tictactoe,
			ease: 'Linear',
			y: this.tictactoe.y + 10,
			alpha: 1,
			delay: 1100,
			duration: 1000
		});

		this.tweens.add({
			targets: this.champTitle,
			ease: 'Linear',
			y: this.champTitle.y + 10,
			alpha: 1,
			delay: 1300,
			duration: 1000
		});

		this.tweens.add({
			targets: this.startButton,
			ease: 'Linear',
			y: this.startButton.y + 10,
			alpha: 1,
			delay: 1600,
			duration: 1000
		});

		this.startButton.setInteractive().on('pointerdown', () => {
			this.scene.start('Level1');
		});

		this.keys = this.input.keyboard.addKeys('SPACE,ENTER');
	}
	update(delta) {
		if (this.keys.SPACE.isDown || this.keys.ENTER.isDown) {
			this.scene.start('Level1');
		}
	}
}
