import 'phaser';
import LevelOneScene from './levelOneScene.js';
import LevelScene from './level.js';
import levelData from '../data/levels.json';

// Scenes here
var levelOne = new LevelOneScene();
var levels = []
for (var level in levelData) if (levelData.hasOwnProperty(level)) {
  levels.push(new LevelScene(levelData[level]));
}

// Global settings
const gameConfig = {
  type: Phaser.AUTO,
  parent: 'tower-defense',
  title: "Tower Defense",
  width: 864,
  height: 540,
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
  scene: [levels[0]]  // Scene array
};

// Instantiates a phaser game.
window.onload = function () {
  var game = new Phaser.Game(gameConfig);
};