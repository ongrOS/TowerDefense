import images from '../assets/*.png';

const Tower = require("./tower.js")
const Enemy = require("./enemy.js")
const Bullet = require("./bullet.js")
const TowerManager = require("./towerManager.js")

let curScene;
let towers;
let enemies;
let bullets;

class LevelOneScene extends Phaser.Scene {

  constructor() {
    super({ key: "Level1" });
    // this.towerManager = new TowerManager(this)
    console.log(this)
  }

  preload() {
    this.load.image('background', images.sky);
    this.load.image('basic_attack', images.bullet);
    this.load.image('test_enemy', images.alien);
  }

  create() {
    curScene = this;
    // World properties
    this.physics.world.setBounds(0, 0, 800, 600);

    this.registry.groups = {}
    console.log(this)
    let towerManager = new TowerManager(this);
    towerManager.addTower(300, 200, "basic_tower")



    // Static/dynamic object groups
    // bullets = this.physics.add.group({ classType: Bullet });
    // this.registry.groups['bullets'] = bullets


    // enemies = this.physics.add.group({ classType: Enemy });
    // this.registry.groups['enemies'] = enemies
    // enemies.add(new Enemy(this, 150, 200, "test_enemy"));
    // enemies.add(new Enemy(this, 300, 350, "test_enemy"));



    // Image/object placement
    this.add.text(50, 50, "Sample text");


  }

  update() {


    // bullets.children.iterate(function (bullet) {

    //   curScene.physics.moveToObject(
    //     bullet,
    //     bullet.target,
    //     bullet.speed
    //   );
    // });


  }
}
export default LevelOneScene;