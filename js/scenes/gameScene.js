// create a new scene
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function() {};

// load asset files for our game
gameScene.preload = function() {
  // load images
  this.load.image('floor_basic', 'assets/images/basic floor/basic_floor.png');
}; 

// executed once, after assets were loaded
gameScene.create = function() {
  let gameW = this.sys.game.config.width;
  let gameH = this.sys.game.config.height;

  //Game BG
  let bg = this.add.sprite(0,0,'background_air').setInteractive();
  bg.setOrigin(0,0);
  bg.setScale(5);

  //Add all level elements
  this.setupLevel();
};

gameScene.setupLevel = function(){
  let baseFloor = this.physics.add.sprite(180, 200, 'floor_basic');
  baseFloor.setScale(0.1);
  this.physics.add.existing(baseFloor, true);
  baseFloor.body.allowGravity = false;
}