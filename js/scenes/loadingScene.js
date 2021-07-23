// create a new scene
let loadingScene = new Phaser.Scene('Loading');

loadingScene.preload = function(){
    //Show Logo
    let logo = this.add.sprite(this.sys.game.config.width/2, this.sys.game.config.height/8*2, 'logo');
    logo.setScale(0.2);

    //Progress bar background
    let bgBar = this.add.graphics();

    let barW = 500;
    let barH = 50;

    bgBar.setPosition(this.sys.game.config.width/2 - barW/2, this.sys.game.config.height/2 - barH/2);
    bgBar.fillStyle(0xF5F5F5, 1);
    bgBar.fillRect(0,0,barW, barH);

    //Progress Bar
    let progressBar = this.add.graphics();
    progressBar.setPosition(this.sys.game.config.width/2 - barW/2, this.sys.game.config.height/2 - barH/2);

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

    //Loading Floors
    this.load.image('floor_basic', 'assets/images/basic floor/basic_floor.png');
    this.load.image('floor_qualle', 'assets/images/Qualle/qualle_floor.png');

    //Loading Items
    this.load.image('door_basic','assets/images/basic floor/basic_door.png');
    this.load.image('poster_basic','assets/images/basic floor/basic_poster.png');
    this.load.image('table_basic','assets/images/basic floor/basic_table.png');
    
    this.load.image('beanbagL_qualle','assets/images/Qualle/beanbagL.png');
    this.load.image('beanbagR_qualle','assets/images/Qualle/beanbagR.png');
    
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

    this.scene.start('Home');
}