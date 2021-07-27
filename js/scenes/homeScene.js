// create a new scene
let homeScene = new Phaser.Scene('Home');

//Create
homeScene.create = function(){
    //Game background, with active input
    let bg = this.add.sprite(0,0,'background_title').setInteractive();
    bg.setOrigin(0,0);
    bg.setScale(0.25);

    this.setupSprites();
    
    //Welcome Text
    let gameW = this.sys.game.config.width;
    let gameH = this.sys.game.config.height;

    let text = this.add.text(gameW/2, gameH/8, 'Seastoration Tower', {
        font: '20px Arial',
        fill: '#ffffff',
    });

    game1H = gameH/4*1.5;
    game2H = gameH/4*2.5;
    game3H = gameH/4*3.5;
    optionHeights = [game1H, game2H, game3H];

    let game1 = this.add.text(gameW/2, game1H, 'New Game', {
        font: '20px Arial',
        fill: '#ffffff',
    });

    let game2 = this.add.text(gameW/2, game2H, 'Continue', {
        font: '20px Arial',
        fill: '#ffffff',
    });

    let game3 = this.add.text(gameW/2, game3H, 'Mini Games', {
        font: '20px Arial',
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
        this.scene.start('Game');
    }, this);

    game2.on('pointerdown', function(){
        this.scene.start('Game');
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

}

homeScene.animateSprites = function(){
    if(this.shark.x >=690){
        this.shark.x = -50;
        this.shark.y = Math.random()*200+100;
    } 

}

homeScene.update = function(){
    //Animate sprites
    this.animateSprites();
}