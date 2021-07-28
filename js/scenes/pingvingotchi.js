// create a new scene
let pingvingotchiScene = new Phaser.Scene('Pingvingotchi');

WebFont.load({
    google: {
      families: ['Grandstander', 'Averia Libre']
    }
  });

pingvingotchiScene.init = function(data){
    if(Object.keys(data).length != 0){
        this.gameStats = data;
      }
    else this.gameStats = {};

    //Game Stats
    this.pingvinStats = {
        health: 100,
        fun: 100
    }

    //Decay Parameters
    this.decayRates = {
        health: -5,
        fun: -2
    }

    // fonts
    this.titleFont = 'Grandstander';
    this.bodyFont = 'Averia Libre';
}

pingvingotchiScene.create = function(){
        //Game background, with active input
        let bg = this.add.sprite(0,0,'background_title').setInteractive();
        bg.setOrigin(0,0);
        bg.setScale(0.25);
        
        //Welcome Text
        let gameW = this.sys.game.config.width;
        let gameH = this.sys.game.config.height;
    
        let text = this.add.text(gameW/8, gameH/14, 'Pingvingotchi', {
            font: "20px "+this.titleFont,
            fill: '#ffffff',
        });
        text.depth = 52;
    
        game1H = gameH/4*1.5;
        game2H = gameH/4*2.5;
        game3H = gameH/4*3.5;
        optionHeights = [game1H, game2H, game3H];
        
        text.setOrigin(0.5, 0.5);
    
        //Text background
        let textBg = this.add.graphics();
        textBg.fillStyle(0x000000, 0.7);
        textBg.fillRect(gameW/8 - text.width/2 - 10, gameH/14 - text.height/2 -10, text.width+20, text.height+ 20);
        textBg.depth = 51;
        //Add Pingvin
        this.pingvin = this.add.sprite(100,200,'sprite_pingvin',0).setInteractive();
        this.pingvin.setScale(0.3);
        this.pingvin.depth = 1;

        //Back Button
        this.backButton = this.physics.add.sprite(gameW- 70, 280, "icon_back");
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
                this.returnToMGSelection();
            },
            callbackScope: this
            });
        }, this);


        //Add on drag features
        this.input.on('drag', function(pointer, gameObject, dragX, dragY){
            //Make sprite located at dragging
            gameObject.x = dragX;
            gameObject.y = dragY;
          });

        //Show Pet Stats
        this.createHud();
        this.refreshHud();
      
}

pingvingotchiScene.returnToMGSelection = function(){
    this.isAnimating = false;
    this.scene.start('MGSelection',this.gameStats);
}

//Create HUD
pingvingotchiScene.createHud = function(){
    //Header Bar
    this.headerBar = this.add.graphics();
    this.headerBar.setPosition(0, 0);
    this.headerBar.fillStyle(0x459eda, 1);
    this.headerBar.fillRect(0, 0, 1000, 50);
    this.headerBar.depth = 50;
    //Health Stat
    this.healthText = this.add.text(200,10,'Health: ',{
      font: '20px '+this.bodyFont,
      fill: '#ffffff'
    });
    this.healthText.depth = 51;
  
    //Fun stat
    this.funText = this.add.text(370,10,'Fun: ',{
      font: '20px '+this.bodyFont,
      fill: '#ffffff'
    });

    this.funText.depth = 51;
  
  }

//Show current value of Health and fun
pingvingotchiScene.refreshHud = function(){
    this.healthText.setText(`Health: ${this.pingvinStats.health}`);
    this.funText.setText(`Fun: ${this.pingvinStats.fun}`);
  };