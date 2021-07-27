// create a new scene
let loadingScene = new Phaser.Scene('Loading');

WebFont.load({
    google: {
      families: ['Grandstander', 'Averia Libre']
    }
  });

loadingScene.init = function() {
    this.titleFont = 'Grandstander';
    this.bodyFont = 'Averia Libre';
}

loadingScene.preload = function(){

    //Get gameW and gameH
    let gameW = this.sys.game.config.width;
    let gameH = this.sys.game.config.height;

    //Show Logo
    let logo = this.add.sprite(gameW/2, gameH/8*3, 'logo');
    logo.setScale(0.15);

    //Progress bar background
    let bgBar = this.add.graphics();

    let barW = 500;
    let barH = 25;

    bgBar.setPosition(gameW/2 - barW/2, gameH/8*7 - barH/2);
    bgBar.fillStyle(0xF5F5F5, 1);
    bgBar.fillRect(0,0,barW, barH);

    //Progress Bar
    let progressBar = this.add.graphics();
    progressBar.setPosition(gameW/2 - barW/2, gameH/8*7 - barH/2);

    //Boot Text Description
    let loadingText = this.add.text(gameW/8*2.5, gameH/12, 'Loading your Tower', {
        fontFamily: this.titleFont,
        fontSize: '30px',
        fill: '#ffffff',
        align: 'center',
        fontWeight: 'bold',
    });

    let infoText = this.add.text(gameW/8, gameH/8*5, 'Do you know the oceans provide 99% of the living space \non the planet containing 50-80% of all life?', {
        fontFamily: this.titleFont,
        fontSize: '20px',
        fill: '#ffffff',
        align: 'center',
        fontWeight: 'bold',
    });

    infoText.setShadow(0, 0, 'rgba(0, 0, 0, 1)', 0);

    //Listen to progress event
    this.load.on('progress', function(value){
        //Clearing progress bar
        progressBar.clear();

        //Set Style
        progressBar.fillStyle(0x9AD98D,1);

        //Draw rect
        progressBar.fillRect(0,0, value * barW, barH);
    }, this);

    //Load assets
    //Loading Background
    this.load.image('background', 'assets/images/bg/grass.png');
    this.load.image('background_air', 'assets/images/bg/sky.png');
    this.load.image('background_water', 'assets/images/bg/water.png');
    this.load.image('background_title', 'assets/images/start screen/background1.png');

    //Loading Icons
    this.load.spritesheet('icon_arrow','assets/images/icons/icon_arrow.png', {
        frameWidth: 100,
        frameHeight: 100,
        margin: 0,
        spacing: 0
    });
    this.load.spritesheet('icon_back','assets/images/icons/icon_back.png', {
        frameWidth: 100,
        frameHeight: 100,
        margin: 0,
        spacing: 0
    });
    this.load.image('icon_recycle', 'assets/images/icons/icon_recycle.png');
    

    //Loading Sprites
    this.load.spritesheet('sprite_mia','assets/images/sprites/sprite_mia.png', {
        frameWidth: 1000,
        frameHeight: 1000,
        margin: 0,
        spacing: 0
    });
    this.load.spritesheet('sprite_kj','assets/images/sprites/sprite_kj.png', {
        frameWidth: 1000,
        frameHeight: 1000,
        margin: 0,
        spacing: 0
    });
    this.load.spritesheet('sprite_ky','assets/images/sprites/sprite_ky.png', {
        frameWidth: 1000,
        frameHeight: 1000,
        margin: 0,
        spacing: 0
    });
    this.load.spritesheet('sprite_sy','assets/images/sprites/sprite_sy.png', {
        frameWidth: 1000,
        frameHeight: 1000,
        margin: 0,
        spacing: 0
    });

    this.load.spritesheet('sprite_shark','assets/images/animals/shark.png', {
        frameWidth: 860,
        frameHeight: 400,
        margin: 0,
        spacing: 0
    });

    //Loading Trash
    this.load.image('trash_bluecan', 'assets/images/start screen/bluecan.png');
    this.load.image('trash_bluecan_full', 'assets/images/start screen/bluecan_whole.png');
    this.load.image('trash_brownbottle', 'assets/images/start screen/brownbottle.png');
    this.load.image('trash_facemask', 'assets/images/start screen/facemask.png');
    this.load.image('trash_greenbottle', 'assets/images/start screen/greenbottle.png');
    this.load.image('trash_marooncan', 'assets/images/start screen/marooncan.png');
    this.load.image('trash_purpleshoe', 'assets/images/start screen/purpleshoe.png');
    this.load.image('trash_redcan_full', 'assets/images/start screen/redcan_whole.png');
    this.load.image('trash_yellowboot', 'assets/images/start screen/yellowboot.png');
    this.load.image('trash_yellowcan', 'assets/images/start screen/yellowcan.png');
    this.load.image('trash_yellowcan_full', 'assets/images/start screen/yellowcan_whole.png');


    //Loading Floors
    this.load.image('floor_basic', 'assets/images/basic floor/basic_floor.png');
    this.load.image('floor_qualle', 'assets/images/Qualle/qualle_floor.png');

    this.load.image('floor_locked', 'assets/images/basic floor/darkroom.png');

    //Loading Room Props
    this.load.image('door_basic','assets/images/basic floor/basic_door.png');
    this.load.image('poster_basic','assets/images/basic floor/basic_poster.png');
    this.load.image('table_basic','assets/images/basic floor/basic_table.png');
    
    this.load.image('beanbagL_qualle','assets/images/Qualle/beanbagL.png');
    this.load.image('beanbagR_qualle','assets/images/Qualle/beanbagR.png');
    
    //Profiles
    this.load.image('profile_pic_front','assets/images/profile/FrontFrame.png');
    this.load.image('profile_pic_back','assets/images/profile/BackFrame.png');

    //Sample Profile Pic
    this.load.image('profile_pic_sample','assets/images/profile/KingFish.png');

    //Create loading demo
    for (let i=0;i<300;i++){
        this.load.image('test'+ i, 'assets/images/pingvin.gif');
    }
};

loadingScene.create = function(){
    //Animations
    this.anims.create({
        key: 'walking_mia',
        frames: this.anims.generateFrameNames('sprite_mia', {frames: [1,2,3,4]}),
        frameRate: 7,
        yoyo: true,
        repeat: -1 //Repeat forever is -1
    });

    this.anims.create({
        key: 'walking_kj',
        frames: this.anims.generateFrameNames('sprite_kj', {frames: [1,2,3,2,4]}),
        frameRate: 7,
        yoyo: true,
        repeat: -1 //Repeat forever is -1
    });

    this.anims.create({
        key: 'walking_ky',
        frames: this.anims.generateFrameNames('sprite_ky', {frames: [1,2,1,3]}),
        frameRate: 7,
        yoyo: true,
        repeat: -1 //Repeat forever is -1
    });

    this.anims.create({
        key: 'walking_sy',
        frames: this.anims.generateFrameNames('sprite_sy', {frames: [1,2,3,4]}),
        frameRate: 7,
        yoyo: true,
        repeat: -1 //Repeat forever is -1
    });

    //Animals
    this.anims.create({
        key: 'swimming_shark',
        frames: this.anims.generateFrameNames('sprite_shark', {frames: [0,1,2,1]}),
        frameRate: 7,
        yoyo: true,
        repeat: -1 //Repeat forever is -1
    });

    //Rubbish

    this.scene.start('Home');
}