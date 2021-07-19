import 'phaser';
import LevelOneScene from './LevelOneScene.js';

// Scenes here
var levelOne = new LevelOneScene();

// Global settings
const gameConfig = {
  type: Phaser.AUTO,
  parent: 'tower-defense',
  title: "Tower Defense",
  width: 1000,
  height: 600,
  backgroundColor: '#a06505', // Placeholder color
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: {
        y: 0
      }
    }
  },
  scene: [levelOne]  // Scene array
};

// Instantiates a phaser game.
window.onload = function () {
  var game = new Phaser.Game(gameConfig);
};