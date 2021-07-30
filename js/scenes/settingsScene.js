// create a new scene
let settingsScene = new Phaser.Scene('Settings');

settingsScene.init = function(data){
    this.titleFont = 'Grandstander';
    this.bodyFont = 'Averia Libre';
    if(Object.keys(data).length != 0){
        this.gameStats = data;
      }
    else this.gameStats = {};
}

settingsScene.preload = function(){
    this.load.image('pingvin', 'assets/images/sprites/sprite_pingvin_cropped.png');
}

settingsScene.create = function(){
    //Game background, with active input
    let bg = this.add.sprite(0,0,'background_title').setInteractive();
    bg.setOrigin(0,0);
    bg.setScale(0.25);
    
    //Welcome Text
    let gameW = this.sys.game.config.width;
    let gameH = this.sys.game.config.height;

    let text = this.add.text(gameW/2, gameH/8, 'Settings', {
        font: "25px "+this.titleFont,
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 5
    });

    game1H = (gameH/4*1.5)-30;
    game2H = (gameH/4*2.5)-25;
    game3H = gameH/4*3.5;
    // optionHeights = [game1H, game2H, game3H];

    // let game1 = this.add.text(gameW/2, game1H, 'Option 1', {
    //     font: '20px '+this.titleFont,
    //     fill: '#ffffff',
    // });

    // let game2 = this.add.text(gameW/2, game2H, 'Option 2', {
    //     font: '20px '+this.titleFont,
    //     fill: '#ffffff',
    // });

    // let game3 = this.add.text(gameW/2, game3H, 'Back', {
    //     font: '20px '+this.titleFont,
    //     fill: '#ffffff',
    // });

    // gameOptions = [game1,game2,game3];
    
    text.setOrigin(0.5, 0.5);
    text.depth = 1;

    // let optionBg = [];
    // for (var i=0;i<gameOptions.length;i++){
    //     gameOptions[i].setOrigin(0.5, 0.5);
    //     gameOptions[i].depth = 1;

    //     //Text background
    //     optionBg[i] = this.add.graphics();
    //     optionBg[i].setInteractive();
    //     optionBg[i].fillStyle(0xA01010, 0.7);
    //     optionBg[i].fillRect(gameW/2 - gameOptions[i].width/2 - 10, optionHeights[i] - gameOptions[i].height/2 -10, gameOptions[i].width+20, gameOptions[i].height+ 20);
    //     gameOptions[i].setInteractive();
    // };

    // game1.on('pointerdown', function(){

    // }, this);

    // game2.on('pointerdown', function(){

    // }, this);

    sfxVol = 0.5;
    bgmVol = 0.5;
    // get existing settings if any
    if(Object.keys(this.gameStats).length > 0) {
        sfxVol = this.gameStats.sfxVol;
        bgmVol = this.gameStats.bgmVol;
    }

    // bounding box for sliders
    const sliderWidth = (gameW/2)-175;
    const maxWidth = 350;
    let graphics1 = this.add.graphics();
    graphics1.fillStyle(0x78c3f5, 1);
    graphics1.fillRect(sliderWidth,game1H+20,maxWidth,20);
    
    let sprite1 = this.add.sprite(sliderWidth+maxWidth*sfxVol,game1H+30,'pingvin').setInteractive();
    sprite1.setScale(0.1);
    this.input.setDraggable(sprite1, this.gameStats);
    let graphics2 = this.add.graphics();
    graphics2.fillStyle(0x78c3f5, 1);
    graphics2.fillRect(sliderWidth,game2H+20,maxWidth,20);
    
    let sprite2 = this.add.sprite(sliderWidth+maxWidth*bgmVol,game2H+30,'pingvin').setInteractive();
    sprite2.setScale(0.1);
    this.input.setDraggable(sprite2, this.gameStats);

    sprite1.on('pointerover', function(){
        sprite1.setScale(0.115);
        hover.play();
    }, this);
    sprite2.on('pointerover', function(){
        sprite2.setScale(0.115);
        hover.play();
    }, this);
    sprite1.on('pointerout', function(){
        sprite1.setScale(0.10);
    }, this);
    sprite2.on('pointerout', function(){
        sprite2.setScale(0.10);
    }, this);

    // drag functions
    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        // gameObject.y = dragY;
        if(dragX < sliderWidth) gameObject.x = sliderWidth;
        else if(dragX > sliderWidth+maxWidth) gameObject.x = sliderWidth+maxWidth;
        else gameObject.x = dragX;
    });
    this.input.on('dragend', function (pointer, gameObject) {
        sfxVol = (maxWidth - (sliderWidth + maxWidth - sprite1.x)) / maxWidth;
        // whys it getting louder when the volume gets lower?! o_O
        bgmVol = (maxWidth - (sliderWidth + maxWidth - sprite2.x)) / maxWidth;
        sfxSetting.setText(`Sound Effects Volume: ${(sfxVol*100).toFixed(1)}%`);
        bgmSetting.setText(`Music Volume: ${(bgmVol*100).toFixed(1)}%`);
    });

    // volume controls
    let sfxSetting = this.add.text(gameW/2, game1H, `Sound Effects Volume: ${(sfxVol*100).toFixed(1)}%`, {
        font: '20px '+this.titleFont,
        fill: '#ffdf00',
        stroke: '#000000',
        strokeThickness: 5
    });
    sfxSetting.setOrigin(0.5);
    let bgmSetting = this.add.text(gameW/2, game2H, `Music Volume: ${(bgmVol*100).toFixed(1)}%`, {
        font: '20px '+this.titleFont,
        fill: '#ffdf00',
        stroke: '#000000',
        strokeThickness: 5
    });
    bgmSetting.setOrigin(0.5);

    // return buttons
    let mainmenu = this.add.text((gameW/2)-150, game3H, 'Back to Main Menu', {
        font: '20px '+this.titleFont,
        fill: '#ffdf00',
        stroke: '#000000',
        strokeThickness: 5
    });
    mainmenu.setInteractive();
    mainmenu.setOrigin(0.5, 0.5);
    mainmenu.on('pointerover', function(){
        mainmenu.setFont('23px '+this.titleFont);
        mainmenu.setOrigin(0.5);
        hover.play();
    }, this);
    mainmenu.on('pointerout', function(){
        mainmenu.setFont('20px '+this.titleFont);
        mainmenu.setOrigin(0.5);
    }, this);
    mainmenu.on('pointerdown', function(){
        click.play();
        mgSelectionScene.isAnimating = false;
        if(Object.keys(this.gameStats).length > 0){
            this.gameStats.sfxVol = sfxVol;
            this.gameStats.bgmVol = bgmVol;
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
            sfxVol: sfxVol,
            bgmVol: bgmVol,
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
        }
        this.sound.stopAll();
        this.scene.start('Home', this.gameStats);
    }, this);

    let backgame = this.add.text((gameW/2)+150, game3H, 'Back to Game', {
        font: '20px '+this.titleFont,
        fill: Object.keys(this.gameStats).length === 0 ? '#726512' : '#ffdf00',
        stroke: '#000000',
        strokeThickness: 5
    });
    backgame.setInteractive();
    backgame.setOrigin(0.5, 0.5);
    backgame.on('pointerover', function(){
        if(Object.keys(this.gameStats).length > 0) {
            backgame.setFont('23px '+this.titleFont);
            backgame.setOrigin(0.5);
            hover.play();
        }
    }, this);
    backgame.on('pointerout', function(){
        if(Object.keys(this.gameStats).length > 0) {
            backgame.setFont('20px '+this.titleFont);
            backgame.setOrigin(0.5);
        }
    }, this);
    backgame.on('pointerdown', function(){
        if(Object.keys(this.gameStats).length > 0) {
            click.play();
            this.gameStats.sfxVol = sfxVol;
            this.gameStats.bgmVol = bgmVol;
            // placeholder till audio volume can be changed while playing
            this.sound.stopAll();
            mgSelectionScene.isAnimating = false;
            this.scene.start('Game', this.gameStats);
        } 
        else error.play();
    }, this);

    //Text background
    // let textBg = this.add.graphics();
    // textBg.fillStyle(0x000000, 0.7);
    // textBg.fillRect(gameW/2 - text.width/2 - 10, gameH/8 - text.height/2 -10, text.width+20, text.height+ 20);
  
}