// create a new scene
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function() {
  //Variables
  this.charactersSpeed = [-20,-15, -22, -17];
  this.timeElapsed = 0;
  this.gameStats = {
    greenpoints: 0,
    pollution: 100,
    profilePic: "profile_pic_sample"
  }
};

// load asset files for our game
gameScene.preload = function() {
}; 

// executed once, after assets were loaded
gameScene.create = function() {
  let gameW = this.sys.game.config.width;
  let gameH = this.sys.game.config.height;

  //Game BG
  let bg = this.add.sprite(0,0,'background_title').setInteractive();
  bg.setOrigin(0,0);
  //bg.setScale(5);

  //Add all tower elements
  this.setupTower();
  
  //Set up HUD
  this.setUpHUD();
  this.setUpCamera();

  //Enable cursor keys
  this.cursors = this.input.keyboard.createCursorKeys();

};

//Show current value of stats
gameScene.refreshHud = function(){
  this.greenPointText.setText('♻️: '+ this.gameStats.greenpoints.toFixed(0));
  this.pollutionStatText.setText('💀: '+this.gameStats.pollution.toFixed(2)+'%');
};

gameScene.setUpHUD = function(){
  //Profile
  //Back Frame
  this.backFramePP = this.physics.add.sprite(50, 50, "profile_pic_back");
  this.backFramePP.setScale(0.5);
  this.backFramePP.body.allowGravity = false;
  //Profile Pic
  this.profilePicture = this.physics.add.sprite(50, 50, this.gameStats.profilePic);
  this.profilePicture.setScale(0.5);
  this.profilePicture.body.allowGravity = false;
  //Front Frame
  this.frontFramePP = this.physics.add.sprite(50, 50, "profile_pic_front");
  this.frontFramePP.setScale(0.5);
  this.frontFramePP.body.allowGravity = false;

  //Money Stat
  this.greenPointText = this.add.text(500,10,'♻️: ',{
    font: '26px Arial',
    fill: '#ffffff',
    backgroundColor: '#ff00ff' 
  });

  //Pollution stat
  this.pollutionStatText = this.add.text(300,10,'💀: ',{
    font: '26px Arial',
    fill: '#ffffff',
    backgroundColor: '#ff00ff'
  });

  this.arrowUp = this.physics.add.sprite(70, 140, "sprite_arrow");
  this.physics.add.existing(this.arrowUp, true);
  this.arrowUp.body.allowGravity = false;
  this.arrowUp.setInteractive();
  this.arrowUp.on('pointerdown', function(){
    this.scrollScreen("Up", 50);
  }, this);

  this.arrowDown = this.physics.add.sprite(70, 290, "sprite_arrow");
  this.physics.add.existing(this.arrowDown, true);
  this.arrowDown.flipY = true;
  this.arrowDown.body.allowGravity = false;
  this.arrowDown.setInteractive();
  this.arrowDown.on('pointerdown', function(){
    this.scrollScreen("Down", 50);
  }, this);
}

gameScene.setUpCamera = function(){
  var cam = this.cameras.main; 

  this.input.on('pointermove', function (p) {
    if (!p.isDown) return;
    if(p.downY){
      if (p.y-p.downY >0) gameScene.scrollScreen("Down", (p.y-p.downY)/10);
      else if (p.y-p.downY<0) gameScene.scrollScreen("Up", -(p.y-p.downY)/10);
    }
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
  this.shopKeeperNames = ["mia","kj","ky", "sy"];
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

gameScene.scrollScreen = function(dir, dist = 10){
  if (dir=="Up"){
    travel = -dist;

    //Change frame of arrow
    this.arrowUp.setFrame(1);

    //Keep game on for sometime
    this.time.addEvent({
      delay: 2000,
      repeat: 0,
      callback: function(){
        this.arrowUp.setFrame(0);
      },
      callbackScope: this
    });
  }
  else if (dir=="Down"){
    travel = dist;
    //Change frame of arrow
    this.arrowDown.setFrame(1);

    //Keep game on for sometime
    this.time.addEvent({
      delay: 2000,
      repeat: 0,
      callback: function(){
        this.arrowDown.setFrame(0);
      },
      callbackScope: this
    });
  }

  this.cameras.main.scrollY += travel;
  if (this.cameras.main.scrollY<0){
    diff = 0-this.cameras.main.scrollY;
    this.cameras.main.scrollY = 0;
    this.greenPointText.y = 10;
    this.pollutionStatText.y = 10;
    this.arrowUp.y = 140;
    this.arrowDown.y = 290;
    return;
  }
  this.arrowUp.y += travel;
  this.arrowDown.y += travel;
  this.greenPointText.y += travel;
  this.pollutionStatText.y += travel;
  
}

//Executed on every frame
gameScene.update = function(){

  if (this.cursors.down.isDown){
    this.scrollScreen("Down");
  }
  else if (this.cursors.up.isDown){
    this.scrollScreen("Up");
  }
  else if (this.cursors.left.isDown){
    this.scene.start('Home');
    return;
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
  
  //Simualte increasing pts
  this.gameStats.pollution -= 0.0001;
  if (this.gameStats.pollution<=0) this.gameStats.pollution = 0;

  this.gameStats.greenpoints += 0.01;


  gameScene.refreshHud();
  this.timeElapsed+=0.01;
  
  
};