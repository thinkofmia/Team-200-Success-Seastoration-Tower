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
    this.timeElapsed = 0;
    this.floatingSpeed = 5;
    this.isAnimating = true;
    if(Object.keys(data).length != 0){
        this.gameStats = data;
    }
    else this.gameStats = {};
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

    let text = this.add.text(gameW/2, gameH/8, 'Goals to level up!', {
        font: "20px "+this.titleFont,
        fill: '#ffffff',
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