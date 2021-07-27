// create a new scene
let gameScene = new Phaser.Scene('Game');

WebFont.load({
  google: {
    families: ['Grandstander', 'Averia Libre']
  }
});

// some parameters for our scene
gameScene.init = function(data) {
  // fonts
  this.titleFont = 'Grandstander';
  this.bodyFont = 'Averia Libre';
  //UIs
  this.popupW = 600;
  this.popupH = 300;
  
  this.barW = 100;
  this.barH = 10;
  this.globalSpriteScale = 0.75;
  this.globalSpriteTranslate = -50;

  this.floorStatsBarW = 350;
  this.floorStatsBarH = 50;
  //Variables
  this.charactersSpeed = [-20,-15, -22, -17];
  this.timeElapsed = 0;
  if(Object.keys(data).length != 0){
    this.gameStats = data;
  }
  else this.gameStats = {
    greenpoints: 0,
    pollution: 50,
    profileLv: 1,
    profileExp: 20,
    maxExp: 100,
    profilePic: "profile_pic_sample",
    nextShopToBuy: 1,
    earningBase: 125,
    earningIncrement: 25,
    unlockCost: 175,
    upgradeBase: 200,
    upgradeIncrement: 50,
    restorationCost: 500,
    pollutionDrop: 5,
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
};

// load asset files for our game
gameScene.preload = function() {
}; 

// executed once, after assets were loaded
gameScene.create = function() {
  let gameW = this.sys.game.config.width;
  let gameH = this.sys.game.config.height;

  //Game BG
  this.bg = this.add.sprite(0,0,'background_unclean').setInteractive();
  this.bg.setOrigin(0,0);

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

  //Update shop
  for (var i=0;i<this.gameStats.shopsData.length;i++){
    shop = this.gameStats.shopsData[i];
    if (shop.locked){
      this.floorLevelTexts[i].setText('');
      this.floorIncomeTexts[i].setText('');
    }
    else{
      this.floorLevelTexts[i].setText(`Lv. ${shop.level}`);
      this.floorIncomeTexts[i].setText(`♻️ ${shop.level*this.gameStats.earningIncrement +this.gameStats.earningBase}`);
    } 
  }

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
    progressBar.fillRect(0,0,(this.floorStatsBarW-130)*shop.currentRate/shop.completionRate, this.floorStatsBarH-10);
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
  this.backFramePP.depth = 90;
  //Profile Pic
  this.profilePicture = this.physics.add.sprite(50, 50, this.gameStats.profilePic);
  this.profilePicture.setScale(0.5);
  this.profilePicture.body.allowGravity = false;
  this.profilePicture.depth = 90;
  //Front Frame
  this.frontFramePP = this.physics.add.sprite(50, 50, "profile_pic_front");
  this.frontFramePP.setScale(0.5);
  this.frontFramePP.body.allowGravity = false;
  this.frontFramePP.depth = 90;

  this.headerBar = this.add.graphics();
  this.headerBar.setPosition(0, 0);
  this.headerBar.fillStyle(0x459eda, 1);
  this.headerBar.fillRect(0, 0, 1000, 40);
  this.headerBar.depth = 50;

  //Level bar background
  this.levelBg = this.add.graphics();

  this.levelBg.setPosition(100, 20);
  this.levelBg.fillStyle(0x000000, 1);
  this.levelBg.fillRect(0,0,this.barW+5, this.barH+5);
  this.levelBg.depth = 89;

  //Level Bar
  this.levelProgress = this.add.graphics();
  this.levelProgress.setPosition(102.5, 22.5);
  this.levelProgress.depth = 90;

  //Level Stat
  this.levelText = this.add.text(100,50,'Level: ',{
    font: '20px '+this.titleFont,
    fill: '#ffffff',
    backgroundColor: '#ff00ff' 
  });
  this.levelText.depth = 90;

  //Money Stat
  this.greenPointText = this.add.text(500,10,'♻️: ',{
    font: '26px '+this.titleFont,
    fill: '#ffffff',
    backgroundColor: '#ff00ff' 
  });
  this.greenPointText.depth = 90;

  //Pollution stat
  this.pollutionStatText = this.add.text(300,10,'💀: ',{
    font: '26px '+this.titleFont,
    fill: '#ffffff',
    backgroundColor: '#ff00ff'
  });
  this.pollutionStatText.depth = 90;

  //Arrow Keys
  this.arrowUp = this.physics.add.sprite(70, 140, "icon_arrow");
  this.arrowUp.body.allowGravity = false;
  this.arrowUp.setInteractive();
  this.arrowUp.on('pointerdown', function(){
    this.scrollScreen("Up", 50);
  }, this);
  this.arrowUp.depth = 90;

  this.arrowDown = this.physics.add.sprite(70, 240, "icon_arrow");
  this.arrowDown.flipY = true;
  this.arrowDown.body.allowGravity = false;
  this.arrowDown.setInteractive();
  this.arrowDown.on('pointerdown', function(){
    this.scrollScreen("Down", 50);
  }, this);
  this.arrowDown.depth = 90;

  //Earth Button
  this.healButton = this.physics.add.sprite(gameW - 70, 140, "icon_earth");
  this.healButton.body.allowGravity = false;
  this.healButton.setScale(0.2);
  this.healButton.setInteractive();
  this.healButton.on('pointerdown', function(){
    if (this.gameStats.greenpoints>= this.gameStats.restorationCost){
      this.gameStats.pollution -= this.gameStats.pollutionDrop;
      this.gameStats.greenpoints -= this.gameStats.restorationCost;
    } 
    else {
      this.displayModal(`Insufficient points. You need ${this.gameStats.restorationCost}♻️!`)
    }
  }, this);
  this.healButton.depth = 90;

  //Back Button
  this.backButton = this.physics.add.sprite(gameW- 70, 240, "icon_back");
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

  this.backButton.depth = 90;

  //Create Popup Modal
  this.popup = this.add.graphics();

  this.popup.setPosition(20, 20);
  this.popup.fillStyle(0xcddbf5, 1);
  this.popup.fillRect(0,0,this.popupW, this.popupH);
  this.popup.depth = 100;
  this.popup.setVisible(false);
/*
  this.closePopup = this.physics.add.sprite(570, 80, "icon_cross");
  this.closePopup.body.allowGravity = false;
  this.closePopup.setInteractive();
  this.closePopup.setScale(0.15);
  this.closePopup.on('pointerdown', function(){
    
  }, this);
  this.closePopup.depth = 101;
*/
  //Pollution stat
  this.popupText = this.add.text(50,150,'This is a fake modal. Please close me! :3 ',{
    font: '26px '+this.titleFont,
    fill: '#000000',
    align: 'center'
  });
  this.popupText.depth = 101;
  this.popupText.setVisible(false);
}

gameScene.goHome = function(){
  this.scene.start('Home', this.gameStats);
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

//Display modal for 1s
gameScene.displayModal = function(modalMsg){
  //Update modal text
  this.popupText.setText(modalMsg);
  
  this.popup.setVisible(true);
  this.popupText.setVisible(true);
  //Time 2s
  this.time.addEvent({
    delay: 1000,
    repeat: 0,
    callback: function(){
      this.popup.setVisible(false);
      this.popupText.setVisible(false);
    },
    callbackScope: this
  });
}

//Create and setup base tower
gameScene.setupTower = function(){
  this.floorData = [];
  this.floorProps = [];
  this.floorStatsData = [];
  this.floorLevelTexts = [];
  this.floorIncomeTexts = [];
  this.floorProgressBar = [];
  this.floorUpgradeButtons = [];
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

    this.floorStatsData[i].setPosition(148, 172 + i*(170*this.globalSpriteScale+this.floorStatsBarH));
    this.floorStatsData[i].fillStyle(0x817a93, 1);
    this.floorStatsData[i].fillRect(0,0,this.floorStatsBarW, this.floorStatsBarH);
    
    this.floorProgressBar[i] = this.add.graphics();

    this.floorProgressBar[i].setPosition(220, 177 + i*(170*this.globalSpriteScale+this.floorStatsBarH));
    this.floorProgressBar[i].fillStyle(0x50d9c8, 1);
    this.floorProgressBar[i].fillRect(0,0,(this.floorStatsBarW-110)*shop.currentRate/shop.completionRate, this.floorStatsBarH-10);
  
    this.floorLevelTexts[i] = this.add.text(150, 177 + i*(170*this.globalSpriteScale+this.floorStatsBarH), `Lv. ${shop.level}`, {
      fontFamily: this.titleFont,
      fontSize: '15px',
      fill: '#ffffff',
      fontWeight: 'bold',
    });
    this.floorIncomeTexts[i] = this.add.text(147, 197 + i*(170*this.globalSpriteScale+this.floorStatsBarH), `♻️ ${shop.level*this.gameStats.earningIncrement +this.gameStats.earningBase}`, {
      fontFamily: this.titleFont,
      fontSize: '15px',
      fill: '#ffffff',
      fontWeight: 'bold',
    });
    //Add Upgrade Icon
    if (!shop.locked){
      this.floorUpgradeButtons[i] = this.physics.add.sprite(525+this.globalSpriteTranslate, 200 + i*(170*this.globalSpriteScale+this.floorStatsBarH), 'icon_upgrade');
      this.floorUpgradeButtons[i].setScale(0.15*this.globalSpriteScale);
      this.physics.add.existing(this.floorUpgradeButtons[i], true);
      this.floorUpgradeButtons[i].body.allowGravity = false;
      this.floorUpgradeButtons[i].setInteractive();
      this.floorUpgradeButtons[i].on('pointerdown', function(){
        gameScene.upgradeShop(i);
      }, this);
    }
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

gameScene.upgradeShop = function(shopNo){
  shop = this.gameStats.shopsData[shopNo];
  amt = this.gameStats.upgradeBase+this.gameStats.upgradeIncrement*shop.level;
  if (this.gameStats.greenpoints>=amt){
    shop.level +=1;
    this.gameStats.greenpoints -= amt;
  }
  else this.displayModal(`Not enough green points! You need ${amt}♻️!`);
  //else alert(`Not enough green points! You need ${amt}!`);
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
  if (this.gameStats.greenpoints<this.gameStats.unlockCost){
    this.displayModal(`Insufficent Green Points! You need ${this.gameStats.unlockCost}♻️!`);
    //alert(`Insufficent Green Points! You need ${this.gameStats.unlockCost}!`);
    return;
  } 
  this.gameStats.greenpoints -= this.gameStats.unlockCost;
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
    
    //Add Upgrade button
      this.floorUpgradeButtons[shop] = this.physics.add.sprite(525+this.globalSpriteTranslate, 200 + shop*(170*this.globalSpriteScale+this.floorStatsBarH), 'icon_upgrade');
      this.floorUpgradeButtons[shop].setScale(0.15*this.globalSpriteScale);
      this.physics.add.existing(this.floorUpgradeButtons[shop], true);
      this.floorUpgradeButtons[shop].body.allowGravity = false;
      this.floorUpgradeButtons[shop].setInteractive();
      this.floorUpgradeButtons[shop].on('pointerdown', function(){
        gameScene.upgradeShop(shop);
      }, this);

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
    this.backButton.y = 240;
    this.popup.y = 20;
    this.popupText.y = 150;
    this.healButton.y = 140;
    this.headerBar.y = 0;
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
  this.popupText.y += travel;
  this.popup.y += travel;
  this.healButton.y += travel;
  this.headerBar.y += travel;
}

gameScene.checkLevel = function(){
  if(this.gameStats.profileExp<100) this.gameStats.profileExp += 0.1;
  else {
    this.gameStats.profileLv += 1;
    this.gameStats.profileExp = 0;
  }
}

gameScene.countUnlockedShops = function(){
  var count = 0;
  for (var i=0;i<this.gameStats.shopsData.length;i++){
    var shop = this.gameStats.shopsData[i];
    if (!shop.locked) count += 1;
  }

  return count;
}

//Run in update to monitor pollution level
gameScene.checkPollution = function(){
  //Simualte increasing pts
  this.gameStats.pollution += 0.001;
  if (this.gameStats.pollution<0) this.gameStats.pollution = 0;
  else if (this.gameStats.pollution>100) this.gameStats.pollution = 100;

  if (this.gameStats.pollution<33){
    this.bg.setTexture('background_clean');
    this.cameras.main.setBackgroundColor('#467698');
  }
  else if (this.gameStats.pollution<66){
    this.bg.setTexture('background_unclean');
    this.cameras.main.setBackgroundColor('#707e51');
  }
  else {
    this.bg.setTexture('background_dirty');
    this.cameras.main.setBackgroundColor('#562c37');
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
    
    //Check pollution
    this.checkPollution();
    
    //Earn Some MONEUH
    this.earnGreenPoints();
  
    this.checkLevel();
    gameScene.refreshHud();
    this.timeElapsed+=0.01;
  }
  
};