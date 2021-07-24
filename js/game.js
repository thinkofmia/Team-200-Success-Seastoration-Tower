// set the configuration of the game
let config = {
  type: Phaser.CANVAS, // Phaser will use WebGL if available, if not it will use Canvas
  width: 640,
  height: 360,
  scene: [bootScene, loadingScene, homeScene, gameScene],
  title: 'Team 200 Success Presents\nEnv Tower',
  pixelArt: false,
  backgroundColor: 'ffffff',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1000},
      debug: false
    }
  }
};

// create a new game, pass the configuration
let game = new Phaser.Game(config);
