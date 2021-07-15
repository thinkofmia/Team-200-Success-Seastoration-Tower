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

  //Add all tower elements
  this.setupTower();

  //Enable cursor keys
  this.cursors = this.input.keyboard.createCursorKeys();

};

gameScene.setupTower = function(){

  this.floorNames = ['floor_basic', 'floor_qualle'];
  this.floorData = [];
  //Create all floors
  this.floors = this.physics.add.staticGroup();
  for (let i=0;i<this.floorNames.length;i++){

    this.floorData[i] = this.physics.add.sprite(180, 600 - i*75, this.floorNames[i]);
    this.floorData[i].setScale(0.1);
    this.physics.add.existing(this.floorData[i], true);
    this.floorData[i].body.allowGravity = false;
  }

  //Character
  this.mia = this.add.sprite(180, 620, 'sprite_mia');
  this.physics.add.existing(this.mia);
  this.mia.setScale(0.05);
  this.mia.body.allowGravity = false;
  
  //Constraint character
  this.mia.body.setCollideWorldBounds(true);
  
}

//Executed on every frame
gameScene.update = function(){

  if (this.cursors.down.isDown){
    this.scene.start('Home');
    return;
  }
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