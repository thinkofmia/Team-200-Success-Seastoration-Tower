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
        //Variables
        let gameW = this.sys.game.config.width;
        let gameH = this.sys.game.config.height;

        //Game background, with active input
        let bg = this.add.sprite(0,0,'background_title').setInteractive();
        bg.setOrigin(0,0);
        bg.setScale(0.25);
        bg.depth = 1;

        //Transparent bg for clicking
        let clickable = this.add.graphics();
        let rect = new Phaser.Geom.Rectangle(0, 0, gameW, gameH);
        let pointer = this.input.activePointer; 
        clickable.fillStyle(0x000000, 0.0);
        clickable.fillRectShape(rect);
        //clickable.fillRect(0, 0, gameW, gameH);
        clickable.depth = 100;
        clickable.setInteractive(rect, () => {
            if(pointer.isDown) {
              pingvingotchiScene.placeItem(pointer);
            }
          });

        //clickable.on('pointerdown', this.placeItem, this);
        
        //Welcome Text
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
        this.pingvin = this.add.sprite(300,200,'sprite_pingvin',0).setInteractive();
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
        this.backButton.depth = 50;

        //Make pet draggable
        this.input.setDraggable(this.pingvin);

        //Add on drag features
        this.input.on('drag', function(pointer, gameObject, dragX, dragY){
            //Make sprite located at dragging
            gameObject.x = dragX;
            gameObject.y = dragY;
          });

        //Show Pet Stats
        this.createHud();
        this.refreshHud();
      
        //Start Decay
          //Decay of health and fun over time
        this.timedEventStats = this.time.addEvent({
            delay: 1000,
            repeat: -1, //Repeat forever
            callback: function(){
            //Update stats
            this.updateStats(this.decayRates);
            },
            callbackScope: this
        });
}

pingvingotchiScene.placeItem = function(pointer){
    //console.log(pointer);
    //console.log(localX, localY);
  
    //Check item selected
    if (!this.selectedItem) return;
  
    //UI must be unblocked
    if (this.uiBlocked) return;
  
    // Create new item in position
    let newItem = this.add.sprite(pointer.downX, pointer.downY, this.selectedItem.texture.key);
    newItem.setScale(0.2);
    newItem.depth = 51;
  
    //Block UI
    this.uiBlocked = true;
    
    //Add pingvin move
    this.pingvin.play('walking_pingvin');
    //Save current item
    let currSelectedItem = this.selectedItem;
    //Pingvin movement
    let pingvinTween = this.tweens.add({
      targets: this.pingvin,
      duration: 500,
      x: newItem.x,
      y: newItem.y-100,
      paused: false,
      callbackScope: this,
      onComplete: function(tween, sprites){
  
        //Destroy Item
        newItem.destroy();
  
        //Event listener when animation ends
        this.pingvin.on('animationcomplete', function(){
  
          //Set pet back to neutral
          this.pingvin.setFrame(0);
  
          //Clear UI
          this.uiReady();
  
          //Refresh HUD
          this.refreshHud();
  
        }, this);
  
        //Play spreadsheet animation
        this.pingvin.play('blushing_pingvin');
        
        //Update stats
        this.updateStats(currSelectedItem.customStats);
        }
    });
    
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
    pingvingotchiScene.createButtons();
  }

//Show current value of Health and fun
pingvingotchiScene.refreshHud = function(){
    this.healthText.setText(`Health: ${this.pingvinStats.health}`);
    this.funText.setText(`Fun: ${this.pingvinStats.fun}`);
  };

//Ends Game
pingvingotchiScene.gameOver = function(){
    //Block UI
    this.uiBlocked = true;

    //Change frame of pet
    this.pingvin.setFrame(5);

    //Keep game on for sometime
    this.time.addEvent({
        delay: 2000,
        repeat: 0,
        callback: function(){
            pingvingotchiScene.returnToMGSelection();
        },
        callbackScope: this
    });
};

pingvingotchiScene.createButtons = function(){
    //Add Sushi Button
    this.sushiBtn = this.add.sprite(600,100,'sprite_sushi').setInteractive();
    this.sushiBtn.customStats = {health: 20, fun: 0};
    this.sushiBtn.on('pointerdown', this.pickItem);
    this.sushiBtn.setScale(0.2);
    this.sushiBtn.depth = 51;

    //Add Chips Button
    this.chipsBtn = this.add.sprite(600,178,'sprite_chips').setInteractive();
    this.chipsBtn.customStats = {health: -20, fun: 25};
    this.chipsBtn.on('pointerdown', this.pickItem);
    this.chipsBtn.setScale(0.2);
    this.chipsBtn.depth = 51;

    //Add Pillow Button
    this.pillowBtn = this.add.sprite(50,100,'sprite_pillow').setInteractive();
    this.pillowBtn.customStats = {health: -5, fun: 15};
    this.pillowBtn.on('pointerdown', this.pickItem);
    this.pillowBtn.setScale(0.2);
    this.pillowBtn.depth = 51;

    //Array with all buttons
    this.buttons = [this.sushiBtn, this.chipsBtn, this.pillowBtn];

    //UI not blocked
    this.uiBlocked = false;

    //Refresh UI
    this.uiReady();
}

//Pick item
pingvingotchiScene.pickItem = function(){
    //console.log(this.customStats);
    if (this.scene.uiBlocked) return;
    
    //Make sure UI is ready
    this.scene.uiReady();
  
    //Select Item
    this.scene.selectedItem = this;
  
    //Change transparency
    this.alpha = 0.5;
  
    console.log('Picking ' + this.texture.key);
  };

pingvingotchiScene.uiReady = function(){
    //Nothing selected
    this.selectedItem = null;
  
    //Reset transparency
    for (let i=0; i<this.buttons.length; i++){
      this.buttons[i].alpha = 1;
    }
  
    //Unblock scene
    this.uiBlocked = false;
  }

//Stats Updater
pingvingotchiScene.updateStats = function(statDiff){
    //Flag to see if game over
    let isGameOver = false;

    for (stat in statDiff){
      if (statDiff.hasOwnProperty(stat)){
        this.pingvinStats[stat] += statDiff[stat];

        //Stats cant be negative
        if (this.pingvinStats[stat]<=0){
          isGameOver = true;
          this.pingvinStats[stat] = 0;
        } 

        //Refresh HUD
        this.refreshHud();

        //Check Game Over
        if(isGameOver) this.gameOver();
      }
    };
};
