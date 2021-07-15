// set the configuration of the game
let config = {
  type: Phaser.AUTO, // Phaser will use WebGL if available, if not it will use Canvas
  width: 360,
  height: 640,
  scene: [bootScene, loadingScene, homeScene, gameScene],
  title: 'Team 200 Success Presents\nEnv Tower',
  pixelArt: false,
  backgroundColor: 'ffffff',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1000},
      debug: true
    }
  }
};

// create a new game, pass the configuration
let game = new Phaser.Game(config);
