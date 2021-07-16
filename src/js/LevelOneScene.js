import images from '../assets/*.png';

const Tower = require("./tower.js")
const Enemy = require("./enemy.js")
const Bullet = require("./bullet.js")
const TowerManager = require("./towerManager.js")
const EnemyManager = require("./enemyManager.js")


class LevelOneScene extends Phaser.Scene {

  constructor() {
    super({ key: "Level1" });
    // this.towerManager = new TowerManager(this)
  }

  preload() {
    for (const spriteName in images) {
      this.load.image(spriteName, images[spriteName])
    }

  }

  create() {
    // World properties
    this.physics.world.setBounds(0, 0, 800, 600);

    this.registry.managers = {};

    let towerManager = new TowerManager(this);
    let tower = towerManager.addTower(100, 450, "basic_tower");
    let tower2 = towerManager.addTower(450, 400, "basic_tower");

    let enemyManager = new EnemyManager(this);
    let enemy = enemyManager.addEnemy(475, 200, "test_enemy");

    let bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
    this.registry.managers["bullets"] = bullets;



    // Image/object placement
    this.add.text(50, 50, "Sample text");


  }

  update() {


  }

}



export default LevelOneScene;