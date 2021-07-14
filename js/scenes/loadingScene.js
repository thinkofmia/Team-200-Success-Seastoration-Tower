// create a new scene
let loadingScene = new Phaser.Scene('Loading');

loadingScene.preload = function(){
    //Show Logo
    let logo = this.add.sprite(this.sys.game.config.width/2, this.sys.game.config.height/2 - 50, 'logo');
    logo.setScale(0.1);

    //Progress bar background
    let bgBar = this.add.graphics();

    let barW = 150;
    let barH = 30;

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
    this.load.image('background', 'assets/images/grass.png');

    //Create loading demo
    for (let i=0;i<200;i++){
        this.load.image('test'+ i, 'assets/images/pingvin.gif');
    }
};

loadingScene.create = function(){
    this.scene.start('Home');
}