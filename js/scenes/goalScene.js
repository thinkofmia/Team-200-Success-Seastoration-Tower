// Create Goal Scene
let goalScene = new Phaser.Scene('Goal');

WebFont.load({
    google: {
      families: ['Grandstander', 'Averia Libre']
    }
  });

goalScene.init = function(data) {
    this.titleFont = 'Grandstander';
    this.bodyFont = 'Averia Libre';
    if(Object.keys(data).length != 0){
        this.gameStats = data;
    }
    else this.gameStats = {};
    this.profilePicPos = [100,100];
    this.profilePicSize = 0.75;
    this.barW = 300;
    this.barH = 20;
    this.goalDist = 30;
}

// load asset files for our game
goalScene.preload = function() {
}; 

//Create
goalScene.create = function(){
    //Game background
    this.bg = this.add.sprite(0,0,'background_clean').setInteractive();
    this.bg.setOrigin(0,0);
    this.cameras.main.setBackgroundColor('#467698');

    let gameW = this.sys.game.config.width;
    let gameH = this.sys.game.config.height;

    //Add Profile Pic
    //Back Frame
    this.backFramePP = this.physics.add.sprite(this.profilePicPos[0], this.profilePicPos[1], "profile_pic_back");
    this.backFramePP.setScale(this.profilePicSize);
    this.backFramePP.body.allowGravity = false;
    this.backFramePP.depth = 90;
    //Profile Pic
    this.profilePicture = this.physics.add.sprite(this.profilePicPos[0], this.profilePicPos[1], this.gameStats.profilePic);
    this.profilePicture.setScale(this.profilePicSize);
    this.profilePicture.body.allowGravity = false;
    this.profilePicture.depth = 90;
    //Front Frame
    this.frontFramePP = this.physics.add.sprite(this.profilePicPos[0], this.profilePicPos[1], "profile_pic_front");
    this.frontFramePP.setScale(this.profilePicSize);
    this.frontFramePP.body.allowGravity = false;
    this.frontFramePP.depth = 90;


    //Add Texts

    //Level bar background
    this.levelBg = this.add.graphics();

    this.levelBg.setPosition(180, 80);
    this.levelBg.fillStyle(0x000000, 1);
    this.levelBg.fillRect(0,0,this.barW+5, this.barH+5);
    this.levelBg.depth = 89;

    //Level Bar
    this.levelProgress = this.add.graphics();
    this.levelProgress.setPosition(182.5, 82.5);
    this.levelProgress.depth = 90;

    this.levelProgress.clear();
  this.levelProgress.fillStyle(0x9AD98D,1);
  this.levelProgress.fillRect(0,0, this.gameStats.profileExp/this.gameStats.maxExp * this.barW, this.barH);

    //Level Stat
    this.levelText = this.add.text(180,110,`Level ${this.gameStats.profileLv}: ${this.gameStats.profileExp.toFixed(0)}/${this.gameStats.maxExp.toFixed(0)}`,{
    font: '30px '+this.titleFont,
    fill: '#ffffff',
    fontWeight: 'bold',
    });
    this.levelText.depth = 90;

    let text = this.add.text(gameW/4, gameH/2, 'Goals to level up!', {
        font: "25px "+this.titleFont,
        fill: '#000000',
    });

    this.goals = [];
    this.goals[0] = this.add.text(gameW/3, gameH, '• Unlock 4 Shopkeepers', {
        font: "20px "+this.titleFont,
        fill: '#000000',
    });
    this.goals[1] = this.add.text(gameW/3, gameH, '• Get more than 50000♻️', {
        font: "20px "+this.titleFont,
        fill: '#000000',
    });
    this.goals[2] = this.add.text(gameW/3, gameH, '• Get to level 10 in a shop', {
        font: "20px "+this.titleFont,
        fill: '#000000',
    });

    for (var i=0;i<this.goals.length;i++){
        this.goals[i].y = gameH/2 + this.goalDist*(i+1);
    }

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
        this.returnToGame();
      },
      callbackScope: this
    });
  }, this);

};

goalScene.returnToGame = function(){
    this.scene.start('Game', this.gameStats);
  }