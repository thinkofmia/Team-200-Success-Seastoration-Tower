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
    let logo = this.add.sprite(gameW/2, gameH/8*1.5, 'sprite_pingvin');
    logo.setScale(0.3);

    //Progress bar background
    let bgBar = this.add.graphics();

    let barW = 500;
    let barH = 25;

    bgBar.setPosition(gameW/2 - barW/2, gameH/8*6.5 - barH/2);
    bgBar.fillStyle(0xF5F5F5, 1);
    bgBar.fillRect(0,0,barW, barH);

    //Progress Bar
    let progressBar = this.add.graphics();
    progressBar.setPosition(gameW/2 - barW/2, gameH/8*6.5 - barH/2);

    //Boot Text Description
    let loadingText = this.add.text(gameW/8*2.25, gameH/12, 'Loading your Tower', {
        fontFamily: this.titleFont,
        fontSize: '30px',
        fill: '#ffffff',
        align: 'center',
        fontWeight: 'bold',
    });

    infoOptions = [
        'Did you know the ocean provides 99% of the living \nspace on the planet containing 50-80% of all life?',
        'It\'s estimated that over 80% of the ocean is still \nunexplored. That\'s one huge ocean!',
        'Elkhorn corals, found in the Caribbean sea, can \nlive for up to 5,000 years!',
        'The fastest fish in the ocean, the sailfish, can \ntravel at almost 110 km/h!',
        'Carrageenan, made from red seaweed, is used to \nimprove the consistency and taste of ice cream.'
    ]
    let infoText = this.add.text(40+gameW/14, gameH/8*5, infoOptions[Math.floor(Math.random()*infoOptions.length)], {
        fontFamily: this.titleFont,
        fontSize: '20px',
        fill: '#ffffff',
        align: 'center',
        fontWeight: 'bold',
    });

    infoText.setShadow(0, 0, 'rgba(0, 0, 0, 1)', 0);

    this.progressTime = 1;
    //Listen to progress event
    this.load.on('progress', function(value){
        logo.anims.play('walking_pingvin');
        logo.setFrame(Math.round(value*5)%2+1);
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
    this.load.image('background_title', 'assets/images/start screen/backgroundnew.png');
    this.load.image('background_clean', 'assets/images/bg/water_clean.png');
    this.load.image('background_unclean', 'assets/images/bg/water_unclean.png');
    this.load.image('background_dirty', 'assets/images/start screen/water_dirty.png');

    //Loading Icons
    this.load.spritesheet('icon_arrow','assets/images/icons/icon_arrow.png', {
        frameWidth: 500,
        frameHeight: 456,
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
    this.load.image('icon_upgrade', 'assets/images/icons/icon_upgrade.png');
    this.load.image('icon_cross', 'assets/images/icons/icon_cross.png');
    this.load.image('icon_heal', 'assets/images/icons/icon_heal.png');
    this.load.image('icon_earth', 'assets/images/icons/icon_earth.png');
    this.load.image('icon_minigame', 'assets/images/icons/icon_minigame.png');
    this.load.image('icon_pingvingotchi', 'assets/images/icons/icon_pingvingotchi.png');
    this.load.image('icon_flippingmemory', 'assets/images/icons/icon_flippingmemory.png');
    this.load.image('settings', 'assets/images/icons/settings.png');
    this.load.image('save', 'assets/images/icons/save.png');
    this.load.image('savesuccess', 'assets/images/icons/savesuccess.png');

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

    this.load.spritesheet('shark_clean','assets/images/animals/shark_clean.png', {
        frameWidth: 860,
        frameHeight: 400,
        margin: 0,
        spacing: 0
    })

    this.load.spritesheet('turtle_clean','assets/images/animals/turtle_clean.png', {
        frameWidth: 860,
        frameHeight: 400,
        margin: 0,
        spacing: 0
    })

    this.load.image('sprite_sushi', 'assets/images/sprites/sprite_sushi.png');
    this.load.image('sprite_pillow', 'assets/images/sprites/sprite_pillow.png');
    this.load.image('sprite_chips', 'assets/images/sprites/sprite_chips.png');

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
    this.load.image('floor_camera', 'assets/images/basic floor/cameraroom.png');
    this.load.image('floor_qualle', 'assets/images/Qualle/qualle_floor.png');
    this.load.image('floor_kitchen', 'assets/images/basic floor/kitchenroom.png');
    this.load.image('floor_clinic', 'assets/images/basic floor/basic_floor.png');
    this.load.image('floor_crop', 'assets/images/croproom/crop_bg.png');
    this.load.image('floor_museum', 'assets/images/museumfloor/museum_bg.png');
    this.load.image('floor_lab', 'assets/images/labfloor/lab_bg.png');
    this.load.image('floor_greenhouse', 'assets/images/greenhouse/greenhouse_bg.png');
    this.load.image('floor_library', 'assets/images/library/librarybg.png');

    this.load.image('floor_locked', 'assets/images/basic floor/darkroom.png');

    //Loading Room Props
    this.load.image('door_basic','assets/images/basic floor/basic_door.png');
    this.load.image('poster_basic','assets/images/basic floor/basic_poster.png');
    this.load.image('table_basic','assets/images/basic floor/basic_table.png');
    
    this.load.image('beanbagL_qualle','assets/images/Qualle/beanbagL.png');
    this.load.image('beanbagR_qualle','assets/images/Qualle/beanbagR.png');

    this.load.image('poster_clinic','assets/images/basic floor/firstaidposter.png');
    
    this.load.image('banner_crop','assets/images/croproom/crop_banner.png');
    this.load.image('brinjal_crop','assets/images/croproom/crop_brinjal.png');
    this.load.image('carrot_crop','assets/images/croproom/crop_carrot.png');
    this.load.image('melon_crop','assets/images/croproom/crop_melon.png');

    this.load.image('headphones_museum','assets/images/museumfloor/headphones.png');
    this.load.image('fish_museum','assets/images/museumfloor/mainexhibit_fish.png');
    this.load.image('plaque_museum','assets/images/museumfloor/plaque.png');

    this.load.image('blueflask_lab', 'assets/images/labfloor/blueflask.png');
    this.load.image('desk_lab', 'assets/images/labfloor/desk.png');
    this.load.image('greenflask_lab', 'assets/images/labfloor/greenflask.png');
    this.load.image('microscope_lab', 'assets/images/labfloor/microscope.png');
    this.load.image('orangeflask_lab', 'assets/images/labfloor/orangeflask.png');
    this.load.image('testtuberack_lab', 'assets/images/labfloor/testtuberack.png');

    this.load.image('beadyplant_greenhouse', 'assets/images/greenhouse/beadyplant.png');
    this.load.image('bicolour_greenhouse', 'assets/images/greenhouse/bicolour.png');
    this.load.image('fancybowl_greenhouse', 'assets/images/greenhouse/fancybowl.png');
    this.load.image('floweringairplant_greenhouse', 'assets/images/greenhouse/floweringairplant.png');
    this.load.image('hagrid_greenhouse', 'assets/images/greenhouse/hagrid.png');
    this.load.image('orchid_greenhouse', 'assets/images/greenhouse/orchid.png');
    this.load.image('wateringcan_greenhouse', 'assets/images/greenhouse/wateringcan.png');

    this.load.image('shelf1_library', 'assets/images/library/shelf1.png');
    this.load.image('shelf2_library', 'assets/images/library/shelf2.png');
    this.load.image('shelf3_library', 'assets/images/library/shelf3.png');
    this.load.image('shelf4_library', 'assets/images/library/shelf4.png');

    //Flipping Memory Minigame
    this.load.spritesheet('fm_bar','assets/images/flippingMemory/card_bar.png', {
        frameWidth: 500,
        frameHeight: 500,
        margin: 0,
        spacing: 0
    });
    this.load.spritesheet('fm_diamond','assets/images/flippingMemory/card_diamond.png', {
        frameWidth: 500,
        frameHeight: 500,
        margin: 0,
        spacing: 0
    });
    this.load.spritesheet('fm_o','assets/images/flippingMemory/card_o.png', {
        frameWidth: 500,
        frameHeight: 500,
        margin: 0,
        spacing: 0
    });
    this.load.spritesheet('fm_star','assets/images/flippingMemory/card_star.png', {
        frameWidth: 500,
        frameHeight: 500,
        margin: 0,
        spacing: 0
    });
    this.load.spritesheet('fm_sun','assets/images/flippingMemory/card_sun.png', {
        frameWidth: 500,
        frameHeight: 500,
        margin: 0,
        spacing: 0
    });
    this.load.spritesheet('fm_triangle','assets/images/flippingMemory/card_triangle.png', {
        frameWidth: 500,
        frameHeight: 500,
        margin: 0,
        spacing: 0
    });

    //Profiles
    this.load.image('profile_pic_front','assets/images/profile/FrontFrame.png');
    this.load.image('profile_pic_back','assets/images/profile/BackFrame.png');

    //Sample Profile Pic
    this.load.image('profile_pic_sample','assets/images/profile/KingFish.png');

    //Load Quotes
    this.load.json('envQuotes', 'assets/json/quotes.json');

    for (var i=0;i<200;i++){
        this.load.image(`test${i}`,'assets/images/profile/KingFish.png');
 
    }

    // load audio files
    this.load.audio("upgrade",["sfx/Upgrade.ogg"]);
    this.load.audio("unlock",["sfx/UnlockShop.ogg"]);
    this.load.audio("click",["sfx/Click.ogg"]);
    this.load.audio("error",["sfx/Error.ogg"]);
    this.load.audio("bgm",["sfx/MarineParadise.mp3"]);
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

    this.anims.create({
        key: 'swimming_shark_clean',
        frames: this.anims.generateFrameNames('shark_clean', {frames: [0,1,2,1]}),
        frameRate: 7,
        yoyo: true,
        repeat: -1 //Repeat forever is -1
    });

    this.anims.create({
        key: 'swimming_turtle_clean',
        frames: this.anims.generateFrameNames('turtle_clean', {frames: [0,1,2,1]}),
        frameRate: 7,
        yoyo: true,
        repeat: -1 //Repeat forever is -1
    });

    this.anims.create({
        key: 'blushing_pingvin',
        frames: this.anims.generateFrameNames('sprite_pingvin', {frames: [0,3,4,3]}),
        frameRate: 7,
        yoyo: true,
        repeat: 0 //Repeat forever is -1
    });

    //Flipping Memory
    this.anims.create({
        key: 'cards_pingvin',
        frames: this.anims.generateFrameNames('sprite_pingvin', {frames: [6,7,6,7]}),
        frameRate: 4,
        yoyo: true,
        repeat: -1 //Repeat forever is -1
    });

    this.anims.create({
        key: 'flip_sun',
        frames: this.anims.generateFrameNames('fm_sun', {frames: [3,2,1,0]}),
        frameRate: 7,
        yoyo: true,
        repeat: 0 //Repeat forever is -1
    });
    this.anims.create({
        key: 'unflip_sun',
        frames: this.anims.generateFrameNames('fm_sun', {frames: [0,1,2,3]}),
        frameRate: 7,
        yoyo: true,
        repeat: 0 //Repeat forever is -1
    });
    this.anims.create({
        key: 'flip_bar',
        frames: this.anims.generateFrameNames('fm_bar', {frames: [3,2,1,0]}),
        frameRate: 7,
        yoyo: true,
        repeat: 0 //Repeat forever is -1
    });
    this.anims.create({
        key: 'unflip_bar',
        frames: this.anims.generateFrameNames('fm_bar', {frames: [0,1,2,3]}),
        frameRate: 7,
        yoyo: true,
        repeat: 0 //Repeat forever is -1
    });
    this.anims.create({
        key: 'flip_diamond',
        frames: this.anims.generateFrameNames('fm_diamond', {frames: [3,2,1,0]}),
        frameRate: 7,
        yoyo: true,
        repeat: 0 //Repeat forever is -1
    });
    this.anims.create({
        key: 'unflip_diamond',
        frames: this.anims.generateFrameNames('fm_diamond', {frames: [0,1,2,3]}),
        frameRate: 7,
        yoyo: true,
        repeat: 0 //Repeat forever is -1
    });
    this.anims.create({
        key: 'flip_triangle',
        frames: this.anims.generateFrameNames('fm_triangle', {frames: [3,2,1,0]}),
        frameRate: 7,
        yoyo: true,
        repeat: 0 //Repeat forever is -1
    });
    this.anims.create({
        key: 'unflip_triangle',
        frames: this.anims.generateFrameNames('fm_triangle', {frames: [0,1,2,3]}),
        frameRate: 7,
        yoyo: true,
        repeat: 0 //Repeat forever is -1
    });
    this.anims.create({
        key: 'flip_star',
        frames: this.anims.generateFrameNames('fm_star', {frames: [3,2,1,0]}),
        frameRate: 7,
        yoyo: true,
        repeat: 0 //Repeat forever is -1
    });
    this.anims.create({
        key: 'unflip_star',
        frames: this.anims.generateFrameNames('fm_star', {frames: [0,1,2,3]}),
        frameRate: 7,
        yoyo: true,
        repeat: 0 //Repeat forever is -1
    });
    this.anims.create({
        key: 'flip_o',
        frames: this.anims.generateFrameNames('fm_o', {frames: [3,2,1,0]}),
        frameRate: 7,
        yoyo: true,
        repeat: 0 //Repeat forever is -1
    });
    this.anims.create({
        key: 'unflip_o',
        frames: this.anims.generateFrameNames('fm_o', {frames: [0,1,2,3]}),
        frameRate: 7,
        yoyo: true,
        repeat: 0 //Repeat forever is -1
    });


    this.scene.start('Home');
}