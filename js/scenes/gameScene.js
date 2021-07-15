// create a new scene
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function() {
  this.charactersSpeed = [-20,-15];
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

    this.floorData[i] = this.physics.add.sprite(380, 925 - i*150, this.floorNames[i]);
    this.floorData[i].setScale(0.2);
    this.physics.add.existing(this.floorData[i], true);
    this.floorData[i].body.allowGravity = false;
  }

  //Character
  this.shopKeeperNames = ["mia","kj"];
  this.shopKeepersData = [];

  for (let i=0;i<this.shopKeeperNames.length;i++){
    let shopkeeper = this.add.sprite(360 + Math.random()* 40, 950 - i*(150-10), `sprite_${this.shopKeeperNames[i]}`);
    this.physics.add.existing(shopkeeper);
    shopkeeper.setScale(0.1);
    shopkeeper.body.allowGravity = false;
  
    //Constraint character
    shopkeeper.body.setCollideWorldBounds(true);
    //Add to data
    this.shopKeepersData.push(shopkeeper);
  }
  
}

//Executed on every frame
gameScene.update = function(){

  if (this.cursors.down.isDown){
    this.scene.start('Home');
    return;
  }

  for (let i=0;i<this.shopKeepersData.length;i++){
    //Random Motion
    if (this.timeElapsed%5>3){
      this.shopKeepersData[i].body.setVelocityX(-this.charactersSpeed[i]);
      this.shopKeepersData[i].flipX = false;
      //Check
      if (!this.shopKeepersData[i].anims.isPlaying) this.shopKeepersData[i].anims.play(`walking_${this.shopKeeperNames[i]}`);
    }
    else if (this.timeElapsed%5>1){
      this.shopKeepersData[i].body.setVelocityX(this.charactersSpeed[i]);
      this.shopKeepersData[i].flipX = true;
      if (!this.shopKeepersData[i].anims.isPlaying) this.shopKeepersData[i].anims.play(`walking_${this.shopKeeperNames[i]}`);
    }
    else {
      this.shopKeepersData[i].body.setVelocityX(0);
      this.shopKeepersData[i].anims.stop(`walking_${this.shopKeeperNames[i]}`);

      //Set default frame
      this.shopKeepersData[i].setFrame(0);
    }
    
  }
  
  this.timeElapsed+=0.01;
  
};