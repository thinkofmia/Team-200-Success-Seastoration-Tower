// create a new scene
let pingvingotchiScene = new Phaser.Scene('Pingvingotchi');

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
}

pingvingotchiScene.create = function(){
        //Game background, with active input
        let bg = this.add.sprite(0,0,'background_title').setInteractive();
        bg.setOrigin(0,0);
        bg.setScale(0.25);
        
        //Welcome Text
        let gameW = this.sys.game.config.width;
        let gameH = this.sys.game.config.height;
    
        let text = this.add.text(gameW/2, gameH/8, 'Pingvingotchi', {
            font: "20px "+this.titleFont,
            fill: '#ffffff',
        });
    
        game1H = gameH/4*1.5;
        game2H = gameH/4*2.5;
        game3H = gameH/4*3.5;
        optionHeights = [game1H, game2H, game3H];
        
        text.setOrigin(0.5, 0.5);
        text.depth = 1;
    
        //Text background
        let textBg = this.add.graphics();
        textBg.fillStyle(0x000000, 0.7);
        textBg.fillRect(gameW/2 - text.width/2 - 10, gameH/8 - text.height/2 -10, text.width+20, text.height+ 20);

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
      
}

pingvingotchiScene.returnToMGSelection = function(){
    this.isAnimating = false;
    this.scene.start('MGSelection',this.gameStats);
}