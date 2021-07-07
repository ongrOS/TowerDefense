import 'phaser';
import LevelOneScene from './LevelOneScene.js';

// Scenes here
var levelOne = new LevelOneScene();

// Global settings
const gameConfig = {
    title: "Tower Defense",
    width: 800,
    height: 600,
    background: 0xff0000,
    scene: [levelOne]  // Scene array
  };

// Instantiates a phaser game.
window.onload = function() {
  var game = new Phaser.Game(gameConfig);
};