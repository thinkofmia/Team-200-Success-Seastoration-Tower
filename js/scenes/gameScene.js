// create a new scene
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function() {
  this.charactersSpeed = -20;
  this.timeElapsed = 0;
};

// load asset files for our game
gameScene.preload = function() {
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
  //Basic Floor
  let baseFloor = this.physics.add.sprite(180, 600, 'floor_basic');
  baseFloor.setScale(0.1);
  this.physics.add.existing(baseFloor, true);
  baseFloor.body.allowGravity = false;

  //Character
  this.mia = this.add.sprite(180, 620, 'sprite_mia');
  this.physics.add.existing(this.mia);
  this.mia.setScale(0.05);
  this.mia.body.allowGravity = false;
  
  //Constraint character
  this.mia.body.setCollideWorldBounds(true);
  
  //Collision Detection
  //this.physics.add.collider(this.mia, this.baseFloor);
}

//Executed on every frame
gameScene.update = function(){

  //Random Motion
  if (this.timeElapsed%5>3){
    this.mia.body.setVelocityX(-this.charactersSpeed);
    this.mia.flipX = false;

    //Check
    if (!this.mia.anims.isPlaying) this.mia.anims.play('walking_mia');
  }
  else if (this.timeElapsed%5>1){
    this.mia.body.setVelocityX(this.charactersSpeed);
    this.mia.flipX = true;
    if (!this.mia.anims.isPlaying) this.mia.anims.play('walking_mia');
  }
  else {
    this.mia.body.setVelocityX(0);
    this.mia.anims.stop('walking_mia');

    //Set default frame
    this.mia.setFrame(0);
  }
  this.timeElapsed+=0.01;
  
};