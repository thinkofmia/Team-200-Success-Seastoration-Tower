// create a new scene
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function(data) {
  // fonts
  this.titleFont = 'Grandstander';
  this.bodyFont = 'Averia Libre';
  //UIs
  this.popupW = 600;
  this.popupH = 200;
  
  this.barW = 100;
  this.barH = 10;
  this.globalSpriteScale = 0.75;
  this.globalSpriteTranslate = -50;

  this.floorStatsBarW = 350;
  this.floorStatsBarH = 50;
  //Variables
  this.timeElapsed = 0;
  //Load Json data
  this.envQuotes = this.cache.json.get('envQuotes');
  if(Object.keys(data).length != 0){
    this.gameStats = data;
  }
  else this.gameStats = {
    goals: [
      {
        description: '• Unlock 4 Shopkeepers',
        type: 'countShopkeepers',
        count: 4,
        complete: false
      },
      {
        description: '• Get more than 50000♻️',
        type: 'countPoints',
        count: 50000,
        complete: false
      },
      {
        description: '• Get level 10 in a shop',
        type: 'lvShop',
        count: 10,
        complete: false
      },
    ],
    sfxVol: 0.5,
    bgmVol: 0.5,
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
        completionRate: 100,
        walkSpeed : -20,
      },
      //Shop 2
      {
        room: 'floor_qualle',
        locked: true,
        shopkeeper: 'kj',
        level: 1,
        currentRate: 0,
        completionRate: 500,
        walkSpeed: -15,
      },
      //Shop 3
      {
        room: 'floor_camera',
        locked: true,
        shopkeeper: 'sy',
        level: 1,
        currentRate: 0,
        completionRate: 1000,
        walkSpeed: -22,
      },
      //Shop 4
      {
        room: 'floor_kitchen',
        locked: true,
        shopkeeper: 'ky',
        level: 1,
        currentRate: 0,
        completionRate: 5000,
        walkSpeed: -17,
      },
      //Shop 5
      {
        room: 'floor_clinic',
        locked: true,
        shopkeeper: 'pingvin',
        level: 1,
        currentRate: 0,
        completionRate: 10000,
        walkSpeed: -20,
      },
    ]
  };
  this.isPlaying = true;
};

// load asset files for our game
gameScene.preload = function() {
  this.load.audio("bgm",["sfx/MarineParadise.mp3"]);
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

  // set up audio
  click = this.sound.add("click", {loop:false,volume:Object.keys(this.gameStats).length>0?this.gameStats.sfxVol:0.5});
  upgrade = this.sound.add("upgrade", {loop:false,volume:Object.keys(this.gameStats).length>0?this.gameStats.sfxVol:0.5});
  unlock = this.sound.add("unlock", {loop:false,volume:Object.keys(this.gameStats).length>0?this.gameStats.sfxVol:0.5});
  error = this.sound.add("error", {loop:false,volume:Object.keys(this.gameStats).length>0?this.gameStats.sfxVol:0.5});
  bgm = this.sound.add("bgm", {loop:true,volume:Object.keys(this.gameStats).length>0?1-this.gameStats.bgmVol:0.5});
  hover = this.sound.add("hover", {loop:false,volume:Object.keys(this.gameStats).length>0?this.gameStats.sfxVol:0.5});
};

gameScene.checkGoals = function(){
  for (var i=0;i<this.gameStats.goals.length;i++){
    let goal = this.gameStats.goals[i];
    //Only runs if goal is completed
    if (!goal.complete){
      switch(goal.type){
        //Count number of shopkeepers
        case 'countShopkeepers':
          if (this.countShopkeepers()>=goal.count){
            goal.complete = true;
            this.gainExp();
          } 
          break;
        //Count total points generated
        case 'countPoints':
          if (this.gameStats.greenpoints>=goal.count){
            goal.complete = true;
            this.gainExp();
          } 
          break;
        //Count Highest level of shops
        case 'lvShop':
          if (this.countHighestShopLevel()>=goal.count){
            goal.complete = true;
            this.gainExp();
          } 
          break;
      }
    }
  }
}

gameScene.environmentalQuote = function(characterName, speechBubble){
  //var characterName = character.shopkeeper;
  let quotes = this.envQuotes[characterName];
  let selectedQuote = quotes[Math.floor(Math.random()*quotes.length)];
  console.log(`${characterName}: ${selectedQuote}`);
  speechBubble.setText(selectedQuote);
  //Keep game on for sometime
  this.time.addEvent({
    delay: 1000,
    repeat: 0,
    callback: function(){
      speechBubble.setText(` `);
    },
    callbackScope: this
  });

}

gameScene.countHighestShopLevel = function(){
  var highestLv = 0;
  for (var i=0;i<this.gameStats.shopsData.length;i++){
    let shop = this.gameStats.shopsData[i];
    if (highestLv<shop.level) highestLv = shop.level; 
  }
  return highestLv;
}

gameScene.countShopkeepers = function(){
  var count = 0;
  for (var i=0;i<this.gameStats.shopsData.length;i++){
    let shop = this.gameStats.shopsData[i];
    if (!shop.locked) count +=1;
  }
  return count;
}

//Show current value of stats
gameScene.refreshHud = function(){
  //Update texts
  this.levelText.setText(`Level: ${this.gameStats.profileLv}`);
  this.greenPointText.setText(`♻️: ${this.gameStats.greenpoints.toFixed(0)}`);
  this.pollutionStatText.setText(`💀: ${this.gameStats.pollution.toFixed(2)}%`);
  // this.settingsText.setText(`🔧`);

  //Update shop
  for (var i=0;i<this.gameStats.shopsData.length;i++){
    shop = this.gameStats.shopsData[i];
    if (shop.locked){
      this.floorLevelTexts[i].setText('');
      this.floorIncomeTexts[i].setText('');
      this.floorUpgradeTexts[i].setText('');
    }
    else{
      this.floorUpgradeTexts[i].setText(`♻️ ${this.gameStats.upgradeBase+this.gameStats.upgradeIncrement*shop.level}`);
      this.floorLevelTexts[i].setText(`Lv. ${shop.level}`);
      this.floorIncomeTexts[i].setText(`♻️ ${shop.level*(this.gameStats.earningIncrement*(i+1)) +this.gameStats.earningBase}`);
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
  if(!bgm.isPlaying) bgm.play();
  
  let gameW = this.sys.game.config.width;
  let gameH = this.sys.game.config.height;

  //Profile
  //Back Frame
  this.backFramePP = this.physics.add.sprite(25, 25, "profile_pic_back");
  this.backFramePP.setScale(0.25);
  this.backFramePP.body.allowGravity = false;
  this.backFramePP.depth = 90;
  //Profile Pic
  this.profilePicture = this.physics.add.sprite(25, 25, this.gameStats.profilePic);
  this.profilePicture.setScale(0.25);
  this.profilePicture.body.allowGravity = false;
  this.profilePicture.depth = 90;
  this.profilePicture.setInteractive();
  this.profilePicture.on('pointerover', function() {
    hover.play();
  }, this);
  this.profilePicture.on('pointerdown', function(){
    click.play();
    this.isPlaying = false;
    bgm.isPlaying = true;
    this.scene.start('Goal', this.gameStats);
  }, this);
  //Front Frame
  this.frontFramePP = this.physics.add.sprite(25, 25, "profile_pic_front");
  this.frontFramePP.setScale(0.25);
  this.frontFramePP.body.allowGravity = false;
  this.frontFramePP.depth = 90;

  this.headerBar = this.add.graphics();
  this.headerBar.setPosition(0, 0);
  this.headerBar.fillStyle(0x459eda, 1);
  this.headerBar.fillRect(0, 0, 1000, 50);
  this.headerBar.depth = 50;

  //Level bar background
  this.levelBg = this.add.graphics();

  this.levelBg.setPosition(50, 25);
  this.levelBg.fillStyle(0x000000, 1);
  this.levelBg.fillRect(0,0,this.barW+5, this.barH+5);
  this.levelBg.depth = 89;

  //Level Bar
  this.levelProgress = this.add.graphics();
  this.levelProgress.setPosition(52.5, 27.5);
  this.levelProgress.depth = 90;

  //Level Stat
  this.levelText = this.add.text(50,5,'Level: ',{
    font: '15px '+this.titleFont,
    fill: '#ffffff'
  });
  this.levelText.depth = 90;

  //Money Stat
  this.greenPointText = this.add.text(450,10,'♻️: ',{
    font: '26px '+this.titleFont,
    fill: '#ffffff'
  });
  this.greenPointText.depth = 90;

  //Pollution stat
  this.pollutionStatText = this.add.text(250,10,'💀: ',{
    font: '26px '+this.titleFont,
    fill: '#ffffff'
  });
  this.pollutionStatText.depth = 90;

  //Settings
  // this.settingsText = this.add.text(500,10,'🔧: ',{
  //   font: '26px '+this.titleFont,
  //   fill: '#ffffff'
  // });
  // this.settingsText.depth = 90;

  //Arrow Keys
  this.arrowUp = this.physics.add.sprite(70, 160, "icon_arrow");
  this.arrowUp.body.allowGravity = false;
  this.arrowUp.setInteractive();
  this.arrowUp.on('pointerover', function(){
    hover.play();
    this.arrowUp.setScale(1.1);
  }, this);
  this.arrowUp.on('pointerout', function(){
    this.arrowUp.setScale(1.0);
  }, this);
  this.arrowUp.on('pointerdown', function(){
    click.play();
    this.scrollScreen("Up", 50);
  }, this);
  this.arrowUp.depth = 90;

  this.arrowDown = this.physics.add.sprite(70, 280, "icon_arrow");
  this.arrowDown.flipY = true;
  this.arrowDown.body.allowGravity = false;
  this.arrowDown.setInteractive();
  this.arrowDown.on('pointerover', function(){
    hover.play();
    this.arrowDown.setScale(1.1);
  }, this);
  this.arrowDown.on('pointerout', function(){
    this.arrowDown.setScale(1.0);
  }, this);
  this.arrowDown.on('pointerdown', function(){
    click.play();
    this.scrollScreen("Down", 50);
  }, this);
  this.arrowDown.depth = 90;

// Settings icon
this.settingsButton = this.physics.add.sprite(600, 23, "settings");
this.settingsButton.setScale(0.4);
this.settingsButton.setInteractive();
this.settingsButton.body.allowGravity = false;
this.settingsButton.on('pointerover', function(){
  hover.play();
  this.settingsButton.setScale(0.45);
}, this);
this.settingsButton.on('pointerout', function(){
  this.settingsButton.setScale(0.4);
}, this);
this.settingsButton.on('pointerdown', function(){
  click.play();
  gameScene.isPlaying = false;
  bgm.isPlaying = true;
  this.scene.start('Settings', this.gameStats);
}, this);
this.settingsButton.depth = 90;

//Minigame Button
this.minigameButton = this.physics.add.sprite(gameW - 70, 90, "icon_minigame");
this.minigameButton.body.allowGravity = false;
this.minigameButton.setScale(0.2);
this.minigameButton.setInteractive();
this.minigameButton.on('pointerover', function(){
  hover.play();
  this.minigameButton.setScale(0.25);
}, this);
this.minigameButton.on('pointerout', function(){
  this.minigameButton.setScale(0.2);
}, this);
this.minigameButton.on('pointerdown', function(){
  click.play();
  gameScene.isPlaying = false;
  bgm.isPlaying = true;
  this.scene.start('MGSelection', this.gameStats);
}, this);
this.minigameButton.depth = 90;

  //Earth Button
  this.healButton = this.physics.add.sprite(gameW - 70, 180, "icon_heal");
  this.healButton.body.allowGravity = false;
  this.healButton.setScale(0.2);
  this.healButton.setInteractive();
  this.healButton.on('pointerover', function(){
    hover.play();
    this.healButton.setScale(0.25);
  }, this);
  this.healButton.on('pointerout', function(){
    this.healButton.setScale(0.2);
  }, this);
  this.healButton.on('pointerdown', function(){
    if (this.gameStats.greenpoints>= this.gameStats.restorationCost){
      click.play();
      this.gameStats.pollution -= this.gameStats.pollutionDrop;
      this.gameStats.greenpoints -= this.gameStats.restorationCost;
      this.gainExp();
    } 
    else {
      error.play();
      this.displayModal(`Insufficient points. You need ${this.gameStats.restorationCost}♻️!`)
    }
  }, this);
  this.healButton.depth = 90;

  //Back Button
  this.backButton = this.physics.add.sprite(gameW- 70, 280, "icon_back");
  this.backButton.body.allowGravity = false;
  this.backButton.setInteractive();
  this.backButton.on('pointerover', function(){
    hover.play();
    this.backButton.setScale(1.1);
  }, this);
  this.backButton.on('pointerout', function(){
    this.backButton.setScale(1.0);
  }, this);
  this.backButton.on('pointerover', function() {
    hover.play();
  }, this);
  this.backButton.on('pointerdown', function(){
    click.play();
    this.backButton.setFrame(1);
    this.isPlaying = false;
    // placeholder stop audio till i can get bgm.stop() to work
    this.sound.stopAll();

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
  this.backButton.setScale(0.8);

  //Create Popup Modal
  this.popup = this.add.graphics();

  this.popup.setPosition(20, 110);
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
  this.popupText = this.add.text(50,170,'This is a fake modal. Please close me! :3 ',{
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
  this.floorUpgradeTexts = [];
  this.floorProgressBar = [];
  this.floorUpgradeButtons = [];
  //Create all floors
  this.floors = this.physics.add.staticGroup();
  for (let i=0;i<this.gameStats.shopsData.length;i++){

    shop = this.gameStats.shopsData[i];
    if (shop.locked){
      if (i==this.gameStats.nextShopToBuy){
        this.floorData[i] = this.physics.add.sprite(380+this.globalSpriteTranslate, 100 + i*(170*this.globalSpriteScale+this.floorStatsBarH), 'floor_locked');
        this.floorData[i].setScale(0.25*this.globalSpriteScale);
        this.physics.add.existing(this.floorData[i], true);
        this.floorData[i].body.allowGravity = false;
      }
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
          this.addProp("Table",shop.room, i);
          break;
        case "floor_qualle":
          this.addProp("Beanbag L",shop.room, i);
          this.addProp("Beanbag R",shop.room, i);
          break;
        case "floor_clinic":
          this.addProp("Poster",shop.room, i);
          this.addProp("Table",shop.room, i);
          break;
      }
          //Add Props
          this.addProp("Door",shop.room, i);
    }
    
    //Add Data
    if (!shop.locked || i<=this.gameStats.nextShopToBuy){
      this.floorStatsData[i] = this.add.graphics();

      this.floorStatsData[i].setPosition(148, 172 + i*(170*this.globalSpriteScale+this.floorStatsBarH));
      this.floorStatsData[i].fillStyle(0x817a93, 1);
      this.floorStatsData[i].fillRect(0,0,this.floorStatsBarW, this.floorStatsBarH);
      
      this.floorProgressBar[i] = this.add.graphics();

      this.floorProgressBar[i].setPosition(220, 177 + i*(170*this.globalSpriteScale+this.floorStatsBarH));
      this.floorProgressBar[i].fillStyle(0x50d9c8, 1);
      this.floorProgressBar[i].fillRect(0,0,(this.floorStatsBarW-110)*shop.currentRate/shop.completionRate, this.floorStatsBarH-10);
    }

    this.floorLevelTexts[i] = this.add.text(150, 177 + i*(170*this.globalSpriteScale+this.floorStatsBarH), `Lv. ${shop.level}`, {
      fontFamily: this.titleFont,
      fontSize: '15px',
      fill: '#ffffff',
      fontWeight: 'bold',
    });
    this.floorLevelTexts[i].depth = 44;
    this.floorIncomeTexts[i] = this.add.text(147, 197 + i*(170*this.globalSpriteScale+this.floorStatsBarH), `♻️ ${shop.level*this.gameStats.earningIncrement +this.gameStats.earningBase}`, {
      fontFamily: this.titleFont,
      fontSize: '15px',
      fill: '#ffffff',
      fontWeight: 'bold',
    });
    this.floorIncomeTexts[i].depth = 44;

    this.floorUpgradeTexts[i] = this.add.text(490+this.globalSpriteTranslate, 200 + i*(170*this.globalSpriteScale+this.floorStatsBarH), `♻️ ${this.gameStats.upgradeBase+this.gameStats.upgradeIncrement*shop.level}`, {
      fontFamily: this.titleFont,
      fontSize: '15px',
      fill: '#ffffff',
      fontWeight: 'bold',
    });
    this.floorUpgradeTexts[i].depth = 44;

    //Add Upgrade Icon
    if (!shop.locked){
      this.floorUpgradeButtons[i] = this.physics.add.sprite(525+this.globalSpriteTranslate, 190 + i*(170*this.globalSpriteScale+this.floorStatsBarH), 'icon_upgrade');
      this.floorUpgradeButtons[i].setScale(0.10*this.globalSpriteScale);
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
    this.unlockIcon = this.physics.add.sprite(370+this.globalSpriteTranslate, 95+this.gameStats.nextShopToBuy*(170*this.globalSpriteScale+this.floorStatsBarH), 'icon_recycle');
    this.unlockIcon.setScale(0.25*this.globalSpriteScale);
    this.physics.add.existing(this.unlockIcon, true);
    this.unlockIcon.body.allowGravity = false;
    this.unlockIcon.setInteractive();
    this.unlockIcon.depth = 44;
    this.unlockText = this.add.text(320+this.globalSpriteTranslate, 135+this.gameStats.nextShopToBuy*(170*this.globalSpriteScale+this.floorStatsBarH), `Unlock ♻️ ${(this.gameStats.unlockCost+(this.gameStats.upgradeIncrement+this.gameStats.earningBase)*this.gameStats.nextShopToBuy)*this.gameStats.nextShopToBuy}`, {
      fontFamily: this.titleFont,
      fontSize: '15px',
      fill: '#ffffff',
      fontWeight: 'bold',
    });
    this.unlockText.depth = 44;
    this.unlockIcon.on('pointerdown', function(){
      gameScene.unlockShop();
    }, this);
  }
  

  //Character
  this.shopKeepersData = [];
  this.shopKeepersTexts = [];

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
      shopkeeper.setInteractive();
      
    
      //Shopkeeper text
      let shopkeeperText = this.add.text(360 + Math.random()* 40+this.globalSpriteTranslate, 75 + i*(170*this.globalSpriteScale+this.floorStatsBarH), ``, {
        fontFamily: this.titleFont,
        fontSize: '15px',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3,
        align: 'center'
      });

      //Add to data
      this.shopKeepersData.push(shopkeeper);
      this.shopKeepersTexts.push(shopkeeperText);

      shopkeeper.on('pointerdown', function(){
        this.environmentalQuote(this.gameStats.shopsData[i].shopkeeper,shopkeeperText);
      }, this);
    }
  }


}

gameScene.upgradeShop = function(shopNo){
  shop = this.gameStats.shopsData[shopNo];
  amt = this.gameStats.upgradeBase+this.gameStats.upgradeIncrement*shop.level;
  if (this.gameStats.greenpoints>=amt){
    upgrade.play();
    shop.level +=1;
    this.gameStats.greenpoints -= amt;
  }
  else {
    error.play();
    this.displayModal(`Not enough green points! You need ${amt}♻️!`);
  }
  //else alert(`Not enough green points! You need ${amt}!`);
}

gameScene.earnGreenPoints = function(){
  for (var i=0;i<this.gameStats.shopsData.length;i++){
    var shop = this.gameStats.shopsData[i];
    if (!shop.locked){
      if(shop.currentRate>=shop.completionRate){
        this.gameStats.greenpoints += shop.level*(this.gameStats.earningIncrement*(i+1)) +this.gameStats.earningBase;
        shop.currentRate = 0;
      }
      else {
        shop.currentRate += 1;
      }
    }
  }
}

gameScene.unlockShop = function(){
  let shopCost = (this.gameStats.unlockCost+(this.gameStats.upgradeIncrement+this.gameStats.earningBase)*this.gameStats.nextShopToBuy)*this.gameStats.nextShopToBuy;
  if (this.gameStats.greenpoints<shopCost){
    error.play();
    this.displayModal(`Insufficent Green Points! You need ♻️${shopCost}!`);
    //alert(`Insufficent Green Points! You need ${this.gameStats.unlockCost}!`);
    return;
  } 
  this.gameStats.greenpoints -= shopCost;
  var shop = this.gameStats.nextShopToBuy;
  var shopKeeperName = this.gameStats.shopsData[shop].shopkeeper;
  var shopName = this.gameStats.shopsData[shop].room;
  if (shop<this.gameStats.shopsData.length){
    unlock.play();

    //Reveal room
    this.floorData[shop].setTexture(this.gameStats.shopsData[shop].room);

    //Show locked next room
    if (shop+1<this.gameStats.shopsData.length){
      this.floorData[shop+1] = this.physics.add.sprite(380+this.globalSpriteTranslate, 100 + (shop+1)*(170*this.globalSpriteScale+this.floorStatsBarH), 'floor_locked');
      this.floorData[shop+1].setScale(0.25*this.globalSpriteScale);
      this.physics.add.existing(this.floorData[shop+1], true);
      this.floorData[shop+1].body.allowGravity = false;

      this.floorStatsData[shop+1] = this.add.graphics();

      this.floorStatsData[shop+1].setPosition(148, 172 + (shop+1)*(170*this.globalSpriteScale+this.floorStatsBarH));
      this.floorStatsData[shop+1].fillStyle(0x817a93, 1);
      this.floorStatsData[shop+1].fillRect(0,0,this.floorStatsBarW, this.floorStatsBarH);
      
      this.floorProgressBar[shop+1] = this.add.graphics();

      this.floorProgressBar[shop+1].setPosition(220, 177 + (shop+1)*(170*this.globalSpriteScale+this.floorStatsBarH));
      this.floorProgressBar[shop+1].fillStyle(0x50d9c8, 1);
      this.floorProgressBar[shop+1].fillRect(0,0,(this.floorStatsBarW-110)*shop.currentRate/shop.completionRate, this.floorStatsBarH-10);
    }
    //Unlock Props
    this.floorProps[shop] = {};
    //Extra Props
    switch (shopName){
      case "floor_basic": 
        this.addProp("Poster",shopName, shop);
        this.addProp("Table",shopName, shop);
        break;
      case "floor_qualle":
        this.addProp("Beanbag L",shopName, shop);
        this.addProp("Beanbag R",shopName, shop);
        break;
      case "floor_clinic": 
        this.addProp("Poster",shopName, shop);
        this.addProp("Table",shopName, shop);
        break;
    }
        //Add Props
        this.addProp("Door",shopName, shop);

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
    shopkeeper.setInteractive();
    //Add shopkeeperText
    let shopkeeperText = this.add.text(360 + Math.random()* 40+this.globalSpriteTranslate, 75 + shop*(170*this.globalSpriteScale+this.floorStatsBarH), ``, {
      fontFamily: this.titleFont,
      fontSize: '15px',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
      align: 'center'
    });

    
    shopkeeper.on('pointerdown', function(){
      this.environmentalQuote(this.gameStats.shopsData[shop].shopkeeper,shopkeeperText);
    }, this);
    //Add to data
    this.shopKeepersData.push(shopkeeper);
    this.shopKeepersTexts.push(shopkeeperText);
    
    //Add Upgrade button
      this.floorUpgradeButtons[shop] = this.physics.add.sprite(525+this.globalSpriteTranslate, 190 + shop*(170*this.globalSpriteScale+this.floorStatsBarH), 'icon_upgrade');
      this.floorUpgradeButtons[shop].setScale(0.10*this.globalSpriteScale);
      this.physics.add.existing(this.floorUpgradeButtons[shop], true);
      this.floorUpgradeButtons[shop].body.allowGravity = false;
      this.floorUpgradeButtons[shop].setInteractive();
      this.floorUpgradeButtons[shop].on('pointerdown', function(){
        gameScene.upgradeShop(shop);
      }, this);
      this.floorUpgradeTexts[shop] = this.add.text(490+this.globalSpriteTranslate, 200 + shop*(170*this.globalSpriteScale+this.floorStatsBarH), `♻️ ${this.gameStats.upgradeBase+this.gameStats.upgradeIncrement*shop.level}`, {
        fontFamily: this.titleFont,
        fontSize: '15px',
        fill: '#ffffff',
        fontWeight: 'bold',
      });
      this.floorUpgradeTexts[shop].depth = 44;

    //Update status of shop
    this.gameStats.shopsData[shop].locked = false;
    //Update Unlock icon position and next shop to buy
    this.gameStats.nextShopToBuy +=1;
    this.unlockIcon.y = 95 + this.gameStats.nextShopToBuy*(170*this.globalSpriteScale+this.floorStatsBarH);
    this.unlockText.setText(`Unlock ♻️ ${(this.gameStats.unlockCost+(this.gameStats.upgradeIncrement+this.gameStats.earningBase)*this.gameStats.nextShopToBuy)*this.gameStats.nextShopToBuy}`);
    this.unlockText.y = 135 + this.gameStats.nextShopToBuy*(170*this.globalSpriteScale+this.floorStatsBarH);
  }
  if (this.gameStats.nextShopToBuy>=this.gameStats.shopsData.length){
    //Else destroy icon
    this.gameStats.nextShopToBuy = -1;
    this.unlockIcon.destroy();
    this.unlockText.destroy();
  }
  
}

//Add Props
gameScene.addProp = function(objectKey, room, floor){
  propHeight = 100 + floor*(170*this.globalSpriteScale+this.floorStatsBarH);
  propDist = 300 + this.globalSpriteTranslate;
  switch (room){
    case "floor_basic":
      if (objectKey=="Table") this.floorProps[floor][objectKey] = this.physics.add.sprite(propDist+100, propHeight, "table_basic");
      if (objectKey=="Poster") this.floorProps[floor][objectKey] = this.physics.add.sprite(propDist + 50 + Math.random()*50, propHeight, "poster_basic");
      break;
    case "floor_qualle":
      if (objectKey=="Beanbag L") this.floorProps[floor][objectKey] = this.physics.add.sprite(propDist, propHeight, "beanbagL_qualle");
      if (objectKey=="Beanbag R") this.floorProps[floor][objectKey] = this.physics.add.sprite(propDist, propHeight, "beanbagR_qualle");
      break;
    case "floor_clinic":
      if (objectKey=="Table") this.floorProps[floor][objectKey] = this.physics.add.sprite(propDist+100, propHeight, "table_basic");
      if (objectKey=="Poster") this.floorProps[floor][objectKey] = this.physics.add.sprite(propDist + 50 + Math.random()*50, propHeight, "poster_clinic");
      break;
  }
  
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
    this.settingsButton.y = 23;
    this.arrowUp.y = 160;
    this.arrowDown.y = 280;   
    this.backFramePP.setPosition(25, 25);
    this.frontFramePP.setPosition(25, 25);
    this.profilePicture.setPosition(25, 25);
    this.levelBg.y = 25;
    this.levelProgress.y = 27.5;
    this.levelText.y = 5;
    this.backButton.y = 280;
    this.popup.y = 20;
    this.popupText.y = 170;
    this.healButton.y = 180;
    this.headerBar.y = 0;
    this.minigameButton.y = 90;
    return;
  }
  this.arrowUp.y += travel;
  this.arrowDown.y += travel;
  this.greenPointText.y += travel;
  this.pollutionStatText.y += travel;
  this.settingsButton.y += travel;
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
  this.minigameButton.y += travel;
}

gameScene.gainExp = function(exp = 30){
  this.gameStats.profileExp += exp;
  if (this.gameStats.profileExp>=this.gameStats.maxExp) {
    this.gameStats.profileLv += 1;
    this.gameStats.profileExp = 0;
    this.gameStats.maxExp += 100*this.gameStats.profileLv;
  }
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
  this.gameStats.pollution += 0.001*this.gameStats.profileLv;
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
      speed = this.gameStats.shopsData[i].walkSpeed;
      //Random Motion
      if (this.timeElapsed%5>3){
        this.shopKeepersData[i].body.setVelocityX(-speed);
        this.shopKeepersTexts[i].x = this.shopKeepersData[i].x-100;
        this.shopKeepersData[i].flipX = false;
        //Check
        if (!this.shopKeepersData[i].anims.isPlaying) this.shopKeepersData[i].anims.play(`walking_${shopKeeperName}`);
      }
      else if (this.timeElapsed%5>1){
        this.shopKeepersData[i].body.setVelocityX(speed);
        this.shopKeepersTexts[i].x = this.shopKeepersData[i].x-100;
        this.shopKeepersData[i].flipX = true;
        if (!this.shopKeepersData[i].anims.isPlaying) this.shopKeepersData[i].anims.play(`walking_${shopKeeperName}`);
      }
      else {
        this.shopKeepersData[i].body.setVelocityX(0);
        this.shopKeepersTexts[i].x = this.shopKeepersData[i].x-100;
        this.shopKeepersData[i].anims.stop(`walking_${shopKeeperName}`);
  
        //Set default frame
        this.shopKeepersData[i].setFrame(0);
      }
      
    }
    
    //Check pollution
    this.checkPollution();
    
    //Earn Some MONEUH
    this.earnGreenPoints();

    //Check goals
    this.checkGoals();

    this.refreshHud();
    this.timeElapsed+=0.01;
  }
  
};