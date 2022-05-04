export default class Level1 extends Phaser.Scene {
	constructor() {
		super({
			key: 'Level1'
		});
	}

	preload() {
		this.load.image('background', '/assets/sprites/titlescreen/background.png');
		const boardPath = '/assets/sprites/board/';
		this.load.image('title', '/assets/sprites/images/title.png');
		this.load.image('boardbg', boardPath + 'boardbg.png');
		this.load.image('playAgain', boardPath + 'playagain.png');
		this.load.image('scorebg', boardPath + 'scorebg.png');
		this.load.image('wins', boardPath + 'wins.png');
		this.load.image('oIcon', boardPath + 'o.png');
		this.load.image('xIcon', boardPath + 'x.png');

		this.load.image('boxBlank', '/assets/sprites/box_blank.png');

		this.load.image('oTitle', boardPath + 'o.png');
		this.load.image('boxOred', '/assets/sprites/box_ored.png');

		this.load.image('xTitle', boardPath + 'x.png');
		this.load.image('boxXblue', '/assets/sprites/box_xblue.png');

		this.load.audio('introMusic', '/assets/audio/01-Opening.ogg');
		this.load.audio('coinSound', '/assets/audio/sfx_coin_double1.wav');
		this.load.audio('winningSound', '/assets/audio/sfx_sounds_powerup4.wav');
	}

	create() {
		/*
		========================================================================
			game logic
		========================================================================
		*/

		this.gameboard = [null, null, null, null, null, null, null, null, null];
		this.currentPlayer = true; // true == blue X || false == red O
		this.complete = false; // is the game complete

		/*
		========================================================================
			audio
		========================================================================
		*/

		this.introMusic = this.sound.add('introMusic', {
			loop: true
		});
		
		this.introMusic.play();

		this.coinSound = this.sound.add('coinSound');
		this.winningSound = this.sound.add('winningSound');

		/*
		========================================================================
			UI setup
		========================================================================
		*/

		this.background = this.add.image(0, 0, 'background').setOrigin(0);
		this.title = this.add
			.image(this.game.config.width / 2, 50, 'title')
			.setScale(0.5);

		this.wins = this.add.image(-200, 150, 'wins').setDepth(5);

		this.playAgain = this.add
			.image(this.game.config.width / 2, 280, 'playAgain')
			.setDepth(5);

		this.playAgain.setInteractive().on('pointerdown', () => {
			this.scene.restart()
		});

		/*
		========================================================================
			Gameboard setup
		========================================================================
		*/

		this.boardbg = this.add.image(this.game.config.width / 2, 160, 'boardbg');
		const offset = 42;
		for (let x = 0; x < 3; x++) {
			for (let y = 0; y < 3; y++) {
				this.add
					.image(32 + x * offset, 102 + offset * y, 'boxBlank')
					.setOrigin(0, 0)
					.setInteractive()
					.setDataEnabled()
					.data.set('boxNumber', new Phaser.Math.Vector2(x, y));
				//console.log('current x: ' + x + '\ncurrent y: ' + y);
			}
		}

		/*
		========================================================================
			Win game
		========================================================================
		*/

		this.oIcon = this.add
			.image(this.game.config.width / 2, 140, 'oIcon')
			.setAlpha(0)
			.setScale(0.5)
			.setDepth(6);
		this.xIcon = this.add
			.image(this.game.config.width / 2, 140, 'xIcon')
			.setAlpha(0)
			.setScale(0.5)
			.setDepth(6);
		
			this.clickedBox();
	}

	clickedBox() {

		this.input.on('gameobjectdown', (pointer, gameObject) => {

			if(this.complete || gameObject.data.get('boxNumber') == null) return;

			const data = gameObject.data.get('boxNumber');
			const index = data.x + data.y * 3;

			if (
				gameObject.data.get('boxNumber') != null &&
				this.gameboard[index] == null
			) {
				// change cell
				this.boxblank1 = this.add
					.image(
						gameObject.x,
						gameObject.y,
						this.currentPlayer ? 'boxXblue' : 'boxOred'
					)
					.setOrigin(0);

				// save this in gameboard
				this.player = !this.player;
				this.gameboard[index] = this.currentPlayer;


				this.checkWin();
				this.currentPlayer = !this.currentPlayer;
				this.coinSound.play();
			}
		});
	}

	checkWin() {
		// check horizontal
		let counter = 0;
		let counter2 = 0;
		let counter3 = 0;

		for (let x = 0; x < 3; x++) {
			counter += this.gameboard[x] == this.currentPlayer ? 1 : 0;
			counter2 += this.gameboard[x + 3] == this.currentPlayer ? 1 : 0;
			counter3 += this.gameboard[x + 6] == this.currentPlayer ? 1 : 0;
		}
		if (counter >= 3 || counter2 >= 3 || counter3 >= 3) this.WinAnimation();

		counter = 0;
		counter2 = 0;
		counter3 = 0;

		// check vertical
		for (let y = 0; y < 3; y++) {
			counter += this.gameboard[y * 3] == this.currentPlayer ? 1 : 0;
			counter2 += this.gameboard[y * 3 + 1] == this.currentPlayer ? 1 : 0;
			counter3 += this.gameboard[y * 3 + 2] == this.currentPlayer ? 1 : 0;
		}

		if (counter >= 3 || counter2 >= 3 || counter3 >= 3) this.WinAnimation();

		// check diagonal

		counter = 0;
		counter2 = 0;
		counter3 = 0;

		for (let i = 0; i < 3; i++) {
			counter += this.gameboard[i * 4] == this.currentPlayer ? 1 : 0;
			counter2 += this.gameboard[2 * i + 2] == this.currentPlayer ? 1 : 0;
		}

		if (counter >= 3 || counter2 >= 3) this.WinAnimation();
	}

	WinAnimation() {
		this.complete = true;
		this.winningSound.play();
		this.introMusic.stop();

		this.tweens.add({
			targets: this.wins,
			x: this.game.config.width / 2,
			duration: 600
		});

		this.tweens.add({
			targets: this.currentPlayer ? this.xIcon : this.oIcon,
			delay: 1000,
			duration: 400,
			alpha: 1
		});
	}

	update(time, delta) {}
}
