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
    this.profilePicture.setInteractive();
    this.profilePicture.on('pointerdown', function(){
        this.isPlaying = false;
        this.scene.start('Goal', this.gameStats);
    }, this);
    //Front Frame
    this.frontFramePP = this.physics.add.sprite(this.profilePicPos[0], this.profilePicPos[1], "profile_pic_front");
    this.frontFramePP.setScale(this.profilePicSize);
    this.frontFramePP.body.allowGravity = false;
    this.frontFramePP.depth = 90;


    //Add Texts
    let text = this.add.text(gameW/4, gameH/2, 'Goals to level up!', {
        font: "25px "+this.titleFont,
        fill: '#000000',
    });

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