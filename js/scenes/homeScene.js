// create a new scene
let homeScene = new Phaser.Scene('Home');

WebFont.load({
    google: {
      families: ['Grandstander', 'Averia Libre']
    }
  });

homeScene.preload = function() {
    this.load.audio("clicksplash",["sfx/ClickSplash.ogg"]);
}

homeScene.init = function(data) {
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

//Create
homeScene.create = function(){
    //Game background, with active input
    let bg = this.add.sprite(0,0,'background_title').setInteractive();
    bg.setOrigin(0,0);
    bg.setScale(0.25);

    // set up audio
    clicksplash = this.sound.add("clicksplash", {loop:false});

    this.setupSprites();
    
    //Welcome Text
    let gameW = this.sys.game.config.width;
    let gameH = this.sys.game.config.height;

    let text = this.add.text(gameW/2, gameH/8, 'Seastoration Tower', {
        font: "20px "+this.titleFont,
        fill: '#ffffff',
    });

    game1H = gameH/4*1.5;
    game2H = gameH/4*2.5;
    game3H = gameH/4*3.5;
    optionHeights = [game1H, game2H, game3H];

    let game1 = this.add.text(gameW/2, game1H, 'New Game', {
        font: '20px '+this.titleFont,
        fill: '#ffffff',
    });

    let game2 = this.add.text(gameW/2, game2H, 'Continue', {
        font: '20px '+this.titleFont,
        fill: '#ffffff',
    });

    let game3 = this.add.text(gameW/2, game3H, 'Settings', {
        font: '20px '+this.titleFont,
        fill: '#ffffff',
    });

    gameOptions = [game1,game2,game3];
    
    text.setOrigin(0.5, 0.5);
    text.depth = 1;

    let optionBg = [];
    for (var i=0;i<gameOptions.length;i++){
        gameOptions[i].setOrigin(0.5, 0.5);
        gameOptions[i].depth = 1;

        //Text background
        optionBg[i] = this.add.graphics();
        optionBg[i].setInteractive();
        optionBg[i].fillStyle(0xA01010, 0.7);
        optionBg[i].fillRect(gameW/2 - gameOptions[i].width/2 - 10, optionHeights[i] - gameOptions[i].height/2 -10, gameOptions[i].width+20, gameOptions[i].height+ 20);
        gameOptions[i].setInteractive();
    };

    game1.on('pointerdown', function(){
        homeScene.isAnimating = false;
        clicksplash.play();
        this.scene.start('Game', {});
    }, this);

    game2.on('pointerdown', function(){
        homeScene.isAnimating = false;
        clicksplash.play();
        this.scene.start('Game', this.gameStats);
    }, this);

    if(Object.keys(this.gameStats).length === 0){
        game2.setVisible(false);
        optionBg[1].setVisible(false);
    }
    else {
        game2.setVisible(true);
        optionBg[1].setVisible(true);
    }
    
    game3.on('pointerdown', function(){
        homeScene.isAnimating = false;
        clicksplash.play();
        //Display Settin Screen
        this.scene.start('Settings', this.gameStats);
    }, this);

    //Text background
    let textBg = this.add.graphics();
    textBg.fillStyle(0x000000, 0.7);
    textBg.fillRect(gameW/2 - text.width/2 - 10, gameH/8 - text.height/2 -10, text.width+20, text.height+ 20);
  
};

homeScene.setupSprites = function(){
    //add trashbag shark
    this.shark = this.add.sprite(60 + Math.random()* 40, Math.random()*200+100 , `sprite_shark`);
    this.physics.add.existing(this.shark)
    this.shark.setScale(0.1);
    this.shark.body.allowGravity = false;
    this.shark.body.setVelocityX(40);
    if (!this.shark.anims.isPlaying) this.shark.anims.play(`swimming_shark`);

    //Add Floating Rubbish
    this.floatingRubbishForward = [];
    this.floatingRubbishReverse = [];

    let bluecan = this.add.sprite(60, 40 , `trash_bluecan`);
    this.floatingRubbishForward.push(bluecan);

    let bluecan_2 = this.add.sprite(500, 200 , `trash_bluecan_full`);
    this.floatingRubbishReverse.push(bluecan_2);

    let brownbottle = this.add.sprite(460, 40 , `trash_brownbottle`);
    this.floatingRubbishForward.push(brownbottle);

    let facemask = this.add.sprite(200, 70 , `trash_facemask`);
    this.floatingRubbishReverse.push(facemask);

    let greenbottle = this.add.sprite(160, 40 , `trash_greenbottle`);
    this.floatingRubbishForward.push(greenbottle);

    let marooncan = this.add.sprite(530, 40 , `trash_marooncan`);
    this.floatingRubbishReverse.push(marooncan);

    let purpleshoe = this.add.sprite(120, 300 , `trash_purpleshoe`);
    this.floatingRubbishForward.push(purpleshoe);

    let redcan = this.add.sprite(30, 140 , `trash_redcan_full`);
    this.floatingRubbishReverse.push(redcan);

    let yellowboot = this.add.sprite(90, 40 , `trash_yellowboot`);
    this.floatingRubbishForward.push(yellowboot);

    let yellowcan = this.add.sprite(590, 40 , `trash_yellowcan`);
    this.floatingRubbishReverse.push(yellowcan);

    let yellowcan2 = this.add.sprite(600, 130 , `trash_yellowcan_full`);
    this.floatingRubbishForward.push(yellowcan2);

    //Loop all rubbish
    for (var i=0; i<this.floatingRubbishForward.length;i++){
        rubbish = this.floatingRubbishForward[i];
        this.physics.add.existing(rubbish);
        rubbish.setScale(0.25);
        rubbish.body.allowGravity = false;
    }

    for (var i=0; i<this.floatingRubbishReverse.length;i++){
        rubbish = this.floatingRubbishReverse[i];
        this.physics.add.existing(rubbish);
        rubbish.setScale(0.25);
        rubbish.body.allowGravity = false;
    }
}

homeScene.animateSprites = function(){
    if(this.shark.x >=690){
        this.shark.x = -50;
        this.shark.y = Math.random()*200+100;
    } 

    for (let i=0;i<this.floatingRubbishReverse.length;i++){
        //Random Floating Motion
        if (this.timeElapsed%4>2){
          this.floatingRubbishReverse[i].body.setVelocityY(-this.floatingSpeed);
        }
        else{
          this.floatingRubbishReverse[i].body.setVelocityY(this.floatingSpeed);
        }
    }

    for (let i=0;i<this.floatingRubbishForward.length;i++){
        //Random Floating Motion
        if (this.timeElapsed%4>2){
          this.floatingRubbishForward[i].body.setVelocityY(this.floatingSpeed);
        }
        else{
          this.floatingRubbishForward[i].body.setVelocityY(-this.floatingSpeed);
        }
    }


}

homeScene.update = function(){
    //Animate sprites
    if(this.isAnimating) this.animateSprites();

    //Elasped time
    this.timeElapsed += 0.1;
}