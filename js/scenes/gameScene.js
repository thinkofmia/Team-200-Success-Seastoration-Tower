// create a new scene
let gameScene = new Phaser.Scene('Game');

WebFont.load({
  google: {
    families: ['Grandstander', 'Averia Libre']
  }
});

// some parameters for our scene
gameScene.init = function() {
  // fonts
  this.titleFont = 'Grandstander';
  this.bodyFont = 'Averia Libre';
  //Variables
  this.charactersSpeed = [-20,-15, -22, -17];
  this.timeElapsed = 0;
  this.gameStats = {
    greenpoints: 0,
    pollution: 100,
    profileLv: 1,
    profileExp: 20,
    maxExp: 100,
    profilePic: "profile_pic_sample",
    nextShopToBuy: 1,
    earningBase: 125,
    earningIncrement: 25,
    unlockCost: 175,
    shopsData: [
      //Shop 1
      {
        room: 'floor_basic',
        locked: false,
        shopkeeper: 'mia',
        level: 1,
        currentRate: 0,
        completionRate: 100
      },
      //Shop 2
      {
        room: 'floor_qualle',
        locked: true,
        shopkeeper: 'kj',
        level: 1,
        currentRate: 0,
        completionRate: 500
      },
      //Shop 3
      {
        room: 'floor_basic',
        locked: true,
        shopkeeper: 'ky',
        level: 1,
        currentRate: 0,
        completionRate: 1000
      },
      //Shop 4
      {
        room: 'floor_basic',
        locked: true,
        shopkeeper: 'sy',
        level: 1,
        currentRate: 0,
        completionRate: 5000
      }
    ]
  };
  this.isPlaying = true;
  this.barW = 100;
  this.barH = 10;
  this.globalSpriteScale = 0.75;
  this.globalSpriteTranslate = -50;

  this.floorStatsBarW = 350;
  this.floorStatsBarH = 30;
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
  //Update texts
  this.levelText.setText(`Level: ${this.gameStats.profileLv}`);
  this.greenPointText.setText(`♻️: ${this.gameStats.greenpoints.toFixed(0)}`);
  this.pollutionStatText.setText(`💀: ${this.gameStats.pollution.toFixed(2)}%`);

  //Update Level Bar
  this.levelProgress.clear();
  this.levelProgress.fillStyle(0x9AD98D,1);
  this.levelProgress.fillRect(0,0, this.gameStats.profileExp/this.gameStats.maxExp * this.barW, this.barH);

  //Update shop Progress bar
  for (var i=0;i<this.floorProgressBar.length;i++){
    var shop = this.gameStats.shopsData[i];
    progressBar = this.floorProgressBar[i];
    progressBar.clear();
    progressBar.fillStyle(0x50d9c8, 1);
    progressBar.fillRect(0,0,(this.floorStatsBarW-90)*shop.currentRate/shop.completionRate, this.floorStatsBarH-10);
  }
  
  
};

gameScene.setUpHUD = function(){
  
  let gameW = this.sys.game.config.width;
  let gameH = this.sys.game.config.height;

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

  //Level bar background
  this.levelBg = this.add.graphics();

  this.levelBg.setPosition(100, 20);
  this.levelBg.fillStyle(0x000000, 1);
  this.levelBg.fillRect(0,0,this.barW+5, this.barH+5);

  //Level Bar
  this.levelProgress = this.add.graphics();
  this.levelProgress.setPosition(102.5, 22.5);

  //Level Stat
  this.levelText = this.add.text(100,50,'Level: ',{
    font: '20px '+this.titleFont,
    fill: '#ffffff',
    backgroundColor: '#ff00ff' 
  });

  //Money Stat
  this.greenPointText = this.add.text(500,10,'♻️: ',{
    font: '26px '+this.titleFont,
    fill: '#ffffff',
    backgroundColor: '#ff00ff' 
  });

  //Pollution stat
  this.pollutionStatText = this.add.text(300,10,'💀: ',{
    font: '26px '+this.titleFont,
    fill: '#ffffff',
    backgroundColor: '#ff00ff'
  });

  //Arrow Keys
  this.arrowUp = this.physics.add.sprite(70, 140, "icon_arrow");
  this.arrowUp.body.allowGravity = false;
  this.arrowUp.setInteractive();
  this.arrowUp.on('pointerdown', function(){
    this.scrollScreen("Up", 50);
  }, this);

  this.arrowDown = this.physics.add.sprite(70, 240, "icon_arrow");
  this.arrowDown.flipY = true;
  this.arrowDown.body.allowGravity = false;
  this.arrowDown.setInteractive();
  this.arrowDown.on('pointerdown', function(){
    this.scrollScreen("Down", 50);
  }, this);

  //Back Button
  this.backButton = this.physics.add.sprite(gameW- 70, 190, "icon_back");
  this.backButton.body.allowGravity = false;
  this.backButton.setInteractive();
  this.backButton.on('pointerdown', function(){
    this.backButton.setFrame(1);
    this.isPlaying = false;
    //Keep game on for sometime
    this.time.addEvent({
      delay: 500,
      repeat: 0,
      callback: function(){
        this.backButton.setFrame(0);
        this.goHome();
      },
      callbackScope: this
    });
  }, this);
}

gameScene.goHome = function(){
  this.scene.start('Home');
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

//Create and setup base tower
gameScene.setupTower = function(){
  this.floorData = [];
  this.floorProps = [];
  this.floorStatsData = [];
  this.floorProgressBar = [];
  //Create all floors
  this.floors = this.physics.add.staticGroup();
  for (let i=0;i<this.gameStats.shopsData.length;i++){

    shop = this.gameStats.shopsData[i];
    if (shop.locked){
      this.floorData[i] = this.physics.add.sprite(380+this.globalSpriteTranslate, 100 + i*(170*this.globalSpriteScale+this.floorStatsBarH), 'floor_locked');
      this.floorData[i].setScale(0.25*this.globalSpriteScale);
      this.physics.add.existing(this.floorData[i], true);
      this.floorData[i].body.allowGravity = false;
    }
    else {
      this.floorData[i] = this.physics.add.sprite(380+this.globalSpriteTranslate, 100 + i*(170*this.globalSpriteScale+this.floorStatsBarH), shop.room);
      this.floorData[i].setScale(0.25*this.globalSpriteScale);
      this.physics.add.existing(this.floorData[i], true);
      this.floorData[i].body.allowGravity = false;
  
      this.floorProps[i] = {};
      //Extra Props
      switch (shop.room){
        case "floor_basic": 
          this.addProp("Poster",shop.room, i);
          break;
        case "floor_qualle":
          this.addProp("Beanbag L",shop.room, i);
          this.addProp("Beanbag R",shop.room, i);
          break;
      }
          //Add Props
          this.addProp("Door",shop.room, i);
          this.addProp("Table",shop.room, i);
      
    }
    
    //Add Data
    this.floorStatsData[i] = this.add.graphics();

    this.floorStatsData[i].setPosition(145, 172 + i*(170*this.globalSpriteScale+this.floorStatsBarH));
    this.floorStatsData[i].fillStyle(0x000000, 1);
    this.floorStatsData[i].fillRect(0,0,this.floorStatsBarW, this.floorStatsBarH);
    
    this.floorProgressBar[i] = this.add.graphics();

    this.floorProgressBar[i].setPosition(200, 177 + i*(170*this.globalSpriteScale+this.floorStatsBarH));
    this.floorProgressBar[i].fillStyle(0x50d9c8, 1);
    this.floorProgressBar[i].fillRect(0,0,(this.floorStatsBarW-90)*shop.currentRate/shop.completionRate, this.floorStatsBarH-10);
    
  }

  if (this.gameStats.nextShopToBuy>0){
    //Add Unlocking icon
    this.unlockIcon = this.physics.add.sprite(370+this.globalSpriteTranslate, 100 + this.gameStats.nextShopToBuy*(170*this.globalSpriteScale+this.floorStatsBarH), 'icon_recycle');
    this.unlockIcon.setScale(0.25*this.globalSpriteScale);
    this.physics.add.existing(this.unlockIcon, true);
    this.unlockIcon.body.allowGravity = false;
    this.unlockIcon.setInteractive();
    this.unlockIcon.on('pointerdown', function(){
      gameScene.unlockShop();
    }, this);
  }
  

  //Character
  this.shopKeepersData = [];

  for (let i=0;i<this.gameStats.shopsData.length;i++){
    shop = this.gameStats.shopsData[i];
    shopKeeperName = shop.shopkeeper;
    if (!shop.locked && shopKeeperName.length>0){
      let shopkeeper = this.add.sprite(360 + Math.random()* 40+this.globalSpriteTranslate, 130 + i*(170*this.globalSpriteScale+this.floorStatsBarH), `sprite_${shopKeeperName}`);
      this.physics.add.existing(shopkeeper)
      shopkeeper.setScale(0.1*this.globalSpriteScale);
      switch(shopKeeperName){
        case "kj":
          shopkeeper.setScale(0.12*this.globalSpriteScale);
          break;
      }
      shopkeeper.body.allowGravity = false;
    
      //Add to data
      this.shopKeepersData.push(shopkeeper);
    }
  }


}

gameScene.earnGreenPoints = function(){
  for (var i=0;i<this.gameStats.shopsData.length;i++){
    var shop = this.gameStats.shopsData[i];
    if (!shop.locked){
      if(shop.currentRate>=shop.completionRate){
        this.gameStats.greenpoints += shop.level*this.gameStats.earningIncrement +this.gameStats.earningBase;
        shop.currentRate = 0;
      }
      else {
        shop.currentRate += 1;
      }
    }
  }
}

gameScene.unlockShop = function(){
  var shop = this.gameStats.nextShopToBuy;
  var shopKeeperName = this.gameStats.shopsData[shop].shopkeeper;
  var shopName = this.gameStats.shopsData[shop].room;
  if (shop<this.gameStats.shopsData.length){
    //Reveal room
    this.floorData[shop].setTexture(this.gameStats.shopsData[shop].room);

    //Unlock Props
    this.floorProps[shop] = {};
    //Extra Props
    switch (shopName){
      case "floor_basic": 
        this.addProp("Poster",shopName, shop);
        break;
      case "floor_qualle":
        this.addProp("Beanbag L",shopName, shop);
        this.addProp("Beanbag R",shopName, shop);
        break;
    }
        //Add Props
        this.addProp("Door",shopName, shop);
        this.addProp("Table",shopName, shop);

    //Unlock Shopkeeper
    let shopkeeper = this.add.sprite(360 + Math.random()* 40+this.globalSpriteTranslate, 130 + shop*(170*this.globalSpriteScale+this.floorStatsBarH), `sprite_${shopKeeperName}`);
          this.physics.add.existing(shopkeeper)
          shopkeeper.setScale(0.1*this.globalSpriteScale);
          switch(shopKeeperName){
            case "kj":
              shopkeeper.setScale(0.12*this.globalSpriteScale);
              break;
          }
    shopkeeper.body.allowGravity = false;
    this.shopKeepersData.push(shopkeeper);
    
    //Update status of shop
    this.gameStats.shopsData[shop].locked = false;
    //Update Unlock icon position and next shop to buy
    this.gameStats.nextShopToBuy +=1;
    this.unlockIcon.y = 100 + this.gameStats.nextShopToBuy*(170*this.globalSpriteScale+this.floorStatsBarH);

  }
  if (this.gameStats.nextShopToBuy>=this.gameStats.shopsData.length){
    //Else destroy icon
    this.gameStats.nextShopToBuy = -1;
    this.unlockIcon.destroy();
  }
  
}

//Add Props
gameScene.addProp = function(objectKey, room, floor){
  propHeight = 100 + floor*(170*this.globalSpriteScale+this.floorStatsBarH);
  propDist = 300 + this.globalSpriteTranslate;
  switch (room){
    case "floor_basic":
      if (objectKey=="Poster") this.floorProps[floor][objectKey] = this.physics.add.sprite(propDist + 50 + Math.random()*50, propHeight, "poster_basic");
      break;
    case "floor_qualle":
      if (objectKey=="Beanbag L") this.floorProps[floor][objectKey] = this.physics.add.sprite(propDist, propHeight, "beanbagL_qualle");
      if (objectKey=="Beanbag R") this.floorProps[floor][objectKey] = this.physics.add.sprite(propDist, propHeight, "beanbagR_qualle");
      break;
  }
  
  if (objectKey=="Table") this.floorProps[floor][objectKey] = this.physics.add.sprite(propDist+100, propHeight, "table_basic");
  if (objectKey=="Door") this.floorProps[floor][objectKey] = this.physics.add.sprite(propDist+50, propHeight, "door_basic");
  
  if (this.floorProps[floor][objectKey]){
    this.floorProps[floor][objectKey].setScale(0.25*this.globalSpriteScale);
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
  //If reach top, reset positions of HUD
  if (this.cameras.main.scrollY<0){
    diff = 0-this.cameras.main.scrollY;
    this.cameras.main.scrollY = 0;
    this.greenPointText.y = 10;
    this.pollutionStatText.y = 10;
    this.arrowUp.y = 140;
    this.arrowDown.y = 240;   
    this.backFramePP.setPosition(50, 50);
    this.frontFramePP.setPosition(50, 50);
    this.profilePicture.setPosition(50, 50);
    this.levelBg.setPosition(100, 20);
    this.levelProgress.setPosition(102.5, 22.5);
    this.levelText.setPosition(100, 50);
    this.backButton.y = 190;
    return;
  }
  this.arrowUp.y += travel;
  this.arrowDown.y += travel;
  this.greenPointText.y += travel;
  this.pollutionStatText.y += travel;
  this.backFramePP.y += travel;
  this.frontFramePP.y += travel;
  this.profilePicture.y += travel;
  this.levelBg.y +=travel;
  this.levelProgress.y +=travel;
  this.levelText.y += travel;
  this.backButton.y += travel;
}

gameScene.checkLevel = function(){
  if(this.gameStats.profileExp<100) this.gameStats.profileExp += 0.1;
  else {
    this.gameStats.profileLv += 1;
    this.gameStats.profileExp = 0;
  }
}

//Executed on every frame
gameScene.update = function(){
  if (this.isPlaying){
    if (this.cursors.down.isDown){
      this.scrollScreen("Down");
    }
    else if (this.cursors.up.isDown){
      this.scrollScreen("Up");
    }
  
    //Random movement
    for (let i=0;i<this.shopKeepersData.length;i++){
      shopKeeperName = this.gameStats.shopsData[i].shopkeeper;
      //Random Motion
      if (this.timeElapsed%5>3){
        this.shopKeepersData[i].body.setVelocityX(-this.charactersSpeed[i]);
        this.shopKeepersData[i].flipX = false;
        //Check
        if (!this.shopKeepersData[i].anims.isPlaying) this.shopKeepersData[i].anims.play(`walking_${shopKeeperName}`);
      }
      else if (this.timeElapsed%5>1){
        this.shopKeepersData[i].body.setVelocityX(this.charactersSpeed[i]);
        this.shopKeepersData[i].flipX = true;
        if (!this.shopKeepersData[i].anims.isPlaying) this.shopKeepersData[i].anims.play(`walking_${shopKeeperName}`);
      }
      else {
        this.shopKeepersData[i].body.setVelocityX(0);
        this.shopKeepersData[i].anims.stop(`walking_${shopKeeperName}`);
  
        //Set default frame
        this.shopKeepersData[i].setFrame(0);
      }
      
    }
    
    //Simualte increasing pts
    this.gameStats.pollution -= 0.0001;
    if (this.gameStats.pollution<=0) this.gameStats.pollution = 0;
  
    //Earn Some MONEUH
    this.earnGreenPoints();
  
    this.checkLevel();
    gameScene.refreshHud();
    this.timeElapsed+=0.01;
  }
  
};