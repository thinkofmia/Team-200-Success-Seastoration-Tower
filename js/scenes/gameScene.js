// create a new scene
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function() {};

// load asset files for our game
gameScene.preload = function() {
};

// executed once, after assets were loaded
gameScene.create = function() {
  let gameW = this.sys.game.config.width;
  let gameH = this.sys.game.config.height;

  //Game BG
  let bg = this.add.sprite(0,0,'background').setInteractive();
  bg.setOrigin(0,0);
  bg.setScale(5);

  let text = this.add.text(gameW/2, gameH/2, 'Game Scene', {
      font: '20px Arial',
      fill: '#ffffff',
  });

  text.setOrigin(0.5, 0.5);
  text.depth = 1;

  //Text background
  let textBg = this.add.graphics();
  textBg.fillStyle(0x000000, 0.7);
  textBg.fillRect(gameW/2 - text.width/2 - 10, gameH/2 - text.height/2 -10, text.width+20, text.height+ 20);

  bg.on('pointerdown', function(){
    this.scene.start('Home');
}, this);
};