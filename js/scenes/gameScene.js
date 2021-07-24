// create a new scene
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function() {
  //Variables
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

  this.setUpCamera();

  //Game BG
  let bg = this.add.sprite(0,0,'background_water').setInteractive();
  bg.setOrigin(0,0);
  bg.setScale(5);

  //Add all tower elements
  this.setupTower();

  //Enable cursor keys
  this.cursors = this.input.keyboard.createCursorKeys();

};

gameScene.setUpCamera = function(){
  var cam = this.cameras.main; 

  this.input.on('pointermove', function (p) {
    if (!p.isDown) return;
    console.log(p.prevPosition);
    //cam.scrollX -= (p.x - p.prevPosition.x) / cam.zoom;
    if(p.prevPosition)cam.scrollY -= (p.y - p.prevPosition.y);
  });
}

gameScene.setupTower = function(){

  this.floorNames = ['floor_basic', 'floor_qualle', 'floor_basic', 'floor_basic', 'floor_basic', ];
  this.floorData = [];
  this.floorProps = [];
  //Create all floors
  this.floors = this.physics.add.staticGroup();
  for (let i=0;i<this.floorNames.length;i++){

    this.floorData[i] = this.physics.add.sprite(380, 100 + i*170, this.floorNames[i]);
    this.floorData[i].setScale(0.25);
    this.physics.add.existing(this.floorData[i], true);
    this.floorData[i].body.allowGravity = false;

    this.floorProps[i] = {};
    //Extra Props
    switch (this.floorNames[i]){
      case "floor_basic": 
        this.addProp("Poster",this.floorNames[i], i);
        break;
      case "floor_qualle":
        this.addProp("Beanbag L",this.floorNames[i], i);
        this.addProp("Beanbag R",this.floorNames[i], i);
        break;
    }
        //Add Props
        this.addProp("Door",this.floorNames[i], i);
        this.addProp("Table",this.floorNames[i], i);
    
  }

  //Character
  this.shopKeeperNames = ["mia","kj"];
  this.shopKeepersData = [];

  for (let i=0;i<this.shopKeeperNames.length;i++){
    let shopkeeper = this.add.sprite(360 + Math.random()* 40, 140 + i*(170), `sprite_${this.shopKeeperNames[i]}`);
    this.physics.add.existing(shopkeeper)
    shopkeeper.setScale(0.1);
    switch(this.shopKeeperNames[i]){
      case "kj":
        shopkeeper.setScale(0.12);
        //shopkeeper.y = 160 + i*(170);
        break;
    }
    shopkeeper.body.allowGravity = false;
  
    //Constraint character
    //shopkeeper.body.setCollideWorldBounds(true);
    //Add to data
    this.shopKeepersData.push(shopkeeper);
  }
  
}

//Add Props
gameScene.addProp = function(objectKey, room, floor){
  switch (room){
    case "floor_basic":
      if (objectKey=="Poster") this.floorProps[floor][objectKey] = this.physics.add.sprite(350 + Math.random()*50, 100 + floor*(170), "poster_basic");
      break;
    case "floor_qualle":
      if (objectKey=="Beanbag L") this.floorProps[floor][objectKey] = this.physics.add.sprite(300, 100 + floor*(170), "beanbagL_qualle");
      if (objectKey=="Beanbag R") this.floorProps[floor][objectKey] = this.physics.add.sprite(300, 100 + floor*(170), "beanbagR_qualle");
      break;
  }
  
  if (objectKey=="Table") this.floorProps[floor][objectKey] = this.physics.add.sprite(400, 100 + floor*(170), "table_basic");
  if (objectKey=="Door") this.floorProps[floor][objectKey] = this.physics.add.sprite(350, 100 + floor*(170), "door_basic");
  
  if (this.floorProps[floor][objectKey]){
    this.floorProps[floor][objectKey].setScale(0.25);
    this.physics.add.existing(this.floorProps[floor][objectKey]);
    this.floorProps[floor][objectKey].body.allowGravity = false;  
  }
  
}

//Executed on every frame
gameScene.update = function(){

  if (this.cursors.down.isDown){
    //this.scene.start('Home');
    this.cameras.main.scrollY += 10;
    //return;
  }
  else if (this.cursors.up.isDown){
    //this.scene.start('Home');
    this.cameras.main.scrollY -= 10;
    //return;
  }

  //Random movement
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