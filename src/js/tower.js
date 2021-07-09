import * as data from "../json/*.json"

class Tower extends Phaser.GameObjects.Sprite {
    constructor(x, y, towerName) {
        super();
    }
}

// Creates a new tower using stats from "{towerName}.json" at coordinates(x, y)
const addTower = function addTower(x, y, towerName, towers) {
    var towerData = data[towerName];
    console.log(towerData)
    var t = towers.create(x, y, towerName);
    t.name = towerData.name;
    t.type = towerData.type;
    t.projectile = towerData.projectile;
    t.scale = towerData.scale;
    t.range = towerData.range;
    t.currentCD = 0;
    t.enemiesInRange = new Set();
    t.cooldown = towerData.cooldown * 60;
    console.log(t)
}

module.exports.Tower = Tower
module.exports = { addTower }