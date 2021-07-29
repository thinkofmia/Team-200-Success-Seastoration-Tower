// create a new scene
let bootScene = new Phaser.Scene('Boot');

bootScene.preload = function(){
    this.load.spritesheet('sprite_pingvin','assets/images/sprites/sprite_pingvin.png', {
        frameWidth: 1000,
        frameHeight: 1000,
        margin: 0,
        spacing: 0
    });

};

bootScene.create = function(){
    this.anims.create({
        key: 'walking_pingvin',
        frames: this.anims.generateFrameNames('sprite_pingvin', {frames: [1,2,1,2]}),
        frameRate: 7,
        yoyo: true,
        repeat: -1 //Repeat forever is -1
    });
    this.scene.start('Loading');
};